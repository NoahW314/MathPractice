
const { ComplexNumber, arrFromLatexStr, numericParser, vectSetFromLatexStr } = require("./util.js");
const { size, typeOf } = require("mathjs");

// Class for a concrete instance of a question and answer

// Unless otherwise stated, all text is assumed to be written in Latex,
// with a pair of dollar signs being used to enclose anything in math mode.
// Anything in math mode will be rendered in displaystyle, but inline.
// Remember to escape slashes in the string
class Question {
	constructor(text, answer, answer_explanation, options, matrix_dims, info) {
		// The actual text of the question
		this.text = render(text);
		// The answer that will be checked against the user input.
		this.answer = answer;
		// The answer text that is seen when "Show Answer" is clicked.
		// Has the answer, followed by a short explanation on the next line.
		this.answer_text = [];
		for (var i = 0; i < this.answer.length; i++) {
			if (options[i] === undefined || options[i].length === 0) {
				this.answer_text.push(render("Correct Answer: $" + this.answer[i] + "$<br>" + answer_explanation[i]));
			}
			else {
				this.answer_text.push(render("Correct Answer: " + this.answer[i] + "<br>" + answer_explanation[i]));
			}
		}
		// If this is a multiple choice question, then these are the choices
		// otherwise, it is undefined
		this.options = options;
		// If this is a matrix question, then these are the dimensions of the matrix
		// otherwise, it is undefined
		this.matrix_dims = matrix_dims;
		// extra info that gets passed to custom validators
		this.info = info;
	};
	getOptions(i) {
		return this.options[i];
	};
};

var render = function (text) {

	var textArr = text.split("$");
	var newText = "";
	var doNext = false;
	for (var i = 0; i < textArr.length; i++) {
		if (i % 2 === 1) {
			// when we encounter an empty string, that means we have double dollar signs,
			// so the mod counting is off and the rendering needs to be done differently.
			// Double dollar signs are always paired, so after doing this twice, 
			// doNext will be back to false and the mod counting will be back on track
			if (textArr[i] === "") {
				doNext = !doNext;
			}
			else {
				newText += katex.renderToString("\\displaystyle " + textArr[i], { displayMode: false });
			}
		}
		else if (doNext) {
			newText += katex.renderToString("\\displaystyle " + textArr[i], { displayMode: true });
		}
		else {
			newText += textArr[i];
		}
	}
	return newText;
};

class Option {
	constructor(value, display) {
		this.value = value;
		this.display = display;
	}
}

// Class for a class of questions, these are all questions that have the 
// same form, but each individual question will have different values for constants
// These values will be represented by variables denoted by a # on one side and a space on the other side
class QuestionClass {
	constructor(text, answer_form, answer_explanation_form, replacements, options, matrix_info, extra_info) {
		// The actual text of the question
		this.text = text;
		// The general form that the answer takes
		if (!Array.isArray(answer_form)) this.answer_form = [answer_form]; // standard, single part question
		else if (options !== undefined && !Array.isArray(options[0]) && !Array.isArray(answer_form[0])) this.answer_form = [answer_form]; // multiple choice question
		else this.answer_form = answer_form; // multi-part answer
		// The general form that the explanation takes
		if (!Array.isArray(answer_form)) this.answer_explanation_form = [answer_explanation_form];
		else this.answer_explanation_form = answer_explanation_form;
		// an object which supplies a function that gives a value to replace 
		// each variable in text, answer_form, and answer_explanation_form.
		this.replacements = replacements;
		// If this is a multiple choice question, then these are the choices
		// otherwise, it is undefined
		this.options = [];
		if (options === undefined) this.options.push(undefined);
		else {
			if (Array.isArray(options[0])) {
				for (var i = 0; i < options.length; i++) {
					this.options.push([]);
					for (var j = 0; j < options[i].length; j++) {
						if (options[i][j] instanceof Option) this.options[i].push(options[i][j]);
						else this.options[i].push(new Option(options[i][j], options[i][j]));
					}
				}
			}
			else {
				this.options.push([]);
				for (var i = 0; i < options.length; i++) {
					if (options[i] instanceof Option) this.options[0].push(options[i]);
					else this.options[0].push(new Option(options[i], options[i]));
				}
			}
		}
		// If this is a matrix question (or a question with a matrix part), 
		// then this is the string in the info object which will map to the 
		// matrix whose dimensions are the same as the answers.
		//  otherwise, it is undefined
		if (!Array.isArray(matrix_info)) this.matrix_info = [matrix_info]; 
		else this.matrix_info = matrix_info;
		// If desired, this is a string or an array of string in the info object whose
		// values will be passed to the validator (this provides extra information for custom validators)
		// all values will be passed to all question parts
		if (!Array.isArray(extra_info)) this.extra_info = [extra_info];
		else this.extra_info = extra_info;
	};
	handleNormal(char, new_text, info) {
		if (char === "#") {
			info.get_variable_name = true;
		}
		else if (char === "(" && info.get_variable_name) {
			info.in_func = true;
			info.get_variable_name = false;
			info.args.push([]);
			info.func_names.push(info.var_name);
			info.var_name = "";
		}
		else if (char === " " && info.get_variable_name) {
			info.get_variable_name = false;
			var value = "";
			if (info.var_name in info.values) {
				value = info.values[info.var_name];
			}
			else {
				value = this.replacements[info.var_name]();
				info.values[info.var_name] = value;
			}
			new_text += value;
			info.var_name = "";
		}
		else if (info.get_variable_name) {
			info.var_name += char;
		}
		else {
			new_text += char;
		}
		return new_text;
	};
	handleFunc(char, new_text, info) {
		if (char === "#") {
			info.get_variable_name = true;
		}
		else if (char === ")") {
			if (info.get_variable_name) {
				info.get_variable_name = false;
				var param_value = "";
				if (info.var_name in info.values) {
					param_value = info.values[info.var_name];
				}
				else {
					param_value = this.replacements[info.var_name]();
					info.values[info.var_name] = param_value;
				}
				info.args[info.nested].push(param_value);
			}
			else if (info.get_param) {
				info.get_param = false;
				info.args[info.nested].push(info.param);
				info.param = "";
			}

			var func_name = info.func_names.pop();
			var value = this.replacements[func_name](...info.args[info.nested]);

			info.values[func_name] = value;
			if (info.nested === 0) {
				new_text += value;
				info.in_func = false;
			}
			else {
				info.args[info.nested - 1].push(value);
				info.nested -= 1;
			}

			info.var_name = "";
			info.args.pop();
		}
		else if (char === "(") {
			info.get_variable_name = false;
			info.nested += 1;
			info.args.push([]);
			info.func_names.push(info.var_name);
			info.var_name = "";
		}
		else if (info.get_variable_name) {
			if (char === ",") {
				info.get_variable_name = false;
				var value = "";
				if (info.var_name in info.values) {
					value = info.values[info.var_name];
				}
				else {
					value = this.replacements[info.var_name]();
					info.values[info.var_name] = value;
				}
				info.args[info.nested].push(value);
				info.var_name = "";
			}
			else {
				info.var_name += char;
			}
		}
		else if (info.get_param) {
			// sensistive characters (i.e. , ) should be prefaced by a slash
			// the characters ( ) # are not allowed in strings passed as a param
			if (char !== ",") {
				info.param += char;
			}
			else if (info.param[info.param.length - 1] === "\\") {
				info.param = info.param.slice(0, info.param.length - 1);
				info.param += char;
			}
			else {
				info.args[info.nested].push(info.param);
				info.get_param = false;
				info.param = "";
			}
		}
		else if (char !== " " && char !== ",") {
			info.get_param = true;
			info.param += char;
		}
		return new_text;
	};
	parse(form, info) {
		info.get_variable_name = false;
		info.in_func = false;
		info.get_param = false;
		info.nested = 0;
		info.args = [];
		info.func_names = [];
		info.var_name = "";
		info.param = "";
		var result = "";
		for (const char of form) {
			if (info.in_func) {
				result = this.handleFunc(char, result, info);
			}
			else {
				result = this.handleNormal(char, result, info);
			}
		}
		return result;
	};
	getInstance(answerType) {
		var info = {
			get_variable_name: false,
			in_func: false,
			get_param: false,
			nested: 0,
			args: [],
			func_names: [],
			var_name: "",
			param: "",
			values: {}
		};
		// assign a specific value to each variable in replacements
		// replace all these variable in text, answer_form, and answer_explanation_form
		var new_text = this.parse(this.text, info);
		var answer = [];
		var answer_explanation = [];
		var options = [];
		var matrix_dims = [];
		var extra_info = [];
		
		for (var i = 0; i < this.answer_form.length; i++) {
			if (Array.isArray(this.answer_form[i])) {
				answer.push([]);
				for (var j = 0; j < this.answer_form[i].length; j++) {
					answer[i].push(this.parse(this.answer_form[i][j], info));
				}
			}
			else {
				answer.push(this.parse(this.answer_form[i], info));
			}
		}
		for (var i = 0; i < this.answer_explanation_form.length; i++) {
			answer_explanation.push(this.parse(this.answer_explanation_form[i], info));
		}
		for (var i = 0; i < this.options.length; i++) {
			if (Array.isArray(this.options[i])) {
				options.push([]);
				for (var j = 0; j < this.options[i].length; j++) {
					options[i].push(new Option(this.options[i][j].value, render(this.parse(this.options[i][j].display, info))));
				}
			}
			else if (this.options[i] === undefined) options.push(undefined);
			else options.push(new Option(this.options[i].value, render(this.parse(this.options[i].display, info))));
		}
		for (var i = 0; i < this.matrix_info.length; i++) {
			if (this.matrix_info[i] === undefined) {
				matrix_dims.push(undefined);
			}
			else {
				var data = info.values[this.matrix_info[i]];
				var aType = answerType[i];
				if (Array.isArray(aType)) {
					aType = aType[1];
				}
				// single matrix
				if (aType === AnswerType.Matrix) {
					var dims = size(data);
					matrix_dims.push([dims.get([0]), dims.get([1])]);
				}
				// (column) vector set
				else {
					var rows = size(data[0]).get([0]);
					matrix_dims.push([rows, data.length]);
				}
				
			}
		}
		for (var i = 0; i < this.extra_info.length; i++) {
			extra_info.push(info.values[this.extra_info[i]]);
		}


		// return a ready-to-use Question instance
		return new Question(new_text, answer, answer_explanation, options, matrix_dims, extra_info);
	};
};



// "enum" that represents some general catergories that answers can fall into
//   matrix sizes are represented by an array.
class AnswerType {
	static Other = new AnswerType(0);
	static Numeric = new AnswerType(1);
	static Exact = new AnswerType(2);
	static Complex = new AnswerType(3);
	static SelfCheck = new AnswerType(4);
	static MultipleChoice = new AnswerType(5);
	static SelectAll = new AnswerType(6);
	static Interval = new AnswerType(7);
	static Matrix = new AnswerType(8);
	static Vectors = new AnswerType(9);
	constructor(type) {
		// type is the general type of the answer, (e.x. numeric, multiple choice, matrix)
		this.type = type;
		// value is any specific information about this particular answer (e.x. the dimensions of a matrix or vector)
		// this will be set by the question class when it is instaniatated.
		this.value = undefined;
	}
}

const numericValidator = function (userAnswer, correctAnswer) {
	// the user's answer could be in decimal, or latex, or a fraction
	var userAnswerD = numericParser(userAnswer);
	if (Math.abs(Number(correctAnswer)) > Math.pow(10, 6)) {
		return userAnswerD.toPrecision(6) === Number(correctAnswer).toPrecision(6);
	}
	else {
		return Math.abs(userAnswerD - correctAnswer) < Math.pow(10, -2)/2;
	}
};
const matrixValidator = function (userArr, correctAnswer) {
	// correctAnswer is a matrix formatted as a Latex String, so we have to convert it to an array 
	var correctArr = arrFromLatexStr(correctAnswer);
	var r = correctArr.length;
	var c = correctArr[0].length;
	for (var i = 0; i < r; i++) {
		for (var j = 0; j < c; j++) {
			if (!numericValidator(userArr[i][j], correctArr[i][j])) {
				return false;
			}
		}
	}
	return true;
};
const vectorSetValidator = function (userArr, correctAnswer) {
	var correctArr = vectSetFromLatexStr(correctAnswer);
	var n = correctArr.length;
	var r = correctArr[0].length;
	// ensure that each vector in correctArr is in userArr
	for (var i = 0; i < n; i++) {
		var isInUserArr = false;
		for (var j = 0; j < n; j++) {
			var areVectorsEqual = true;
			// compare the vectors element-by-element
			for (var k = 0; k < r; k++) {
				if (!numericValidator(userArr[j][k], correctArr[i][k][0])) {
					areVectorsEqual = false;
					break;
				}
			}
			if (areVectorsEqual) {
				isInUserArr = true;
				break;
			}
		}
		if (!isInUserArr) return false; 
	}
	return true;
}
// When possible, maps the answer type to a function which can validate an answer of that type
const validators = {
	1: numericValidator,
	2: function (userAnswer, correctAnswer) {
		return userAnswer === correctAnswer;
	},
	3: function (userAnswer, correctAnswer) {
		return new ComplexNumber(userAnswer).equals(new ComplexNumber(correctAnswer));
	},
	4: function (userAnswer, correctAnswer) {
		return true; // I'm always right (;
  	},
	5: function (userAnswer, correctAnswer) {
		return userAnswer === correctAnswer;
	},
	6: function (userAnswer, correctAnswer) {
		if (userAnswer.length !== correctAnswer.length) return false;
		for (var selection of correctAnswer) {
			if (!userAnswer.includes(selection)) return false;
		}
		return true;
	},
	7: function (userAnswer, correctAnswer) {
		// remove all whitespace
		var strUserAnswer = userAnswer.replace("/\s/g", "");
		var strCorrectAnswer = correctAnswer.replace("/\s/g", "");
		// 4 things to compare, open or closed on each end and the two endpoints
		if (strUserAnswer[0] !== strCorrectAnswer[0]) return false;
		if (strUserAnswer[strUserAnswer.length - 1] !== strCorrectAnswer[strCorrectAnswer.length - 1]) return false;

		var commaSplitU = strUserAnswer.indexOf(",");
		var commaSplitC = strCorrectAnswer.indexOf(",");

		var firstU = strUserAnswer.slice(1, commaSplitU);
		var firstC = strCorrectAnswer.slice(1, commaSplitC);
		var secondU = strUserAnswer.slice(commaSplitU + 1, -1);
		var secondC = strCorrectAnswer.slice(commaSplitU + 1, -1);

		if ((firstU === "\\infty" || firstU === "-\\infty") && firstU !== firstC) return false; 
		else if (!numericValidator(firstU, firstC)) return false;

		if ((secondU === "\\infty" || secondU === "-\\infty") && secondU !== secondC) return false;
		else if (!numericValidator(secondU, secondC)) return false;

		// If we pass all four checks, then the intervals must be the same
		return true;
	},
	8: matrixValidator,
	9: vectorSetValidator
};
const hints = {
	1: "A decimal like 3, -2.2, or 2e-4 <br>" +
		"A fraction like 22/7, -\\frac{3}{2}, or \\frac{-3}{8} <br>" + 
		"A mixed number like 3\\frac{1}{3}, -2-1/2, 1+2/5, or -4\\frac{6}{5}.<br>" +
		"Answers should be correct to 2 decimal places or 6 significant figures, whichever is less precise",
	3: "A complex number like 2-3i, -1+4i, 7, -i, i, or 6i."
};


// Class for a collection of QuestionClasses, there are all QuestionClasses that 
// have the same or similar form, but each individual QuestionClass will have 
// different functions or a slightly different form.
// The answer type of these QuestionClasses should all be the same, since the 
// answer validation is done by this class
class QuestionSet {
	constructor(questionClasses, answer_type, answer_validation, hint) {
		// an array containing all different forms of questions that we could ask
		this.questions = questionClasses;
		// should be a value from the AnswerType "enum" or an array of such values
		if (!Array.isArray(answer_type)) this.answerType = [answer_type];
		else if (typeof answer_type[0] === "string") this.answerType = [answer_type]; 
		else this.answerType = answer_type;
		// a function that takes two inputs (user answer and correct answer, in that order) 
		// and returns a boolean to indicate if the user answer is correct or not.
		// this can be omitted if answerType != Other (0)
		this.validate = [];
		if (answer_validation === undefined || Array.isArray(answer_validation)) {
			for (var i = 0; i < this.answerType.length; i++) {
				var aType = this.answerType[i];
				if (Array.isArray(aType)) {
					aType = this.answerType[i][1];
				}

				if (answer_validation !== undefined && answer_validation[i] !== undefined) {
					this.validate.push(answer_validation[i]);
				}
				else if (aType !== AnswerType.Other) {
					this.validate.push(validators[aType.type]);
				}
				else {
					throw TypeError("answer_validation can't be undefined when answerType is Other!");
				}
			}
		}
		// if a single validator is given, then we apply it to all answer parts
		else {
			for (var i = 0; i < this.answerType.length; i++) {
				this.validate.push(answer_validation);
			}
		}
		// the text that tells what type of answer is expected (e.g. a number, a string, a complex number)
		if (Array.isArray(hint)) this.answerHint = hint;
		else this.answerHint = [hint];
	};
	getInstance() {
		var randomIndex = Math.floor(Math.random() * this.questions.length);
		// TODO: Unhack
		//randomIndex = 0;
		console.log(randomIndex);
		return this.questions[randomIndex].getInstance(this.answerType);
	};
	getHint(i) {
		if (i < 0 || i >= this.answerType.length) {
			throw RangeError("The index "+i+" is outside the range of answerType!");
		}
		if (this.answerHint !== undefined && this.answerHint[i] !== undefined) {
			return this.answerHint[i];
		}
		else {
			return hints[this.answerType[i]];
		}
	};
};

module.exports = {
	QuestionSet, QuestionClass, Question, AnswerType, Option,
	numericValidator, vectorSetValidator, matrixValidator
};