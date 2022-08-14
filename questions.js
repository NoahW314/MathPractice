
const { complexParser, arrFromLatexStr, numericParser, vectSetFromLatexStr } = require("./util.js");
const { size, typeOf, symbolicEqual, evaluate, Infinity } = require("mathjs");

// Class for a concrete instance of a question and answer

// Unless otherwise stated, all text is assumed to be written in Latex,
// with a pair of dollar signs being used to enclose anything in math mode.
// Anything in math mode will be rendered in displaystyle, but inline.
// Remember to escape slashes in the string
class Question {
	constructor(text, answer, answer_explanation, options, answer_info, info, answerType) {
		// The actual text of the question
		this.text = render(text);
		// The answer that will be checked against the user input.
		this.answer = answer;
		// The answer text that is seen when "Show Answer" is clicked.
		// Has the answer, followed by a short explanation on the next line.
		this.answer_text = [];
		for (var i = 0; i < this.answer.length; i++) {
			var aType = answerType[i];
			if (Array.isArray(aType)) {
				aType = aType[1];
			}
			if (aType === AnswerType.Series) {
				this.answer_text.push(render("Correct Answer: $" + answer_info[i] + " " + this.answer[i] + "$<br>" + answer_explanation[i]));
			}
			else if (aType === AnswerType.MultipleChoice) {
				var answerDisplay = "Not Found!";
				for (var option of options[i]) {
					if (option.value === this.answer[i]) {
						answerDisplay = option.display;
					}
				}
				this.answer_text.push(render("Correct Answer: " + answerDisplay + "<br>" + answer_explanation[i]));
			}
			else if (aType === AnswerType.SelectAll) {
				var answerDisplay = "";
				if (this.answer[i].length === 0) {
					answerDisplay = "None of the above";
				}
				for (var j = 0; j < this.answer[i].length; j++) {
					for (var option of options[i]) {
						if (option.value === this.answer[i][j]) {
							if (j !== 0) {
								answerDisplay += ", ";
							}
							answerDisplay += option.display;
						}
					}
				}
				this.answer_text.push(render("Correct Answer: " + answerDisplay + "<br>" + answer_explanation[i]));
			}
			else {
				this.answer_text.push(render("Correct Answer: $" + this.answer[i] + "$<br>" + answer_explanation[i]));
			}
		}
		// If this is a multiple choice question, then these are the choices
		// otherwise, it is undefined
		this.options = options;
		// If this is a matrix question, then these are the dimensions of the matrix
		// If this is a series question, then it is the Latex string for the summation (big sigma)
		// otherwise, it is undefined
		this.answer_info = answer_info;
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
	constructor(text, answer_form, answer_explanation_form, replacements, options, answer_type_info, extra_info) {
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
		// If this is a matrix question, then this is the string in the info object
		// which will map to the matrix whose dimensions are the same as the answers.
		// For a series question, this is the summation info (the capital sigma and bounds) as a Latex string
		// for a multiple choice question, this is whether or not to shuffle the options around
		if (!Array.isArray(answer_type_info)) this.answer_type_info = [answer_type_info]; 
		else this.answer_type_info = answer_type_info;
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
		var answer_info = [];
		var extra_info = [];

		for (var i = 0; i < this.answer_form.length; i++) {
			if (Array.isArray(this.answer_form[i])) {
				answer.push([]);
				for (var j = 0; j < this.answer_form[i].length; j++) {
					answer[i].push(this.parse(this.answer_form[i][j], info));
				}
			}
			else if (this.answer_form[i] === undefined) {
				var aType = answerType[i];
				if (Array.isArray(aType)) {
					aType = aType[1];
				}
				if (aType === AnswerType.SelectAll) {
					answer.push(info.values[this.answer_type_info[i]]);
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
		for (var i = 0; i < this.answer_type_info.length; i++) {
			var aType = answerType[i];
			if (Array.isArray(aType)) {
				aType = aType[1];
			}
			if (this.answer_type_info[i] === undefined) {
				answer_info.push(undefined);
			}
			else if (aType === AnswerType.Series || aType === AnswerType.MultipleChoice) {
				answer_info.push(this.answer_type_info[i]);
			}
			else if(aType === AnswerType.Matrix || aType === AnswerType.Vectors){
				var data = info.values[this.answer_type_info[i]];	
				// single matrix
				if (aType === AnswerType.Matrix) {
					var dims = size(data);
					answer_info.push([dims.get([0]), dims.get([1])]);
				}
				// (column) vector set
				else {
					var rows = size(data[0]).get([0]);
					answer_info.push([rows, data.length]);
				}
				
			}
		}
		for (var i = 0; i < this.extra_info.length; i++) {
			if (this.extra_info[i] in info.values) {
				extra_info.push(info.values[this.extra_info[i]]);
			}
			else {
				extra_info.push(this.extra_info[i]);
			}
		}


		// return a ready-to-use Question instance
		return new Question(new_text, answer, answer_explanation, options, answer_info, extra_info, answerType);
	};
};



// "enum" that represents some general catergories that answers can fall into
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
	static Expression = new AnswerType(10);
	static Series = new AnswerType(11);
	constructor(type) {
		// type is the general type of the answer, (e.x. numeric, multiple choice, matrix)
		this.type = type;
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
const expressionParser = function (expr) {
	// replace any latex specific stuff with general things
	// things to replace:
	// \frac{}{} with ()/()    [state 1]
	// \sqrt{} with sqrt()     [state 2]
	// {} with ()			   [state 3]
	// juxtaposition with *	   [state 0]
	var state = 0; // neutral state
	var index = 0;
	var parsed = "";
	var currentTerm = ""; // v for variable, n for numeric, g for group (enclosed by parens)
	while (index < expr.length) {
		var char = expr.charAt(index);
		if (state === 0) {
			// command
			if (char === "\\") {
				if (currentTerm !== "") parsed += "*";
				if (expr.charAt(index + 1) === "f") state = 1;
				if (expr.charAt(index + 1) === "s") state = 2;
			}
			// group
			else if (char === "{") {
				if (currentTerm !== "") parsed += "*";
				state = 3;
			}
			// variable
			else if (char.match(/^[a-z]+$/i)) {
				// variables can only be 1 letter long, so we always a *
				if (currentTerm !== "") parsed += "*";
				parsed += char;
				currentTerm = "v";
			}
			// number
			else if (char.match(/^[0-9\.]+$/)) {
				// numbers can be several symbols long, so we don't always insert a *
				if (currentTerm !== "" && currentTerm !== "n") parsed += "*";
				parsed += char;
				currentTerm = "n";
			}
			// spaces (LaTeX ignore whitespace, so we do too)
			else if (char === " ") { }
			else {
				parsed += char;
				currentTerm = "";
			}
			index++;
		}
		else if (state === 1) {
			// get the first part (the numerator)
			index += 5; // index now points to the first character after the {
			var start1 = index;
			var depth = 1;
			while (depth !== 0) {
				if (expr.charAt(index) === "{") depth++;
				if (expr.charAt(index) === "}") depth--;
				index++;
			}
			// index points to the char after the closing } of the numerator
			var numer = expressionParser(expr.slice(start1, index-1));
			// get the second part (the denomator)
			index++;
			var start2 = index;
			var depth = 1;
			while (depth !== 0) {
				if (expr.charAt(index) === "{") depth++;
				if (expr.charAt(index) === "}") depth--;
				index++;
			}
			var denom = expressionParser(expr.slice(start2, index-1));
			parsed += "(" + numer + ")/(" + denom + ")";
			state = 0;
			currentTerm = "g"; // we want to handle any factors after this fraction
		}
		else if (state === 2) {
			parsed += "sqrt(";
			index += 5; // index now points to the first character after the {
			var start = index;
			var depth = 1;
			while (depth !== 0) {
				if (expr.charAt(index) === "{") depth++;
				if (expr.charAt(index) === "}") depth--;
				index++;
			}
			// index points to the char after the closing } of the sqrt command
			var subExpr = expr.slice(start, index-1);
			parsed += expressionParser(subExpr);
			parsed += ")";
			state = 0;
			currentTerm = "g"; // we want to handle any factors after this square root
		}
		else if (state === 3) {
			var depth = 1;
			var start = index;
			while (depth !== 0) {
				if (expr.charAt(index) === "{") depth++;
				if (expr.charAt(index) === "}") depth--;
				index++;
			}
			var subExpr = expressionParser(expr.slice(start, index-1));
			parsed += "(" + subExpr + ")";
			state = 0;
			currentTerm = "g"; // we want to handle any factors after this group
		}
	}
	return parsed;
}
const expressionValidator = function (userAnswer, correctAnswer) {
	// my expression parser probably doesn't perfectly handle every case, but it does a decent job
	// combined with the fact that math.js's parser seems to be pretty smart convinces me that 
	// this expression validator will work correctly in almost all cases
	var userExpr = expressionParser(userAnswer);
	var correctExpr = expressionParser(correctAnswer);
	console.log(userExpr);
	console.log(correctExpr);
	return userExpr === correctExpr || symbolicEqual(userExpr, correctExpr);
}
// When possible, maps the answer type to a function which can validate an answer of that type
const validators = {
	1: numericValidator,
	2: function (userAnswer, correctAnswer) {
		return userAnswer === correctAnswer;
	},
	3: function (userAnswer, correctAnswer, previousAnswers, info) {
		// form expresses whether the answer is written in rectangular form or exponential form
		// form must always be the first thing listed in the info array for a complex problem
		// if no form is specified, then we try to detect the form being used by the presence of e^
		var form = info[0];
		// parse userAnswer and correctAnswer as a complex number 
		// return type is the complex number type from math.js
		var userComplex = complexParser(userAnswer, form);
		var correctComplex = complexParser(correctAnswer, form);
		
		// if one of the answers is Infinity, but not the other, then they are different
		if (correctComplex === Infinity) {
			return userComplex === Infinity;
		}
		else if (userComplex === Infinity) {
			return false;
		}
		console.log("User: " + userComplex.toString());
		console.log("Correct: " + correctComplex.toString());
		return numericValidator(userComplex.re, correctComplex.re) && numericValidator(userComplex.im, correctComplex.im);
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
	9: vectorSetValidator,
	10: expressionValidator,
	11: expressionValidator
};
const hints = {
	1: "A decimal like 3, -2.2, or 2e-4 <br>" +
		"A fraction like 22/7, -\\frac{\\sqrt{3}}{2}, or \\frac{-3}{8} <br>" + 
		"A mixed number like 3\\frac{1}{3}, -2-1/2, 1+2/5, or -4\\frac{6}{5}.<br>" +
		"Answers should be correct to 2 decimal places or 6 significant figures, whichever is less precise",
	3: "A complex number like 2-3.5i, -1+\\sqrt{3}i, \\frac{5}{2}, -i, i, or \\frac{\\sqrt{3}}{2}i."
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
		//randomIndex = 4;
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

const theoremCreator = function (thmName, thmImpl, thmConditions, correctConditionKey, isFirst, uniConds) {
	var text = "Select the conditions of the following theorem:<br>";
	if (thmName !== undefined) {
		text += "<b>" + thmName + "</b>";
		text += "<br>";
	}
	if (uniConds !== undefined) {
		text += uniConds + "<br>";
	}
	if (isFirst) {
		text += thmImpl + " . . .";
	}
	else {
		text += ". . . " + thmImpl;
	}
	return new QuestionClass(text, correctConditionKey, "", {}, thmConditions, true);
};

module.exports = {
	QuestionSet, QuestionClass, Question, AnswerType, Option,
	numericValidator, vectorSetValidator, matrixValidator, render, theoremCreator
};