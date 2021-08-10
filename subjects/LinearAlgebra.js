
const { AnswerType, QuestionSet, QuestionClass } = require("../questions.js"); 
const { Matrix } = require("ml-matrix");

const rref = [new QuestionSet([
	new QuestionClass("Is this a question?", "Yes", "It has a question mark.", {})
], AnswerType.Numeric)]; // We really need a matrix answer type

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