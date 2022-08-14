
const { multiply, complex, divide, norm, add, pow, nthRoots, exp, log, equal,
	cos, sin, fraction, typeOf, subtract, abs, sqrt, factorial } = require("mathjs");
const { AnswerType, QuestionSet, QuestionClass, Option, theoremCreator } = require("../questions.js");
const { randInt, addsub, randI, piFracStr, numFracs, randIE, strFracs, randIntExclude } = require("../util.js");

//----------------------------------------------------------------------------
// Complex Numbers
//----------------------------------------------------------------------------

// all question classes include addition, subtraction, and 1 other operation as indicated
const complexArithmetic = [new QuestionSet([
	// multiplication
	new QuestionClass("Perform the following computation. $(#1 #7(#2)i)(#3 #7(#4)i) #7(#5) #7(#6)i$",
		"#8(#1, #2, #3, #4, #5, #6)", "", {
		"1": randI, "2": randI, "3": randI, "4": randI, "5": randI, "6": randI, "7": addsub,
		"8": (a, b, c, d, e, f) => add(multiply(complex(a, b), complex(c, d)), complex(e, f))
	}),
	// division
	new QuestionClass("Perform the following computation. $\\frac{#1 #7(#2)i}{#3 #7(#4)i} #7(#5) #7(#6)i$",
		"#8(#1, #2, #3, #4, #5, #6)", "", {
		"1": randI, "2": randI, "3": randI, "4": randI, "5": randI, "6": randI, "7": addsub,
		"8": (a, b, c, d, e, f) => add(divide(complex(a, b), complex(c, d)), complex(e, f))
	}),
	// modulus
	new QuestionClass("Perform the following computation. $|#1 #7(#2)i #7(#3) #7(#4)i|$",
		"#8(#1, #2, #3, #4)", "", {
		"1": randI, "2": randI, "3": randI, "4": randI, "7": addsub,
		"8": (a, b, c, d) => norm(add(complex(a, b), complex(c, d)))
	}),
	// conjugate
	new QuestionClass("Perform the following computation. $\\overline{(#1 #7(#2)i)} #7(#3) #7(#4)i$",
		"#8(#1, #2, #3, #4)", "", {
		"1": randI, "2": randI, "3": randI, "4": randI, "7": addsub,
		"8": (a, b, c, d) => add(complex(a, -b), complex(c, d))
	}),
], AnswerType.Complex)];

const correctOpProps = function (...exclude) {
	var arr = [
		"$z^{-1}=\\frac{x}{x^2+y^2}-i\\frac{y}{x^2+y^2}$",
		"$\\text{Re}(z)\\leq |z|$",
		"$\\text{Im}(z)\\leq |z|$",
		"$\\text{Re}(z)=\\frac{z+\\overline{z}}{2}$",
		"$\\text{Im}(z)=\\frac{z-\\overline{z}}{2i}$",
		"$|z|=|\\overline{z}|$",
		"$\\overline{z_1+z_2}=\\overline{z_1}+\\overline{z_2}$",
		"$\\overline{z_1\\cdot z_2}=\\overline{z_1}\\cdot\\overline{z_2}$",
		"$\\overline{z^{-1}}=\\overline{z}^{-1}$",
		"$|z_1\\cdot z_2|=|z_1|\\cdot|z_2|$",
		"$|z_1+z_2|\\leq |z_1|+|z_2|$",
		"$|z^n|=|z|^n$",
		"$({\\bf C}, +, *)$ is a vector space"
	];
	var statement;
	do {
		statement = arr[randInt(0, arr.length - 1)];
	} while (exclude.indexOf(statement) !== -1);
	return statement;
};
const incorrectOpProps = function (...exclude) {
	var arr = [
		"$z^{-1}=\\frac{y}{x^2+y^2}-i\\frac{x}{x^2+y^2}$",
		"$\\text{Re}(z)=\\frac{z-\\overline{z}}{2}$",
		"$\\text{Im}(z)=\\frac{z+\\overline{z}}{2i}$",
		"$|\\text{Re}(z)|+|\\text{Im}(z)|>\\sqrt{2}|z|$",
		"$|z_1\\cdot z_2|<|z_1|\\cdot|z_2|$",
		"$z=\\overline{z}$ iff $z$ is pure imaginary"
	];
	var statement;
	do {
		statement = arr[randInt(0, arr.length - 1)];
	} while (exclude.indexOf(statement) !== -1);
	return statement;
};
const opProperties = [new QuestionSet([
	// 2 correct
	new QuestionClass("Select all of the below which are true for complex numbers", ["1", "2"], "",
		{"1": correctOpProps, "2": correctOpProps, "3": incorrectOpProps, "4": incorrectOpProps},
		[new Option("1", "#1 "), new Option("2", "#2(#1)"), new Option("3", "#3 "), new Option("4", "#4(#3)")]),
	// 3 correct
	new QuestionClass("Select all of the below which are true for complex numbers", ["1", "2", "3"], "",
		{ "1": correctOpProps, "2": correctOpProps, "3": correctOpProps, "4": incorrectOpProps },
		[new Option("1", "#1 "), new Option("2", "#2(#1)"), new Option("3", "#3(#1, #2)"), new Option("4", "#4 ")]),
	// 4 correct
	new QuestionClass("Select all of the below which are true for complex numbers", ["1", "2", "3", "4"], "",
		{ "1": correctOpProps, "2": correctOpProps, "3": correctOpProps, "4": correctOpProps },
		[new Option("1", "#1 "), new Option("2", "#2(#1)"), new Option("3", "#3(#1, #2)"), new Option("4", "#4(#1, #2, #3)")])
], AnswerType.SelectAll)];

const exponentialForm = [
	// convert between rectangular and exponential form
	new QuestionSet([
		new QuestionClass("Convert $#1 #5(#2)i$ to exponential form.", "#3(#1, #2)", "",
			{
				"1": randI, "2": randI, "5": addsub, "3": (a, b) => {
					var polar = complex(a, b).toPolar();
					return polar.r+"e^{"+polar.phi+"i}";
				}
			}, undefined, undefined, ["exp"]),
		new QuestionClass("Convert $#1 e^{#4(#2) i}$ to rectangular form.", "#3(#1, #2)", "",
			{
				"1": randI, "2": () => numFracs[randInt(0, numFracs.length - 1)],
				"3": (r, phi) => {
					return complex({r: r, phi: phi}).toString();
				}, "4": piFracStr
			}),
		// technically, this is a real-valued answer, but R is a subset of C, so eh,
		new QuestionClass("Find the principal argument of $#1 #5(#2)i$.", "#3(#1, #2)", "",
			{
				"1": randI, "2": randI, "5": addsub, "3": (a, b) => {
					var polar = complex(a, b).toPolar();
					if (polar.phi <= Math.PI && polar.phi > -Math.PI) return polar.phi;
					else if (polar.phi > Math.PI) return polar.phi - 2 * Math.PI;
					else if (polar.phi < -Math.PI) return polar.phi - 2 * Math.PI;
				}
			}), 
	], AnswerType.Complex),
	// multiplication (and powers) of complex numbers
	new QuestionSet([
		// powers
		new QuestionClass("Evaluate $(#1 #5(#2)i)^#3 $ using exponential form.", "#4(#1, #2, #3)", "",
			{
				"1": () => randInt(-5, 5), "2": () => randInt(-5, 5), "3": () => randInt(3, 5), "5": addsub,
				"4": (a, b, n) => {
					return pow(complex(a, b), n);
				}
			}),
		// multiplication
		new QuestionClass("Evaluate $(#1 #5(#2)i)(#3 #5(#4)i)$ using exponential form.", "#6(#1, #2, #3, #4)", "",
			{
				"1": randI, "2": randI, "3": randI, "4": randI, "5": addsub,
				"6": (a, b, c, d) => {
					return multiply(complex(a, b), complex(c, d));
				}
			}),
		// division
		new QuestionClass("Evaluate $\\frac{#1 #5(#2)i}{#3 #5(#4)i}$ using exponential form.", "#6(#1, #2, #3, #4)", "",
			{
				"1": randI, "2": randI, "3": randI, "4": randI, "5": addsub,
				"6": (a, b, c, d) => {
					return divide(complex(a, b), complex(c, d));
				}
			})
	], AnswerType.Complex)
];

const calculateNthRoots = [new QuestionSet([
	// principal root
	new QuestionClass("Find the principal root of $(#1 #5(#2)i)^{1/#3 }$.", "#4(#1, #2, #3)", "",
		{
			"1": randI, "2": randI, "3": () => randInt(2, 5), "5": addsub,
			"4": (a, b, n) => {
				return nthRoots(complex(a, b), n)[0];
			}
		}),
	// kth root
	new QuestionClass("Find the #4(#3)th root of $(#1 #5(#2)i)^{1/#3 }$.", "#6(#1, #2, #3, #4)", "",
		{
			"1": randI, "2": randI, "5": addsub, "3": () => randInt(2, 5), "4": (n) => randInt(0, n - 1),
			"6": (a, b, n, k) => {
				return nthRoots(complex(a, b), n)[k];
			}
		})
], AnswerType.Complex)];

const expFunction = [
	// e^z for complex z
	new QuestionSet([
		new QuestionClass("Evaluate $e^{#1 #5(#2)i}$", "#3(#1, #2)", "", {
			"1": () => randInt(-3, 5), "2": randI, "5": addsub, "3": (a, b) => {
				return exp(complex(a, b));
			}
		})
	], AnswerType.Complex),
	// Log z
	// branches of log z
	new QuestionSet([
		new QuestionClass("Evaluate $\\text{Log}(#1 #5(#2)i)$.", "#3(#1, #2)", "", {
			"1": randI, "2": randI, "5": addsub, "3": (a, b) => {
				return log(complex(a, b));
			}
		}),
		new QuestionClass("Evaluate $\\text{log}(#1 #5(#2)i)$ using the branch $-#7(#3) < \\theta < #4(#3)$",
			"#6(#1, #2, #8(#3))", "",
			{
				"1": randI, "2": randI, "3": () => randInt(1, numFracs.length - 1), "5": addsub,
				"7": (i) => piFracStr(numFracs[i]), "4": (i) => piFracStr(numFracs[numFracs.length - i]),
				"8": (i) => -numFracs[i], "6": (a, b, p) => {
					var polar = complex(a, b).toPolar();
					var x = log(polar.r);
					var y = polar.phi;
					while (y > p + 2 * Math.PI) y -= 2 * Math.Pi;
					while (y < p) y += 2 * Math.PI;
					return complex(x, y);
				}
			})
	], AnswerType.Complex),
	// z^c for complex z,c
	new QuestionSet([
		new QuestionClass("Find the principal value of $(#1 #5(#2)i)^{#3 #5(#4)i}$.", "#6(#1, #2, #3, #4)", "", {
			"1": () => randInt(-5, 5), "2": () => randInt(-5, 5),
			"3": () => randInt(-5, 5), "4": () => randInt(-5, 5), "5": addsub,
			"6": (a, b, c, d) => {
				return pow(complex(a, b), complex(c, d));
			}
		})
	], AnswerType.Complex)
];


const correctExpProps = function (...exclude) {
	var arr = [
		// exp
		"$e^z=e^x\\cos(y)+ie^x\\sin(y)$",
		"$|e^z|=e^x$",
		"$\\text{arg}(e^z)=y+2\\pi n$",
		"$e^z\\not=0$",
		"$e^{z_1+z_2}=e^{z_1}e^{z_2}$",
		"$e^{-z}=\\frac{1}{e^z}$",
		"$e^z$ is entire",
		"$e^{z+2\\pi i}=e^z$",
		"$e^{i\\pi}=-1$",
		"$\\overline{e^z}=e^{\\overline{z}}$",
		"$|e^{z^2}|\\leq e^{|z^2|}$",
		// log
		"$\\text{log}(z)=\\text{ln}|z|+i\\text{arg}(z)$",
		"$e^{\\text{log}(z)}=z$",
		"$e^{\\text{Log}(z)}=z$",
		"If $z$ is positive and real, then $\\text{Log}(z)=\\text{ln}(x)$",
		"Each branch of $\\text{log}(z)$ is analytic in its domain",
		"$\\text{log}(z_1z_2)=\\text{log}(z_1)+\\text{log}(z_2)$"
	];
	var statement;
	do {
		statement = arr[randInt(0, arr.length - 1)];
	} while (exclude.indexOf(statement) !== -1);
	return statement;
}
const incorrectExpProps = function (...exclude) {
	var arr = [
		// exp
		"$|e^z|=e^y$",
		"$|e^z|=x$",
		"$e^z>0$",
		"$e^{z_1z_2}=e^{z_1}+e^{z_2}$",
		"$e^z$ has a derivative only for real $z$",
		"$e^{z+2\\pi}=e^z$",
		"$|e^{z^2}|>e^{|z^2|}$",
		// log
		"$\\text{log}(e^z)=z$",
		"$\\text{log}(z)$ is entire",
		"$\\text{Log}(z^c)=c\\text{Log}(z)$",
		"$\\text{log}(z^c)=c\\cdot\\text{log}(z)$",
		"$\\text{Log}(z_1z_2)=\\text{Log}(z_1)+\\text{Log}(z_2)$"
	];
	var statement;
	do {
		statement = arr[randInt(0, arr.length - 1)];
	} while (exclude.indexOf(statement) !== -1);
	return statement;
}
const expTrigProperties = [
	// properties that hold for real numbers, but not always for complex
	new QuestionSet([
		// Log(z^n) \not= n Log(z)
		new QuestionClass("Does $\\text{Log}((#1 #5(#2)i)^{#3 })=#3 \\text{Log}(#1 #5(#2)i)$?", "#4(#1, #2, #3)", "",
			{
				"1": () => randInt(-3, 3), "2": () => randInt(-3, 3), "3": () => randInt(2, 4), "5": addsub,
				"4": (a, b, n) => {
					var leftSide = log(pow(complex(a, b), n));
					var rightSide = n * log(complex(a, b));
					return equal(leftSide, rightSide) ? "Yes" : "No";
				}
			},
		["Yes", "No"]),
		// Log z_1z_2 \not= Log z_1 + Log z_2
		new QuestionClass("Does $\\text{Log}((#1 #5(#2)i)(#3 #5(#4)i))=\\text{Log}(#1 #5(#2)i)+\\text{Log}(#3 #5(#4)i)$?",
			"#6(#1, #2, #3, #4)", "",
			{
				"1": () => randInt(-3, 3), "2": () => randInt(-3, 3), "3": () => randInt(-3, 3),
				"4": () => randInt(-3, 3), "5": addsub,
				"6": (a, b, c, d) => {
					var leftSide = log(multiply(complex(a, b), complex(c, d)));
					var rightSide = add(log(complex(a, b)), log(complex(c, d)));
					return equal(leftSide, rightSide) ? "Yes" : "No";
				}
			},
			["Yes", "No"])
	], AnswerType.MultipleChoice),
	// exp and log properties
	new QuestionSet([
		// 1 correct
		new QuestionClass("Select all of the below which are true for complex numbers", ["1"], " ",
			{ "1": correctExpProps, "2": incorrectExpProps, "3": incorrectExpProps, "4": incorrectExpProps },
			[new Option("1", "#1 "), new Option("2", "#2 "), new Option("3", "#3(#2)"), new Option("4", "#4(#2, #3)")]),
		// 2 correct
		new QuestionClass("Select all of the below which are true for complex numbers", ["1", "2"], " ",
			{ "1": correctExpProps, "2": correctExpProps, "3": incorrectExpProps, "4": incorrectExpProps },
			[new Option("1", "#1 "), new Option("2", "#2(#1)"), new Option("3", "#3 "), new Option("4", "#4(#3)")]),
		// 3 correct
		new QuestionClass("Select all of the below which are true for complex numbers", ["1", "2", "3"], " ",
			{ "1": correctExpProps, "2": correctExpProps, "3": correctExpProps, "4": incorrectExpProps },
			[new Option("1", "#1 "), new Option("2", "#2(#1)"), new Option("3", "#3(#1, #2)"), new Option("4", "#4 ")]),
		// 4 correct
		new QuestionClass("Select all of the below which are true for complex numbers", ["1", "2", "3", "4"], " ",
			{ "1": correctExpProps, "2": correctExpProps, "3": correctExpProps, "4": correctExpProps },
			[new Option("1", "#1 "), new Option("2", "#2(#1)"), new Option("3", "#3(#1, #2)"), new Option("4", "#4(#1, #2, #3)")]),
	], AnswerType.SelectAll)
];

const randSet = function () {
	// the sets are objects with 4 properties:
	// the set text (describing the set to the user)
	// the set properties (an array of properties which the set possesses)
	// the closure set properties (an array like the above, but for the closure)
	// the classification of 0 (interior, accumulation, or boundary)
	var arr = [
		// Open, Closed, Connected, Bounded, Domain, Neighborhood
		{
			"text": "\\{z: |z-2+i|\\leq 1\\}",
			"prop": ["C", "Cn", "B"],
			"clProp": ["C", "Cn", "B"],
			"zero": ["I", "A"]
		},
		{
			"text": "\\{z: |2z+3|>4\\}",
			"prop": ["O", "Cn", "D"],
			"clProp": ["C", "Cn"],
			"zero": ["E"]
		},
		{
			"text": "\\{z: \\text{Im}(z)>1 \\}",
			"prop": ["O", "Cn", "D"],
			"clProp": ["C", "Cn"],
			"zero": ["E"]
		},
		{
			"text": "\\{z: \\text{Im}(z)=1 \\}",
			"prop": ["C", "Cn"],
			"clProp": ["C", "Cn"],
			"zero": ["E"]
		},
		{
			"text": "\\{z\\not=0 : 0\\leq \\text{arg} z\\leq \\pi/4 \\}",
			"prop": ["Cn"],
			"clProp": ["C", "Cn"],
			"zero": ["B", "A"]
		},
		{
			"text": "\\{z : |z-4|\\geq |z|\\}",
			"prop": ["C", "Cn"],
			"clProp": ["C", "Cn"],
			"zero": ["I", "A"]
		},
		{
			"text": "\\emptyset",
			"prop": ["O", "C", "Cn", "B"],
			"clProp": ["O", "C", "Cn", "B"],
			"zero": ["E"]
		},
		{
			"text": "{\\bf C}",
			"prop": ["O", "C", "Cn", "D"],
			"clProp": ["O", "C", "Cn", "D"],
			"zero": ["I", "A"]
		},
		{
			"text": "\\{z : |z-3+i|<2\\}",
			"prop": ["O", "Cn", "D", "N", "B"],
			"clProp": ["C", "Cn", "B"],
			"zero": ["I", "A"]
		}
	];
	return arr[randInt(0, arr.length-1)];
}
const topology = [
	new QuestionSet([
		new QuestionClass("Which of the following properties does the set $S=#5(#1)$ have?<br>  \
			What about $\\text{cl}(S)$#4(#2(#1), #3(#1), #6(#1))?<br>  \
			Is $0$ a interior point, exterior point, accumulation point, or boundary point of $S$?",
			[undefined, undefined, undefined], ["", ""], {
				"1": randSet, "2": (a) => a.prop, "3": (a) => a.clProp,
				"4": (...a) => "", "5": (a) => a.text, "6": (a) => a.zero
		}, [[new Option("O", "Open"), new Option("C", "Closed"), new Option("Cn", "Connected"), new Option("B", "Bounded"),
			new Option("D", "Domain"), new Option("N", "Neighborhood")],
			[new Option("O", "Open"), new Option("C", "Closed"), new Option("Cn", "Connected"), new Option("B", "Bounded"),
				new Option("D", "Domain"), new Option("N", "Neighborhood")],
			[new Option("I", "Interior point"), new Option("A", "Accumulation point"), new Option("B", "Boundary point"), new Option("E", "Exterior Point")]],
			["2", "3", "6"])
	], [["S", AnswerType.SelectAll], ["cl(S)", AnswerType.SelectAll], ["0 classification", AnswerType.SelectAll]])
];

//----------------------------------------------------------------------------
// Complex Calculus
//----------------------------------------------------------------------------

const infiniteLimits = [
	// z -> infinity
	new QuestionSet([
		// normal limits
		new QuestionClass("Find $\\displaystyle\\lim_{z\\to\\infty}\\frac{#1 z^2}{(z #3(#2))^2}$ using the definition \
			of the limit at infinity.", "#4(#1, #2)", "", {
			"1": randIE, "2": randI, "3": addsub, "4": (a, b) => a
		}),
		new QuestionClass("Find $\\displaystyle\\lim_{z\\to\\infty}\\frac{#1 z^2}{(z #3(#2))^3}$ \
			using the definition of the limit at infinity.", "0", "", {
			"1": randIE, "2": randI, "3": addsub
		}),
		// infinite limit
		new QuestionClass("Find $\\displaystyle\\lim_{z\\to\\infty}\\frac{#1 z^2}{z #3(#2)}$ using the definition \
			of the limit at infinity.", "\\infty", "", {
				"1": randIE, "2": randI, "3": addsub 
		})
	], AnswerType.Complex),
	// f(z) -> infinity as z -> z_0 (and other strange/nonexistent limits)
	new QuestionSet([
		new QuestionClass("Find $\\displaystyle\\lim_{z\\to 0}\\frac{\\overline{z}^2}{z}$.", "0", "", {},
			[new Option("0", "$0$"), new Option("DNE", "Does not exist"), new Option("infty", "$\\infty$"), new Option("1", "$1$"), new Option("-infty", "$-\\infty$")]),
		new QuestionClass("Find $\\displaystyle\\lim_{z\\to 1}\\frac{1}{(z-1)^2}$.", "infty", "", {},
			[new Option("0", "$0$"), new Option("DNE", "Does not exist"), new Option("infty", "$\\infty$"), new Option("1", "$1$"), new Option("-infty", "$-\\infty$")]),
		new QuestionClass("Find $\\displaystyle\\lim_{z\\to 0}\\frac{\\text{Re}(z)}{z}$.", "DNE", "", {},
			[new Option("0", "$0$"), new Option("DNE", "Does not exist"), new Option("infty", "$\\infty$"), new Option("1", "$1$"), new Option("-infty", "$-\\infty$")]),
		new QuestionClass("Find $\\displaystyle\\lim_{z\\to 0}\\frac{\\overline{z}}{z}$.", "DNE", "", {},
			[new Option("0", "$0$"), new Option("DNE", "Does not exist"), new Option("infty", "$\\infty$"), new Option("1", "$1$"), new Option("-infty", "$-\\infty$")]),
		new QuestionClass("Find $\\displaystyle\\lim_{z\\to 0}e^{-1/z}$.", "DNE", "", {},
			[new Option("0", "$0$"), new Option("DNE", "Does not exist"), new Option("infty", "$\\infty$"), new Option("1", "$1$"), new Option("-infty", "$-\\infty$")]),
		new QuestionClass("Find $\\displaystyle\\lim_{z\\to 0} -\\frac{1}{z^2}$.", "infty", "", {},
			[new Option("0", "$0$"), new Option("DNE", "Does not exist"), new Option("infty", "$\\infty$"), new Option("1", "$1$"), new Option("-infty", "$-\\infty$")])
	], AnswerType.MultipleChoice)
];

const derivatives = [new QuestionSet([
	// polynomial (degree 2)
	new QuestionClass("Find the derivative of $#1 z^2 #4(#2)iz #4(#3)$ at $#5 #4(#6)i$.", "#7(#1, #2, #3, #5, #6)", "", {
		"1": randI, "2": randI, "3": randI, "5": randI, "6": randI, "4": addsub, "7": (a, b, c, d, e) => {
			var point = complex(d, e);
			return add(multiply(2*a, point), complex(0, b));
		}
	}),
	// exponential
	new QuestionClass("Find the derivative of $e^{(#1 #4(#2)i)z}$ at $#5 #4(#6)i$.", "#7(#1, #2, #5, #6)", "", {
		"1": randI, "2": randI, "5": randI, "6": randI, "4": addsub, "7": (a, b, d, e) => {
			var point = complex(d, e);
			var factor = complex(a, b);
			return multiply(factor, exp(multiply(factor, point)));
		}
	}),
	// logarithmic
	new QuestionClass("Find the derivative of $\\text{log}((#1 #4(#2)i)z)$ at $#5 #4(#6)i$ using the principal branch.", "#7(#1, #2, #5, #6)", "", {
		"1": randI, "2": randI, "5": randI, "6": randI, "4": addsub, "7": (a, b, d, e) => {
			var point = complex(d, e);
			var factor = complex(a, b);
			return divide(1, point);
		}
	}),
	// power
	new QuestionClass("Find the derivative of $z^{#1 #4(#2)i}$ at $#5 #4(#6)i$ using the principal branch.", "#7(#1, #2, #5, #6)", "", {
		"1": randI, "2": randI, "5": randI, "6": randI, "4": addsub, "7": (a, b, d, e) => {
			var point = complex(d, e);
			var exponent = complex(a-1, b);
			return multiply(complex(a, b), pow(point, exponent));
		}
	}),
	// sin
	new QuestionClass("Find the derivative of $\\text{sin}(z)$ at $#6(#5)$.", "#7(#5)", "", {
		"5": () => randInt(0, 2), "6": (n) => ["0", "\\pi", "\\pi/2"][n],
		"7": (n) => ["1", "-1", "0"][n]
	}),
	// cosh
	new QuestionClass("Find the derivative of $\\text{cosh}(z)$ at $0$.", "0", "", {})
], AnswerType.Complex)];

const CRfuncts = [
	["\\overline{z}", ["none"], ""],
	["z-\\overline{z}", ["none"], ""],
	["\\overline{z}^2", ["0"], "0"],
	["2x+ixy^2", ["none"], ""],
	["e^xe^{-iy}", ["none"], ""],
	["iz+2", ["entire"], "i"],
	["e^{-x}e^{-iy}", ["entire"], "-0.36788"],
	["x^2+iy^2", ["else", "0"], "0"],
	["\\frac{1}{z}", ["1", "i", "else"], "-1"],
	["z \\text{Im} z", ["0"], "0"],
	["x^3+i(1-y)^3", ["i"], "0"],
	["xy+iy", ["i"], "1"],
	["e^ye^{ix}", ["none"], ""],
	["2xy+i(x^2-y^2)", ["0"], "0"]
];
const CReqns = [new QuestionSet([
	new QuestionClass("Use the Cauchy-Riemann Equations to determine where the function $f(z)=#2(#1)$ has a derivative (select only Everywhere if entire).  \
			Also, give the value at the derivative at $1$, $i$, or $0$ ($1$ if it exists there, $i$ if not, $0$ if it doesn't exist at $1$ or $i$).#5(#3(#1))",
		[undefined, "#4(#1)"], ["", ""], {
			"1": () => CRfuncts[randInt(0, CRfuncts.length-1)], "2": (arr) => arr[0], "3": (arr) => arr[1], "4": (arr) => arr[2], "5": () => ""
	}, [[new Option("0", "$0$"), new Option("1", "$1$"), new Option("i", "$i$"), new Option("else", "In Other Places"),
	new Option("entire", "Everywhere"), new Option("none", "Nowhere")]], ["3", undefined])
], [AnswerType.SelectAll, ["Derivative:", AnswerType.Complex]])];

const integralsOverRealVars = [new QuestionSet([
	new QuestionClass("Evaluate $\\displaystyle \\int^{#1 }_{#2(#1)} (#3 +it)^2\\,dt$.", "#4(#1, #2, #3)", "",
		{
			"1": () => randInt(-3, 6), "2": (b) => randInt(-9, b-1), "3": randIE, "4": (b, a, c) => {
				var re = (c * c * b - b * b * b / 3) - (c * c * a - a * a * a / 3);
				var im = c* b * b - c* a * a;
				return complex(re, im);
			}
		}),
	new QuestionClass("Evaluate $\\displaystyle \\int^{#1 }_{#2(#1)} \\left(\\frac{#3 }{t}-i\\right)^2\\,dt$.", "#4(#1, #2, #3)", "",
		{
			"1": () => randInt(-3, 6), "2": (b) => randInt(-9, b - 1), "3": randIE, "4": (b, a, c) => {
				var re = (-c * c / b - b) - (-c * c / a - a);
				var im = (-2 * c * Math.log(Math.abs(b))) - (-2 * c * Math.log(Math.abs(a)));
				return complex(re, im);
			}
		}),
	new QuestionClass("Evaluate $\\displaystyle \\int^{#2(#1, #3)}_0 e^{i#3 t}\\,dt$.", "#4(#1, #3)", "",
		{
			"1": () => randInt(1, numFracs.length - 1), "3": () => randInt(1, 4), "2": (val, div) => {
				var start = strFracs[val].charAt(0);
				var end = strFracs[val].slice(-1);
				if (start === "\\") {
					start = 1;
				}
				if (end === "i") {
					end = 1;
				}
				var frac = fraction(start, end);
				frac = divide(frac, div);
				var str = "";
				if (frac.n !== 1) str += frac.n;
				str += "\\pi";
				if (frac.d !== 1) str += ("/" + frac.d);
				return str;
			}, "4": (val, factor) => {
				var re = sin(numFracs[val]) / factor;
				var im = -cos(numFracs[val]) / factor + 1 / factor;
				return complex(re, im);
			}
		}),
	new QuestionClass("Evaluate $\\displaystyle \\int^\\infty_0 e^{-(#1 #3(#2)i)t}\\,dt$.", "#4(#1, #2)", "",
		{
			"1": () => randInt(1, 9), "2": randI, "3": addsub, "4": (a, b) => divide(1, complex(a, b))
		}),
	new QuestionClass("Evaluate $\\displaystyle \\int^#5 _0 e^{(#1 #3(#2)i)t}\\,dt$.", "#4(#5, #1, #2)", "",
		{
			"1": () => randInt(-4, 4), "2": () => randInt(-4, 4), "5": () => randInt(1, 5), "3": addsub, "4": (b, c, d) => {
				var factor = complex(c, d);
				return divide(subtract(exp(multiply(b, factor)), 1), factor);
			}
		})
], AnswerType.Complex)];

const integralModulus = [new QuestionSet([
	new QuestionClass("Find an upper bound for $\\displaystyle\\left|\\int_C \\frac{z^{#1 } #3(#2)}{z^{#4 } #3(#5)}\\,dz\\right|$, \
		where $C$ is a semicircle with radius $#6 $", "#7(#1, #2, #4, #5, #6)", "",
		{
			"1": () => randInt(1, 5), "2": randI, "3": addsub, "5": randI, "4": () => randInt(1, 5), "6": () => randInt(1, 5),
			"7": (a, b, c, d, f) => {
				var num = pow(f, a) + abs(b);
				var denom = abs(pow(f, c) - abs(d));
				return num / denom * Math.PI * f;
			}
		}),
	new QuestionClass("Find an upper bound for $\\displaystyle\\left|\\int_C(e^z-#4 \\overline{z})\\,dz\\right|$, \
		where $C$ is the boundary of the triangle with vertices at the points $0, #1 i, -#2 $.", "#3(#1, #2, #4)", "",
		{
			"1": () => randIntExclude(-5, 5, 0), "2": () => randInt(1, 5), "4": () => randInt(1, 5),
			"3": (a, b, c) => {
				var L = a + b + sqrt(a * a + b * b);
				var M = 1 + c * Math.max(a, b);
				return L * M;
			}
		})
], AnswerType.Complex)];

const antiderivative = [new QuestionSet([
	new QuestionClass("Evaluate $\\displaystyle\\int^{\\pi #3(#1)i}_0 #4 \\cos\\left(\\frac{z}{2}\\right)\\,dz$.",
			"#5(#1, #4)", "", {
			"1": randI, "3": addsub, "4": randIE, "5": (a, c) => {
				return complex(-c*(exp(-a/2)+exp(a/2)), 0);
			}
	}),
	new QuestionClass("Evaluate $\\displaystyle\\int_C #1 z #3(#2) #3(#4)i\\,dz$, where $C$ is the line from \
		$#5 #3(#6)i$ to $#7 #3(#8)i$", "#9(#1, #2, #4, #5, #6, #7, #8)", "",
		{
			"1": randIE, "2": randI, "4": randI, "3": addsub, "5": randI, "6": randI, "7": randI, "8": randI,
			"9": (a, b, c, d, f, g, h) => {
				var factor = complex(b, c);
				var end = complex(g, h);
				var start = complex(d, f);
				var first = add(multiply(a / 2, end, end), multiply(factor, end));
				var second = add(multiply(a / 2, start, start), multiply(factor, start));
				return subtract(first, second);
			}
		}),
	new QuestionClass("Evaluate $\\displaystyle\\int^{#1 #3(#2)i}_{#4 #3(#5)i} \\frac{1}{z}\\,dz$.",
		"#6(#1, #2, #4, #5)", "", {
			"1": randI, "2": randI, "3": addsub, "4": randI, "5": randI, "6": (a, b, c, d) => {
				var end = complex(a, b);
				var start = complex(c, d);
				return subtract(log(end), log(start));
			}
	})
], AnswerType.Complex)];

const parameterizationIntegrals = [new QuestionSet([
	new QuestionClass("Evaluate $\\displaystyle \\int_C f(z)\\,dz$, where $f(z)=\\frac{z #3(#1)}{#2 z}$ and $C$ is the semicircle $z=#4 e^{i\\theta}$ with $0\\leq\\theta\\leq\\pi$.", "#5(#1, #2, #4)", "",
		{
			"1": randI, "2": randIE, "3": addsub, "4": () => randInt(1, 9), "5": (a, b, r) => {
				return complex(-2*r/b, a/b*Math.PI);
			} 
		}),
	new QuestionClass("Evaluate $\\displaystyle \\int_C f(z)\\,dz$, where $f(z)=\\pi e^{\\pi\\overline{z}}$ and $C$ consists of the line between $0$ and $#1 $ and the line between $#1 $ and $i$.", "#5(#1)", "",
		{
			"1": () => randIntExclude(-5, 5, 0), "5": (a) => {
				var factor = divide(complex(-a, 1), complex(a, 1));
				var ex = exp(Math.PI * a);
				return add(ex, multiply(ex, factor), factor);
			}
		}),
	new QuestionClass("Evaluate $\\displaystyle \\int_C f(z)\\,dz$, where $f(z)=\\left\\{\\begin{array}{ll}#1 , & y < 0, \\\\ #2 y, & y > 0\\end{array}\\right.$ and \
		$C$ is the arc from $-1-i$ to $1+i$ along the curve $y=x^3$.", "#5(#1, #2)", "",
		{
			"1": randI, "2": randI, "5": (a, b) => {
				return complex(a + b / 4, a + b / 2);
			}
		})
], AnswerType.Complex)];

const cauchyGoursatIntegrals = [new QuestionSet([
	new QuestionClass("Evaluate $\\displaystyle \\int_C f(z)\\,dz$, where $f(z)=\\frac{#1 z^2}{z #3(#2)}$ and $C$ is the square whose sides lie along the lines $x=\\pm #4(#2)$ and $y=\\pm #4 $.", "0", "",
		{
			"1": randIE, "2": () => randIntExclude(-9, 9, -1, 0, 1), "3": addsub, "4": (a) => randInt(1, Math.abs(a)-1)
		}),
	new QuestionClass("Evaluate $\\displaystyle \\int_C f(z)\\,dz$, where $f(z)=#2 ze^{#1 z}$ and $C$ is the circle centered at $0$ with radius $#3 $.", "0", "",
		{
			"1": () => randInt(-5, 5), "2": randIE, "3": () => randInt(1, 9)
		}),
	new QuestionClass("Evaluate $\\displaystyle \\int_C f(z)\\,dz$, where $f(z)=#2 \\text{Log}(z #3(#1))$ and $C$ is the circle centered at $0$ with radius $#4(#1)$.", "0", "",
		{
			"1": () => randIntExclude(-9, 9, -1, 0, 1), "2": randIE, "3": addsub, "4": (a) => randInt(1, Math.abs(a) - 1)
		}),
	new QuestionClass("Evaluate $\\displaystyle \\int_C f(z)\\,dz$, where $f(z)=\\frac{#1 }{(z #3(#2))^2}$ and $C$ is the square whose sides lie along the lines $x=\\pm #4(#2)$ and $y=\\pm #4 $.", "0", "",
		{
			"1": randIE, "2": () => randIntExclude(-9, 9, -1, 0, 1), "3": addsub, "4": (a) => 2*randInt(1, Math.abs(a) - 1)
		})
], AnswerType.Complex)];

const randC = function (r) {
	var Cs = ["the square whose sides lie along the lines $x=\\pm " + r + "$ and $y=\\pm " + r + "$",
		"the circle centered at $0$ with radius $" + r + "$"];
	return Cs[randInt(0, 1)];
};
const cauchyIntegralFormula = [new QuestionSet([
	new QuestionClass("Evaluate $\\displaystyle \\int_C f(z)\\,dz$, where $f(z)=\\frac{#1 \\cosh z}{z^{#3(#2)}}$ and $C$ is #4(#6).", "#5(#1, #2)", "",
		{
			"1": randIE, "2": () => randInt(0, 4), "3": (n) => n + 1, "4": randC, "6": () => randInt(1, 9), "5": (a, n) => {
				if (n % 2 === 0) return complex(0, 2 * a * Math.PI / factorial(n));
				else return "0";
			}
		}),
	new QuestionClass("Evaluate $\\displaystyle \\int_C f(z)\\,dz$, where $f(z)=\\frac{#1 z}{(#2 z #7(#3))^{#8(#9)}}$ and $C$ is #4(#6(#2, #3)).", "#5(#1, #2, #3, #9)", "",
		{
			"1": randIE, "2": randIE, "3": randI, "7": addsub, "8": (n) => n + 1, "9": () => randInt(0, 2), "4": randC,
			"6": (b, c) => {
				var minNum = Math.ceil(Math.max(1, Math.abs(c / b)));
				return randInt(minNum, 9);
			}, "5": (a, b, c, n) => {
				if (n > 1) return 0;
				if (n === 1) return complex(0, 2 * a * Math.PI / (b * b));
				if (n === 0) return complex(0, -a * c * 2 * Math.PI / (b * b));
			}
		}),
	new QuestionClass("Evaluate $\\displaystyle \\int_C f(z)\\,dz$, where $f(z)=\\frac{#1 }{z^2+#3(#2)}$ and $C$ is the circle centered at $i$ with radius $#2 $.", "#5(#1, #2)", "",
		{
			"1": randIE, "2": () => randInt(1, 9), "3": (b) => b * b, "5": (a, b) => complex(a / b * Math.PI, 0)
		}),
	new QuestionClass("Evaluate $\\displaystyle \\int_C f(z)\\,dz$, where $f(z)=\\frac{e^{#1 z}}{#2 z^#7(#3)}$ and $C$ is #4(#6).", "#5(#1, #2, #3)", "",
		{
			"1": randIE, "2": randIE, "3": () => randInt(0, 3), "7": (n) => n + 1, "4": randC, "6": () => randInt(1, 9),
			"5": (a, b, n) => complex(0, 2 * Math.PI * Math.pow(a, n) / (b * factorial(n)))
		}),
], AnswerType.Complex)];

const calculusTheorems = [new QuestionSet([
	theoremCreator(undefined, "then $f$ is constant on $D$",
		[new Option("1", "$f(z)$ and $\\overline{f(z)}$ are analytic on $D$"),
			new Option("2", "$f(z)$ is analytic and bounded on $D$"),
			new Option("3", "$f(z)$ is continuous and $\\int_C f(z)\\,dz=0$ for any contour $C$ in $D$"),
		new Option("4", "$|f(z)|$ is constant")],
		"1", false, "Let $D$ be a domain."),
	theoremCreator(undefined, "then $f$ is constant on $D$",
		[new Option("1", "$f(z)$ is analytic and $|f(z)|$ is constant on $D$"),
		new Option("2", "$f(z)$ is analytic and bounded on $D$"),
		new Option("3", "$f(z)$ is continuous and $\\int_C f(z)\\,dz=0$ for any contour $C$ in $D$"),
		new Option("4", "$f(z)$ is analytic on $D$ and $\\overline{f(z)}$ is bounded on $D$")],
		"1", false, "Let $D$ be a domain."),
	theoremCreator(undefined, "then $f$ is constant.",
		[new Option("1", "$f(z)$ is entire and bounded"),
		new Option("3", "$f(z)$ is continuous and $\\int_C f(z)\\,dz=0$ for any contour $C$"),
			new Option("4", "$|f(z)|$ is constant")], "1"),
	theoremCreator("Cauchy's Theorem", "then $\\int_C f(z)\\,dz=0$", [
		new Option("1", "If $f$ is analytic at all points inside and on $C$"),
		new Option("2", "If $f$ is analytic at all points inside $C$"),
		new Option("3", "If $f$ is entire"),
		new Option("4", "If $f$ is analytic at all but a finite number of points inside $C$")
	], "1", false, "Let $C$ be a simple closed contour."),
	theoremCreator("Principle of deformation of paths", "then $\\int_{C_1} f(z)\\,dz=\\int_{C_2} f(z)\\,dz$", [
		new Option("1", "If $f$ is analytic at all points between and on $C_1$ and $C_2$"),
		new Option("2", "If $f$ is analytic at all points between $C_1$ and $C_2$"),
		new Option("3", "If $f$ is analytic at all points inside and on $C_2$"),
		new Option("4", "If $f$ is analytic at all points inside $C_1$")
	], "1", false, "Let $C_1,C_2$ be positively oriented simple closed contours with $C_1$ interior to $C_2$."),
	theoremCreator("Cauchy's Integral Formula", "then $$f(z_0)=\\frac{1}{2\\pi i}\\int_C \\frac{f(z)}{z-z_0}\\,dz$$",
		[
			new Option("1", "If $f$ is analytic inside and on $C$ and $z_0$ is inside $C$"),
			new Option("2", "If $f$ is analytic on $C$ and $z_0$ is inside $C$"),
			new Option("3", "If $f$ is analytic outside $C$ and $z_0$ is outside $C$"),
			new Option("4", "If $f$ is analytic on $C$ and $z_0$ is outside $C$")
		], "1", false, "Let $C$ be a positively oriented simple closed contour."),
	theoremCreator("Fundamental Theorem of Calculus", "then the following are equivalent: \
		<br> $f$ has an antiderivative\
		<br> the integrals of $f(z)$ are path idependent and $\\int_C f(z)\\,dz=F(z_1)-F(z_2)$\
		<br> the integrals of $f(z)$ around closed contours are $0$",
		[
			new Option("1", "If $f$ is continuous"),
			new Option("2", "Always true"),
			new Option("3", "If $f$ is analytic"),
			new Option("4", "If $f$ is bounded")
		], "1"),
	theoremCreator("Cauchy-Riemann Equations", "then $u_x=v_y$ and $u_y=-v_x$ and $f'=u_x+iv_x$", [
		new Option("1", "If $f'$ exists"),
		new Option("2", "If the first-order partial derivatives of $u$ and $v$ are continuous"),
		new Option("3", "If the first-order partial derivatives of $u$ and $v$ exist"),
		new Option("4", "If $f$ is analytic at $z_0$")
	], "1", false, "Let $f=u+iv$.  Assume that these functions are all evaluated at $z_0=x_0+iy_0$"),
	theoremCreator("Cauchy-Riemann Equations", "then $f'$ exists and $f'=u_x+iv_x$", [
		new Option("1", "If the first-order partial derivatives of $u$ and $v$ exists in some neighborhood \
			and are continuous at $z_0$ and $u_x=v_y$ and $u_y=-v_x$"),
		new Option("2", "If $u_x=v_y$ and $u_y=-v_x$"),
		new Option("3", "If $f$ is continuous"),
		new Option("4", "If the first-order partial derivatives of $u$ and $v$ are continuous in some neighborhood \
			and $u_x=v_y$ and $u_y=-v_x$")
	], "1", false, "Let $f=u+iv$.  Assume that these functions are all evaluated at $z_0=x_0+iy_0$")
], AnswerType.MultipleChoice)];

//----------------------------------------------------------------------------
// Series, Residues, and Poles
//----------------------------------------------------------------------------

const correctSeProps = function (...exclude) {
	var arr = [
		"$z_n\\to z$ iff $x_n\\to x$ and $y_n\\to y$",
		"If $\\lim_{n\\to\\infty}z_n=z$, then $\\lim_{n\\to\\infty}|z_n|=|z|$",
		"$\\sum z_n = \\sum x_n + \\sum y_n$",
		"If $\\sum z_n$ converges, then $\\lim_{n\\to\\infty}z_n=0$",
		"If $\\sum |z_n|$ converges, then $\\sum z_n$ converges",
		"If $\\sum z_n=S$, then $\\sum \\overline{z_n}=\\overline{S}$",
		"If $\\sum z_n=S$, then $\\sum cz_n=cS$ for complex $c$",
		"If $\\sum z_n=S$ and $\\sum w_n=T$, then $\\sum z_n+w_n=S+T$"
	];
	var statement;
	do {
		statement = arr[randInt(0, arr.length - 1)];
	} while (exclude.indexOf(statement) !== -1);
	return statement;
}
const incorrectSeProps = function (...exclude) {
	var arr = [
		"If $\\lim_{n\\to\\infty}z_n=0$, then $\\sum z_n$ converges",
		"If $\\lim_{n\\to\\infty}z_n$ converges, then $\\sum z_n$ converges",
		"If $\\sum z_n$ converges, then $\\sum |z_n|$ converges",
		"If $\\sum z_n=S$ and $\\sum w_n=T$, then $\\sum \\frac{z_n}{w_n}=\\frac{S}{T}$",
		"If $\\sum z_n+w_n=S+T$, then $\\sum z_n=S$ and $\\sum w_n=T$"
	];
	var statement;
	do {
		statement = arr[randInt(0, arr.length - 1)];
	} while (exclude.indexOf(statement) !== -1);
	return statement;
}
const seqAndSeriesProperties = [new QuestionSet([
	// 1 correct
	new QuestionClass("Select all of the below which are true for sequences and series of complex numbers", ["1"], " ",
		{ "1": correctSeProps, "2": incorrectSeProps, "3": incorrectSeProps },
		[new Option("1", "#1 "), new Option("2", "#2 "), new Option("3", "#3(#2)")]),
	// 2 correct
	new QuestionClass("Select all of the below which are true for sequences and series of complex numbers", ["1", "2"], " ",
		{ "1": correctSeProps, "2": correctSeProps, "3": incorrectSeProps },
		[new Option("1", "#1 "), new Option("2", "#2(#1)"), new Option("3", "#3 ")]),
	// 3 correct
	new QuestionClass("Select all of the below which are true for sequences and series of complex numbers", ["1", "2", "3"], " ",
		{ "1": correctSeProps, "2": correctSeProps, "3": correctSeProps },
		[new Option("1", "#1 "), new Option("2", "#2(#1)"), new Option("3", "#3(#1, #2)")])
], AnswerType.SelectAll)];

const multiChar = function (str) {
	if (str.length > 1) return "(" + str + ")";
	else return str;
}
const taylorSeries = [new QuestionSet([
	new QuestionClass("Find the Maclaurian series for $f(z)=z\\cosh (z^{#1 })$", "#2(#1)", "",
		{ "1": () => randInt(2, 6), "2": (a) => "\\frac{z^{" + 2 * a + "n+1}}{(2n)!}" }, undefined, "\\sum^\\infty_{n=0}"),
	new QuestionClass("Find the Maclaurian series for $f(z)=\\frac{z}{z^4 #3(#1)}$", "#2(#1)", "",
		{ "1": () => randInt(2, 9), "3": addsub, "2": (a) => "\\frac{(-1)^n z^{4n+1}}{" + a + "^{n+1}}" }, undefined, "\\sum^\\infty_{n=0}"),
	new QuestionClass("Find the Taylor series for $f(z)=e^z$ centered at $#1 $", "#2(#1)", "",
		{ "1": randI, "2": (a) => "\\frac{e^{" + a + "}(z" + addsub(-a) + ")^n}{n!}" }, undefined, "\\sum^\\infty_{n=0}"),
	new QuestionClass("Find the Taylor series for $f(z)=\\frac{1}{1-z}$ centered at $#1 $", "#2(#1)", "",
		{ "1": () => randInt(-7, 7, 0, 1, 2), "2": (a) => "\\frac{(z" + addsub(-a) + ")^n}{" + multiChar((1-a)+"") + "^{n+1}}" }, undefined, "\\sum^\\infty_{n=0}")
], AnswerType.Series)];

const sqrtSymbol = function (num) {
	if (Math.sqrt(num) % 1 === 0) return Math.sqrt(num);
	else return "\\sqrt{"+num+"}";
}
const singleDomainLaurentSeries = new QuestionSet([
	new QuestionClass("Find the Laurent series for $#2(#1)$ in the domain $0<|z|<\\infty$.", "#3(#1)", "", {
		"1": () => randInt(0, 1), "2": (i) => ["e^{1/z}", "z^2\\sin\\left(\\frac{1}{z^2}\\right)"][i],
		"3": (i) => ["\\frac{z^{-n}}{n!}", "\\frac{(-1)^n z^{-4n}}{(2n+1)!}"][i]
	}, undefined, "\\sum^\\infty_{n=0}"),
	new QuestionClass("Find the Laurent series for $\\frac{1}{#1 +z}$ in the domain $#1 <|z|<\\infty$.", "(-1)^n #1 ^n z^{-n-1}", "", {
		"1": () => randInt(1, 6)
	}, undefined, "\\sum^\\infty_{n=0}"),
	new QuestionClass("Find the Laurent series for $\\frac{z+#1 }{2(z-#1 )}$ in the domain $#1 <|z|<\\infty$ (ignore the constant term).",
		"#1 ^n z^{-n}", "", {"1": () => randIntExclude(1, 6, 2)}, undefined, "\\sum^\\infty_{n=0}")
], AnswerType.Series);
const twoDomainLaurentSeries = new QuestionSet([
	new QuestionClass("Find two Laurent series for $\\frac{1}{z^2(#1 -z)}$ the first in the domain $0<|z|<#1 $ and the other in the domain $#1 <|z|<\\infty$",
		["\\frac{z^{n-2}}{#1 ^{n+1}}", "-#1 ^n z^{-n-3}"], ["", ""], { "1": () => randInt(1, 6) }, undefined, ["\\sum^\\infty_{n=0}", "\\sum^\\infty_{n=0}"]),
	new QuestionClass("Find two Laurent series for $\\frac{1}{z(#1 +z^2)}$ the first in the domain $0<|z|<#2(#1)$ and the other in the domain $#2(#1)<|z|<\\infty$",
		["\\frac{(-1)^n z^{2n-1}}{#1 ^{n+1}}", "(-1)^n #1 ^n z^{2n+3}"], ["", ""], { "1": () => randInt(1, 16), "2": sqrtSymbol}, undefined, ["\\sum^\\infty_{n=0}", "\\sum^\\infty_{n=0}"]),
], [AnswerType.Series, AnswerType.Series]);
const laurentSeries = [singleDomainLaurentSeries, singleDomainLaurentSeries, twoDomainLaurentSeries];

const findResidue = [new QuestionSet([
	new QuestionClass("Find the residue of $z^{#1 }e^{1/z}$ at $z=0$.", "#2(#1)", "", {
		"1": () => randInt(-2, 4), "2": (a) => {
			if (a < -1) return 0;
			else return complex(divide(1, factorial(a + 1)), 0)
		}
	}),
	new QuestionClass("Find the residue of $z^{#1 }\\cos\\left(\\frac{1}{z}\\right)$ at $z=0$.", "#2(#1)", "", {
		"1": () => randInt(-1, 4), "2": (a) => {
			if (a%2 === 0) return 0;
			else return divide(pow(-1, (a+1)/2), factorial(a + 1))
		}
	}),
	new QuestionClass("Find the residue of $\\frac{z-\\sin z}{z^{#1 }}$ at $z=0$.", "#2(#1)", "", {
		"1": () => randInt(1, 6), "2": (a) => {
			if (a%2 === 1) return 0;
			else return divide(pow(-1, (a/2-1)), factorial(a - 1))
		}
	}),
	new QuestionClass("Find the residue of $\\frac{\\sinh z}{z^{#1 }(1-z^2)}$ at $z=0$.", "#2(#1)", "", {
		"1": () => randInt(1, 6), "2": (a) => {
			if (a%2 === 1) return 0;
			if (a === 2) return 1;
			if (a === 4) return 7 / 6;
			if (a === 6) return 47 / 40;
		}
	})
], AnswerType.Complex)];

const poles = [new QuestionSet([
	new QuestionClass("Let $f(z)=\\frac{z #3(#1)}{z^2+#4(#2)}$.  Find the order of the pole at $z_0=#2 i$ and the residue at that pole.", ["1", "#5(#1, #2)"], ["", ""],
		{
			"1": randI, "2": () => randInt(1, 4), "3": addsub, "4": (b) => b * b, "5": (a, b) => complex(1 / 2, -a / (2 * b))
		}),
	new QuestionClass("Let $f(z)=\\frac{z^2 #3(#1)}{(z #3(#2))^2}$.  Find the order of the pole at $z_0=#5(#2)$ and the residue at that pole.", ["2", "#4(#1, #2)"], ["", ""],
		{
			"1": randI, "2": randI, "3": addsub, "4": (a, b) => -2 * b, "5": (b) => -b
		}),
	new QuestionClass("Let $f(z)=\\left(\\frac{z}{#1 z #3(#2)}\\right)^{#4 }$.  Find the order of the pole at $z_0=#6(#1, #2)$ and the residue at that pole.", ["#4 ", "#5(#1, #2, #4)"], ["", ""],
		{
			"1": () => randIntExclude(-4, 4, 0), "2": () => randIntExclude(-9, 9, 0), "4": () => randInt(2, 4), "3": addsub, "6": (a, b) => {
				var frac = fraction(-b, a);
				if (frac.d === 1) return frac.n;
				else return "\\frac{" + frac.n + "}{" + frac.d + "}";
			},
			"5": (a, b, n) => -b * n / Math.pow(a, n + 1)
		}),
	new QuestionClass("Let $f(z)=\\frac{\\text{Log} z}{z^2+#4(#2)}$.  Find the order of the pole at $z_0=#2 i$ and the residue at that pole.", ["1", "#5(#2)"], ["", ""],
		{
			"2": randIE, "4": (a) => a * a, "5": (a) => divide(log(complex(0, a)), complex(0, 2 * a))
		}),
	new QuestionClass("Let $f(z)=\\frac{\\sinh z}{z^{#1 }}$.  Find the order of the pole at $z_0=0$ and the residue at that pole.", ["#2(#1)", "#5(#1)"], ["", ""],
		{
			"1": () => randInt(1, 6), "2": (n) => n - 1, "5": (n) => {
				if (n % 2 === 0) return divide(1, factorial(n - 1));
				else return 0;
			}
		})
], [["Order", AnswerType.Exact], ["Residue", AnswerType.Complex]])];

const cauchyResidueTheorem = [new QuestionSet([
	new QuestionClass("Evaluate $\\displaystyle \\int_C f(z)\\,dz$, where $f(z)=\\frac{e^{-z}}{(z #3(#1))^2}$ and $C$ is the circle centered at $0$ with radius $#2(#1)$.",
		"#4(#1)", "", {
			"1": () => randInt(-4, 4), "2": (a) => randInt(Math.max(a+1, 0), 9), "3": addsub, "4": (a) => complex(0, multiply(-2*Math.PI, exp(a)))
	}),
	new QuestionClass("Evaluate $\\displaystyle \\int_C f(z)\\,dz$, where $f(z)=\\frac{z #3(#1)}{z^2 #3(#2(#1))z}$ and $C$ is the circle centered at $0$ with radius $#4(#2)$.",
		"2\\pi i", "", {
		"1": randIE, "2": (a) => randIntExclude(-9, 9, 0, a),  "4": (b) => randInt(Math.abs(b) + 1, 9), "3": addsub
	}),
	new QuestionClass("Evaluate $\\displaystyle \\int_C f(z)\\,dz$, where $f(z)=z^{#1 }e^{1/z}$ and $C$ is the circle centered at $0$ with radius $#2 $.",
		"#4(#1)", "", {
			"1": () => randInt(1, 4), "2": () => randInt(1, 9), "4": (n) => complex(0, divide(2 * Math.PI, factorial(n + 1)))
	}),
	new QuestionClass("Evaluate $\\displaystyle \\int_C f(z)\\,dz$, where $f(z)=\\frac{1}{z^{#2 }(z #3(#1))}$ and $C$ is the circle centered at $0$ with radius $#4(#1)$.",
		"0", "", {
		"1": () => randIntExclude(-4, 4, 0), "2": () => randInt(1, 4), "4": (a) => randInt(Math.max(a + 1, 0), 9), "3": addsub
	}),
	new QuestionClass("Evaluate $\\displaystyle \\int_C f(z)\\,dz$, where $f(z)=\\frac{#1 z^3 #3(#2)}{(z #3(#4))(z^2+#6(#5(#4)))}$ and $C$ is the circle centered at $0$ with radius $#7(#4, #5)$.",
		"#8(#1, #2, #4, #5)", "", {
		"1": randI, "2": randI, "3": addsub, "4": () => randInt(-3, 3), "5": (c) => {
				var d = 0;
				while (Math.abs(d) <= Math.abs(c)) {
					d = randInt(-9, 9);
				}
				return d;
			}, "6": (d) => d * d, "7": (c, d) => randInt(Math.abs(c) + 1, Math.abs(d)), "8": (a, b, c, d) => {
				return complex(0, 2 * Math.PI * (-a * c * c * c + b) / (c * c + d * d));
			}
	})
], AnswerType.Complex)];

const improperRealIntegrals = [new QuestionSet([
	new QuestionClass("Use residues to evaluate $\\int^\\infty_0\\frac{dx}{x^2+ #2(#1)}$.", "#3(#1)", "", {
		"1": () => randInt(1, 9), "2": (a) => a * a, "3": (a) => Math.PI / (2 * a)
	}),
	new QuestionClass("Use residues to evaluate $\\int^\\infty_0\\frac{dx}{(x^2+#3(#1))^{#2 }}$.", "#5(#1, #2)", "", {
		"1": () => randInt(1, 3), "2": () => randInt(2, 5), "3": (a) => a * a, "5": (a, n) => {
			return divide(multiply(Math.PI, factorial(2 * n - 2)), multiply(pow(2 * a, 2 * n - 1), factorial(n - 1), factorial(n - 1)));
		}
	}),
	new QuestionClass("Use residues to evaluate $\\int^\\infty_0\\frac{x^2\\,dx}{(x^2+#3(#1))(x^2+#3(#2(#1)))}$.", "#4(#1, #2)", "", {
		"1": () => randInt(1, 9), "2": (a) => randIntExclude(1, 9, a), "3": (a) => a * a, "4": (a, b) => Math.PI / (2 * (a + b))
	}),
	new QuestionClass("Use residues to evaluate $\\int^\\infty_{-\\infty}\\frac{\\cos x\\,dx}{(x^2+#3(#1))(x^2+#3(#2(#1)))}$.", "#4(#1, #2)", "", {
		"1": () => randInt(1, 4), "2": (a) => randIntExclude(1, 4, a), "3": (a) => a * a, "4": (a, b) => {
			return multiply(Math.PI / (a * a - b * b), subtract(divide(exp(-b), b), divide(exp(-a), a)));
		}
	}),
	new QuestionClass("Use residues to evaluate $\\int^\\infty_{-\\infty}\\frac{x^3 \\sin #1 x}{x^4+#3(#2)}\\,dx$.", "#4(#1, #2)", "", {
		"1": () => randInt(1, 9), "2": () => randInt(1, 5), "3": (a) => a * a, "4": (a, b) => {
			var arg = a * Math.sqrt(b / 2);
			return multiply(Math.PI, exp(-arg), cos(arg));
		}
	})
], AnswerType.Numeric)];

const defnTerms = [new QuestionSet([
	new QuestionClass("A function $f(z)$ is analytic in an open set $S$ if . . .", "3", "", {},
		[new Option("1", "$f$ is analytic at each point in $S$"), new Option("2", "$f$ has an antiderivative at each point in $S$"),
			new Option("3", "$f$ has a derivative at each point in $S$"), new Option("4", "$f$ is continuous at each point in $S$")], true),
	new QuestionClass("A function $f(z)$ is analytic at a point $z_0$ if . . .", "2", "", {},
		[new Option("1", "$f$ has a derivative at $z_0$"), new Option("2", "$f$ is analytic in some neighborhood of $z_0$"),
			new Option("3", "$f$ has a derivative in some deleted neighborhood of $z_0$"), new Option("4", "$f$ is continuous and has a derivative at $z_0$")], true),
	new QuestionClass("A point $z_0$ is called a singular point of $f$ if . . .", "1", "", {},
		[new Option("1", "$f$ is not analytic at $z_0$ but is analytic at some point in every neighborhood of $z_0$"),
			new Option("2", "$f$ is not analytic at $z_0$ but is analytic in some deleted neighborhood of $z_0$"),
			new Option("3", "$f$ is not analytic at $z_0$ and is not analytic at some point in every deleted neighborhood of $z_0$"),
			new Option("4", "$f$ is not analytic at $z_0")], true),
	new QuestionClass("A point $z_0$ is called an isolated singular point of $f(z)$ if . . .", "4", "", {},
		[new Option("1", "$f$ is not analytic at $z_0$ and is not analytic in some deleted neighborhood of $z_0$"),
			new Option("2", "$f$ is not analytic at $z_0$ but is analytic in every deleted neighborhood of $z_0$"),
			new Option("3", "$f$ is not analytic at $z_0$ but is analytic at some point in every neighborhood of $z_0$"),
			new Option("4", "$f$ is not analytic at $z_0$ but is analytic in some deleted neighborhood of $z_0$")], true)
], AnswerType.MultipleChoice)];

const srpTheorems = [new QuestionSet([
	theoremCreator("Taylor's Theorem", "then $f(z)$ has a unique power series representation $$f(z)=\\sum^\\infty_{n=0}a_n(z-z_0)^n$$ where $a_n=\\frac{f^{(n)}(z_0)}{n!}",
		[new Option("1", "If $f(z)$ is analytic throughout a disk $|z-z_0|<R$"),
			new Option("2", "If $f(z)$  is analytic throughout an annular domain $0<|z-z_0|<R$"),
			new Option("3", "If $f(z)$ is analytic at $z_0$"), new Option("4", "If $f(z)$ has a derivative at $z_0$")], "1"),
	theoremCreator("Laurent's Theorem", "then $f(z)$ has a unique Laurent series representation $$f(z)=\\sum^\\infty_{n=0}a_n(z-z_0)^n+\\sum^\\infty_{n=1}b_n(z-z_0)^{-n}$$\
		where $a_n=\\frac{1}{2\\pi i}\\int_C \\frac{f(z)\\,dz}{(z-z_0)^{n+1}}$ and $b_n=\\frac{1}{2\\pi i}\\int_C\\frac{f(z)\\,dz}{(z-z_0)^{-n+1}}$",
		[new Option("1", "If $f(z)$ is analytic throughout a disk $|z-z_0|<R$"),
		new Option("2", "If $f(z)$  is analytic throughout an annular domain $0<|z-z_0|<R$"),
			new Option("3", "If $f(z)$ is analytic at $z_0$"), new Option("4", "If $f(z)$ is analytic everywhere except at $z_0$")], "2"),
	theoremCreator("Cauchy's Residue Theorem", "then $\\int_C f(z)\\,dz=2\\pi i\\sum^n_{k=1}\\text{Res}_{z=z_k}f(z)$",
		[new Option("1", "If $f$ is analytic on and inside $C$ except at a finite number of singular points inside $C$"),
			new Option("2", "If $f$ is analytic inside $C$ except at a finite number of singular points inside $C$"),
			new Option("3", "If $f$ is analytic on and inside $C$"),
			new Option("4", "If $f$ is analytic on and inside $C$ except at a finite number of singular points")
		], "1", false, "Let $C$ be a simple closed positively-oriented contour."),
	theoremCreator(undefined, "$f(z)$ has a pole of order $m$ at $z_0$ iff there is a function $\\phi(z)$ such that", [
		new Option("1", "$\\phi(z)$ is analytic at $z_0$, $\\phi(z_0)\\not=0$, and $\\phi(z)=(z-z_0)^m f(z)$ in some punctured disk $0<|z-z_0|<R$"),
		new Option("2", "$\\phi(z)$ is analytic at $z_0$ and $\\phi(z)=(z-z_0)^m f(z)$ in some punctured disk $0<|z-z_0|<R$"),
		new Option("3", "$\\phi(z)$ is analytic at $z_0$, $\\phi(z_0)\\not=0$, $\\phi^{(m-1)}(z_0)\\not=0$, and $\\phi(z)=(z-z_0)^m f(z)$ in some punctured disk $0<|z-z_0|<R$"),
		new Option("4", "$\\phi(z)$ is analytic at $z_0$ and $\\phi(z)=(z-z_0)^m f(z)$ except at $z_0$")
	], "1", true),
	theoremCreator("Jordan's Lemma", "then for all $a>0$, $\\lim_{R\\to\\infty}\\int_{C_R}f(z)e^{iaz}\\,dz=0$", [
		new Option("1", "$f(z)$ is analytic in the upper half plane when $|z|>R_0$. <br> For all points on $C_R$, $|f(z)|\\leq M_R$, where $M_R\\to 0$ as $R\\to\\infty$."),
		new Option("2", "$f(z)$ is analytic in the upper half plane when $|z|>R_0$. <br> For all points on $C_R$, $|f(z)|\\leq M_R$, where $\\frac{M_R}{R}\\to 0$ as $R\\to\\infty$."),
		new Option("3", "$f(z)$ is analytic in the entire upper half plane. <br> For all points on $C_R$, $|f(z)|\\leq M$, where $M$ is a constant."),
		new Option("4", "$f(z)$ is analytic in the entire upper half plane. <br> For all points on $C_R$, $|f(z)|\\leq \\frac{M}{R}$, where $M$ is a constant.")
	], "1", false, "Let $C_R$ be a semi-circle centered at the origin with radius $R$.")
], AnswerType.MultipleChoice)];

// Organized by decreasing level of importance (each level of importance will be done half as often as the level above it)
var complexProbs = [
	[CReqns, parameterizationIntegrals, cauchyGoursatIntegrals, cauchyIntegralFormula, laurentSeries, cauchyResidueTheorem, improperRealIntegrals],
	[opProperties, exponentialForm, calculateNthRoots, expFunction, expTrigProperties, antiderivative, taylorSeries, findResidue, poles, calculusTheorems, srpTheorems],
	[complexArithmetic, topology, infiniteLimits, derivatives, integralsOverRealVars, integralModulus, seqAndSeriesProperties, defnTerms]
];
var complexProbsBySubject = {
	"Complex Numbers": [complexArithmetic, opProperties, exponentialForm, calculateNthRoots, expFunction, expTrigProperties, topology],
	"Complex Calculus": [infiniteLimits, derivatives, CReqns, integralsOverRealVars, integralModulus, antiderivative, parameterizationIntegrals, cauchyGoursatIntegrals, cauchyIntegralFormula, calculusTheorems],
	"Series, Residues, and Poles": [seqAndSeriesProperties, taylorSeries, laurentSeries, findResidue, poles, cauchyResidueTheorem, improperRealIntegrals, defnTerms, srpTheorems]
};
var complexProbsNamed = {
	"Complex Arithmetic": complexArithmetic, "Properties of Operations": opProperties, "Exponential Form": exponentialForm, "nth Roots": calculateNthRoots,
	"Exponential Function": expFunction, "Properties of Exponential/Trigs Functions": expTrigProperties, "Topology of the Complex Plane": topology,
	"Limits with Infinity": infiniteLimits, "Derivatives": derivatives, "Cauchy-Riemann Equations": CReqns, "Integrals of Complex-valued Functions of Real Variables": integralsOverRealVars,
	"Bounds on Integral Moduli": integralModulus, "Antiderivatives": antiderivative, "Parameterizing Contours": parameterizationIntegrals, "Cauchy's Theorem": cauchyGoursatIntegrals, 
	"Cauchy's Integral Formula": cauchyIntegralFormula, "Properties of Sequences and Series": seqAndSeriesProperties, "Taylor Series": taylorSeries, "Laurent Series": laurentSeries,
	"Residues": findResidue, "Poles": poles, "Cauchy's Residue Theorem": cauchyResidueTheorem, "Improper Real Integrals": improperRealIntegrals, "Definitions/Terms": defnTerms,
	"Complex Calculus Theorems": calculusTheorems, "Series, Residues, and Poles Theorems": srpTheorems
};

module.exports = { complexProbs, complexProbsBySubject, complexProbsNamed };