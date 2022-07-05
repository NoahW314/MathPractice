// Note to self, pressing Ctrl+R twice will run the program without the debugger (which is faster)

const { diffEqProbs, diffEqProbsBySubject, diffEqProbsNamed } = require("./subjects/DiffEq.js");
const { linAlgProbs, linAlgProbsBySubject, linAlgProbsNamed } = require("./subjects/LinearAlgebra.js");
const { AnswerType } =  require("./questions.js");
const { randInt, matToLatexStr, vectSetToLatexStr, numericParser } = require("./util.js");
const { zeros } = require("mathjs");

var problems = {
    "Differential Equations": diffEqProbs,
    "Linear Algebra": linAlgProbs
};
var problemsBySubject = {
    "Differential Equations": diffEqProbsBySubject,
    "Linear Algebra": linAlgProbsBySubject
};
var problemsNamed = {
    "Differential Equations": diffEqProbsNamed,
    "Linear Algebra": linAlgProbsNamed
};

var answerInputDivs = [];
var areAllCorrect = false;
var subject = "";
var currQuestion;
var currQuestionSet;

var evaluateAnswerPart = function (answerPart, index, prevAnswers) {
    console.log(answerPart);
    console.log(currQuestion.answer[index]);
	return currQuestionSet.validate[index](answerPart, currQuestion.answer[index], prevAnswers, currQuestion.info);
};

var getAnswerDiv = function () {
    return $('<p class="rendered_answer_input"></p>\
        <div class="answer_div">\
            <div class="answer_status" hidden>\
                <span class="answer_status_text">Correct/Incorrect</span>\
                <i class="checkmark fas fa-check" style="color:MediumSeaGreen" hidden></i>\
                <i class="red_x fas fa-times" style="color:red" hidden></i>\
            </div>\
            <p class="correct_answer_text" hidden>Answer</p>\
        </div>');
}
var getNewQuestion = function () {
    var topicArray;
    var topic = $("#topic_select").val();
    if (topic === "None") {
        const numDiffs = problems[subject].length;
        const max = (2 ** numDiffs) - 1;
        const randNum = randInt(1, max);
        var randomIndex = -1;
        for (var i = 0; i < numDiffs; i++) {
            if (randNum <= (2**(i+1))-1) {
                randomIndex = numDiffs - 1 - i;
                break;
            }
        }

        // TODO: Unhack  (importance in subject array)
        //randomIndex = 1;
        //console.log(randomIndex);
        topicArray = problems[subject][randomIndex];
    }
    else if (topic in problemsBySubject[subject]) {
        topicArray = problemsBySubject[subject][topic];
    }
    else {
        topicArray = [problemsNamed[subject][topic]];
    }
    var randomIndex = Math.floor(Math.random() * topicArray.length);
    // TODO: Unhack  (position in importance level array)
    //randomIndex = topicArray.length-1;
    //console.log(randomIndex);
    var setArray = topicArray[randomIndex];
    randomIndex = Math.floor(Math.random() * setArray.length);
    // TODO: Unhack  (which question set is it [position in low-level topic])
    //randomIndex = 0;
    //console.log(randomIndex);
    currQuestionSet = setArray[randomIndex];
    currQuestion = currQuestionSet.getInstance();

    // remove any old elements from the answer area
    $("#answer_input_div").empty();
    answerInputDivs = [];
    areAllCorrect = false;
    for (var i = 0; i < currQuestionSet.answerType.length; i++) {

        var aType;
        var answerText = "Answer";
        if (Array.isArray(currQuestionSet.answerType[i])) {
            answerText = currQuestionSet.answerType[i][0];
            aType = currQuestionSet.answerType[i][1];
        }
        else aType = currQuestionSet.answerType[i];

        var answerInputDiv = $("<div></div>");
        if (aType === AnswerType.MultipleChoice) {
            // create the wrapper for the multiple choice element
            var selectDiv = $("<div class='answer_input'></div>");
            if (answerText !== "Answer") {
                selectDiv.text(answerText);
                selectDiv.append($("<br>"));
            }

            // place the new options in the wrapper
            for (var option of currQuestion.options[i]) {
                var input = $('<input type="radio" name="answer_'+i+'">');
                input.attr("id", i+"_"+option.value);
                input.attr("value", option.value);
                var label = $('<label></label>');
                label.attr("for", i+"_"+option.value);
                label.html(option.display);

                selectDiv.append(input);
                selectDiv.append(label);
                selectDiv.append("<br>");
            }

            // add the wrapper to the main screen
            answerInputDiv.append(selectDiv);
        }
        else if (aType === AnswerType.SelectAll) {
            // create the wrapper for the multiple choice element
            var selectDiv = $("<div class='answer_input'></div>");
            if (answerText !== "Answer") {
                selectDiv.text(answerText);
                selectDiv.append($("<br>"));
            }

            // shuffle the options around (biased shuffle, but who cares)
            var options = currQuestion.options[i].sort(() => Math.random() - 0.5);
            // place the new options in the wrapper
            for (var option of options) {
                var input = $('<input type="checkbox" name="answer_'+i+'">');
                input.attr("id", i + "_" + option.value);
                input.attr("value", option.value);
                var label = $('<label></label>');
                label.attr("for", i + "_" + option.value);
                label.html(option.display);

                selectDiv.append(input);
                selectDiv.append(label);
                selectDiv.append("<br>");
            }

            // add the wrapper to the main screen
            answerInputDiv.append(selectDiv);
        }
        else if (aType === AnswerType.Matrix) {
            // get the dimensions of the matrix
            var rows = currQuestion.matrix_dims[i][0];
            var cols = currQuestion.matrix_dims[i][1];
            // create the wrapper for matrix boxes
            var matrixDiv = $("<div class='answer_input' id='matrix_div_thing_input'></div>");
            if (answerText === "Answer") {
                answerText = "Matrix: ";
            }
            matrixDiv.append($("<p>" + answerText + "</p>"));

            
            // set up the input boxes for the matrix elements
            for (var k = 0; k < rows; k++) {
                for (var j = 0; j < cols; j++) {
                    matrixDiv.append($("<input type='text' class='answer_matrix_input' id='matrix_input"+i+"_"+k+"_"+j+"'>"));
                }
                matrixDiv.append($("<br>"));
            }
            answerInputDiv.append(matrixDiv);
        }
        else if (aType === AnswerType.Vectors) {
            // get the "dimensions" of the vector set
            var dims = currQuestion.matrix_dims[i];
            var rows = dims[0];
            var num = dims[1]; 
            
            // create the wrapper for vector boxes
            var setDiv = $("<div class='answer_input' id='vector_div_thing_input'></div>");
            if (answerText === "Answer") {
                answerText = "Vector Set: ";
            }
            setDiv.append($('<span>' + answerText + '</span>'));
            if (currQuestionSet.getHint(i) !== undefined) {
                setDiv.append($('<span class="answer_type_hint" id="answer_hint_' + i + '">\
                                <span class="answer_type_text" hidden></span>\
                                <i class="answer_type_icon fas fa-info-circle" style="color:gray"></i>\
                               </span>'));
            }
            setDiv.append($('<br>'));

            for (var j = 0; j < num; j++) {
                var vectDiv = $("<div class='vect_input'></div>");
                for (var k = 0; k < rows; k++) {
                    vectDiv.append($("<input type='text' class='answer_vector_input' id='vector_input" + i + "_" + j + "_" + k + "'>"));
                    vectDiv.append($("<br>"));
                }
                setDiv.append(vectDiv);
            }
            answerInputDiv.append(setDiv);
        }
        else {
            // create the wrapper for the input element
            var inputDiv = $("<div class='answer_input'></div>");
            // add the inards of the input stuff
            inputDiv.append($("<label for='answer_input_"+i+"'>"+answerText+":</label>"));
            inputDiv.append($("<input type='text' class='answer_input_input' id='answer_input_" + i + "'>"));
            inputDiv.append($('<span class="answer_type_hint" id="answer_hint_'+i+'">\
                                <span class="answer_type_text" hidden></span>\
                                <i class="answer_type_icon fas fa-info-circle" style="color:gray"></i>\
                               </span>\
                               <button class="show_latex">Show Latex</button>'));
            // add the wrapper to the main screen
            answerInputDiv.append(inputDiv);
        }
        answerInputDiv.append(getAnswerDiv());
        $("#answer_input_div").append(answerInputDiv);
        answerInputDivs.push(answerInputDiv);
    }

	return currQuestion.text;
};

var getAnswer = function (index) {
	return currQuestion.answer_text[index];
};

var updateSubject = function (newSubject) {
    subject = newSubject;

    const topicSelector = $("#topic_select"); 
    topicSelector.empty();
    topicSelector.append($("<option></option>")
        .attr("value", "None")
        .text("None")); 
    // add the high level topic
    const probs = problemsBySubject[subject];
    for (var topic in probs) {
        topicSelector.append($("<option></option>")
            .attr("value", topic)
            .text(topic)); 
    }
    // add the lower level topics
    const probsNamed = problemsNamed[subject];
    for (var topic in probsNamed) {
        topicSelector.append($("<option></option>")
            .attr("value", topic)
            .text(topic))
    }
};



$("#answer_input_div").on("keydown", ".answer_input", function (keyEvent) {
    if (keyEvent.which === 13) {
        if (areAllCorrect) {
            $("#reload_question").click();
        }
        else {
            $("#answer_submit").click();
        }
    }
});

$("#answer_submit").click(function () {
    areAllCorrect = true;
    var prevAnswers = [];
    for (var i = 0; i < currQuestionSet.answerType.length; i++) {
        var answer;
        var aType;
        if (Array.isArray(currQuestionSet.answerType[i])) aType = currQuestionSet.answerType[i][1];
        else aType = currQuestionSet.answerType[i];

        if (aType === AnswerType.MultipleChoice) {
            answer = answerInputDivs[i].find("input[type='radio'][name='answer_" + i + "']:checked").val();
        }
        else if (aType === AnswerType.SelectAll) {
            answer = answerInputDivs[i].find("input[type='checkbox'][name='answer_" + i + "']:checked").map(function () {
                return $(this).val();
            }).get();
        }
        else if (aType === AnswerType.Matrix) {
            var rows = currQuestion.matrix_dims[i][0];
            var cols = currQuestion.matrix_dims[i][1];
            var answerMat = zeros(rows, cols);
            answer = [];
            for (var k = 0; k < rows; k++) {
                answer.push([]);
                for (var j = 0; j < cols; j++) {
                    var val = $("#matrix_input" + i + "_" + k + "_" + j).val();
                    answerMat.set([k, j], numericParser(val));
                    answer[k].push(val);
                }
            }
            var renderedAnswerInput = answerInputDivs[i].find(".rendered_answer_input").get(0);
            var latexMatrixString = matToLatexStr(answerMat);
            try {
                katex.render(latexMatrixString, renderedAnswerInput);
            } catch (err) {
                if (err instanceof katex.ParseError) {
                    katex.render(answerMat, renderedAnswerInput, { throwOnError: false });
                    return;
                }
                else { throw err; }
            }
        }
        else if (aType === AnswerType.Vectors) {
            var rows = currQuestion.matrix_dims[i][0];
            var num = currQuestion.matrix_dims[i][1];
            var answerVects = [];
            answer = [];
            for (var k = 0; k < num; k++) {
                answerVects.push(zeros(rows, 1));
                answer.push([]);
                for (var j = 0; j < rows; j++) {
                    var val = $("#vector_input" + i + "_" + k + "_" + j).val();
                    answerVects[k].set([j, 0], numericParser(val));
                    answer[k].push(val);
                }
            }
            var renderedAnswerInput = answerInputDivs[i].find(".rendered_answer_input").get(0);
            var latexVectString = vectSetToLatexStr(answerVects);
            try {
                katex.render(latexVectString, renderedAnswerInput);
            } catch (err) {
                if (err instanceof katex.ParseError) {
                    katex.render(answerVects, renderedAnswerInput, { throwOnError: false });
                    return;
                }
                else { throw err; }
            }
        }
        else {
            answer = answerInputDivs[i].find(".answer_input_input").val();
            var renderedAnswerInput = answerInputDivs[i].find(".rendered_answer_input").get(0);

            try {
                katex.render("\\displaystyle" + answer, renderedAnswerInput);
            } catch (err) {
                if (err instanceof katex.ParseError) {
                    katex.render(answer, renderedAnswerInput, { throwOnError: false });
                    return;
                }
                else { throw err; }
            }
        }

        var isCorrect = evaluateAnswerPart(answer, i, prevAnswers);
        if (!isCorrect) areAllCorrect = false;
        prevAnswers.push(answer);

        answerInputDivs[i].find(".answer_status").show();
        var answerStatusText = answerInputDivs[i].find(".answer_status_text");
        if (isCorrect) {
            answerStatusText.text("Correct");
            answerInputDivs[i].find(".checkmark").show();
            answerInputDivs[i].find(".red_x").hide();
        }
        else {
            answerStatusText.text("Incorrect");
            answerInputDivs[i].find(".red_x").show();
            answerInputDivs[i].find(".checkmark").hide();
        }
    }
});

// Grey out this button until a subject has been selected.
$("#reload_question").click(function () {
    // Get the question and display it
    var question_text = getNewQuestion();
    $("#question_text").html(question_text);

    // Get the answer in case we need to show it
    for (var i = 0; i < currQuestion.answer_text.length; i++) {
        var correct_answer_text = getAnswer(i);
        var correctAnswerTextEl = answerInputDivs[i].find(".correct_answer_text");
        // Put the text in the element, but hide it for now
        correctAnswerTextEl.html(correct_answer_text);
        correctAnswerTextEl.hide();
    }
});

$("#answer_input_div").on("click", ".show_latex", function () {
    var answer = $(this).parent().find(".answer_input_input").val();
    var renderedAnswerInput = $(this).parent().parent().find(".rendered_answer_input").get(0);

    try {
        katex.render("\\displaystyle" + answer, renderedAnswerInput);
    } catch (err) {
        if (err instanceof katex.ParseError) {
            katex.render(answer, renderedAnswerInput, { throwOnError: false });
            return;
        }
        else { throw err; }
    }
});

$("#show_answer").click(function () {
    $(".correct_answer_text").show();
});

$("#subject_select").change(function () {
    updateSubject($(this).val());
    $("#reload_question").prop("disabled", false);
    $("#topic_select_span").show();
});

$("#answer_input_div").on("mouseenter", ".answer_type_hint", function () {
    var typeText = $(this).parent().find(".answer_type_text");
    var id = $(this).prop("id");
    var index = id[id.length - 1];
    typeText.html(currQuestionSet.getHint(index));
    typeText.show();
});
$("#answer_input_div").on("mouseleave", ".answer_type_hint", function () {
    $(this).parent().find(".answer_type_text").hide();
});