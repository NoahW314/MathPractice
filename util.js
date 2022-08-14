const { size, zeros, det, subset, index, range, map, row, deepEqual,
	concat, clone, typeOf, complex, Infinity } = require("mathjs");

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
// strFracs.length-1 : 1
// strFracs.length-2 : 2
// strFracs.length-n : n
// -i+strFracs.length: i
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

const rref = function (mat, err) {
	var error = Math.pow(10, -6);
	if (err !== undefined) {
		error = err;
	}
	var A = clone(mat);
	var dims = size(A);
	var rows = dims.get([0]);
	var cols = dims.get([1]);
	var cRow = 0; // current row
	for (var i = 0; i < cols; i++) {
		// check if column i has a non-zero entry (on or below the "diagonal")
		var nonZeroRow = -1;
		for (var j = cRow; j < rows; j++) {
			// we need to account for floating point error (or user input rounding)
			if (Math.abs(A.get([j, i])) > error) {
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
		if (Math.abs(value) < error) {
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
const isInconsistent = function (A, b, rows, cols, error) {
	var RREF = rref(concat(A, b), error);
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
	var num = Number(numStr.replace(/\s/g, ""));
	var fracIndex = numStr.indexOf("\\frac");
	var sqrtIndex = numStr.indexOf("\\sqrt");
	// we handle which ever comes first (i.e. is on the outside of the expression)
	if (fracIndex !== -1 && (sqrtIndex === -1 || fracIndex < sqrtIndex)) {
		var firstPart = numStr.slice(0, fracIndex);
		var start1 = numStr.indexOf("{");
		var end2 = numStr.lastIndexOf("}");
		// walk through the string until we find the matching close } to the first one
		var depth = 1;
		var index = start1 + 1;
		while (depth !== 0) {
			var char = numStr.charAt(index);
			if (char === "{") depth++;
			if (char === "}") depth--;
			index++;
		}
		var end1 = index - 1;
		var start2 = numStr.indexOf("{", end1 + 1);
		// allow for nested fractions or square roots in fractions
		var numer = numericParser(numStr.slice(start1 + 1, end1));
		var denom = numericParser(numStr.slice(start2 + 1, end2));
		num = numer / denom;
		if (firstPart === "-") {
			num *= -1;
		}
		else if (firstPart !== "" && firstPart !== "+") {
			if (firstPart[0] === "-") {
				num *= -1;
			}
			num += numericParser(firstPart);
		}
	}
	else if (sqrtIndex !== -1) {
		var firstPart = numStr.slice(0, sqrtIndex);
		var start = numStr.indexOf("{");
		var end = numStr.lastIndexOf("}");
		var lastPart = numStr.slice(end+1);
		// allow for nested square roots or square roots of a fraction
		var root = numericParser(numStr.slice(start + 1, end));
		num = Math.sqrt(root);
		if (firstPart === "-") {
			num *= -1;
		}
		else if (firstPart !== "" && firstPart !== "+") {
			num *= numericParser(firstPart);
		}
		if (lastPart !== "") {
			if (numStr.charAt(end + 1) === "*") {
				num *= numericParser(lastPart.slice(1));
			}
			else {
				num += numericParser(lastPart);
			}
		}
	}
	else if (numStr.indexOf("/") !== -1) {
		var index = numStr.indexOf("+") !== -1 ? numStr.indexOf("+") : numStr.lastIndexOf("-");
		var splitIndex = numStr.indexOf("/");
		var numer = numericParser(numStr.slice(index + 1, splitIndex));
		var denom = numericParser(numStr.slice(splitIndex + 1));
		num = numer / denom;
		if (index !== -1) {
			if (numStr.indexOf("-") !== -1) {
				num *= -1;
			}
			num += numericParser(numStr.slice(0, index));
		}
	}
	else if (numStr.indexOf("\\pi") !== -1) {
		// things we handle:  2\pi/3, -\pi/3, -\sqrt{2}\pi etc.
		// things we do NOT handle:  \pi-3, 2*\pi, 1/\pi, \pi 2, \pi*2, etc.
		var piIndex = numStr.indexOf("\\pi");
		// we assume that there is a number (or a minus sign or maybe nothing) before the pi symbol
		var firstPart = numStr.slice(0, piIndex).replace(/\s/g, "");
		if (firstPart === "-") return -Math.PI;
		if (firstPart === "") return Math.PI;
		return Number(firstPart) * Math.PI;
	}
	return num;
}
const complexParser = function (str, form) {
	// when the input is already a complex number
	if (typeOf(str) == "Complex") return str;

	// special case for handling infinity
	if (str === "\\infty") {
		return Infinity;
	}

	if (form === undefined) {
		if (str.indexOf("e^") !== -1) form = "exp";
		else form = "rect";
	}

	// re^{i\phi}
	if (form === "exp") {
		// special case for 0 (which doesn't really have an exponential form)
		if (str.trim() === "0") return complex(0, 0);

		var expIndex = str.indexOf("e^");
		// no e^ indicates that is just a real number (so exponential form doesn't make much sense)
		if (expIndex === -1) return complex(numericParser(str), 0);
		
		var start = str.indexOf("{");
		var end = str.indexOf("}");
		if (start === -1 || end === -1 || expIndex > start || start > end) {
			throw new Error(str+" does not have exponential form re^{i theta}!");
		}
		var radiusStr = str.slice(0, expIndex).replace(/\s/g, "");
		if (radiusStr === "") {
			var rad = 1;
		}
		else {
			var rad = numericParser(radiusStr);
		}
		var exponent = str.slice(start + 1, end);
		if (exponent.charAt(0) === "i") exponent = exponent.slice(1);
		// allows for -i\pi/4 or similar
		else if (exponent.charAt(1) === "i") exponent = exponent.charAt(0) + exponent.slice(2);
		else if (exponent.slice(-1) === "i") exponent = exponent.slice(0, -1);
		else {
			throw new Error(str + " does not have exponential form re^{i theta}!");
		}
		var phi = numericParser(exponent);
		var c = complex({ r: rad, phi: phi });
		return c;
	}
	// a+bi
	else if (form === "rect") {
		// special cases
		// when the input is +i or -i
		if (str === "i" || str === "+i") return complex(0, 1);
		if (str === "-i") return complex(0, -1);

		// find the splitting point between the real and imaginary parts (if it exists)
		// we ignore any +/- in the first position because it can't split the number, so it must be the sign for that part of the number
		var index = str.lastIndexOf("+");
		if (index === -1 || index === 0) {
			index = str.lastIndexOf("-");
		}
		// when the input has a single part (i.e. when there is no + or -)
		if (index === -1 || index === 0) {
			// pure imaginary nunber
			if (str.charAt(str.length - 1) === "i") {
				return complex(0, numericParser(str.slice(0, str.length - 1)));
			}
			// real number
			else {
				return complex(numericParser(str), 0);
			}
		}
		// otherwise, we split the string at the + or - 
		else {
			var realPart = str.slice(0, index);
			var imagPart = str.slice(index, str.length - 1);
			if (imagPart.replace(/\s/g, "") === "-") imagPart = "-1";
			if (imagPart.replace(/\s/g, "") === "+") imagPart = "1";
			return complex(numericParser(realPart), numericParser(imagPart));
		}
	}
	else {
		throw new Error(form+" is an invalid for the 'form' parameter for the complex number parser.");
	}
}


module.exports = {
	randInt, randIntExclude, randI, randIE, neg, addsub,
	fix, prec, piFracStr, rref, matToLatexStr, arrFromLatexStr, randMat,
	isSingular, isInconsistent, hasUniqueSolution, hasInfiniteSolutions,
	numericParser, vectSetToLatexStr, vectSetFromLatexStr, complexParser,
	numFracs, strFracs
};