
const { AnswerType, QuestionSet, QuestionClass, Option } = require("../questions.js"); 
const { matToLatexStr, randMat, isSingular, randInt, addsub,
	rref, isInconsistent, hasUniqueSolution, hasInfiniteSolutions,
	randIntExclude } = require("../util.js");
const { add, transpose, multiply, det, inv, subset, index, range,
	zeros, concat, row, column, deepEqual, size, matrix, dotMultiply,
	fraction } = require("mathjs");

const correctMOP = function (...exclude) {
	var arr = [
		"$(A+B)^T=A^T+B^T$",
		"$(A*B)^T=B^T*A^T$",
		"$(A^T)^T=A$",
		"$(A-B)^T=A^T-B^T$",
		"$A*(B-C)^T=A*B^T-A*C^T$",
		"$(A+B)*C=A*C+B*C$"
	];
	var statement;
	do {
		statement = arr[randInt(0, arr.length - 1)];
	} while (exclude.indexOf(statement) !== -1);
	return statement;
}
const incorrectMOP = function (...exclude) {
	var arr = [
		"$A*B=B*A$",
		"$(A*B)^T=A^T*B^T$",
		"$(A*(B+C))^T=A^T*B^T+A^T*C^T$",
		"$(A*(B^T*C))^T=C^T*A^T*B$",
		"$A*(B-C)^T=A*B^T-C^T$"
	];
	var statement;
	do {
		statement = arr[randInt(0, arr.length - 1)];
	} while (exclude.indexOf(statement) !== -1);
	return statement;
}
const matrixArithmetic = [new QuestionSet([
		// linear operations (add, sub, scalar multiplication)
		new QuestionClass("Compute $A#7(#6)B$, where $A=#4(#2(#1))$ and $B=#4(#3(#1))$", "#4(#5(#2, #3, #6))", "",
			{
				"1": () => [randInt(2, 4), randInt(2, 4)], "2": (dims) => randMat(dims[0], dims[1], -9, 9),
				"3": (dims) => randMat(dims[0], dims[1], -9, 9), "4": (A) => matToLatexStr(A),
				"5": (A, B, c) => add(A, multiply(B, c)), "6": () => randIntExclude(-5, 5, 0), "7": addsub
			}, undefined, "5"),
		// transposition
		new QuestionClass("Compute $(A+B)^T$, where $A=#4(#2(#1))$ and $B=#4(#3(#1))$", "#4(#5(#2, #3))", "",
			{
				"1": () => [randInt(2, 4), randInt(2, 4)], "2": (dims) => randMat(dims[0], dims[1], -9, 9),
				"3": (dims) => randMat(dims[0], dims[1], -9, 9), "4": (A) => matToLatexStr(A),
				"5": (A, B) => transpose(add(A, B))
			}, undefined, "3"),
		// TODO: conjugate-transposition?
		// multiplication
		new QuestionClass("Compute $A*B$, where $A=#4(#2(#1))$ and $B=#4(#3(#1))$", "#4(#5(#2, #3))", "",
			{
				"1": () => [randInt(1, 4), randInt(1, 4)], "2": (dims) => randMat(dims[0], dims[1], -9, 9),
				"3": (dims) => randMat(dims[1], randInt(1, 4), -9, 9), "4": (A) => matToLatexStr(A),
				"5": (A, B) => multiply(A, B)
			}, undefined, "5"
		)
], AnswerType.Matrix())];
const matrixOperations = [
	// multiplication dimensions
	new QuestionSet([
		new QuestionClass("What are the dimensions of $A*B$ if $A$ is a $#1 \\times #2 $ matrix and $B$ \
						is a $#2 \\times #3 $ matrix? (Enter the answer as $m\\times n$, written in Latex)",
			"#1 \\times #3 ", "", { "1": () => randInt(1, 9), "2": () => randInt(1, 9), "3": () => randInt(1, 9) }),
		new QuestionClass("What are the dimensions of $B*A$ if $A$ is a $#1 \\times #2 $ matrix and $B$ \
						is a $#3 \\times #1 $ matrix? (Enter the answer as $m\\times n$, written in Latex)",
			"#3 \\times #2 ", "", { "1": () => randInt(1, 9), "2": () => randInt(1, 9), "3": () => randInt(1, 9) }),
		new QuestionClass("What are the dimensions of $(B*A)^T$ if $A$ is a $#1 \\times #2 $ matrix and $B$ \
						is a $#3 \\times #1 $ matrix? (Enter the answer as $m\\times n$, written in Latex)",
			"#2 \\times #3 ", "", { "1": () => randInt(1, 9), "2": () => randInt(1, 9), "3": () => randInt(1, 9) }),
		new QuestionClass("What are the dimensions of $(A*B)^T$ if $A$ is a $#1 \\times #2 $ matrix and $B$ \
						is a $#2 \\times #3 $ matrix? (Enter the answer as $m\\times n$, written in Latex)",
			"#3 \\times #1 ", "", { "1": () => randInt(1, 9), "2": () => randInt(1, 9), "3": () => randInt(1, 9) })
	], AnswerType.Exact),
	// properties of matrix operations
	new QuestionSet([
		// 1 correct
		new QuestionClass("Select all properties which are true", ["1"], " ",
			{ "1": correctMOP, "2": incorrectMOP, "3": (a) => incorrectMOP(a) },
			[new Option("1", "#1 "), new Option("2", "#2 "), new Option("3", "#3(#2)")]),
		// 2 correct
		new QuestionClass("Select all properties which are true", ["1", "2"], " ",
			{ "1": correctMOP, "2": (a) => correctMOP(a), "3": incorrectMOP },
			[new Option("1", "#1 "), new Option("2", "#2(#1)"), new Option("3", "#3 ")]),
		// 3 correct
		new QuestionClass("Select all properties which are true", ["1", "2", "3"], " ",
			{ "1": correctMOP, "2": (a) => correctMOP(a), "3": (a, b) => correctMOP(a, b) },
			[new Option("1", "#1 "), new Option("2", "#2(#1)"), new Option("3", "#3(#1, #2)")])
	], AnswerType.SelectAll)
];


const randSingMat = function (size, min, max, ...exclude) {
	if (Array.isArray(size)) {
		size = randInt(size[0], size[1]);
	}
	var A = randMat(size, size, min, max, exclude);
	while (!isSingular(A)) {
		A = randMat(size, size, min, max, exclude);
	}
	return A;
}
const randNonSingMat = function (size, min, max, ...exclude) {
	if (Array.isArray(size)) {
		size = randInt(size[0], size[1]);
	}
	var A = randMat(size, size, min, max, exclude);
	while (isSingular(A)) {
		A = randMat(size, size, min, max, exclude);
	}
	return A;
}
const randTallMat = function (colsRange, maxDims, min, max, ...exclude) {
	var cols = randInt(colsRange[0], colsRange[1]);
	var rows = randInt(cols + 1, maxDims - cols);
	return randMat(rows, cols, min, max, exclude);
}
const randLongMat = function (rowsRange, maxDims, min, max, ...exclude) {
	var rows = randInt(rowsRange[0], rowsRange[1]);
	var cols = randInt(rows + 1, maxDims - rows);
	return randMat(rows, cols, min, max, exclude);

}
/* What types of matrices do we want? (No Matrix should have dimensions whose sum is > 8 (i.e. 4x4, 3x5, 2x6 are max sizes))
 * Singular square matrices (and thus they will have a free variable)
 * Non-singular square matrices
 * Matrices with more rows than cols
 * Matrices with more cols than rows
 */
const computingRREF = [new QuestionSet([
	// singular
	new QuestionClass("Compute the reduced row-echelon form of $#3(#1)$", "#3(#2(#1))", "",
		{ "1": () => randSingMat([2, 4], -9, 9), "2": (A) => rref(A), "3": (A) => matToLatexStr(A) }, undefined, "1"),
	// nonsingular
	new QuestionClass("Compute the reduced row-echelon form of $#3(#1)$", "#3(#2(#1))", "",
		{ "1": () => randNonSingMat([2, 4], -9, 9), "2": (A) => rref(A), "3": (A) => matToLatexStr(A) }, undefined, "1"),
	// rows > cols
	new QuestionClass("Compute the reduced row-echelon form of $#3(#1)$", "#3(#2(#1))", "",
		{ "1": () => randTallMat([2, 3], 8, -9, 9), "2": (A) => rref(A), "3": (A) => matToLatexStr(A) }, undefined, "1"),
	// cols > rows
	new QuestionClass("Compute the reduced row-echelon form of $#3(#1)$", "#3(#2(#1))", "",
		{ "1": () => randLongMat([2, 3], 8, -9, 9), "2": (A) => rref(A), "3": (A) => matToLatexStr(A) }, undefined, "1")
], AnswerType.Matrix())];
const computeInverse = [new QuestionSet([
	new QuestionClass("Find the inverse of the matrix $#3(#1)$", "#3(#2(#1))", "",
		{ "1": () => randNonSingMat([2, 4], -9, 9), "2": (A) => inv(A), "3": matToLatexStr }, undefined, "1")
], AnswerType.Matrix())];

const randInconsistentACM = function (sizeRange, maxDims, min, max, ...exclude) {
	var rows, cols;
	if (Array.isArray(sizeRange)) {
		rows = randInt(sizeRange[0], sizeRange[1]);
		cols = randInt(1, rows);
	}
	var A = randMat(rows, cols, min, max, exclude);
	var b = randMat(rows, 1, min, max, exclude);
	while (!isInconsistent(A, b, rows, cols)) {
		A = randMat(rows, cols, min, max, exclude);
		b = randMat(rows, 1, min, max, exclude);
	}
	return [A, b];
}
// must have at least as many rows as columns
const randUniqueACM = function (min, max, ...exclude) {
	var arrOpts = [[4, 4], [3, 3], [4, 3], [2, 2], [3, 2]];
	var dims = arrOpts[randInt(0, arrOpts.length - 1)];
	var rows = dims[0];
	var cols = dims[1];
	var A = randMat(rows, cols, min, max, exclude);
	var b = randMat(rows, 1, min, max, exclude);
	while (!hasUniqueSolution(A, b, rows, cols)) {
		A = randMat(rows, cols, min, max, exclude);
		b = randMat(rows, 1, min, max, exclude);
	}
	return [A, b];
}
const randFreeACM = function (sizeRange, maxDims, min, max, ...exclude) {
	var arrOpts = [[2,2], [3,3], [2,3], [2,4], [2,5], [3,4]];
	var dims = arrOpts[randInt(0, arrOpts.length - 1)];
	var rows = dims[0];
	var cols = dims[1];
	var A = randMat(rows, cols, min, max, exclude);
	var b = randMat(rows, 1, min, max, exclude);
	while (!hasInfiniteSolutions(A, b, rows, cols)) {
		A = randMat(rows, cols, min, max, exclude);
		b = randMat(rows, 1, min, max, exclude);
	}
	return [A, b];
}
// have a question part that asks for the type of equation
// inconsistent, unique, or infinitely many
// inconsistent equations will have no entry in the matrix space
// infinitely many solutions will have all free variables set to 1
// no matrix A with dimensions whose sum is > 8
const solveMatrixEq = [new QuestionSet([
	// inconsistent
	new QuestionClass("Solve the equation $A*{\\bf x}={\\bf b}$, where $A=#3(#2(#1))$ and ${\\bf b}=#3(#4(#1))$. \
		(Set any free variables to 1.  Leave solution empty for inconsistent)", ["Inconsistent", "#3(#5(#2))"], [" ", " "],
		{
			"1": () => randInconsistentACM([2, 4], 8, -9, 9), "2": (ACM) => ACM[0],
			"3": (A) => matToLatexStr(A), "4": (ACM) => ACM[1],
			"5": (A) => zeros(size(A).get([1]), 1)
		}, [["Inconsistent", "Unique", "Infinitely Many"], []], [undefined, "5"]),
	// unique solution
	new QuestionClass("Solve the equation $A*{\\bf x}={\\bf b}$, where $A=#3(#2(#1))$ and ${\\bf b}=#3(#4(#1))$. \
		(Set any free variables to 1.  Leave solution empty for inconsistent)", ["Unique", "#3(#5(#2, #4))"], [" ", " "],
		{
			"1": () => randUniqueACM(-9, 9), "2": (ACM) => ACM[0],
			"3": (A) => matToLatexStr(A), "4": (ACM) => ACM[1],
			"5": (A, b) => {
				var RREF = rref(concat(A, b));
				var ind = index(range(0, size(A).get([1])), size(A).get([1]));
				return subset(RREF, ind);
			}
		}, [["Inconsistent", "Unique", "Infinitely Many"], []], [undefined, "5"]),
	// free variables
	new QuestionClass("Solve the equation $A*{\\bf x}={\\bf b}$, where $A=#3(#2(#1))$ and ${\\bf b}=#3(#4(#1))$. \
		(Set any free variables to 1.  Leave solution empty for inconsistent)", ["Infinitely Many", "#3(#5(#2, #4))"], [" ", " "],
		{
			"1": () => randFreeACM([2, 4], 8, -9, 9), "2": (ACM) => ACM[0],
			"3": (A) => matToLatexStr(A), "4": (ACM) => ACM[1],
			"5": (A, b) => {
				var RREF = rref(concat(A,b));
				var rows = size(A).get([0]);
				var cols = size(A).get([1]);
				var ansArr = [];
				var rowsDown = 0;
				for (var i = 0; i < cols; i++) {
					var hasLeadingOne = (rowsDown < rows && RREF.get([rowsDown, i]) === 1);
					// if there is a leading one, then this is not a free variable
					if (hasLeadingOne) {
						var sum = RREF.get([rowsDown, cols]);
						for (var j = i+1; j < cols; j++) {
							sum -= RREF.get([rowsDown, j]);
						}
						ansArr.push([sum]);
						rowsDown++;
					}
					// if there is not a leading one, then this is a free variable, so it should be 1 by convention
					else {
						ansArr.push([1]);
					}
				}
				return matrix(ansArr);
			}
		}, [["Inconsistent", "Unique", "Infinitely Many"], []], [undefined, "5"])
], [["Type of solution: ", AnswerType.MultipleChoice], ["Solution: ", AnswerType.Matrix()]])];

const randEqSysStr = function (type) {
	var rows, cols;
	// rows < cols, underdetermined
	if (type === 0) {
		rows = randInt(2, 4);
		cols = randInt(rows+1, 6);
	}
	// rows = cols, balanced
	else if (type === 1) {
		rows = randInt(2, 5);
		cols = rows;
	}
	// rows > cols, overdetermined
	else if (type === 2) {
		cols = randInt(2, 4);
		rows = randInt(cols+1, 6);
	}
	var str = "$$\\begin{array}{"+("c".repeat(cols*2+1))+"}\n";
	for (var i = 0; i < rows; i++) {
		for (var j = 0; j < cols; j++) {
			var int = randInt(1, 9);
			var sign = { 0: "+", 2: "+", 3: "+", 1: "-" }[randInt(0, 3)];
			if (j === 0) {
				if (sign === "-") {
					str += sign;
				}
			}
			else {
				str += "&"+sign+"&";
			}
			if (int !== 1) {
				str += int;
			}
			str += "x_{" + (j + 1) + "}";
		}
		str += "&=&";
		str += randInt(-9,9);
		str += "\\\\ \n";
	}
	str += "\\end{array}$$"
	return str;
}
const isRowMultiple = function (v1, v2) {
	var x1 = v1.get([0, 0]);
	var y1 = v2.get([0, 0]);
	if (x1 === 0 || y1 === 0) {
		return false;
	}
	var multiple = fraction(x1, y1);
	var newV = multiply(v2, multiple);
	return deepEqual(v1, newV);
}
const performRandRowOp = function (A, type) {
	var rows = size(A).get([0]);
	var cols = size(A).get([1]);
	// switch two rows
	if (type === 1) {
		// pick the rows
		var i = randInt(0, rows - 1);
		var j = randIntExclude(0, rows - 1, i);
		var rowI = row(A, i);
		var rowJ = row(A, j);
		// don't switch rows that are the same
		while (deepEqual(rowI, rowJ)) {
			i = randInt(0, rows - 1);
			j = randIntExclude(0, rows - 1, i);
			rowI = row(A, i);
			rowJ = row(A, j);
		}
		A = subset(A, index(i, range(0, cols)), rowJ); // replace i with j
		A = subset(A, index(j, range(0, cols)), rowI); // replace j with i
		return A;
	}
	// multiply a row by a nonzero scalar
	else if (type === 2) {
		var i = randInt(0, rows - 1);
		var rowI = row(A, i);
		// don't multiply by 1 or 0
		var scalar = randIntExclude(-5, 5, 0, 1);
		rowI = multiply(rowI, scalar);
		A = subset(A, index(i, range(0, cols)), rowI);
		return A;
	}
	// add a (nonzero) multiple of a row to another row
	else if (type === 3) {
		var scalar = randIntExclude(-3, 3, 0, 1);
		var i = randInt(0, rows - 1);
		var j = randIntExclude(0, rows - 1, i);
		var rowI = row(A, i);
		var rowJ = row(A, j);
		// don't add to a row which is a multiple of this row
		while (isRowMultiple(rowI, rowJ)) {
			i = randInt(0, rows - 1);
			j = randIntExclude(0, rows - 1, i);
			rowI = row(A, i);
			rowJ = row(A, j);
		}
		// add the multiple of row i to row j
		rowI = multiply(rowI, scalar);
		rowJ = add(rowI, rowJ);
		A = subset(A, index(j, range(0, cols)), rowJ); // replace with the new row j
		return A;
	}
}
const linearDefnTerms = [
	// underdetermined, overdetermined, balanced
	new QuestionSet([
		new QuestionClass("Is the following system of equations underdetermined, overdetermined, or balanced? #1 ",
			"Underdetermined", "", { "1": () => randEqSysStr(0)}, ["Underdetermined", "Overdetermined", "Balanced"]),
		new QuestionClass("Is the following system of equations underdetermined, overdetermined, or balanced? #1 ",
			"Balanced", "", { "1": () => randEqSysStr(1) }, ["Underdetermined", "Overdetermined", "Balanced"]),
		new QuestionClass("Is the following system of equations underdetermined, overdetermined, or balanced? #1 ",
			"Overdetermined", "", { "1": () => randEqSysStr(2) }, ["Underdetermined", "Overdetermined", "Balanced"])
	], AnswerType.MultipleChoice),
	// row operations
	new QuestionSet([
		new QuestionClass("What type of row operation is being performed? $$#3(#1) \\to #3(#2(#1))$$", "Type I", "",
			{ "1": () => randMat([2, 4], [2, 4], -9, 9), "2": (A) => performRandRowOp(A, 1), "3": matToLatexStr },
			["Type I", "Type II", "Type III"]),
		new QuestionClass("What type of row operation is being performed? $$#3(#1) \\to #3(#2(#1))$$", "Type II", "",
			{ "1": () => randMat([2, 4], [2, 4], -9, 9), "2": (A) => performRandRowOp(A, 2), "3": matToLatexStr },
			["Type I", "Type II", "Type III"]),
		new QuestionClass("What type of row operation is being performed? $$#3(#1) \\to #3(#2(#1))$$", "Type III", "",
			{ "1": () => randMat([2, 4], [2, 4], -9, 9), "2": (A) => performRandRowOp(A, 3), "3": matToLatexStr },
			["Type I", "Type II", "Type III"])
	], AnswerType.MultipleChoice)
];
const randStatement1 = function () {
	var statements = [
		// not system related
		["Suppose that $A$ is a nonsingular matrix such that $A^2=A$, then $A=I$.", "T"],
		["Suppose that $A,B$ are invertible, then $A+B$ is invertible.", "D"],
		["Suppose that $A,B$ are nonsingular, then $A*B$ is nonsingular.", "T"],
		// sing =>
		["$A$ is singular, then the system is consistent.", "D"],
		["$A$ is noninvertible, then the system is inconsistent.", "D"],
		["$A$ is singular, then the system is overdetermined.", "D"],
		["$A$ is singular, then the system is balanced.", "D"],
		// consistent => 
		["the system is consistent, then $A$ is singular.", "D"],
		["the system is consistent, then $A$ is nonsingular.", "D"],
		["the system is consistent, then the system is balanced.", "D"],
		// invertible =>
		["$A$ is invertible, then the system is consistent.", "T"],
		["$A$ is nonsingular, then the system is balanced.", "T"],
		["$A$ is invertible, then the system is inconsistent.", "F"],
		["$A$ is invertible, then the system is underdetermined.", "F"],
		// others
		["the system is underdetermined, then the system has a unique solution.", "F"],
		["the system has two solutions, then the system has an infinite number of solutions.", "T"],
		["the system is underdetermined, then $A$ is nonsingular.", "F"],
		["the system is overdetermined, then $A$ is nonsingular.", "F"],
	];
	var index = randInt(0, statements.length - 1);
	if (index <= 2) return statements[index];
	return ["Consider the matrix equation $A*{\\bf x}={\\bf b}$.  Suppose that " +
		statements[index][0], statements[index][1]];
}
const linearDTRelationships = [new QuestionSet([
	new QuestionClass("#2(#1)", "#3(#1)", "", { "1": randStatement1, "2": (S) => S[0], "3": (S) => S[1] },
		[new Option("T", "Always True"), new Option("F", "Always False"), new Option("D", "It depends")])
], AnswerType.MultipleChoice)];


// Organized by decreasing level of importance (each level of importance will be done half as often as the level above it)
var linAlgProbs = [[solveMatrixEq], [computingRREF, computeInverse, linearDTRelationships],
	[matrixArithmetic, matrixOperations, linearDefnTerms]];
var linAlgProbsBySubject = {
	"Linear Systems of Equations": [matrixArithmetic, matrixOperations, computingRREF, computeInverse, solveMatrixEq, linearDTRelationships, linearDefnTerms],
	"Vector Spaces": [],
	"Eigenvalues": [],
	"Inner Product Spaces": []
};
var linAlgProbsNamed = {
	"rref": computingRREF
};

module.exports = { linAlgProbs, linAlgProbsBySubject, linAlgProbsNamed };