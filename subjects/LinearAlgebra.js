
const { AnswerType, QuestionSet, QuestionClass } = require("../questions.js"); 
const { Matrix } = require("ml-matrix");
const { matToLatexStr, randMat } = require("../util.js");

const rref = [new QuestionSet([
	new QuestionClass("Is this a question? $#2(#1)$", "#2 ", "It has a question mark.",
		{ "1": () => randMat([2,6], [2,6], -9, 9), "2": (A) => matToLatexStr(A)}, undefined, "1")
], AnswerType.Matrix())];



// Organized by decreasing level of importance (each level of importance will be done half as often as the level above it)
var linAlgProbs = [[rref], [rref], [rref]];
var linAlgProbsBySubject = {
	"Linear Systems of Equations": [rref],
	"Vector Spaces": [],
	"Eigenvalues": [],
	"Inner Product Spaces": []
};
var linAlgProbsNamed = {
	"rref": rref
};

module.exports = { linAlgProbs, linAlgProbsBySubject, linAlgProbsNamed };