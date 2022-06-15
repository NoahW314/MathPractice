const { size, zeros, det, subset, index, range, map, row, deepEqual,
	concat, clone } = require("mathjs");

// Note that these are both inclusive on both ends
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const randIntExclude = function (min, max, ...exclude) {
	var val = exclude[0];
	while (exclude.indexOf(val) !== -1) {
		val = randInt(min, max);
	}
	return val;
};
const randI = () => randInt(-9, 9);
const randIE = () => randIntExclude(-9, 9, 0);
const neg = (x) => -x;
const addsub = function (a) {
	if (a >= 0) return "+" + a;
	else return a;
};
const fix = function (x) {
	return +(x).toFixed(2);
};
const prec = function (x) {
	return +(x).toPrecision(3);
};
var strFracs = ["0", "\\pi/4", "\\pi/3", "\\pi/2", "2\\pi/3", "3\\pi/4", "\\pi",
	"5\\pi/4", "4\\pi/3", "3\\pi/2", "5\\pi/3", "7\\pi/4"];
var numFracs = [0, Math.PI / 4, Math.PI / 3, Math.PI / 2, 2 * Math.PI / 3, 3 * Math.PI / 4,
	Math.PI, 5 * Math.PI / 4, 4 * Math.PI / 3, 3 * Math.PI / 2, 5 * Math.PI / 3, 7 * Math.PI / 4];
var fracs = {};
for (var i = 0; i < numFracs.length; i++) {
	fracs[numFracs[i]] = strFracs[i];
}
const piFracStr = function (frac) {
	return fracs[frac];
}

const rref = function (mat) {
	var A = clone(mat);
	var dims = size(A);
	var rows = dims.get([0]);
	var cols = dims.get([1]);
	var cRow = 0; // current row
	for (var i = 0; i < cols; i++) {
		// check if column i has a non-zero entry (on or below the "diagonal")
		var nonZeroRow = -1;
		for (var j = cRow; j < rows; j++) {
			// we need to account for floating point error
			if (Math.abs(A.get([j, i])) > Math.pow(10, -6)) {
				nonZeroRow = j;
				break;
			}
		}
		// this column is all 0, skip it
		if (nonZeroRow === -1) continue;
		// move the first row with a non-zero entry in that column to the top
		if (nonZeroRow !== cRow) {
			// swap rows cRow and nonZeroRow
			var tempRow = subset(A, index(cRow, range(0, cols)));
			A = subset(A, index(cRow, range(0, cols)), 
					subset(A, index(nonZeroRow, range(0, cols))));
			A = subset(A, index(nonZeroRow, range(0, cols)), tempRow);
		}
		// normalize the (now) first row (that is, row cRow)
		var diag = A.get([cRow, i]);
		for (var j = i; j < cols; j++) {
			A.set([cRow, j], A.get([cRow, j])/diag);
		}
		// zero out all rows (at least in this column)
		for (var j = 0; j < rows; j++) {
			if (j === cRow) continue;
			var factor = A.get([j, i]);
			for (var k = i; k < cols; k++) {
				var val = A.get([j, k])-factor*A.get([cRow, k]);
				A.set([j, k], val);
			}
		}
		cRow++;
	}
	
	return map(A, function (value) {
		if (Math.abs(value) < Math.pow(10, -6)) {
			return 0;
		}
		else return value;
	});
}
const matToLatexStr = function (A) {
	var dims = size(A);
	var rows = dims.get([0]);
	var cols = dims.get([1]);
	var str = "\\displaystyle\\left[\\begin{array}";
	str += "{" + ("c".repeat(cols)) + "}\n";
	for (var i = 0; i < rows; i++) {		
		for (var j = 0; j < cols; j++) {
			if (j != 0) {
				str += " & ";
			}
			str += A.get([i, j]);
			}
			str += "\\\\ \n";
	}
	str += "\\end{array}\\right]";
	return str;
}
const vectSetToLatexStr = function (V) {
	var str = "";
	for (var i = 0; i < V.length; i++) {
		if (i !== 0) {
			str += ",";
		}
		str += matToLatexStr(V[i]);
	}
	return str;
}
/*
\displaystyle\left[\begin{array}{cccc}
-7 & -3 & -1 & -9\\
0 & -2 & 0 & -2\\
-4 & 1 & 3 & -9\\
 \end{array}\right]
 */
const arrFromLatexStr = function (str) {
	var arr = [];

	var start = str.indexOf("\n");
	var end = str.indexOf("\\end");
	str = str.slice(start+1, end-1);
	str = str.replaceAll("\\\\", "");

	var rows = str.split("\n");
	for (var i = 0; i < rows.length; i++) {
		arr.push(rows[i].split("&"));
	}

	return arr;
}
const vectSetFromLatexStr = function (str) {
	var V = [];
	var strArr = str.split("\\displaystyle");
	for (var i = 1; i < strArr.length; i++) {
		V.push(arrFromLatexStr(strArr[i]));
	}
	return V;
}
// an array for r or c specifies a range for them
const randMat = function (r, c, min, max, ...exclude) {
	var rows = r;
	var cols = c;
	if (Array.isArray(r)) {
		rows = randInt(r[0], r[1]);
	}
	if (Array.isArray(c)) {
		cols = randInt(c[0], c[1]);
	}

	var A = zeros(rows, cols);
	for (var i = 0; i < rows; i++) {
		for (var j = 0; j < cols; j++) {
			A.set([i, j], randIntExclude(min, max, exclude));
		}
	}
	return A;
}
const isSingular = function (A) {
	return det(A) === 0;
}
const isInconsistent = function (A, b, rows, cols) {
	var RREF = rref(concat(A, b));
	var inconsistentRow = zeros(1, cols + 1);
	inconsistentRow.set([0, cols], 1);
	for (var i = 0; i < rows; i++) {
		if (deepEqual(row(RREF, i), inconsistentRow)) {
			return true;
		}
	}
	return false;
}
const hasUniqueSolution = function (A, b, rows, cols) {
	if (rows < cols) {
		return false;
	}
	var RREF = rref(concat(A, b));
	for (var i = 0; i < cols; i++) {
		if (RREF.get([i,i]) !== 1) {
			return false;
		}
	}
	if (rows !== cols && RREF.get([cols, cols]) === 1) {
		return false;
	}
	return true;
}
const hasInfiniteSolutions = function (A, b, rows, cols) {
	return !isInconsistent(A, b, rows, cols) && !hasUniqueSolution(A, b, rows, cols);
}

const numericParser = function (numStr) {
	if (typeof numStr === "number") {
		return numStr;
	}
	var num = Number(numStr);
	if (numStr.indexOf("\\frac") !== -1) {
		var firstPart = numStr.slice(0, numStr.indexOf("\\frac"));
		var start1 = numStr.indexOf("{");
		var end1 = numStr.indexOf("}");
		var start2 = numStr.indexOf("{", end1 + 1);
		var end2 = numStr.indexOf("}", end1 + 1);
		var numer = Number(numStr.slice(start1 + 1, end1));
		var denom = Number(numStr.slice(start2 + 1, end2));
		num = numer / denom;
		if (firstPart === "-") {
			num *= -1
		}
		else if (firstPart !== "") {
			if (firstPart[0] === "-") {
				num *= -1;
			}
			num += Number(firstPart);
		}
	}
	else if (numStr.indexOf("/") !== -1) {
		var index = numStr.indexOf("+") !== -1 ? numStr.indexOf("+") : numStr.lastIndexOf("-");
		var splitIndex = numStr.indexOf("/");
		var numer = Number(numStr.slice(index + 1, splitIndex));
		var denom = Number(numStr.slice(splitIndex + 1));
		num = numer / denom;
		if (index !== -1) {
			if (numStr.indexOf("-") !== -1) {
				num *= -1;
			}
			num += Number(numStr.slice(0, index));
		}
	}
	return num;
}

//TODO: We don't this anymore (probably) because we have complex number support through math.js 
// (but we should still wait until we actually try to do stuff with complex numbers before removing it)
// This parsing constructor is untested, but it was based on my C++ parser
// so it should have few to no problems.
// The parser does not support fractions or mixed numbers, though I don't if 
// support should be added for those or not. 
// (It will depend on how many problems actually use this)
// If we do include support, we can just use the Numeric validator code instead of Number()
class ComplexNumber {
	constructor(str) {
		this.r = 0;
		this.i = 0;
		if (str === "i" || str === "+i") {
			this.i = 1;
		}
		else if (str === "-i") {
			this.i = -1;
		}
		else {
			var firstPart = "";
			var index = 0;
			while (index !== str.length && str[index] !== "i" &&
				(str[index] !== "+" && str[index] !== "-")) {
				firstPart += str[index];
				index++;
			}
			var firstNum = Number(firstPart);
			if (index === str.length) {
				this.r == firstNum;
			}
			else if (str[index] === "i") {
				this.i = firstNum;
			}
			else {
				this.r = firstNum;
				if (str.slice(index) === "+i") {
					this.i = 1;
				}
				else if (str.slice(index) === "-i") {
					this.i = -1;
				}
				else {
					var secondPart = "";
					while (str[index] !== "i") {
						secondPart += str[index];
						index++;
					}
					this.i = Number(secondPart);
				}
			}

		}
	};
	equals(other) {
		return this.r.toFixed(2) === other.r.toFixed(2) &&
			this.i.toFixed(2) === other.i.toFixed(2);
	};
};

module.exports = {
	ComplexNumber, randInt, randIntExclude, randI, randIE, neg, addsub,
	fix, prec, piFracStr, rref, matToLatexStr, arrFromLatexStr, randMat,
	isSingular, isInconsistent, hasUniqueSolution, hasInfiniteSolutions,
	numericParser, vectSetToLatexStr, vectSetFromLatexStr
};