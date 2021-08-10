
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

const rref = function (A, b) {
	var ans = b.slice();
	const size = b.length;
	if (A.length !== size || A[0].length !== size) throw Error("Matrix is of the wrong size!");
	for (var i = 0; i < size; i++) {
		if (A[i][i] === 0) throw Error("Zero element in the diagonal of a matrix!");
	}
	for (var i = 0; i < size; i++) {
		// divide through by the diagonal element
		const diag = A[i][i];
		for (var j = 0; j < size; j++) {
			A[i][j] /= diag;
		}
		ans[i] /= diag;
		// then add the needed multiple of this row to every other row
		for (var j = 0; j < size; j++) {
			// j is the row that we are adding row i to.
			if (j !== i) {
				// we want A[j][i] to be zero, so mult=-A[j][i], that way A[j][i]=mult*1+A[j][i]=0
				const mult = -A[j][i];
				for (var k = 0; k < size; k++) {
					A[j][k] += mult * A[i][k];
				}
				ans[j] += mult * ans[i];
			}
		}
	}
	return ans;
}

//TODO: This parsing constructor is untested, but it was based on my C++ parser
// so it should have few to no problems.
// The parser does not support fractions or mixed numbers, though I don't if 
// support should be added for those or not. 
// (It will depend on how many problems actually use this)
// If we do include support we can just use the Numeric validator code instead of Number()
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
	fix, prec, piFracStr, rref
};