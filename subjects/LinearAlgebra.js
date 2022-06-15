
const { AnswerType, QuestionSet, QuestionClass, Option, numericValidator } = require("../questions.js"); 
const { matToLatexStr, randMat, isSingular, randInt, addsub,
	rref, isInconsistent, hasUniqueSolution, hasInfiniteSolutions,
	randIntExclude, vectSetToLatexStr, arrFromLatexStr, numericParser } = require("../util.js");
const { add, transpose, multiply, det, inv, subset, index, range,
	zeros, concat, row, column, deepEqual, size, matrix,
	fraction, squeeze, reshape, clone } = require("mathjs");

//----------------------------------------------------------------------------
// Linear Systems of Equations
//----------------------------------------------------------------------------

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
], AnswerType.Matrix)];
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
], AnswerType.Matrix)];
const computeInverse = [new QuestionSet([
	new QuestionClass("Find the inverse of the matrix $#3(#1)$", "#3(#2(#1))", "",
		{ "1": () => randNonSingMat([2, 4], -9, 9), "2": (A) => inv(A), "3": matToLatexStr }, undefined, "1")
], AnswerType.Matrix)];

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
], [["Type of solution: ", AnswerType.MultipleChoice], ["Solution: ", AnswerType.Matrix]])];

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


//----------------------------------------------------------------------------
// Vector Spacecs
//----------------------------------------------------------------------------

const mssBasis = function () {
	return {0: "minimal spanning set", 1: "minimal spanning set", 2: "basis"}[randInt(0, 2)]
}
const randVect = function (rows) {
	return randMat(rows, 1, -9, 9);
}
const vectSetFromMat = function (A) {
	var S = [];
	for (var i = 0; i < size(A).get([1]); i++) {
		S.push(column(A, i));
	}
	return S;
}
const vectSetToMat = function (S) {
	var arr = [];
	for (var i = 0; i < S.length; i++) {
		arr.push(squeeze(S[i]));
	}
	return transpose(matrix(arr));
}
// are the columns of A linearly independent
const areColsLI = function (A, rows, cols) {
	// this happens precisely when every column of rref(A) contains a leading 1
	// (i.e. the diagonal is all 1s and rows >= cols)
	if (rows < cols) {
		return false;
	}
	var RREF = rref(A);
	for (var i = 0; i < cols; i++) {
		if (RREF.get([i, i]) !== 1) {
			return false;
		}
	}
	return true;
}
const basisValidator = function (userArr, correctAnswer, prevAnswers, info) {
	var vectorSet = info[0];
	// we simply need to check that the vectors are linearly independent
	// and are present in the original vectorSet
	// and that none of them are the 0 vector
	// check for presence (and parse the user answer in the process)
	var S = [];
	for (var i = 0; i < userArr.length; i++) {
		var notPresent = true;
		var isZero = true;
		var parsedArr = [];
		for (var j = 0; j < vectorSet.length; j++) {
			var areVectorsSame = true;
			for (var k = 0; k < userArr[i].length; k++) {
				if (j === 0) {
					parsedArr.push(numericParser(userArr[i][k]));
					if (parsedArr[parsedArr.length-1] !== 0) {
						isZero = false;
					}
				}
				if (!numericValidator(userArr[i][k], vectorSet[j].get([k, 0]))) {
					areVectorsSame = false;
					if (j !== 0) {
						break;
					}
				}
			}
			if (areVectorsSame) {
				notPresent = false;
				break;
			}
		}
		if (notPresent || isZero) {
			return false;
		}
		S.push(transpose([parsedArr]));
	}
	// check for linear independence
	return areColsLI(vectSetToMat(S), userArr[0].length, userArr.length);
}

const vectorSpans = [
	// is a vector in the span of a set of vectors
	new QuestionSet([
		// in
		new QuestionClass("Is the vector ${\\bf v}=#4(#2(#1))$ in Span$(S)$, where $S=\\left\\{#5(#3(#1, #2))\\right\\}$?",
			"Yes", "",
			{
				"1": () => randInt(2, 4), "2": (r) => randVect(r),
				"4": matToLatexStr, "5": vectSetToLatexStr,
				"3": (rows, vect) => {
					var num = randInt(Math.max(2, rows - 1), Math.min(rows + 1, 4)); // between 2 and 4 vectors possible
					var A = randMat(rows, num, -9, 9);
					while (isInconsistent(A, vect, rows, num)) {
						A = randMat(rows, num, -9, 9);
					}
					return vectSetFromMat(A);
				}
			}, ["Yes", "No"]),
		// not in
		new QuestionClass("Is the vector ${\\bf v}=#4(#2(#1))$ in Span$(S)$, where $S=\\left\\{#5(#3(#1, #2))\\right\\}$?",
			"No", "",
			{
				"1": () => randInt(2, 4), "2": (r) => randMat(r, 1, -9, 9),
				"4": matToLatexStr, "5": vectSetToLatexStr,
				"3": (rows, vect) => {
					var num = randInt(Math.max(2, rows - 1), Math.min(rows + 1, 4)); // between 1 and 4 vectors possible
					var A = randMat(rows, num, -9, 9);
					while (!isInconsistent(A, vect, rows, num)) {
						A = randMat(rows, num, -9, 9);
					}
					return vectSetFromMat(A);
				}
			}, ["Yes", "No"])
	], AnswerType.MultipleChoice),
	// minimal spanning set for the span of vectors
	// with the other vector (if it exists) written as a linear combination of the others
	new QuestionSet([
		// same vectors
		new QuestionClass("Find a #1  for the set of vectors $\\left\\{#3(#2)\\right\\}$ and write any of the vectors not in \
			the spanning set as a linear combination of those in it.", ["#3 ", "#5(#4(#2))"], ["", ""],
			{
				"1": mssBasis, "2": () => {
					var rows = randInt(2, 4);
					var num = randInt(2, rows); // (2,2) (3,2) (3,3) (4,2) (4,3) (4,4)
					var A = randMat(rows, num, -9, 9);
					while (!areColsLI(A, rows, num)) {
						A = randMat(rows, num, -9, 9);
					}
					return vectSetFromMat(A);
				}, "3": vectSetToLatexStr, "4": (S) => zeros(1, S.length), "5": (a) => ""
			}, undefined, ["2", "4"]
		),
		// remove a vector
		new QuestionClass("Find a #1  for the set of vectors $\\left\\{#3(#2)\\right\\}$ and write any of the vectors not in \
			the spanning set as a linear combination of those in it.", ["#3(#5(#4(#2)))", "#8(#7(#2), #4)"], ["", ""],
			{
				"1": mssBasis, "2": () => {
					var rows = randInt(2, 4);
					var num = randInt(2, Math.min(rows, 3)); // (2,2) (3,2) (3,3) (4,2) (4,3)
					var A = randMat(rows, num, -9, 9);
					while (areColsLI(A, rows, num)) {
						A = randMat(rows, num, -9, 9);
					}
					return vectSetFromMat(A);
				}, "3": vectSetToLatexStr, "7": (S) => zeros(1, S.length - 1), "5": (V) => V[0],
				"4": (S) => {
					var A = vectSetToMat(S);
					var RREF = rref(A);
					// find the column that doesn't have a leading 1,
					// and thus is the first column without a 1 on the diagonal
					var foundFree = false;
					var B = [];
					var v;
					for (var i = 0; i < S.length; i++) {
						if (!foundFree && RREF.get([i, i]) !== 1) {
							v = column(A, i);
							foundFree = true;
						}
						else {
							B.push(column(A, i));
						}
					}
					return [B, v];
				}, 
				"8": (a, V) => { // user-readable correct answer
					var A = vectSetToMat(V[0]);
					var v = V[1];
					var RREF = rref(concat(A, v));
					var ind = index(range(0, V[0].length), V[0].length);
					return transpose(squeeze(subset(RREF, ind)));
				}
			}, undefined, ["5", "7"], ["2"])
	], [AnswerType.Vectors, ["Linear Combination:", AnswerType.Matrix]], [basisValidator,
		(userArr, correctAnswer, prevAnswers, info) => {
			// if all vectors are in the minimal spanning set, then this is irrelevant
			if (correctAnswer === "") {
				return true;
			}
			// arrFromLatexStr ignores everything before the first newline, so we put extra information in there
			// namely, the user-readable correct answer (but we ignore that here)


			// we want to check that A*x=b, where b is the removed vector, A is the matrix formed from 
			// the vector set given by the user in answer to part 1, and x is userArr
			// first, we have to construct A and x
			var parsedArrA = [];
			for (var i = 0; i < prevAnswers[0].length; i++) {
				var parsedArr = [];
				for (var j = 0; j < prevAnswers[0][i].length; j++) {
					parsedArr.push(numericParser(prevAnswers[0][i][j]));
				}
				parsedArrA.push(parsedArr);
			}
			var A = transpose(parsedArrA);
			var x = [];
			for (var i = 0; i < userArr[0].length; i++) {
				x.push(numericParser(userArr[0][i]));
			}

			// find b, the vector that the user chose to remove from the set
			var vectorSet = info[0];
			var userBasis = vectSetFromMat(matrix(A));
			var used = Array(userBasis.length).fill(false);
			var b;
			// check each vector in vectorSet for inclusion in the user's basis
			for (var i = 0; i < vectorSet.length; i++) {
				var notIncluded = true;
				for (var j = 0; j < userBasis.length; j++) {
					if (deepEqual(vectorSet[i], userBasis[j])) {
						// if this vector in the basis is the same as two vectors in the vector set, 
						// then it must be the missing vector, because a vector can't appear twice in a basis
						if (used[j]) {
							break;
						}
						else {
							used[j] = true;
							notIncluded = false;
							break;
						}
					}
				}
				if (notIncluded) {
					b = vectorSet[i];
					break;
				}
			}
			// then, compute A*x
			var result = multiply(A, transpose(x));
			result = reshape(result, [result.length, 1]);

			// then compare this (using the numeric validator) to correctArr
			var r = size(b).get([0]);
			for (var i = 0; i < r; i++) {
				if (!numericValidator(result[i][0], b.get([i, 0]))) {
					return false;
				}
			}
			return true;
	}])
];

const rcs = function () {
	return {0: "range", 1: "column space"}[randInt(0, 1)];
}
const hasFullRank = function (A) {
	var RREF = rref(A);
	var dim = 0;
	var rows = size(A).get([0]); var cols = size(A).get([1]);
	for (var i = 0; i < rows; i++) {
		var j = 0;
		while (j < cols && RREF.get([i, j]) !== 1) {
			j++;
		}
		if (j !== cols) {
			dim++;
		}
	}
	return dim === Math.min(rows, cols);
}
const columnSpaceSpan = [
	new QuestionSet([
		// full rank
		new QuestionClass("Find a #1  for the #9  of the matrix $A=#3(#2)$ and determine the rank of the matrix.#8(#7(#2))",
			["#4(#5(#2))", "#6(#5)", "Yes"], ["", "", ""],
			{
				"1": mssBasis, "3": matToLatexStr, "4": vectSetToLatexStr, "6": (S) => S.length,
				"2": () => {
					var rows = randInt(2, 4);
					var cols = randInt(2, 4);
					var A = randMat(rows, cols, -9, 9);
					while (!hasFullRank(A)) {
						A = randMat(rows, cols, -9, 9);
					}
					return A;
				}, "7": (A) => vectSetFromMat(A), "8": (a) => "",
				"5": (A) => {
					var RREF = rref(A);
					var basis = [];
					for (var i = 0; i < size(A).get([0]); i++) {
						var j = 0;
						while (j < size(A).get([1]) && RREF.get([i, j]) !== 1) {
							j++;
						}
						if (j !== size(A).get([1])) {
							basis.push(column(A, j));
						}
					}
					return basis;
				}, "9": rcs
			},
		[[], [], ["Yes", "No"]], ["5", undefined, undefined], ["7"]),
		// not full rank
		new QuestionClass("Find a #1  for the #9  of the matrix $A=#3(#2)$ and determine the rank of the matrix.#8(#7(#2))",
			["#4(#5(#2))", "#6(#5)", "No"], ["", "", ""],
			{
				"1": mssBasis, "3": matToLatexStr, "4": vectSetToLatexStr, "6": (S) => S.length,
				"2": () => {
					var rows = randInt(3, 5);
					var cols = randInt(3, 5);
					var A = randMat(rows, cols, -9, 9);
					while (hasFullRank(A)) {
						A = randMat(rows, cols, -9, 9);
					}
					return A;
				}, "7": (A) => vectSetFromMat(A), "8": (a) => "",
				"5": (A) => {
					var RREF = rref(A);
					var basis = [];
					for (var i = 0; i < size(A).get([0]); i++) {
						var j = 0;
						while (j < size(A).get([1]) && RREF.get([i, j]) !== 1) {
							j++;
						}
						if (j !== size(A).get([1])) {
							basis.push(column(A, j));
						}
					}
					return basis;
				}, "9": rcs
			},
			[[], [], ["Yes", "No"]], ["5", undefined, undefined], ["7"])
	], [AnswerType.Vectors, ["Rank", AnswerType.Exact], ["Does the matrix have full rank?", AnswerType.MultipleChoice]],
	[basisValidator, undefined, undefined])
];

const rowSpaceSpan = [
	new QuestionSet([
		// full rank
		new QuestionClass("Find a #1  for the row space of the matrix $A=#3(#2)$ and determine the rank of the matrix.",
			["#4(#5(#2))", "#6(#5)", "Yes"], ["", "", ""],
			{
				"1": mssBasis, "3": matToLatexStr, "4": vectSetToLatexStr, "6": (S) => S.length,
				"2": () => {
					var rows = randInt(2, 4);
					var cols = randInt(2, 4);
					var A = randMat(rows, cols, -9, 9);
					while (!hasFullRank(A)) {
						A = randMat(rows, cols, -9, 9);
					}
					return A;
				}, 
				"5": (A) => {
					var RREF = rref(A);
					var basis = [];
					for (var i = 0; i < size(A).get([0]); i++) {
						for (var j = 0; j < size(A).get([1]); j++) {
							if (RREF.get([i, j]) !== 0) {
								basis.push(transpose(row(RREF, i)));
								break;
							}
						}
					}
					return basis;
				}
			},
			[[], [], ["Yes", "No"]], ["5", undefined, undefined]),
		// not full rank
		new QuestionClass("Find a #1  for the column space of the matrix $A=#3(#2)$ and determine the rank of the matrix.",
			["#4(#5(#2))", "#6(#5)", "No"], ["", "", ""],
			{
				"1": mssBasis, "3": matToLatexStr, "4": vectSetToLatexStr, "6": (S) => S.length,
				"2": () => {
					var rows = randInt(3, 5);
					var cols = randInt(3, 5);
					var A = randMat(rows, cols, -9, 9);
					while (hasFullRank(A)) {
						A = randMat(rows, cols, -9, 9);
					}
					return A;
				},
				"5": (A) => {
					var RREF = rref(A);
					var basis = [];
					for (var i = 0; i < size(A).get([0]); i++) {
						for (var j = 0; j < size(A).get([1]); j++) {
							if (RREF.get([i, j]) !== 0) {
								basis.push(transpose(row(RREF, i)));
								break;
							}
						}
					}
					return basis;
				}
			},
			[[], [], ["Yes", "No"]], ["5", undefined, undefined])
	], [AnswerType.Vectors, ["Rank", AnswerType.Exact], ["Does the matrix have full rank?", AnswerType.MultipleChoice]])
];

const nullSpaceSpan = [new QuestionSet([
	// invertible matrix (thus N(A)={0})
	new QuestionClass("Find a #1  for the nullspace of the matrix $A=#3(#2)$ and determine the nullity and rank of the matrix.",
		["#4(#5(#2))", "0", "#6(#2)"], ["", "", ""],
		{
			"1": mssBasis, "3": matToLatexStr, "4": vectSetToLatexStr, "6": (A) => size(A).get([1]),
			"5": (A) => [zeros(size(A).get([0]), 1)], "2": () => randNonSingMat([2,4], -9, 9)
		},
		undefined, ["5", undefined, undefined]),
	// noninvertible matrix (N(A) could be anything [including {0}])
	new QuestionClass("Find a #1  for the nullspace of the matrix $A=#3(#2)$ and determine the nullity and rank of the matrix.",
		["#4(#8(#5(#2), #2))", "#6(#5)", "#7(#6, #2)"], ["", "", ""],
		{
			"1": mssBasis, "3": matToLatexStr, "4": vectSetToLatexStr, "6": (S) => S.length,
			"2": () => {
				var rows = randInt(2, 4);
				var cols = randInt(2, 4);
				var A = randMat(rows, cols, -9, 9);
				// only square matrices can be invertible
				if (rows !== cols) {
					return A;
				}
				while (!isSingular(A)) {
					A = randMat(rows, cols, -9, 9);
				}
				return A;
			}, "7": (nullDim, A) => size(A).get([1]) - nullDim,
			"5": (A) => {
				var RREF = rref(A);
				var rows = size(A).get([0]);
				var cols = size(A).get([1]);
				var basis = [];
				var rowsDown = 0;
				for (var i = 0; i < cols; i++) {
					var hasLeadingOne = (rowsDown < rows && RREF.get([rowsDown, i]) === 1);
					// if there is not a leading one in this column, then this is a free variable
					// so it is included in our basis
					if (!hasLeadingOne) {
						var arr = [];
						for (var j = 0; j < cols; j++) {
							if (j === i) {
								arr.push([1]);
							}
							else if (j >= rows) {
								arr.push([0]);
							}
							else {
								arr.push([-RREF.get([j, i])]);
							}
						}
						basis.push(matrix(arr));
					}
					else {
						rowsDown++;
					}
				}
				return basis;
			}, "8": (basis, A) => {
				// if the matrix represents an overdetermined system, then
				// A can be singular, but still only have 1 solution to A*x=0
				// (i.e. the 0 vector)
				var B = clone(basis);
				if (B.length === 0) {
					B.push(zeros(size(A).get([1]), 1));
				}
				return B;
			}
		},
		undefined, ["8", undefined, undefined])
], [AnswerType.Vectors, ["Nullity", AnswerType.Exact], ["Rank", AnswerType.Exact]])];

const correctVSA = function (...exclude) {
	var arr = [
		// closure axioms (2)
		"$\\forall {\\bf v},{\\bf w}\\in V, {\\bf v}+{\\bf w}\\in V$",
		"$\\forall {\\bf v}\\in V\\ \\ \\forall\\alpha\\in{\\bf R}, \\alpha{\\bf v}\\in V$",
		// vector space axioms (8)
		"${\\bf v}+{\\bf w}={\\bf w}+{\\bf v}$",
		"$({\\bf u}+{\\bf v})+{\\bf w}={\\bf u}+({\\bf v}+{\\bf w})$",
		"$\\exists {\\bf z}\\in V, {\\bf v}+{\\bf z}={\\bf v}$",
		"$\\forall {\\bf v}\\in V\\ \\ \\exists {\\bf w}\\in V, {\\bf v}+{\\bf w}={\\bf z}$",
		"$\\alpha({\\bf v}+{\\bf w})=\\alpha{\\bf v}+\\alpha{\\bf w}$",
		"$(\\alpha+\\beta){\\bf v}=\\alpha{\\bf v}+\\beta{\\bf v}$",
		"$(\\alpha\\beta){\\bf v}=\\alpha(\\beta{\\bf v})$",
		"$1{\\bf v}={\\bf v}$",
	];
	var statement;
	do {
		statement = arr[randInt(0, arr.length - 1)];
	} while (exclude.indexOf(statement) !== -1);
	return statement;
}
const incorrectVSA = function (...exclude) {
	var arr = [
		// closure "axioms" (1)
		"$\\forall {\\bf v},{\\bf w}\\in V, {\\bf v}\\cdot{\\bf w}\\in V$",
		// vector space "axioms" (4)
		"$\\alpha({\\bf u}+{\\bf v})+{\\bf w}={\\bf u}+\\alpha({\\bf v}+{\\bf w})$",
		"${\\bf v}-{\\bf w}={\\bf w}-{\\bf v}$",
		"${\\bf v}+{\\bf 1}={\\bf v}$",
		"${\\bf v}+1{\\bf w}=2({\\bf v}+{\\bf w})$"
	];
	var statement;
	do {
		statement = arr[randInt(0, arr.length - 1)];
	} while (exclude.indexOf(statement) !== -1);
	return statement;
}
const vectorSpacesDefnTerms = [
	// relationship between matrix dimensions, linear independence, and spanning R^m
	new QuestionSet([
		new QuestionClass("Suppose that $A$ is a $#6(#2(#1))$ matrix, then #4(#3, #2)", "#5(#1, #3)", "",
			{
				"1": () => randInt(0, 2), "6": (a) => a[1], "2": (type) => {
					var rows = -1;
					var cols = -1;
					// m>n
					if (type === 0) {
						cols = randInt(1, 5);
						rows = randInt(cols + 1, 7);
					}
					// m<n
					else if (type === 1) {
						rows = randInt(1, 5);
						cols = randInt(rows + 1, 7);
					}
					// m=n
					else {
						rows = randInt(2, 6);
						cols = rows;
					}
					return [rows, rows+"\\times "+cols];
				}, "3": () => randInt(0, 2), "4": (type, sizeInfo) => {
					if (type === 0) return "the columns of $A$ are linearly independent.";
					else if (type === 1) return "the columns of $A$ span ${\\bf R}^" + sizeInfo[0] + "$.";
					else return "the coluns of $A$ are linearly independent and span ${\\bf R}^"+sizeInfo[0]+"$.";
				}, "5": (a, b) => {
					return {
						"0,0": "D", "0,1": "F", "0,2": "F",
						"1,0": "F", "1,1": "D", "1,2": "F",
						"2,0": "D", "2,1": "D", "2,2": "D"
					}[[a, b]];
				}
			}, [new Option("T", "Always True"), new Option("D", "It depends"), new Option("F", "Always False")]),
		new QuestionClass("Suppose that $A$ is an $m\\times n$ matrix whose columns are linearly independent, then \
						which of the following is necessarily true?", "GTE", "", {},
			[new Option("EQ", "$m=n$"), new Option("GT", "$m>n$"), new Option("LT", "$m<n$"), new Option("GTE", "$m\\geq n$"), new Option("LTE", "$m\\leq n$")]),
		new QuestionClass("Suppose that $A$ is an $m\\times n$ matrix whose columns span ${\\bf R}^m$, then \
						which of the following is necessarily true?", "LTE", "", {},
			[new Option("EQ", "$m=n$"), new Option("GT", "$m>n$"), new Option("LT", "$m<n$"), new Option("GTE", "$m\\geq n$"), new Option("LTE", "$m\\leq n$")])
	], AnswerType.MultipleChoice),
	// axioms of vector spaces
	new QuestionSet([
		// 3 correct
		new QuestionClass("Select all of the below which are properties of a vector space $V$.", ["1", "2", "3"], "", {
			"1": correctVSA, "2": correctVSA, "3": correctVSA, "4": incorrectVSA, "5": incorrectVSA
		}, [new Option("1", "#1 "), new Option("2", "#2(#1)"), new Option("3", "#3(#1, #2)"), new Option("4", "#4 "), new Option("5", "#5(#4)")]),
		// 4 correct
		new QuestionClass("Select all of the below which are properties of a vector space $V$.", ["1", "2", "3", "4"], "", {
			"1": correctVSA, "2": correctVSA, "3": correctVSA, "4": correctVSA, "5": incorrectVSA
		}, [new Option("1", "#1 "), new Option("2", "#2(#1)"), new Option("3", "#3(#1, #2)"), new Option("4", "#4(#1, #2, #3)"), new Option("5", "#5 ")]),
		// 5 correct
		new QuestionClass("Select all of the below which are properties of a vector space $V$.", ["1", "2", "3", "4", "5"], "", {
			"1": correctVSA, "2": correctVSA, "3": correctVSA, "4": correctVSA, "5": correctVSA
		}, [new Option("1", "#1 "), new Option("2", "#2(#1)"), new Option("3", "#3(#1, #2)"), new Option("4", "#4(#1, #2, #3)"), new Option("5", "#5(#1, #2, #3, #4)")])
	], AnswerType.SelectAll),
	// other questions from homework
	new QuestionSet([
		new QuestionClass("Let $U,V$ be non-zero subspaces of ${\\bf R}^n$ and let $W=U\\cup V$.  \
			Then $W$ is a subspace of ${ \\bf R }^n$", "False", "", {}, ["True", "False"]),
		new QuestionClass("Let $U,V$ be non-zero subspaces of ${\\bf R}^n$ and let $W=U\\cap V$.  \
			Then $W$ is a subspace of ${ \\bf R }^n$", "True", "", {}, ["True", "False"]),
		new QuestionClass("Let $U,V$ be non-zero subspaces of ${\\bf R}^n$ and let $W=U+V$ \
			be the set of vectors which can be written as ${\\bf u}+{\\bf v}$ for some \
			${\\bf u}\\in U$ and ${\\bf v}\\in V$.  Then $W$ is a subspace of ${ \\bf R }^n$",
			"True", "", {}, ["True", "False"]),
		new QuestionClass("Let $V$ be a subspace of ${\\bf R}^n$ and ${\\bf v}_1,{\\bf v}_2\\in{\\bf R}^n$ \
			such that ${\\bf v}_1+{\\bf v}_2\\in V$.  Then ${\\bf v}_1,{\\bf v}_2\\in V$.", "False", "", {},
			["True", "False"]),
		new QuestionClass("Let $V$ be a subspace of $W$ and $V^\\complement=\\{{\\bf w}\\in W | {\\bf w}\\not\\in W\\}$.  \
			Then $V^\\complement$ is a subspace of $W$.", "False", "", {}, ["True", "False"])
	], AnswerType.MultipleChoice)
];

const randVectorSpace = function () {
	var spaces = [
		// actual vector spaces
		["T", "Let $F[a,b]$ be the set of functions on the closed interval $[a,b]$ and let $+,\\cdot$ be defined as normal.  \
			Is $(F[a,b],+,\\cdot)$ a vector space?"],
		["T", "Let $+,\\cdot$ denote matrix addition and scalar matrix multiplication.  Is $({\\bf R}^{m\\times n},+,\\cdot)$ \
			a vector space?"],
		["T", "Let $W=\\{{\\bf x}\\in{\\bf R}^3 : x^2_1+x^2_2+x^2_3\\geq0\\}$ and let $+,\\cdot$ be defined as normal.  Is \
			$(W,+,\\cdot)$ a vector space?"],
		// not vector spaces
		["F", "Let $W=\\{{\\bf x}\\in{\\bf R}^3 : x_1^2=x_2+x_3\\}$ and let $+,\\cdot$ be defined as normal.  Is $(W,+,\\cdot)$ \
			a vector space?"],
		["F", "Let $W=\\{{\\bf x}\\in{\\bf R}^3 : x_1x_2=x_3\\}$ and let $+,\\cdot$ be defined as normal.  Is $(W,+,\\cdot)$ \
			a vector space?"],
		["F", "Let $-,\\cdot$ denote matrix subtraction and scalar matrix multiplication.  Is $({\\bf R}^{m\\times n},+,\\cdot)$ \
			a vector space?"]
	];
	return spaces[randInt(0, spaces.length-1)];
}
const randSubspace = function () {
	var spaces = [
		// actual subspaces
		["T", "Let $A\\in{\\bf R}^{3\\times 3}$ be a matrix and let $W=\\{{\\bf v}\\in{\\bf R}^3\\}$ such that $A*{\\bf x}={\\bf v}$ \
			is consistent.  Is $W$ a subspace of ${\\bf R}^3$?"],
		["T", "Let $C[a,b]$ be the set of continuous functions on the closed interval $[a,b]$.  Is $C[a,b]$ a subspace of $F[a,b]$?"],
		["T", "Let ${\\bf a},{\\bf b}$ be vectors in ${\\bf R}^3$ and let $W=\\{{\\bf x}\\in{\\bf R}^3 : \
				{\\bf x}^T*{\\bf a}={\\bf x}^T*{\\bf b}\\}$.  Is $W$ a subspace of ${\\bf R}^3$"],
		// not subspaces
		["F", "Let $W=\\{{\\bf x}\\in{\\bf R}^n : A*{\\bf x}\\not={\\bf 0}\\}$ for some matrix $A$.  Is $W$ a subspace of ${\\bf R}^n?$"],
		["F", "Let $|F|(a,b)$ be the set of absolute values of functions on the interval $(a,b)$.  That is, $g\\in |F|(a,b)$ iff \
			$g=|f|$ for some function $f:(a,b)\\to{\\bf R}$.  Is $|F|(a,b)$ a subspace of $F(a,b)$?"],
		["F", "Let $W=\\{{\\bf x}\\in{\\bf R}^3 : x_1\\geq x_2\\}$.  Is $W$ a subspace of ${\\bf R}^3?$"]
	];
	return spaces[randInt(0, spaces.length - 1)];
}
const vectorSpaceExamples = [new QuestionSet([
	new QuestionClass("#2(#1)", "#3(#1)", "", {
		"1": randVectorSpace, "2": (a) => a[1], "3": (a) => a[0]
	}, [new Option("T", "Yes"), new Option("F", "No")]),
	new QuestionClass("#2(#1)", "#3(#1)", "", {
		"1": randSubspace, "2": (a) => a[1], "3": (a) => a[0]
	}, [new Option("T", "Yes"), new Option("F", "No")])
], AnswerType.MultipleChoice)];


const changeOfBasis = [new QuestionSet([
	// standard to different
	new QuestionClass("Let ${}_{\\bf e}{\\bf v}=#3(#1)$ be a vector represented in the standard coordinate system. \
			Let $S=\\left\\{#4(#2(#1))\\right\\}$ be a basis and compute ${}_S{\\bf v}$.", "#3(#5(#1, #2))", "",
		{
			"1": () => randVect([2, 4]), "3": matToLatexStr, "4": vectSetToLatexStr,
			"2": (v) => {
				var rows = size(v).get([0]);
				var num = rows;
				var A = randMat(rows, num, -9, 9);
				while (!areColsLI(A, rows, num)) {
					A = randMat(rows, num, -9, 9);
				}
				return vectSetFromMat(A);
			}, "5": (v, S) => {
				var A = vectSetToMat(S);
				//  A = [v_1, v_2, ..., v_n] expressed in e
				// thus A = e_T_S, but we want S_T_e, so we invert A
				var STe = inv(A);
				// then S_v = S_T_e * e_v
				return multiply(STe, v);
			}
		}, undefined, "5"),
	// different to standard
	new QuestionClass("Let ${}_S{\\bf v}=#3(#1)$ be a vector where $S$ is the basis $\\left\\{#4(#2(#1))\\right\\}$ \
			(vectors are expressed in the standard coordinate system).  Compute ${}_{\\bf e}{\\bf v}$.", "#3(#5(#1, #2))", "",
		{
			"1": () => randVect([2, 4]), "3": matToLatexStr, "4": vectSetToLatexStr,
			"2": (v) => {
				var rows = size(v).get([0]);
				var num = rows;
				var A = randMat(rows, num, -9, 9);
				while (!areColsLI(A, rows, num)) {
					A = randMat(rows, num, -9, 9);
				}
				return vectSetFromMat(A);
			}, "5": (v, S) => {
				var A = vectSetToMat(S);
				//  A = [v_1, v_2, ..., v_n] expressed in e
				// thus A = e_T_S, which is what we want
				// since e_v=e_T_S*S_v
				return multiply(A, v);
			}
		}, undefined, "5"),
	// different to different different
	new QuestionClass("Let ${}_S{\\bf v}=#3(#1)$ be a vector where $S$ is the basis $\\left\\{#4(#2(#1))\\right\\}$.  \
			Also let $R =\\left\\{ #4(#6(#1)) \\right\\}$ be a basis.Compute ${ } _R{ \\bf v } $.", "#3(#5(#1, #2, #6))", "",
		{
			"1": () => randVect([2, 4]), "3": matToLatexStr, "4": vectSetToLatexStr,
			"2": (v) => {
				var rows = size(v).get([0]);
				var num = rows;
				var A = randMat(rows, num, -9, 9);
				while (!areColsLI(A, rows, num)) {
					A = randMat(rows, num, -9, 9);
				}
				return vectSetFromMat(A);
			}, "6": (v) => {
				var rows = size(v).get([0]);
				var num = rows;
				var A = randMat(rows, num, -9, 9);
				while (!areColsLI(A, rows, num)) {
					A = randMat(rows, num, -9, 9);
				}
				return vectSetFromMat(A);
			}, "5": (v, S, R) => {
				var A = vectSetToMat(S);
				var B = vectSetToMat(R);
				// A = [v_1, v_2, ..., v_n] expressed in e
				// B = [w_1, w_2, ..., w_n] expressed in e
				// thus A = e_T_S and B = e_T_R
				// we want R_T_S=R_T_e*e_T_S
				var RTS = multiply(inv(B), A);
				// then R_v = R_T_S*S_v
				return multiply(RTS, v);
			}
		}, undefined, "5"),
], AnswerType.Matrix)];

// we don't use constant functions here because this topic is relatively unimportant and 
//   it is just too hard to implement well
const randLinearTrans = function () {
	// format is [T/F, statement, matrix representation (0 matrix if F)]
	var transformations = [
		// actual transforms
		["T", "Let $L:{\\bf R}^4\\to{\\bf R}^3$ be defined by $$L\\left([x_1\\ x_2\\ x_3\\ x_4]^T\\right)= \
			\\left[\\begin{array}{c}x_1+2x_2-x_4 \\\\ -2x_1+3x_2+x_3 \\\\ x_2-5x_3+6x_4 \\end{array}\\right].$$",
			matrix([[1, 2, 0, -1], [-2, 3, 1, 0], [0, 1, -5, 6]])],
		["T", "Let $L:{\\bf R}^3\\to{\\bf R}^2$ be defined by $$L\\left([x_1\\ x_2\\ x_3]^T\\right)= \
			\\left[\\begin{array}{c}5x_2+4x_3\\\\ x_1-6x_2-x_3 \\end{array}\\right].$$",
			matrix([[0, 5, 4], [1, -6, -1]])],
		// not transforms
		["F", "Let $L:{\\bf R}^3\\to{\\bf R}^2$ be defined by $$L\\left([x_1\\ x_2\\ x_3]^T\\right)= \
			\\left[\\begin{array}{c}x_1^2+2x_2 \\\\ -x_1x_3 \\end{array}\\right].$$",
			zeros(2, 3)],
		["F", "Let $L:{\\bf R}^3\\to{\\bf R}^2$ be defined by $$L\\left([x_1\\ x_2\\ x_3]^T\\right)= \
			\\left[\\begin{array}{c}\\sin^2(x_1)+\\cos^2(x_1)+7x_2-1 \\\\ 3x_3+e^0+\\sin(\\pi) \\end{array}\\right].$$",
			zeros(2, 3)]
	];
	return transformations[randInt(0, transformations.length - 1)];
}
const linearTransExamples = [new QuestionSet([
	new QuestionClass("#2(#1) Is $L$ a linear transformation?  If so, give the matrix representation of the transformation.",
		["#3(#1)", "#5(#4(#1))"], "", {
		"1": randLinearTrans, "2": (a) => a[1], "3": (a) => a[0],
		"4": (a) => a[2], "5": matToLatexStr
	}, [[new Option("T", "Yes"), new Option("F", "No")], []], [undefined, "4"])
], [AnswerType.MultipleChoice, AnswerType.Matrix])];

const transSpaces = [
	// basis and dimensionality for kernel of a transformation (i.e. nullspace)
	new QuestionSet([
		// matrix representation
		new QuestionClass("Let $L:{\\bf R}^#1 \\to{\\bf R}^#2 $ be a linear transformation represented by the matrix $#4(#3(#1, #2))$.  \
			Find a basis for the kernel of $L$ and the dimension of the kernel.", ["#7(#8(#5(#3), #3))", "#6(#5)"], ["", ""],
			{
				"1": () => randInt(2, 4), "2": () => randInt(2, 4), "4": matToLatexStr, "7": vectSetToLatexStr,
				"3": (cols, rows) => randMat(rows, cols, -9, 9), "6": (S) => S.length, 
				"5": (A) => {
					var RREF = rref(A);
					var rows = size(A).get([0]);
					var cols = size(A).get([1]);
					var basis = [];
					var rowsDown = 0;
					for (var i = 0; i < cols; i++) {
						var hasLeadingOne = (rowsDown < rows && RREF.get([rowsDown, i]) === 1);
						// if there is not a leading one in this column, then this is a free variable
						// so it is included in our basis
						if (!hasLeadingOne) {
							var arr = [];
							for (var j = 0; j < cols; j++) {
								if (j === i) {
									arr.push([1]);
								}
								else if (j >= rows) {
									arr.push([0]);
								}
								else {
									arr.push([-RREF.get([j, i])]);
								}
							}
							basis.push(matrix(arr));
						}
						else {
							rowsDown++;
						}
					}
					return basis;
				}, "8": (basis, A) => {
					// if the matrix represents an overdetermined system, then
					// A can be singular, but still only have 1 solution to A*x=0
					// (i.e. the 0 vector)
					var B = clone(basis);
					if (B.length === 0) {
						B.push(zeros(size(A).get([1]), 1));
					}
					return B;
				}
			}, undefined, "8")
	], [AnswerType.Vectors, AnswerType.Exact]),
	// basis and dimensionality for image of a transformation (i.e. column space)
	new QuestionSet([
		new QuestionClass("Let $L:{\\bf R}^#1 \\to{\\bf R}^#2 $ be a linear transformation represented by the matrix $#4(#3(#1, #2))$.  \
			Find a basis for the image of $L$ and the dimension of the image.", ["#7(#5(#8(#3)))", "#6(#5)"], ["", ""],
			{
				"1": () => randInt(2, 4), "2": () => randInt(2, 4), "3": (cols, rows) => randMat(rows, cols, -9, 9),
				"4": matToLatexStr, "6": (S) => S.length, "7": vectSetToLatexStr, "8": vectSetFromMat,
				"5": (S) => {
					var A = vectSetToMat(S);
					var RREF = rref(A);
					var basis = [];
					for (var i = 0; i < size(A).get([0]); i++) {
						var j = 0;
						while (j < size(A).get([1]) && RREF.get([i, j]) !== 1) {
							j++;
						}
						if (j !== size(A).get([1])) {
							basis.push(column(A, j));
						}
					}
					return basis;
				}
			}, undefined, ["5", undefined], "8")
	], [AnswerType.Vectors, AnswerType.Exact], [basisValidator, undefined])
];

const changeBaseAndTransform = [new QuestionSet([
	// standard to different
	new QuestionClass("Let ${}_{\\bf e}{\\bf v}=#3(#1)$ be a vector in ${\\bf R}^#5(#1)$ and let $S=\\left\\{#4(#2)\\right\\}$ \
		be a basis of ${\\bf R}^#8(#2)$.  Let ${}_{S}L_{\\bf e}=#3(#6(#1, #2))$ be a linear transformation from ${\\bf R}^#5(#1)$ \
		to ${\\bf R}^#8(#2)$.  Compute ${}_{\\bf e}L({\\bf v})$", "#3(#7(#1, #2, #6))", "",
		{
			"3": matToLatexStr, "4": vectSetToLatexStr, "5": (v) => size(v).get([0]), "8": (S) => S.length,
			"1": () => randVect([2, 4]), "2": () => {
				var rows = randInt(2, 4);
				var num = rows;
				var A = randMat(rows, num, -9, 9);
				while (!areColsLI(A, rows, num)) {
					A = randMat(rows, num, -9, 9);
				}
				return vectSetFromMat(A);
			}, "6": (v, S) => randMat(S.length, size(v).get([0]), -9, 9), "7": (v, S, L) => {
				// we have e_v and S_L_e, so we calculate S_v
				var Sv = multiply(L, v);
				// then we use S to convert to back to the standard basis
				// this is the matrix A = [e_v_1 e_v_2 ... e_v_n] = e_T_S
				// which is what we want
				return multiply(vectSetToMat(S), Sv);
			}
		}, undefined, "7"),
	// different to different
	new QuestionClass("Let ${}_{\\bf e}{\\bf v}=#3(#1)$ be a vector and let $S=\\left\\{#4(#2(#1))\\right\\}$ be a basis of ${\\bf R}^#5(#1)$.  \
		Let ${}_{S'}L_{S}=#3(#6(#1))$ be a linear transformation from ${\\bf R}^#5(#1)$ \
		to ${\\bf R}^#5(#6)$, where $S'=\\left\\{#4(#8(#6))\\right\\}$ is a basis of ${\\bf R}^#5(#6)$.  Compute ${}_{\\bf e}L({\\bf v})$.",
		"#3(#7(#1, #2, #6, #8))", "",
		{
			"3": matToLatexStr, "4": vectSetToLatexStr, "5": (v) => size(v).get([0]),
			"1": () => randVect([2, 4]), "2": (v) => {
				var rows = size(v).get([0]);
				var num = rows;
				var A = randMat(rows, num, -9, 9);
				while (!areColsLI(A, rows, num)) {
					A = randMat(rows, num, -9, 9);
				}
				return vectSetFromMat(A);
			}, "6": (v) => randMat(randInt(2, 4), size(v).get([0]), -9, 9),
			"8": (L) => {
				var rows = size(L).get([0]);
				var num = rows;
				var A = randMat(rows, num, -9, 9);
				while (!areColsLI(A, rows, num)) {
					A = randMat(rows, num, -9, 9);
				}
				return vectSetFromMat(A);
			},
			"7": (v, S, L, S2) => {
				// we have the matrix [e_w_1 e_w_2 ... e_w_n] = e_T_S
				var STe = inv(vectSetToMat(S));
				var Sv = multiply(STe, v);
				// we have e_v and S'_L_e, so we calculate S'_v
				var S2v = multiply(L, Sv);
				// then we use S' to convert to back to the standard basis
				// this is the matrix A = [e_v_1 e_v_2 ... e_v_n] = e_T_S'
				// which is what we want
				return multiply(vectSetToMat(S2), S2v);
			}
		}, undefined, "7")
], AnswerType.Matrix)];

//----------------------------------------------------------------------------
// Eigenvalues
//----------------------------------------------------------------------------

//----------------------------------------------------------------------------
// Inner Product Spaces
//----------------------------------------------------------------------------

// Organized by decreasing level of importance (each level of importance will be done half as often as the level above it)
var linAlgProbs = [
	[solveMatrixEq, vectorSpans, changeOfBasis],
	[computingRREF, computeInverse, columnSpaceSpan, nullSpaceSpan, vectorSpaceExamples, changeBaseAndTransform],
	[linearDTRelationships, rowSpaceSpan, vectorSpacesDefnTerms],
	[matrixArithmetic, matrixOperations, linearDefnTerms, transSpaces, linearTransExamples]];
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