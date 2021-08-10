const { QuestionSet, QuestionClass, AnswerType, Option } = require("../questions.js");
const { randInt, randIntExclude, randI, randIE, neg, addsub, fix, piFracStr, rref } = require("../util.js");


//-----------------------------------------------------------------------------
// 1st order ODEs
//-----------------------------------------------------------------------------

// Separable -- 6 few constants
const separable = [new QuestionSet([
	new QuestionClass("Solve the initial value problem $y'=\\frac{#1 t^2}{#2 y}, \\; y(#3 )=#4 $ and find $y(#5(#1, #2, #3, #4))$.",
		"#6(#1, #2, #3, #4, #5)", "$y(t)=\\sqrt{\\frac{#7(#1)}{#8(#2)}t^3+\\frac{#9(#1, #2, #3, #4)}{#8(#2)}}$",
		{
			"1": randIE, "2": randIE, "3": () => randInt(-8, 8), "4": randI,
			"5": (a, b, c, d) => {
				var possible = [];
				for (var i = -9; i < 10; i++) {
					var val = 2 * a * (i ** 3) / (3 * b) + d * d - 2 * a * (c ** 3) / (3 * b);
					if (i !== c && val > 0) {
						possible.push(i);
					}
				}
				return possible[randInt(0, possible.length-1)];
			},
			"6": (a, b, c, d, f) => {
				const c1 = 2 / 3 * a / b;
				return +(Math.sqrt(c1 * (f ** 3) + d * d - c1 * (c ** 3))).toFixed(4);
			}, "7": (a) => 2 * a, "8": (b) => 3 * b,
			"9": (a, b, c, d) => 3 * b * d * d - 2 * a * (c ** 3)
		}),
	new QuestionClass("Solve the initial value problem $y'+#1 y^2\\sin t=0, \\; y(0)=#2 $ " +
		"and find $y(#3 )$.", "#4(#1, #2, #3)", "$y(t)=\\frac{1}{#6(#5(#1))\\cos t +\\frac{1}{#2 } #6(#1)}$",
		{
			"1": randIE, "2": randIE, "3": randIE,
			"4": (a, b, c) => +(1 / (-a * Math.cos(c) + 1 / b + a)).toFixed(4),
			"5": neg, "6": addsub
		}),
	new QuestionClass("Solve the initial value problem $y' #7(#1) y^2=#2 ty^2, \\; y(#3 )=#4 $ " +
		"and find $y(#5(#1, #2, #3, #4))$.", "#6(#1, #2, #3, #4, #5)",
		"$y(t)=\\frac{1}{-\\frac{#2 }{2}t^2 #7(#1) t+\\frac{1}{#4 }+\\frac{#8(#2, #3)}{2} #7(#9(#1, #3))}$",
		{
			"1": randIE, "2": randIE, "3": randI, "4": randIE, "7": addsub,
			"5": (a, b, c, d) => {
				var possible = [];
				for (var i = -9; i < 10; i++) {
					var val = -1 / 2 * b * i * i + a * i + 1 / d + 1 / 2 * b * c * c - a * c;
					if (i !== c && val !== 0) {
						possible.push(i);
					}
				}
				return possible[randInt(0, possible.length - 1)];
			}, "8": (b, c) => b * c * c, "9": (a, c) => -a * c,
			"6": (a, b, c, d, f) => +(1 / (-1 / 2 * b * f * f + a * f + 1 / d + 1 / 2 * b * c * c - a * c)).toFixed(4)
		}),
	new QuestionClass("Solve the initial value problem $y'e^{-t}y #5(#1)t=0, \\; y(1)=#2 $"+
		" and find $y(#3(#1, #2))$", "#4(#1, #2, #3)", "$y(t)=\\sqrt{#6(#1)e^t(1-t)+#7(#2)}$",
		{
			"1": randIE, "2": randI, "5": addsub, "6": (x) => 2 * x, "7": (x) => x * x,
			"4": (a, b, c) => +(Math.sqrt(2 * a * Math.exp(c) * (1 - c) + b * b)).toFixed(4),
			"3": (a, b) => {
				var possible = [];
				for (var i = -1; i < 10; i++) {
					var val = 2 * a * Math.exp(i) * (1 - i) + b * b;
					if (i !== 1 && val > 0) {
						possible.push(i);
					}
				}
				return possible[randInt(0, possible.length - 1)];
			}
		}),
	new QuestionClass("Solve the initial value problem $y'\\cos #1(#2, #3) y=-\\sin #2 t, \\; y(0)=#3 $" +
		" and find $y(#4(#1, #2, #3))$", "#5(#1, #2, #3, #4)",
		"$y(t)=\\frac{1}{#1 }\\sin^{-1}\\left(\\frac{#1 }{#2 }\\cos #2 t+\\frac{#1 }{#2 } #7(#6(#1, #3))\\right)$",
		{
			"1": (b, c) => {
				var possible = [];
				for (var i = -9; i < 10; i++) {
					for (var j = -9; j < 10; j++) {
						var val = i / b * Math.cos(b * j) + i / b - Math.sin(i * c);
						if (i !== 0 && val >= -1 && val <= 1) {
							possible.push(i);
							break;
						}
					}
				}
				return possible[randInt(0, possible.length - 1)];
			}, "2": randIE, "3": randI, "4": (a, b, c) => {
				var possible = [];
				for (var i = -9; i < 10; i++) {
					var val = a / b * Math.cos(b * i) + a / b - Math.sin(a * c);
					if (i !== 0 && val >= -1 && val <= 1) {
						possible.push(i);
					}
				}
				return possible[randInt(0, possible.length - 1)];
			},
			"5": (a, b, c, d) => +(1 / a * Math.asin(a / b * Math.cos(b * d) + a / b - Math.sin(a * c))).toFixed(4),
			"6": (a, c) => +(-Math.sin(a * c)).toFixed(2), "7": addsub
		}),
	new QuestionClass("Solve the initial value problem $y' #6(#1)x^{#2 }y=0, \\; y(0)=#3 $ and find $y(#4 )$.",
		"#5(#1, #2, #3, #4)", "$y(t)=#3 e^{\\frac{#1 }{#7(#2)}t^{#7 }}$",
		{
			"1": () => randIntExclude(-5, 5, 0), "2": () => randIntExclude(-5, 4, -1, 0),
			"3": randI, "4": () => randIntExclude(-2, 2, 0), "6": addsub, "7": (x) => x + 1,
			"5": (a, b, c, d) => +(c * Math.exp(a / (b + 1) * Math.pow(d, b + 1))).toFixed(4)
		})
], AnswerType.Numeric)];

// Linear 1st order -- 7 moderate constants
const linear1stOrder = [new QuestionSet([
	new QuestionClass("Solve the initial value problem $#1 y'+#2 y=#3 te^{#4(#1, #2) t}, \\; y(0)=#5 $" +
		" and find $y(#6 )$.", "#7(#1, #2, #3, #4, #5, #6)", "$y(t)=#8(#1, #2, #3, #4) te^{#4 t}+#9(#1, #2, #3, #4)e^{#4 t}+#10(#1, #2, #3, #4, #5)e^{#11(#1, #2) t}$",
		{
			"1": randIE, "2": randI, "3": randIE,
			"4": (a, b) => randIntExclude(-9, 9, -b / a),
			"5": randI, "6": randIE,
			"7": (a, b, c, d, f, g) => {
				const c1 = b / a + d;
				const c2 = Math.exp(d * g);
				const c3 = f + c / (c1 * c1);
				return +(c * g * c2 / c1 - c * c2 / (c1 * c1) + c3 * Math.exp(-b * g / a)).toFixed(4);
			},
			"8": (a, b, c, d) => +(c / (b / a + d)).toFixed(2), "9": (a, b, c, d) => +(c / ((b / a + d) ** 2)).toFixed(2),
			"10": (a, b, c, d, f) => +(f + c / ((b / a + d) ** 2)).toFixed(2), "11": (a, b) => +(-b / a).toFixed(2)
		}),
	new QuestionClass("Solve the initial value problem $y'+(#1 /t)y=#2 (\\cos t)/t^{#1 }, \\; y(\\pi)=#3 , \\; t>0$" +
		" and find $y(#4 )$.", "#5(#1, #2, #3, #4)", "$y(t)=#2 t^{#6(#1) }\\sin t+#7(#1, #3) t^{#6(#1)}$",
		{
			"1": () => randInt(-5, 5), "2": randI, "3": randI, "4": () => randInt(1, 9),
			"5": (a, b, c, d) => +(b * Math.pow(d, -a) * Math.sin(d) + c * Math.pow(Math.PI, a) * Math.pow(d, -a)).toFixed(4),
			"6": neg, "7": (a, c) => +(c * Math.pow(Math.PI, a)).toFixed(2)
		}),
	new QuestionClass("Solve the initial value problem $#1 ty'+(t+#1 )y=#2 t, \\; y(\\ln 2)=#3 , \\; t>0$" +
		" and find $y(#4 )$.", "#5(#1, #2, #3, #4)", "$y(t)=#2 -\\frac{#1 }{#2 t}+\\frac{#6(#1, #2, #3)}{t}e^{-t/#1 }$",
		{
			"1": randIE, "2": randI, "3": randI, "4": () => randInt(1, 9),
			"5": (a, b, c, d) => {
				const C = Math.LN2 * Math.exp(Math.LN2 / a) * (c - b + b / (a * Math.LN2));
				return +(b - b / (a * d) + C / d * Math.exp(-d / a)).toFixed(4);
			},
			"6": (a, b, c) => +(Math.LN2 * Math.exp(Math.LN2 / a) * (c - b + b / (a * Math.LN2))).toFixed(2)
		}),
	new QuestionClass("Solve the initial value problem $#1 y' #8(#2(#3, #4))y=#3 \\sin #4 t, \\; y(0)=#5 $  and find $y(#6 )$.",
		"#7(#1, #2, #3, #4, #5, #6)", "$y(t)=#9(#1, #2, #3, #4)\\sin #4 t #8(#10(#1, #2, #3, #4))\\cos #4 t #8(#11(#5, #10))e^{#12(#1, #2)t}$",
		{
			"1": randIE, "2": randIE, "3": randIE, "4": randIE,
			"5": randI, "6": randIE, "8": addsub,
			"7": (a, b, c, d, f, g) => {
				const c1 = b * c / (b * b + a * a * d * d);
				const c2 = a * c * d / (b * b + a * a * d * d);
				return +(c1 * Math.sin(d * g) - c2 * Math.cos(d * g) + (f + c2) * Math.exp(-b * g / a)).toFixed(4);
			},
			"9": (a, b, c, d) => +(b * c / (b * b + a * a * d * d)).toFixed(2),
			"10": (a, b, c, d) => +(-a * c * d / (b * b + a * a * d * d)).toFixed(2),
			"11": (f, c2) => f + c2, "12": (a, b) => +(-b / a).toFixed(2)
		}),
	new QuestionClass("Solve the initial value problem $y' #8(#1(#4))y=#2 t #8(#3)e^{#4 t}, \\; y(0)=#5 $ and find $y(#6 )$.",
		"#7(#1, #2, #3, #4, #5, #6)", "$y(t)=\\frac{#2 }{#1 }t-\\frac{#2 }{#9(#1) }+\\frac{#3 }{#10(#1, #4) }e^{#4 t}+#11(#1, #2, #3, #4, #5)e^{#12(#1) t}$",
		{
			"1": (d) => randIntExclude(-9, 9, -d, 0), "2": randIE, "3": randIE, "4": randIE, "5": randI, "6": randIE,
			"7": (a, b, c, d, f, g) => {
				const C = f + b / (a ** 2) - c / (a + d);
				return +(b * g / a - b / (a ** 2) + c * Math.exp(d * g) / (a + d) + C * Math.exp(-a * g)).toFixed(4);
			}, "8": addsub, "9": (x) => x * x, "10": (a, d) => a + d, "12": neg,
			"11": (a, b, c, d, f) => +(f + b / (a ** 2) - c / (a + d)).toFixed(2)
		}),
	new QuestionClass("Solve the initial value problem $#1 y' #9(#2(#1, #4))y=#3 e^{#4 t}, \\; y(#5 )=#6 $ and find $y(#7(#5))$.",
		"#8(#1, #2, #3, #4, #5, #6, #7)", "$y(t)=\\frac{#3 }{#10(#1, #2, #4)}e^{#4 t} #9(#11(#1, #2, #3, #4, #5, #6))e^{#12(#1, #2)t}$",
		{
			"1": randIE, "2": (a, d) => randIntExclude(-9, 9, 0, -a * d), "3": randIE,
			"4": randIE, "5": randI, "6": randI, "7": (f) => randIntExclude(-9, 9, f), "9": addsub,
			"8": (a, b, c, d, f, g, h) => {
				const C = g * Math.exp(b * f / a) - c / (b + a * d) * Math.exp(d * f + b * f / a);
				return +(c / (b + a * d) * Math.exp(d * h) + C * Math.exp(-b / a * h)).toFixed(4);
			}, "10": (a, b, d) => b + a * d, "12": (a, b) => +(-b / a).toFixed(2),
			"11": (a, b, c, d, f, g) => +(g * Math.exp(b * f / a) - c / (b + a * d) * Math.exp(d * f + b * f / a)).toFixed(2)
		}),
	new QuestionClass("Solve the initial value problem $y' #8(#1)y=#2 #8(#3)\\cos(#4 t), \\; y(0)=#5 $ and find $y(#6 )$.",
		"#7(#1, #2, #3, #4, #5, #6)", "$y(t)=\\frac{#2 }{#1 } #8(#9(#1, #3, #4))\\sin#4 t #8(#10(#1, #3, #4))\\cos#4 t #8(#11(#1, #2, #3, #4, #5))e^{#12(#1) t}$",
		{
			"1": randIE, "2": randIE, "3": randIE, "4": randIE, "5": randI, "6": randIE,
			"7": (a, b, c, d, f, g) => {
				const c1 = c * d / (a * a + d * d);
				const c2 = c * a / (a * a + d * d);
				return +(c1 * Math.sin(d * g) + c2 * Math.cos(d * g) + (f - b / a - c2) * Math.exp(-a * g) + b / a).toFixed(4);
			},
			"8": addsub, "9": (a, c, d) => +(c * d / (a * a + d * d)).toFixed(2), "10": (a, c, d) => +(c * a / (a * a + d * d)).toFixed(2),
			"11": (a, b, c, d, f) => +(f - c * a / (a * a + d * d) - b / a).toFixed(2), "12": neg
		})
], AnswerType.Numeric)];

// Autonomous -- 5 moderate constants
	// 3 equilibrium solutions and 2 long-term behaviors
const autoSolutions = new QuestionSet([
	new QuestionClass("Find the equilibrium solution of $y'= #3(#1)(y #4(#2))^2$ and classify it.",
		["#3(#2)", "Semistable"], ["$y(t)=#3 $", "Arrows point towards the solution on one side and away from it on the other side."],
		{ "1": () => randInt(1, 9), "2": randI, "3": neg, "4": addsub },
		[[], ["Asymptotically Stable", "Unstable", "Semistable"]]),
	new QuestionClass("Find the equilibrium solution of $y'=#1 y #4(#2)y^2, \\; y<0$ and classify it.",
		["#3(#1, #2)", "Asymptotically Stable"], ["$y(t)=#3 $", "Arrows point towards the solution"], {
			"1": () => randInt(1, 9), "2": () => randInt(1, 9), "4": addsub,
			"3": (a, b) => +(-a / b).toFixed(4)
		}, [[], ["Asymptotically Stable", "Unstable", "Semistable"]]),
	new QuestionClass("Find the equilibrium solution of $y'=#1 y #4(#2)\\sqrt{y}, \\; y>0$ and classify it.",
		["#3(#1, #2)", "Unstable"], ["$y(t)=#3 $", "Arrows point away from the soluton"], {
			"1": () => randInt(1, 9), "2": () => randInt(1, 9), "4": addsub,
			"3": (a, b) => +(b * b / (a * a)).toFixed(4)
	}, [[], ["Asymptotically Stable", "Unstable", "Semistable"]])
], [AnswerType.Numeric, AnswerType.MultipleChoice]);
const autoLongTerm = new QuestionSet([
	new QuestionClass("Find $\\lim_{t\\rightarrow \\infty}y(t)$, where $y'=y^2(#3(#1)-y^2), \\; y_0=#2 $.",
		"#4(#1, #2)", "", {
			"1": () => randInt(0, 9), "2": () => randInt(-9, 9), "3": (x) => x * x,
			"4": (a, b) => {
				if (b > -a) return a;
				else if (b === -a) return -a;
				else return "-\\infty";
			}
		}),
	new QuestionClass("Find $\\lim_{t\\rightarrow \\infty}y(t)$, where $y'=y(y-#1 )(y-#2(#1)), \\; y_0=#3 $.",
		"#4(#1, #2, #3)", "", {
			"1": () => randInt(1, 9), "2": (a) => randIntExclude(1, 9, a), "3": () => randInt(-3, 9),
			"4": (a, b, c) => {
				var first = Math.min(a, b);
				var second = Math.max(a, b);
				if (c < 0) return "-\\infty";
				else if (c === 0) return 0;
				else if (c > 0 && c < second) return first;
				else if (c === second) return second;
				else return "\\infty";
			}
		})
], AnswerType.Exact);
const autonomous = [autoSolutions, autoLongTerm];

// Exact Equations -- 7 few constants (they tend to mess exactness up)
const exactEq = [new QuestionSet([
	new QuestionClass("Solve the initial value problem $(#1 y #7(#2)t)y'=#8(#2)y #7(#3)t," +
		"\\; y(#4(#1, #2, #3)) =#5(#1, #2, #3, #4) $ and find $y(0)$.",
		"#6(#1, #9(#1, #2, #3, #4, #5))", "$\\Psi(t,y)=#10(#1)y^2 #7(#2)ty #7(#10(#3))t^2=#11(#9)$",
		{
			"1": randIE, "2": randIE, "3": randIE, "7": addsub, "8": neg, "11": fix,
			"9": (a, b, d, f, g) => a / 2 * (g ** 2) + b * f * g + d / 2 * (f ** 2),
			"6": (a, c) => +(Math.sqrt(2 * c / a)).toFixed(4), "10": (x) => x / 2,
			"4": (a, b, d) => {
				var possible = [];
				for (var i = -9; i < 10; i++) {
					if (i !== 0) {
						var isPossible = false;
						for (var j = -9; j < 10; j++) {
							if (2 * (a / 2 * (j ** 2) + b * i * j + d / 2 * (i ** 2)) / a > 0) {
								isPossible = true;
								break;
							}
						}
						if (isPossible) {
							possible.push(i);
						}
					}
				}
				return possible[randInt(0, possible.length - 1)];
			}, "5": (a, b, d, f) => {
				var possible = [];
				for (var i = -9; i < 10; i++) {
					if (2 * (a / 2 * (i ** 2) + b * f * i + d / 2 * (f ** 2)) / a > 0) {
						possible.push(i);
					}
				}
				return possible[randInt(0, possible.length - 1)];
			}
		}),
	new QuestionClass("Solve the initial value problem $(#2 t^2+3)y'=#9(#1) t^2 #7(#8(#9(#2)))ty-2, " +
		"\\; y(#3 )=#4 $ and find $y(0)$.", "#5(#6(#1, #2, #3, #4))",
		"$\\Psi(t,y)=\\frac{#1 }{3}t^3 #7(#2)t^2y+2t+3y=#10(#6)$",
		{
			"1": randIE, "2": () => randIntExclude(-4, 4, 0), "3": randIE, "4": randI,
			"5": (C) => +(C / 3).toFixed(4), "7": addsub, "8": (x) => 2 * x, "9": neg, "10": fix,
			"6": (a, b, c, d) => a / 3 * (c ** 3) + b * c * c * d + 2 * c + 3 * d
		}),
	new QuestionClass("Solve the initial value problem $(e^t\\cos y #5(#1)\\cos t)y'=#1 y\\sin t - e^t\\sin y, " +
		"\\; y(#8(#2(#1)))=#8(#3(#1, #2))$ and find $y(\\pi/2)$.", "#4(#6(#1, #2, #3))", "$\\Psi(t,y)=e^t\\sin y #5(#1)y\\cos t= #7(#6)$",
		{
			"1": randIE, "5": addsub, "2": (a) => {
				var allFracs = [0, 1 / 4, 1 / 3, 1 / 2, 2 / 3, 3 / 4, 1, 5 / 4, 4 / 3, 3 / 2, 5 / 3, 7 / 4];
				var possFracs = [];
				for (var i = 0; i < allFracs.length; i++) {
					if (allFracs[i] === 1/2) continue;
					for (var j = 1; j < allFracs.length; j++) {
						var t = allFracs[i] * Math.PI;
						var y = allFracs[j] * Math.PI;
						var val = (Math.exp(t) * Math.sin(y) + a * y * Math.cos(t)) * Math.exp(-Math.PI / 2);
						if (-1 <= val && val <= 1) {
							possFracs.push(allFracs[i]);
							break;
						}
					}
				}
				var frac = possFracs[randInt(0, possFracs.length - 1)];
				return frac * Math.PI;
			}, "3": (a, t) => {
				var allFracs = [0, 1 / 4, 1 / 3, 1 / 2, 2 / 3, 3 / 4, 1, 5 / 4, 4 / 3, 3 / 2, 5 / 3, 7 / 4];
				var possFracs = [];
				for (var i = 0; i < allFracs.length; i++) {
					var y = allFracs[i] * Math.PI;
					var val = (Math.exp(t) * Math.sin(y) + a * y * Math.cos(t)) * Math.exp(-Math.PI / 2);
					if (-1 <= val && val <= 1) possFracs.push(allFracs[i]);
				}
				return possFracs[randInt(0, possFracs.length - 1)] * Math.PI;
			}, "4": (C) => +(Math.asin(C * Math.exp(-Math.PI / 2))).toFixed(4), "7": fix,
			"6": (a, b, c) => Math.exp(b) * Math.sin(c) + a * c * Math.cos(b), "8": piFracStr
		}),
	new QuestionClass("Solve the initial value problem $(\\ln t #7(#2))y'=-y/t #7(#1), \\; y(#3 )=#4 , \\; t>0$" +
		" and find $y(#5(#3))$", "#6(#1, #2, #5, #8(#1, #2, #3, #4))", "$\\Psi(t,y)=y\\ln t #7(#9(#1))t^2 #7(#2)y=#10(#8)$",
		{
			"1": randIE, "2": randIE, "3": () => randInt(1, 9), "4": randI, "7": addsub, 
			"5": (d) => randIntExclude(1, 9, d), "9": (a) => -a / 2, "10": fix,
			"8": (a, b, d, f) => f * Math.log(d) - a / 2 * d * d + b * f,
			"6": (a, b, g, C) => +((C + a / 2 * g * g) / (b + Math.log(g))).toFixed(4)
		}),
	new QuestionClass("Solve the initial value problem $#2 t^{#1 }y^{#8(#2)}y'=#7(#1)t^{#8(#1)}y^{#2 },"+
		"\\; y(#3(#1, #2))=#4(#1, #2, #3)$ and find $y(1)$", "#5(#2, #6(#1, #2, #3, #4))", "$\\Psi(t,y)=t^{#1 }y^{#2 }=#9(#6)$",
		{
			"1": () => randIntExclude(-9, 9, 0, 1), "2": () => randIntExclude(-9, 9, 0, 1),
			"5": (b, C) => +(Math.pow(C, 1 / b)).toFixed(4), "6": (a, b, d, f) => (d ** a) * (f ** b), "7": neg,
			"8": (x) => x - 1, "9": fix, "3": (a, b) => {
				if (b % 2 === 0) return randInt(2, 9);
				else return randIntExclude(-9, 9, 0, 1);
			}, "4": (a, b, d) => {
				if (d ** a > 0) return randInt(1, 9);
				else return randInt(-9, -1);
			}
		}),
	new QuestionClass("Solve the initial value problem $(#2 ty-e^{-\\frac{#2 }{#1 }y})y' #7(#1)y=0, \\; y(#3(#1))=#4 $" +
		" and find $y(0)$.", "#5(#6(#1, #2, #3, #4))", "$\\Psi(t,y)=#1 te^{#9(#8(#1, #2))y}+\\frac{1}{y^2}=#9(#6)$",
		{
			"1": randIE, "2": randIE, "4": randIE, "7": addsub, "9": fix,
			"3": (a) => { if (a >= 0) return randInt(0, 9); if (a < 0) return randInt(-9, 0); },
			"8": (b, a) => b / a, "5": (C) => +(Math.sqrt(C)).toFixed(4),
			"6": (a, b, c, d) => a * c * Math.exp(b * d / a) + 1 / (d ** 2)
		})
], AnswerType.Numeric)];

// Numerical Approximations -- 4 some constants
const approx = function (func, t0, y0, tn, h) {
	var y = y0;
	for (var i = 0; i < (tn - t0) / h; i++) {
		y += func(t0 + i * h, y) * h;
	}
	return y;
}
const numericalApprox = [new QuestionSet([
	new QuestionClass("Given $y'=y(#1 -ty), \\; y(0)=#2 $, approximate $y(2)$ with a step size of $0.5$.",
		"#3(#1, #2)", "",
		{
			"1": randIE, "2": randI,
			"3": (a, b) => +(approx((t, y) => y * (a-t*y), 0, b, 2, 0.5)).toFixed(4)
		}),
	new QuestionClass("Given $y'=#1 #5(#2)y^2, \\; y(0)=#3 $, approximate $y(2)$ with a step size of $0.5$.",
		"#4(#1, #2, #3)", "",
		{
			"1": randIE, "2": randIE, "3": randI, "5": addsub,
			"4": (a, b, c) => +(approx((t, y) => a + b*y*y, 0, c, 2, 0.5)).toFixed(4)
		}),
	new QuestionClass("Given $y'=(#1 -ty)/(#2 +y^2), \\; y(0)=#3(#2)$, approximate $y(2)$ with a step size of $0.5$.",
		"#4(#1, #2, #3)", "",
		{
			"1": randIE, "2": randIE, "3": (b) => randIntExclude(-9, 9, Math.sqrt(Math.abs(b))),
			"4": (a, b, c) => +(approx((t, y) => (a - t * y) / (b + y * y), 0, c, 2, 0.5)).toFixed(4)
		}),
	new QuestionClass("Given $y'=#2 \\cos t #5(#1)y, \\; y(0)=#3 $, approximate $y(2)$ with a step size of $0.5$.",
		"#4(#1, #2, #3)", "",
		{
			"1": randIE, "2": randIE, "3": randIE, "5": addsub,
			"4": (a, b, c) => +(approx((t, y) => b*Math.cos(t)+a*y), 0, c, 2, 0.5).toFixed(4)
		})
], AnswerType.Numeric)]

// Definitions/terms
// Dependent/Independent variables, ODE vs. PDE
const ordinaryPartial = new QuestionSet([
	new QuestionClass("Classify the differential equation: $y+xt^2\\frac{dy}{dt}=e^y$",
		["Ordinary Differential Equation (ODE)", "y", ["t"]], [" ", " ", " "], {}, 
		[["Ordinary Differential Equation (ODE)", "Partial Differential Equation (PDE)"],
		["t", "x", "y"], ["t", "x", "y"]]),
	new QuestionClass("Classify the differential equation: $\\frac{d^2x}{du^2}u^2=tu+\\cos x+\\frac{dx}{du}$",
		["Ordinary Differential Equation (ODE)", "x", ["u"]], [" ", " ", " "], {},
		[["Ordinary Differential Equation (ODE)", "Partial Differential Equation (PDE)"],
		["t", "u", "x"], ["t", "u", "x"]]),
	new QuestionClass("Classify the differential equation: $\\alpha^2\\frac{\\partial^2 u}{\\partial x^2}=\\frac{\\partial u}{\\partial t}$",
		["Partial Differential Equation (PDE)", "u", ["t", "x"]], [" ", " ", " "], {},
		[["Ordinary Differential Equation (ODE)", "Partial Differential Equation (PDE)"],
		[new Option("alpha", "$\\alpha$"), "t", "u", "x"], [new Option("alpha", "$\\alpha$"), "t", "u", "x"]]),
	new QuestionClass("Classify the differential equation: $u_{xx}+u_{yy}+u_{zz}=0$",
		["Partial Differential Equation (PDE)", "u", ["x", "y", "z"]], [" ", " ", " "], {},
		[["Ordinary Differential Equation (ODE)", "Partial Differential Equation (PDE)"],
		["u", "x", "y", "z"], ["u", "x", "y", "z"]])
], [AnswerType.MultipleChoice, ["Select the dependent variable", AnswerType.MultipleChoice], ["Select the independent variable(s)", AnswerType.SelectAll]]);
// Order, Linear, Homogeneous
const orderLinear = new QuestionSet([
	new QuestionClass("Classify the following ODE: $y''+5t^2=e^yy'''$", ["3", "Non-linear"],
		[" ", " "], {}, [[], ["Non-linear", "Linear, Non-homogeneous", "Linear, Homogeneous"]]),
	new QuestionClass("Classify the following ODE: $y^{(4)}=0$", ["4", "Non-linear"],
		[" ", " "], {}, [[], ["Non-linear", "Linear, Non-homogeneous", "Linear, Homogeneous"]]),
	new QuestionClass("Classify the following ODE: $y''+\\cos ty'=e^ty$", ["2", "Linear, Homogeneous"],
		[" ", " "], {}, [[], ["Non-linear", "Linear, Non-homogeneous", "Linear, Homogeneous"]]),
	new QuestionClass("Classify the following ODE: $y'+t^3y=0$", ["1", "Linear, Homogeneous"],
		[" ", " "], {}, [[], ["Non-linear", "Linear, Non-homogeneous", "Linear, Homogeneous"]]),
	new QuestionClass("Classify the following ODE: $e^ty'+ty=\\cos t$", ["1", "Linear, Non-homogeneous"],
		[" ", " "], {}, [[], ["Non-linear", "Linear, Non-homogeneous", "Linear, Homogeneous"]]),
	new QuestionClass("Classify the following ODE: $y''+\\sin ty'+ty=3t^2$", ["2", "Linear, Non-homogeneous"],
		[" ", " "], {}, [[], ["Non-linear", "Linear, Non-homogeneous", "Linear, Homogeneous"]]),
], [["Order", AnswerType.Exact], AnswerType.MultipleChoice], [undefined, undefined],
	["A natural number: 1, 2, 3, etc.", undefined]);
// Linear ODE, Exact ODE, Separable ODE, Autonomous ODE (all first order)
const classify = new QuestionSet([
	new QuestionClass("Classify the following ODE: $\\; y'=t^2+y^2$", [],
		" ", {}, ["Linear", "Autonomous", "Separable", "Exact"]),
	new QuestionClass("Classify the following ODE: $\\; y'=y^2(1-y)^2$", ["Autonomous"],
		" ", {}, ["Linear", "Autonomous", "Separable", "Exact"]),
	new QuestionClass("Classify the following ODE: $\\; (t^2e^y-1-\\sin t)y'=y\\cos t -2te^y$", ["Exact"],
		" ", {}, ["Linear", "Autonomous", "Separable", "Exact"]),
	new QuestionClass("Classify the following ODE: $\\; (y^2+1)y'=(t^2+1)$", ["Separable", "Exact"],
		" ", {}, ["Linear", "Autonomous", "Separable", "Exact"]),
	new QuestionClass("Classify the following ODE: $\\; e^yy'=0$", ["Autonomous", "Separable", "Exact"],
		" ", {}, ["Linear", "Autonomous", "Separable", "Exact"]),
	new QuestionClass("Classify the following ODE: $\\; y'+e^ty=\\cos t$", ["Linear"],
		" ", {}, ["Linear", "Autonomous", "Separable", "Exact"]),
	new QuestionClass("Classify the following ODE: $\\; y' #3(#1)y=#2 $", ["Linear", "Autonomous"],
		" ", {"1": randIE, "2": randIE, "3": addsub}, ["Linear", "Autonomous", "Separable", "Exact"]),
	new QuestionClass("Classify the following ODE: $\\; y'=e^t\\cos t$", ["Linear", "Separable", "Exact"],
		" ", {}, ["Linear", "Autonomous", "Separable", "Exact"]),
	new QuestionClass("Classify the following ODE: $\\; y'=#1 $", ["Linear", "Autonomous", "Exact", "Separable"],
		" ", { "1": randI }, ["Linear", "Autonomous", "Separable", "Exact"])
], AnswerType.SelectAll);
// Domain of validity
const domainOfValidity = new QuestionSet([
	new QuestionClass("Given a solution $y=\\sqrt{t #4(#3(#1, #2))}$ to the initial value problem " +
		"$y'=\\frac{1}{2y}, \\; y(#1 )=#2 $, what is the domain of validity of the solution?", "#5(#1, #2)", " ",
		{
			"1": randI, "2": randI, "3": (a, b) => b * b - a, "4": addsub,
			"5": (a, b) => "["+(a-b*b)+", \\infty)"
		}),
	new QuestionClass("Given a solution $y=\\frac{1}{#1 t #4(#3(#1, #2))}$ to the initial value problem " +
		"$y'=#5(#1)y^2, \\; y(#2 )=1$, what is the domain of validity of the solution?", "#6(#1, #2)", " ",
		{
			"1": randIE, "2": randI, "3": (a, b) => 1 - a * b, "4": addsub, "5": neg,
			"6": (a, b) => {
				if (a > 0) return "(" + (+(b - 1 / a).toFixed(4)) + ", \\infty)";
				else return "(-\\infty, " + (+(b - 1 / a).toFixed(4)) + ")";
			}
		}),
	new QuestionClass("Given a solution $y=\\frac{1}{#5(#1, #2(#1))}e^{#2 t} #8(#6(#1, #2, #3, #4))e^{#7(#1)t}$ " +
		"to the initial value problem $y' #8(#1)y=e^{#2 t}, \\; y(#3 )=#4 $, what is the domain of validity of the solution?",
		"(-\\infty, \\infty)", " ",
		{
			"1": () => randIntExclude(-4, 4, 0), "2": (a) => randIntExclude(-4, 4, 0, -a), "3": () => randInt(-4, 4), "4": randI, "5": (a, b) => a + b,
			"7": neg, "8": addsub, "6": (a, b, d, f) => +(f*Math.exp(a*d)-1/(a+b)*Math.exp((b+a)*d)).toFixed(2)
		})
], AnswerType.Interval);
const firstDefinitionsTerms = [ordinaryPartial, orderLinear, classify, domainOfValidity];

//-----------------------------------------------------------------------------
// 2nd order ODEs
//-----------------------------------------------------------------------------

// Linear homogeneous with constant coefficients -- 1 all constants
var coefficients = [];
var allCoefficients = [[], [], []];
for (var i = -9; i < 10; i++) {
	for (var j = -9; j < 10; j++) {
		for (var k = -9; k < 10; k++) {
			if (i !== 0 && j !== 0 && k !== 0) {
				var determinant = j * j - 4 * i * k;
				if (determinant > 0) allCoefficients[0].push([i, j, k]);
				else if (determinant === 0) allCoefficients[1].push([i, j, k]);
				else allCoefficients[2].push([i, j, k]);
			}
		}
	}
}
const pickCoefficients = function () {
	const randIndex = randInt(0, 2);
	coefficients = allCoefficients[randIndex][randInt(0, allCoefficients[randIndex].length - 1)];
};
// ay''+by'+c=0, y(0)=f, y'(0)=g, find y(h)
const solveHomogeneousAndFind = function (a, b, c, f, g, h, Y = 0, Yp = 0) {
	var determinant = b * b - 4 * a * c;
	if (determinant > 0) {
		const r1 = (-b + Math.sqrt(determinant)) / (2 * a);
		const r2 = (-b - Math.sqrt(determinant)) / (2 * a);
		const c1 = ((g - Yp) - (f - Y) * r2) / (r1 - r2);
		const c2 = ((f - Y) * r1 - (g - Yp)) / (r1 - r2);
		return +(c1 * Math.exp(r1 * h) + c2 * Math.exp(r2 * h)).toFixed(4);
	}
	else if (determinant === 0) {
		const r = -b / (2 * a);
		const c1 = f - Y;
		const c2 = (g - Yp) - r * (f - Y);
		return +(c1 * Math.exp(r * h) + c2 * h * Math.exp(r * h)).toFixed(4);
	}
	else {
		const l = -b / (2 * a);
		const u = Math.sqrt(-determinant) / (2 * a);
		const c1 = f - Y;
		const c2 = c1 * l / u + (g - Yp) / u;
		return +(c1 * Math.exp(l * h) * Math.cos(u * h) + c2 * Math.exp(l * h) * Math.sin(u * h)).toFixed(4);
	}
}
const solveHomogeneous = function (a, b, c, f, g, Y = 0, Yp = 0) {
	var determinant = b * b - 4 * a * c;
	if (determinant > 0) {
		const r1 = +((-b + Math.sqrt(determinant)) / (2 * a)).toFixed(2);
		const r2 = +((-b - Math.sqrt(determinant)) / (2 * a)).toFixed(2);
		const c1 = +(((g - Yp) - (f - Y) * r2) / (r1 - r2)).toFixed(2);
		const c2 = +(((f - Y) * r1 - (g - Yp)) / (r1 - r2)).toFixed(2);
		return c1 + "e^{" + r1 + "t}" + addsub(c2) + "e^{" + r2 + "t}";
	}
	else if (determinant === 0) {
		const r = +(-b / (2 * a)).toFixed(2);
		const c1 = +(f - Y).toFixed(2);
		const c2 = +((g - Yp) - r * (f - Y)).toFixed(2);
		return c1 + "e^{" + r + "t}" + addsub(c2) + "te^{" + r + "t}";
	}
	else {
		const l = +(-b / (2 * a)).toFixed(2);
		const u = +(Math.sqrt(-determinant) / (2 * a)).toFixed(2);
		const c1 = +(f - Y).toFixed(2);
		const c2 = +(c1 * l / u + (g - Yp) / u).toFixed(2);
		return c1 + "e^{" + l + "t}\\cos(" + u + "t)" + addsub(c2) + "e^{" + l + "t}\\sin(" + u + "t)";
	}
}
const linear2ndHomo = [new QuestionSet([
	new QuestionClass("Solve the initial value problem $#1 y'' #8(#2)y' #8(#3)y=0, \\; y(0)=#4 , \\; y'(0)=#5 $" +
		" and find $y(#6 )$", "#7(#1, #2, #3, #4, #5, #6)", "$y(t)=#9(#1, #2, #3, #4, #5)$",
		{
			"1": () => { pickCoefficients(); return coefficients[0]; }, "2": () => coefficients[1],
			"3": () => coefficients[2], "4": randI, "5": randI, "6": randI, "8": addsub,
			"7": solveHomogeneousAndFind, "9": solveHomogeneous
		})
], AnswerType.Numeric)];

// Linear nonhomogeneous with constant coefficients -- 7 many constants (e^t, sin(t), cos(t), polnyomial, sum, product)
const linear2ndNonHomo = [new QuestionSet([
	// Ae^{Bt}
	new QuestionClass("Solve the initial value problem $#1 y'' #10(#2)y' #10(#3)y=#4 e^{#5 t}, " +
		"\\; y(0)=#6 , \\; y'(0)=#7 $ and find $y(#8 )$", "#9(#1, #2, #3, #4, #5, #6, #7, #8)",
		"$y(t)=#11(#1, #2, #3, #4, #5, #6, #7)$",
		{
			"1": () => { pickCoefficients(); return coefficients[0]; }, "2": () => coefficients[1],
			"3": () => coefficients[2], "4": randIE, "5": randIE, "6": randI,
			"7": randI, "8": randI, "10": addsub, "9": (a, b, c, A, B, f, g, h) => {
				var nonHomo;
				if (a * B * B + b * B + c !== 0) {
					const C = A / (a * B * B + b * B + c);
					nonHomo = C * Math.exp(B * h);
					return +(solveHomogeneousAndFind(a, b, c, f, g, h, C, C*B) + nonHomo).toFixed(4);
				}
				else if (2 * a * B + b !== 0) {
					const C = A / (2 * a * b + b);
					nonHomo = C * h * Math.exp(B * h);
					return +(solveHomogeneousAndFind(a, b, c, f, g, h, 0, C) + nonHomo).toFixed(4);
				}
				else {
					const C = A / (2 * a);
					nonHomo = C * h * h * Math.exp(B * h);
					return +(solveHomogeneousAndFind(a, b, c, f, g, h, 0, 0) + nonHomo).toFixed(4);
				}
			}, "11": (a, b, c, A, B, f, g) => {
				var nonHomo;
				if (a * B * B + b * B + c !== 0) {
					const C = A / (a * B * B + b * B + c);
					nonHomo = addsub(fix(C)) + "e^{" + B + "t}";
					return solveHomogeneous(a, b, c, f, g, C, C * B) + nonHomo;
				}
				else if (2 * a * B + b !== 0) {
					const C = A / (2 * a * b + b);
					nonHomo = addsub(fix(C)) + "te^{" + B + "t}";
					return solveHomogeneous(a, b, c, f, g, 0, C) + nonHomo;
				}
				else {
					const C = A / (2 * a);
					nonHomo = addsub(fix(C)) + "t^2e^{" + B + "t}";
					return solveHomogeneous(a, b, c, f, g, 0, 0) + nonHomo;
				}
			}
		}),
	// A\\sin(Bt)
	new QuestionClass("Solve the initial value problem $#1 y'' #10(#2)y' #10(#3)y=#4 \\sin (#5 t), " +
		"\\; y(0)=#6 , \\; y'(0)=#7 $ and find $y(#8 )$", "#9(#1, #2, #3, #4, #5, #6, #7, #8)",
		"$y(t)=#11(#1, #2, #3, #4, #5, #6, #7)$",
		{
			"1": () => { pickCoefficients(); return coefficients[0]; }, "2": () => coefficients[1],
			"3": () => coefficients[2], "4": randIE, "5": randIE, "6": randI,
			"7": randI, "8": randI, "10": addsub, "9": (a, b, c, A, B, f, g, h) => {
				const G = c - a * B * B;
				const H = b * B;
				const C = A * G / (G * G + H * H);
				const D = -A * H / (G * G + H * H);
				const nonHomo = C * Math.sin(B * h) + D * Math.cos(B * h);
				return +(solveHomogeneousAndFind(a, b, c, f, g, h, D, C * B) + nonHomo).toFixed(4);
			}, "11": (a, b, c, A, B, f, g) => {
				const G = c - a * B * B;
				const H = b * B;
				const C = A * G / (G * G + H * H);
				const D = -A * H / (G * G + H * H);
				const nonHomo = addsub(fix(C)) + "\\sin (" + B + "t)" + addsub(fix(D)) + "\\cos(" + B + "t)";
				return solveHomogeneous(a, b, c, f, g, D, C * B) + nonHomo;
			}
		}),
	// At+B
	new QuestionClass("Solve the initial value problem $#1 y'' #10(#2)y' #10(#3)y=#4 t #10(#5), " +
		"\\; y(0)=#6 , \\; y'(0)=#7 $ and find $y(#8 )$", "#9(#1, #2, #3, #4, #5, #6, #7, #8)",
		"$y(t)=#11(#1, #2, #3, #4, #5, #6, #7)$",
		{
			"1": () => { pickCoefficients(); return coefficients[0]; }, "2": () => coefficients[1],
			"3": () => coefficients[2], "4": randIE, "5": randI, "6": randI,
			"7": randI, "8": randI, "10": addsub, "9": (a, b, c, A, B, f, g, h) => {
				const C = A / c;
				const D = B / c - b * A / (c * c);
				const nonHomo = C * h + D;
				return +(solveHomogeneousAndFind(a, b, c, f, g, h, D, C) + nonHomo).toFixed(4);
			}, "11": (a, b, c, A, B, f, g) => {
				const C = A / c;
				const D = B / c - b * A / (c * c);
				const nonHomo = addsub(fix(C)) + "t" + addsub(fix(D));
				return solveHomogeneous(a, b, c, f, g, D, C) + nonHomo;
			}
		}),
	// At^2+Bt+C
	new QuestionClass("Solve the initial value problem $#1 y'' #10(#2)y' #10(#3)y=#4 t^2 #10(#5) t #10(#12), " +
		"\\; y(0)=#6 , \\; y'(0)=#7 $ and find $y(#8 )$", "#9(#1, #2, #3, #4, #5, #12, #6, #7, #8)",
		"$y(t)=#11(#1, #2, #3, #4, #5, #12, #6, #7)$",
		{
			"1": () => { pickCoefficients(); return coefficients[0]; }, "2": () => coefficients[1],
			"3": () => coefficients[2], "4": randIE, "5": randI, "6": randI, "12": randI,
			"7": randI, "8": randI, "10": addsub, "9": (a, b, c, A, B, C, f, g, h) => {
				const D = A / c;
				const E = B / c - 2 * b * A / (c * c);
				const F = C / c - b * B / (c * c) + 2 * b * b * A / (c * c * c) - 2 * a * A / (c * c);
				const nonHomo = D * h * h + E * h + F;
				return +(solveHomogeneousAndFind(a, b, c, f, g, h, F, E) + nonHomo).toFixed(4);
			}, "11": (a, b, c, A, B, C, f, g) => {
				const D = +(A / c).toFixed(2);
				const E = B / c - 2 * b * A / (c * c);
				const F = C / c - b * B / (c * c) + 2 * b * b * A / (c * c * c) - 2 * a * A / (c * c);
				const nonHomo = addsub(D) + "t^2" + addsub(fix(E)) + "t" + addsub(fix(F));
				return solveHomogeneous(a, b, c, f, g, F, E) + nonHomo;
			}
		}),
	// Ae^{Bt}\\cos(Ct)
	// Technically, if B+Ci is a solution to the characteristic equation, then we have to multiply our 
	// guess by t, but the algebraic computation for this in general is hard and long, and it is 
	// unlikely to occur, so we ignore this case for now
	new QuestionClass("Solve the initial value problem $#1 y'' #10(#2)y' #10(#3)y=#4 e^{#5 t}\\cos(#12 t), " +
		"\\; y(0)=#6 , \\; y'(0)=#7 $ and find $y(#8 )$", "#9(#1, #2, #3, #4, #5, #12, #6, #7, #8)",
		"$y(t)=#11(#1, #2, #3, #4, #5, #12, #6, #7)$",
		{
			"1": () => { pickCoefficients(); return coefficients[0]; }, "2": () => coefficients[1],
			"3": () => coefficients[2], "4": randIE, "5": randIE, "6": randI, "12": randIE,
			"7": randI, "8": randI, "10": addsub, "9": (a, b, c, A, B, C, f, g, h) => {
				const G = a * B * B + b * B + c - a * C * C;
				const H = 2 * a * B * C + b * C;
				const D = A * G / (G * G + H * H);
				const E = A * H / (G * G + H * H);
				const nonHomo = D * Math.exp(B * h) * Math.cos(C * h) + E * Math.exp(B * h) * Math.sin(C * h);
				return +(solveHomogeneousAndFind(a, b, c, f, g, h, D, B * D + C * E) + nonHomo).toFixed(4);
			}, "11": (a, b, c, A, B, C, f, g) => {
				const G = a * B * B + b * B + c - a * C * C;
				const H = 2 * a * B * C + b * C;
				const D = A * G / (G * G + H * H);
				const E = A * H / (G * G + H * H);
				const nonHomo = addsub(fix(D)) + "e^{" + B + "t}\\cos(" + C + "t)" + addsub(fix(E)) + "e^{" + B +"t}\\sin("+C+"t)";
				return solveHomogeneous(a, b, c, f, g, D, B * D + C * E) + nonHomo;
			}
		}),
	// Ate^{Bt}
	new QuestionClass("Solve the initial value problem $#1 y'' #10(#2)y' #10(#3)y=#4 te^{#5 t}, " +
		"\\; y(0)=#6 , \\; y'(0)=#7 $ and find $y(#8 )$", "#9(#1, #2, #3, #4, #5, #6, #7, #8)",
		"$y(t)=#11(#1, #2, #3, #4, #5, #6, #7)$",
		{
			"1": () => { pickCoefficients(); return coefficients[0]; }, "2": () => coefficients[1],
			"3": () => coefficients[2], "4": randIE, "5": randIE, "6": randI,
			"7": randI, "8": randI, "10": addsub, "9": (a, b, c, A, B, f, g, h) => {
				var nonHomo;
				if (a * B * B + b * B + c !== 0) {
					const evCE = a * B * B + b * B + c;
					const C = A / evCE;
					const D = -A * (2 * a * B + b) / (evCE ** 2);
					nonHomo = (C * h + D) * Math.exp(B * h);
					return +(solveHomogeneousAndFind(a, b, c, f, g, h, D, B * D + C) + nonHomo).toFixed(2);
				}
				else if (2 * a * B + b !== 0) {
					const C = A / (2 * (2 * a * B + b));
					const D = -a * A / ((2 * a * B + b) ** 2);
					nonHomo = (C * h * h + D * h) * Math.exp(B * h);
					return +(solveHomogeneousAndFind(a, b, c, f, g, h, 0, D) + nonHomo).toFixed(2);
				}
				else {
					const C = A / (6 * a);
					nonHomo = C * (h ** 3) * Math.exp(B * h);
				}
				return +(solveHomogeneousAndFind(a, b, c, f, g, h, 0, 0) + nonHomo).toFixed(2);
			}, "11": (a, b, c, A, B, f, g) => {
				var nonHomo;
				if (a * B * B + b * B + c !== 0) {
					const evCE = a * B * B + b * B + c;
					const C = A / evCE;
					const D = -A * (2 * a * B + b) / (evCE ** 2);
					nonHomo = "+(" + fix(C) + "t" + addsub(fix(D)) + ")e^{" + B + "t}";
					return solveHomogeneous(a, b, c, f, g, D, B * D + C) + nonHomo;
				}
				else if (2 * a * B + b !== 0) {
					const C = A / (2 * (2 * a * B + b));
					const D = -a * A / ((2 * a * B + b) ** 2);
					nonHomo = "+(" + fix(C) + "t^2" + addsub(fix(D)) + "t)e^{" + B + "t}";
					return solveHomogeneous(a, b, c, f, g, 0, D) + nonHomo;
				}
				else {
					const C = A / (6 * a);
					nonHomo = addsub(fix(C)) + "t^3e^{" + B + "t}";
					return solveHomogeneous(a, b, c, f, g, 0, 0) + nonHomo;
				}
			}
		}),
	// Ae^{Bt}+Ct+D
	new QuestionClass("Solve the initial value problem $#1 y'' #10(#2)y' #10(#3)y=#4 e^{#5 t} #10(#12)t #10(#13), " +
		"\\; y(0)=#6 , \\; y'(0)=#7 $ and find $y(#8 )$", "#9(#1, #2, #3, #4, #5, #12, #13, #6, #7, #8)",
		"$y(t)=#11(#1, #2, #3, #4, #5, #12, #13, #6, #7)$",
		{
			"1": () => { pickCoefficients(); return coefficients[0]; }, "2": () => coefficients[1],
			"3": () => coefficients[2], "4": randIE, "5": randIE, "6": randI, "12": randIE, "13": randIE,
			"7": randI, "8": randI, "10": addsub, "9": (a, b, c, A, B, C, D, f, g, h) => {
				const F = C / c;
				const G = D / c - b * C / (c * c);
				var nonHomo = F * h + G;
				if (a * B * B + b * B + c !== 0) {
					const E = A / (a * B * B + b * B + c);
					nonHomo += E * Math.exp(B * h);
					return +(solveHomogeneousAndFind(a, b, c, f, g, h, G + E, F + B * E) + nonHomo).toFixed(4);
				}
				else if (2 * a * B + b !== 0) {
					const E = A / (2 * a * B + b);
					nonHomo += E * h * Math.exp(B * h);
					return +(solveHomogeneousAndFind(a, b, c, f, g, h, G, F + E) + nonHomo).toFixed(4);
				}
				else {
					const E = A / (2 * a);
					nonHomo += E * h * h * Math.exp(B * h);
					return +(solveHomogeneousAndFind(a, b, c, f, g, h, G, F) + nonHomo).toFixed(4);
				}
			}, "11": (a, b, c, A, B, C, D, f, g) => {
				const F = C / c;
				const G = D / c - b * C / (c * c);
				var homo;
				var nonHomo = "";
				if (a * B * B + b * B + c !== 0) {
					const E = A / (a * B * B + b * B + c);
					nonHomo += addsub(fix(E)) + "e^{" + B + "t}";
					homo = solveHomogeneous(a, b, c, f, g, G + E, F + B * E);
				}
				else if (2 * a * B + b !== 0) {
					const E = A / (2 * a * B + b);
					nonHomo += addsub(fix(E)) + "te^{" + B + "t}";
					homo = solveHomogeneous(a, b, c, f, g, G, F + E);
				}
				else {
					const E = A / (2 * a);
					nonHomo += addsub(fix(E)) + "t^2e^{" + B + "t}";
					homo = solveHomogeneous(a, b, c, f, g, G, F);
				}
				nonHomo += addsub(fix(F)) + "t" + addsub(fix(G));
				return homo + nonHomo;
			}
		})
], AnswerType.Numeric)];

// Reduction of order -- 2 few constants
const reductionOfOrder = [new QuestionSet([
	new QuestionClass("Given that $y_1(t)=t$ is a solution of $t^2y'' #6(#1)ty' #6(#7(#1))y=0, \\; t > 0$"+
		", solve the initial value problem with $y(1)=#2 , \\; y'(1)=#3 $ and find $y(#4 )$",
		"#5(#1, #2, #3, #4)", "$y(t)=#8(#1, #2, #3)t #6(#9(#1, #2, #3))t^{#7(#1)}$",
		{
			"1": () => randIntExclude(-9, 9, 0, -1), "2": randI, "3": randI, "4": () => randInt(2, 9),
			"6": addsub, "7": neg, 
			"5": (a, b, d, f) => {
				const c2 = (b - d) / (a + 1);
				const c1 = b - c2;
				return +(c1 * f + c2 * (f ** -a)).toFixed(4);
			}, "8": (a, b, d) => +(b - (b - d) / (a + 1)).toFixed(2),
			"9": (a, b, d) => +((b - d) / (a + 1)).toFixed(2)
		}),
	new QuestionClass("Given that $y_1(t)=t^{-1}$ is a solution of $t^2y'' #6(#1)ty' #6(#7(#1))y=0, \\; t>0$" +
		", solve the initial value problem with $y(1)=#2 , \\; y'(1)=#3 $ and find $y(#4 )$",
		"#5(#1, #2, #3, #4)", "$y(t)=#8(#1, #2, #3)t^{-1} #6(#9(#1, #2, #2))t^{#10(#1)}$",
		{
			"1": () => randIntExclude(-7, 9, 0, 2, 3), "2": randI, "3": randI,
			"4": () => randInt(2, 9), "6": addsub, "7": (a) => a - 2, "10": (a) => 2 - a,
			"5": (a, b, d, f) => {
				const c2 = (b + d) / (3 - a);
				const c1 = b - c2;
				return +(c1 / f + c2 * (f ** (2 - a))).toFixed(4);
			}, "8": (a, b, d) => +(b + (b + d) / (a - 3)).toFixed(2),
			"9": (a, b, d) => +((b + d) / (3 - a)).toFixed(2)
		})
], AnswerType.Numeric)];

// Variation of parameters -- 2 few constants
const variationParameters2nd = [new QuestionSet([
	new QuestionClass("Solve the initial value problem $y''+y=\\tan t, \\; y(0)=#1 , \\; y'(0)=#2 $ " +
		"and find $y(#8(#3))$", "#4(#1, #2, #3)", "$y(t)=#1 \\cos t #7(#6(#2)) \\sin t-\\cos t \\ln(\\sec t+\\tan t)$",
		{
			"1": randI, "2": randI, "3": () => {
				var allFracs = [1 / 4, 1 / 3];
				return allFracs[randInt(0, 1)] * Math.PI;
			}, "7": addsub, "6": (b) => b + 1, "8": piFracStr,
			"4": (a, b, d) => +(a * Math.cos(d) + (b + 1) * Math.sin(d) + Math.cos(d) * Math.log(Math.cos(d) / (1 + Math.sin(d)))).toFixed(4)
		}),
	new QuestionClass("Solve the initial value problem $y'' #8(#7(#1))y'+#9(#1)y=t^{-2}e^{#6(#1)t}, \\;"+
		" y(1)=#2 ,\\;y'(1)=#3 $ and find $y(#4 )$", "#5(#1, #2, #3, #4)",
		"$y(t)=#10(#1, #2, #3) e^{#6 t} #8(#11(#1, #2, #3))te^{#6 t}-e^{#6 t}\\ln t$",
		{
			"1": () => randInt(1, 4), "2": randI, "3": randI, "4": () => randInt(2, 5),
			"6": neg, "7": (a) => 2 * a, "8": addsub, "9": (a) => a * a, "5": (a, b, c, d) => {
				const c1 = (1 - a) * b * Math.exp(a) - c * Math.exp(a) - 1;
				const c2 = a * b * Math.exp(a) + c * Math.exp(a) + 1;
				return +(c1 * Math.exp(-a * d) + c2 * d * Math.exp(-a * d) - Math.exp(-a * d) * Math.log(d)).toFixed(4);
			}, "10": (a, b, c) => +((1 - a) * b * Math.exp(a) - c * Math.exp(a) - 1).toFixed(2),
			"11": (a, b, c) => +(a * b * Math.exp(a) + c * Math.exp(a) + 1).toFixed(2)
		})
], AnswerType.Numeric)];

// Laplace Transform -- 6 few constants
const step = function (c, t) {
	if (t >= c) return 1;
	else return 0;
}
var allLT2Coefficients = [];
for (var i = 0; i < allCoefficients[0].length; i++) {
	var coeffs = allCoefficients[0][i];
	if (coeffs[0] === 1) {
		const determinant = coeffs[1] * coeffs[1] - 4 * coeffs[2];
		const r1 = -coeffs[1] + Math.sqrt(determinant);
		const r2 = -coeffs[1] - Math.sqrt(determinant);
		if (r1 % 2 === 0 && r2 % 2 === 0) {
			allLT2Coefficients.push([coeffs[0], coeffs[1], coeffs[2], [r1/2, r2/2]]);
		}
	}
}
const pickCoefficientsLT2 = function () {
	coefficients = allLT2Coefficients[randInt(0, allLT2Coefficients.length - 1)];
}
var allLT4Coefficients = [];
for (var i = 0; i < allCoefficients[2].length; i++) {
	var coeffs = allCoefficients[2][i];
	if (coeffs[0] === 1) {
		const nDeterminant = -(coeffs[1] * coeffs[1] - 4 * coeffs[2]);
		if (coeffs[1] % 2 === 0 && Math.sqrt(nDeterminant) % 2 === 0) {
			allLT4Coefficients.push([coeffs[0], coeffs[1], coeffs[2], [-coeffs[1] / 2, Math.sqrt(nDeterminant) / 2]]);
		}
	}
}
const pickCoefficientsLT4 = function () {
	coefficients = allLT4Coefficients[randInt(0, allLT4Coefficients.length - 1)];
}
const laplaceTransform = [new QuestionSet([
	new QuestionClass("Solve the initial value problem $y''+y=f(t), \\; y(0)=#1 , \\; y'(0)=#2 , \\; " +
		"f(t)=\\left\\{\\begin{array}{rr}1, & 0\\leq t < 3\\pi \\\\ 0, & 3\\pi\\leq t <\\infty\\end{array}\\right.$ and find $y(#6(#5))$.",
		"#3(#1, #2, #5)", "$y(t)=#1 \\cos t #4(#2)\\sin t+1-\\sin t-u_{3\\pi}(t)[1-\\sin(t-3\\pi)] \\\\ "+
		"Y(s)=\\frac{#1 s #4(#2)}{s^2+1}+\\frac{1-e^{-3\\pi s}}{s(s^2+1)}$",
		{
			"1": randI, "2": randI, "5": () => randIntExclude(1, 12, 6), "6": (c) => {
				if (c === 0) return "\\pi/2";
				else if (c % 2 === 0) return c / 2 + "\\pi";
				else return c + "\\pi/2";
			}, "4": addsub,
			"3": (a, b, c) => {
				const d = c / 2 * Math.PI;
				return +(a * Math.cos(d) + b * Math.sin(d) + 1 - Math.sin(d) - step(3 * Math.PI, d) * (1 - Math.sin(d - 3 * Math.PI))).toFixed(4);
			}
		}),
	new QuestionClass("Solve the initial value problem $y'' #8(#1)y' #8(#2)y=u_2(t), \\; y(0)=#3 , \\; y'(0)=#4 $"+
		" and find $y(#5 )$.", "#6(#1, #2, #3, #4, #5)", "$y(t)=#7(#1, #2, #3, #4) \\\\ Y(s)=#9(#1, #2, #3, #4)$",
		{
			"1": () => { pickCoefficientsLT2(); return coefficients[1]; }, "2": () => coefficients[2],
			"3": randI, "4": randI, "5": () => randInt(1, 9), "8": addsub, "6": (a, b, c, d, f) => {
				const r = coefficients[3];
				const A1 = (r[0] * c + d + a * c) / (r[0] - r[1]);
				const B1 = (r[1] * c + d + a * c) / (r[1] - r[0]);
				const A = 1 / (r[0] * r[1]);
				const B = 1 / (r[0] * (r[0] - r[1]));
				const C = 1 / (r[1] * (r[1] - r[0]));
				return +(A1 * Math.exp(r[0] * f) + B1 * Math.exp(r[1] * f) +
					step(2, f) * (A + B * Math.exp((f - 2) * r[0]) + C * Math.exp((f - 2) * r[1]))).toFixed(4);
			}, "7": (a, b, c, d) => {
				const r = coefficients[3];
				return "\\frac{" + (r[0] * c + d + a * c) + "}{" + (r[0] - r[1]) + "}e^{" + r[0] + "t}+" +
					"\\frac{" + (r[1] * c + d + a * c) + "}{" + (r[1] - r[0]) + "}e^{" + r[1] + "t}+" +
					"u_2(t)\\left[\\frac{1}{" + (r[0] * r[1]) + "}+\\frac{e^{" + (-2 * r[0]) + "}}{" + (r[0] * (r[0] - r[1])) + "}e^{" + r[0] + "t}+" +
					"\\frac{e^{" + (-2 * r[1]) + "}}{" + (r[1] * (r[1] - r[0])) + "}e^{" + r[1] + "t}\\right]";
			}, "9": (a, b, c, d) => {
				const r = coefficients[3];
				return "\\frac{e^{-2s}}{s(s^2" + addsub(a) + "s" + addsub(b) + ")}+" +
					"\\frac{ " + c + "s" + addsub((d + a * c)) + " } { (s" + addsub(-r[0]) + ") (s" + addsub(-r[1]) + ") } ";
			}
		}),
	new QuestionClass("Solve the initial value problem $y''+#6(#1)y=g(t), \\; y(0)=#2 , \\; y'(0)=#3 , \\; "+
		"g(t)=\\left\\{\\begin{array}{ll}t/2, & 0\\leq t < 6 \\\\ 3, & t\\geq 6\\end{array}\\right.$ and find $y(#4 )$.",
		"#5(#1, #2, #3, #4)", "$y(t)=#2 \\cos(#1 t)+\\frac{#3 }{#1 }\\sin(#1 t)+\\frac{1}{#7(#1)}t-\\frac{1}{#8(#1)}\\sin(#1 t)"+
		"-u_6(t)\\left[\\frac{1}{#7 }(t-6)-\\frac{1}{#8 }\\sin(#1 (t-6))\\right]\\\\ Y(s)=\\frac{\\frac{1}{2}-\\frac{1}{2}e^{-6s}}{s^2(s^2+#6 )}+\\frac{#2 s #9(#3)}{s^2+#6 }$",
		{
			"1": () => randInt(1, 3), "2": randI, "3": randI, "4": () => randInt(1, 10), "6": (a) => a * a,
			"5": (a, b, c, d) => {
				return +(b * Math.cos(a * d) + c / a * Math.sin(a * d) + 1 / (2 * a * a) * d - 1 / (2 * a * a * a) * Math.sin(a * d)
					- 1 / (2 * a * a) * step(6, d) * (d - 6 - 1 / a * Math.sin(a * d - 6 * a))).toFixed(4);
			}, "7": (a) => 2 * a * a, "8": (a) => 2 * a * a * a, "9": addsub
		}),
	new QuestionClass("Solve the initial value problem $y'' #10(#1)y' #10(#2)y=\\delta(t-\\pi), \\; y(0)=#3 , \\; y'(0)=#4 $ " +
		"and find $y(#6(#5))$.", "#7(#1, #3, #4, #5)", "$y(t)=#8(#1, #3, #4) \\\\ Y(s)=#9(#1, #3, #4)$",
		{
			"1": () => { pickCoefficientsLT4(); return coefficients[1]; }, "2": () => coefficients[2], "3": randI, "4": randI,
			"5": () => randIntExclude(1, 8, 2), "10": addsub, "6": (e) => {
				if (e === 1) return "\\pi/2";
				else if (e % 2 === 0) return e / 2 + "\\pi";
				else return e + "\\pi/2";
			}, "7": (a, c, d, e) => {
				const f = e / 2 * Math.PI;
				const l = coefficients[3][0];
				const u = coefficients[3][1];
				return +(c * Math.exp(l * f) * Math.cos(u * f) + (d + c * l + c * a) / u * Math.exp(l * f) * Math.sin(u * f) +
					step(Math.PI, f) / u * Math.exp(l * f - l * Math.PI) * Math.sin(u * f - u * Math.PI)).toFixed(4);
			}, "8": (a, c, d) => {
				const l = coefficients[3][0];
				const u = coefficients[3][1];
				return c + "e^{" + l + "t}\\cos(" + u + "t) " + addsub((d + c * (l + a)) / u) + "e^{" + l + "t}\\sin(" + u + "t)+" +
					"\\frac{1}{"+u+"}u_\\pi(t)e^{" + l + "t " + addsub(-l) + "\\pi}\\sin(" + u + "t " + addsub(-u) + "\\pi)";
			}, "9": (a, c, d) => {
				const l = coefficients[3][0];
				const u2 = coefficients[3][1] * coefficients[3][1];
				const denom = "(s" + addsub(-l) + ")^2+" + u2 + "";
				return "\\frac{e^{-\\pi s}}{" + denom + "}+\\frac{" + c + "(s" + addsub(-l) + ")}{" + denom + "}+" +
					"\\frac{" + (d + c * (l + a)) + "}{" + denom + "}";
			}
		}),
	new QuestionClass("Solve the initial value problem $y'' #7(#1)y=\\delta(t-2\\pi)\\cos t, \\; y(0)=#2 , \\; y'(0)=#3 $ " +
		"and find $y(#5(#4))$.", "#6(#1, #2, #3, #4)", "$y(t)=#2 \\cos(#1 t)+\\frac{#3 }{#1 }\\sin(#1 t)+\\frac{1}{#1 }u_{2\\pi}(t)\\sin(#1 t #7(#8(#1))\\pi)"+
		"\\\\ Y(s)=\\frac{e^{-2\\pi s}}{s^2+#9(#1)}+\\frac{#2 s}{s^2+#9 }+\\frac{#3 }{s^2+#9 }$",
		{
			"1": () => randInt(1, 3), "2": randI, "3": randI, "4": () => randInt(1, 14, 4), "5": (d) => {
				if (d === 1) return "\\pi/2";
				else if (d % 2 === 0) return d / 2 + "\\pi";
				else return d + "\\pi/2";
			}, "7": addsub, "6": (a, b, c, d) => {
				const f = d / 2 * Math.PI;
				return +(b * Math.cos(a * f) + c / a * Math.sin(a * f) + 1 / a * step(2 * Math.PI, f) * Math.sin(a * f - 2 * a * Math.PI)).toFixed(4);
			}, "8": (a) => 2 * a, "9": (a) => a*a
		}),
	new QuestionClass("Solve the initial value problem $y^{(4)}-y=\\delta(t-1), \\; y(0)=#1 , \\; y'(0)=#2 , " +
		"\\; y''(0)=#3 , \\; y'''(0)=#4 $ and find $y(#5 )$", "#6(#1, #2, #3, #4, #5)", "$y(t)=#7(#1, #2, #3, #4) \\\\ Y(s)=#8(#1, #2, #3, #4)$",
		{
			"1": randI, "2": randI, "3": randI, "4": randI, "5": () => randInt(1, 5), "6": (a, b, c, d, f) => {
				const A = (a - c) / 2;
				const B = (b - d) / 2;
				const C = (a - b + c - d) / 4;
				const D = (a + b + c + d) / 4;
				return +(A * Math.cos(f) + B * Math.sin(f) + C * Math.exp(-f) + D * Math.exp(f) +
					step(1, f) * (-1 / 2 * Math.sin(f - 1) - 1 / 4 * Math.exp(-f + 1) + 1 / 4 * Math.exp(f - 1))).toFixed(4);
			}, "7": (a, b, c, d) => {
				return "\\frac{" + (a - c) + "}{2}\\cos t+\\frac{" + (b - d) + "}{2}\\sin t+\\frac{" + (a - b + c - d) + "}{4}e^{-t}+" +
					"\\frac{" + (a + b + c + d) + "}{4}e^t+u_1(t)\\left[-\\frac{1}{2}\\sin(t-1)-\\frac{1}{4}e^{-t+1}+\\frac{1}{4}e^{t-1}\\right]";
			}, "8": (a, b, c, d) => {
				return "\\frac{ " + a + "s ^ 3" + addsub(b) + "s ^ 2"+addsub(c)+"s"+addsub(d)+" } { (s ^ 2 + 1)(s + 1)(s - 1) }+\\frac{e^{-s}}{(s^2+1)(s+1)(s-1)}";
			}
		})
], AnswerType.Numeric)];

// Solution by Power Series -- 3 moderate constants
var allEECoefficients = [[], [], []];
for (var i = -6; i < 7; i++) {
	for (var j = -6; j < 7; j++) {
		if (i !== 0 && j !== 0) {
			var determinant = (i - 1) ** 2 - 4 * j;
			if (determinant > 0 && Math.abs(i - 1) !== Math.sqrt(determinant) && Number.isInteger(Math.sqrt(determinant))) {
				allEECoefficients[0].push([i, j, 0, [-(i - 1) / 2 + Math.sqrt(determinant) / 2, -(i - 1) / 2 - Math.sqrt(determinant) / 2]]);
			}
			else if (determinant === 0 && i !== 1) {
				allEECoefficients[1].push([i, j, 1, [-(i - 1) / 2]]);
			}
			else if (determinant < 0 && Number.isInteger(Math.sqrt(-determinant))) {
				allEECoefficients[2].push([i, j, 2, [-(i - 1) / 2, Math.sqrt(-determinant) / 2]]);
			}
		}
	}
}
const pickCoefficientsEE = function () {
	const randIndex = randInt(0, 2);
	coefficients = allEECoefficients[randIndex][randInt(0, allEECoefficients[randIndex].length - 1)];
}
const evaluateByTerms = function (a0, a1, t, recRel) {
	var sum = 0;
	var an = a0;
	var an1 = a1;
	var prevTerm = a0;
	var term = a1 * t;
	var n = 2;
	sum = prevTerm + term;
	while (Math.abs(term) > 0.00001 || Math.abs(prevTerm) > 0.00001) {
		var aNext = recRel(an, an1, n - 2);
		prevTerm = term;
		term = aNext * (t ** n);
		sum += term;
		n++;
		an = an1;
		an1 = aNext;
	}
	return sum;
}
const ordinaryPointSeries = new QuestionSet([
	new QuestionClass("Solve the initial value problem $y''+ty #9(#1)y=0, \\; y(0)=#2 , \\; y'(0)=#3 $ and find $y(#4 )$.",
		"#5(#1, #2, #3, #4)", "$a_{n+2}=-\\frac{n #9 }{(n+2)(n+1)}a_n$",
		{
			"1": () => randIntExclude(-4, 4, 0), "2": () => randInt(-4, 4), "3": () => randInt(-4, 4), "4": () => randIntExclude(-4, 4, 0) / 10,
			"9": addsub, "5": (a, b, c, d) => +(evaluateByTerms(b, c, d, (an, an1, n) => -((n + a) / ((n + 2) * (n + 1))) * an)).toFixed(4)
		}),
	new QuestionClass("Solve the initial value problem $#1 y''+(t+1)y' #9(#2)y=0, \\; y(2)=#3 , \\; y'(2)=#4 $ and find $y(#5 )$.",
		"#6(#1, #2, #3, #4, #5)", "$a_{n+2}=-\\frac{3a_{n+1}}{#1 (n+2)}-\\frac{(n #9(#2))a_n}{#1 (n+2)(n+1)}$",
		{
			"1": () => randIntExclude(-4, 4, 0), "2": () => randIntExclude(-4, 4, 0), "3": () => randInt(-4, 4),
			"4": () => randInt(-4, 4), "5": () => 2 + randIntExclude(-3, 3, 0) / 10, "9": addsub,
			"6": (a, b, c, d, e) => +(evaluateByTerms(c, d, e, (an, an1, n) => -3 * an1 / (a * (n + 2)) - (n + b) * an / (a * (n + 2) * (n + 1)))).toFixed(4)
		})
], AnswerType.Numeric);
const singularPointSeries = new QuestionSet([
	new QuestionClass("Solve the initial value problem $t^2y'' #9(#1)ty' #9(#2)y=0, \\; y(1)=#3 , \\; y'(1)=#4 $ and find $y(#5 )$.",
		"#6(#3, #4, #5)", "$y(t)=#7(#3, #4)$",
		{
			"1": () => { pickCoefficientsEE(); return coefficients[0]; }, "2": () => coefficients[1], "3": () => randInt(-4, 4),
			"4": () => randInt(-4, 4), "5": () => +(randInt(1, 4) / 10).toFixed(1), "9": addsub, "6": (c, d, f) => {
				const b = [c, d];
				const r = coefficients[3];
				if (coefficients[2] === 0) {
					// y=c1 t^{r1}+ c2 t^{r2}
					var A = [[1, 1], [r[0], r[1]]];
					const c = rref(A, b);
					return +(c[0] * (f ** r[0]) + c[1] * (f ** r[1])).toFixed(4);
				}
				else if (coefficients[2] === 1) {
					// y=c1 t^r + c2 t^r ln(t)
					var A = [[1, 0], [r[0], 1]];
					const c = rref(A, b);
					return +((f ** r[0]) * (c[0] + c[1] * Math.log(f))).toFixed(4);
				}
				else {
					// y= c1 t^l cos(u ln(t))+ c2 t^l sin(u ln(t))
					var A = [[1, 0], [r[0], r[1]]];
					const c = rref(A, b);
					return +(c[0] * (f ** r[0]) * Math.cos(r[1] * Math.log(f)) + c[1] * (f ** r[0]) * Math.sin(r[1] * Math.log(f))).toFixed(4);
				}
			}, "7": (c, d) => {
				const b = [c, d];
				const r = coefficients[3];
				if (coefficients[2] === 0) {
					// y=c1 t^{r1}+ c2 t^{r2}
					var A = [[1, 1], [r[0], r[1]]];
					const c = rref(A, b);
					return +(c[0]).toFixed(2)+"t^{"+r[0]+"}" + addsub(+(c[1]).toFixed(2))+"t^{"+r[1]+"}";
				}
				else if (coefficients[2] === 1) {
					// y=c1 t^r + c2 t^r ln(t)
					var A = [[1, 0], [r[0], 1]];
					const c = rref(A, b);
					return "t^{"+r[0]+"}("+ +(c[0]).toFixed(2) + addsub(+(c[1]).toFixed(2))+"\\ln t)";
				}
				else {
					// y= c1 t^l cos(u ln(t))+ c2 t^l sin(u ln(t))
					var A = [[1, 0], [r[0], r[1]]];
					const c = rref(A, b);
					return +(c[0]).toFixed(2) + "t^{" + r[0] + "}\\cos(" + r[1] + "\\ln t)" + addsub(+(c[1]).toFixed(2)) + "t^{" + r[0] + "}\\sin(" + r[1] + "\\ln t)";
				}
			}
		})
], AnswerType.Numeric);
const powerSeries = [ordinaryPointSeries, singularPointSeries];

// Definitions/terms
// Wronskian/Linearly dependent and independent
const wronskian = new QuestionSet([
	new QuestionClass("Do the solutions $y_1(t)=\\cos t, \\; y_2(t)=\\sin t$ form a " +
		"fundamental solution set for a 2nd order ODE?", "Yes", " ", {}, ["Yes", "No"]),
	new QuestionClass("Do the solutions $y_1(t)=e^{2t}, \\; y_2(t)=2e^{2t}$ form a " +
		"fundamental solution set for a 2nd order ODE?", "No", " ", {}, ["Yes", "No"]),
	new QuestionClass("Do the solutions $y_1(t)=#4 t^{#1 }, \\; y_2(t)=#5 t^{#2 }$ form a " +
		"fundamental solution set for a 2nd order ODE?", "#3(#1, #2)", " ", {
		"1": () => randIntExclude(-1, 2, 0), "2": () => randIntExclude(-1, 2, 0),
		"3": (a, b) => {
			if (a === b) return "No";
			else return "Yes";
		}, "4": randIE, "5": randIE
	}, ["Yes", "No"]),
	new QuestionClass("Do the solutions $y_1(t)=t^2, \\; y_2(t)=\\sin t, \\; y_3(t)=e^t$ form a " +
		"fundamental solution set for a 3rd order ODE?", "Yes", " ", {}, ["Yes", "No"]),
], AnswerType.MultipleChoice);
// Characteristic equation
const charEquation = new QuestionSet([
	new QuestionClass("Find the characteristic equation of the ODE $#1 y' #5(#2)y=e^t$ and evaluate the " +
		"characeristic polynomial $Z(r)$ at $r=#3 $", "#4(#1, #2, #3)", "$#1 r #5(#2)=0$",
		{
			"1": randIE, "2": randI, "3": randI, "5": addsub,
			"4": (a, b, r) => a * r + b
		}),
	new QuestionClass("Find the characteristic equation of the ODE $#1 y'' #6(#2)y' #6(#3)=\\cos t$ and evaluate the " +
		"characeristic polynomial $Z(r)$ at $r=#4 $", "#5(#1, #2, #3, #4)", "$#1 r^2 #6(#2)r #6(#3)=0$",
		{
			"1": randIE, "2": randI, "3": randI, "4": randI, "6": addsub,
			"5": (a, b, c, r) => a * r * r + b * r + c
		}),
	new QuestionClass("Find the characteristic equation of the ODE $#1 y''' #7(#2)y'' #7(#3)y' #7(#4)=0$ and evaluate the " +
		"characeristic polynomial $Z(r)$ at $r=#5 $", "#6(#1, #2, #3, #4, #5)", "$#1 r^3 #7(#2)r^2 #7(#3)r #7(#4)=0$",
		{
			"1": randIE, "2": randI, "3": randI, "4": randI, "5": randI, "7": addsub,
			"6": (a, b, c, d, r) => a * r * r * r + b * r * r + c * r + d
		})
], AnswerType.Numeric);
// Analytic function
const analyticFunction = new QuestionSet([
	new QuestionClass("Select all points at which the function $f(x)=#1 xe^x$ is analytic.",
		["1", "2", "3", "4"], " ",
		{
			"1": randIE, "2": randIE, "3": (a) => randIntExclude(-9, 9, 0, a),
			"4": (a, b) => randIntExclude(-9, 9, 0, a, b)
		}, [new Option("1", "#2 "), new Option("2", "#3(#2)"), new Option("3", "0"), new Option("4", "#4(#2, #3)")]),
	new QuestionClass("Select all points at which the function $f(x)=\\cos x$ is analytic.",
		["1", "2", "3", "4"], " ",
		{ "1": randIE, "2": (a) => randIntExclude(-9, 9, 0, a), "3": (a, b) => randIntExclude(-9, 9, 0, a, b) },
		[new Option("1", "#1 "), new Option("2", "#2(#1)"), new Option("3", "0"), new Option("4", "#3(#1, #2)")]),
	new QuestionClass("Select all points at which the function $f(x)=|x|$ is analytic.",
		["1", "2", "4"], " ",
		{ "1": randIE, "2": (a) => randIntExclude(-9, 9, 0, a), "3": (a, b) => randIntExclude(-9, 9, 0, a, b) },
		[new Option("1", "#1 "), new Option("2", "#2(#1)"), new Option("3", "0"), new Option("4", "#3(#1, #2)")]),
	new QuestionClass("Select all points at which the function $f(x)=\\frac{x^2+1}{(x #4(#1))(x #4(#2(#1)))}$ is analytic.",
		["3", "4"], " ",
		{ "1": randIE, "2": (a) => randIntExclude(-9, 9, 0, a), "3": (a, b) => randIntExclude(-9, 9, 0, a, b), "4": addsub },
		[new Option("2", "#2 "), new Option("3", "0"), new Option("4", "#3(#1, #2)"), new Option("1", "#1 ")])
], AnswerType.SelectAll);
// Ordinary Points, Regular/Irregular Singular Points
const ordinarySingularPoints = new QuestionSet([
	// 2 Ordinary Points, 2 Regular Singular Points, 2 Irregular Singular Points
	new QuestionClass("Given $xy''+(1-x)y'+xy$, classify the point $x_0=0$", "Regular", "", {},
		[new Option("Ordinary", "Ordinary Point"), new Option("Regular", "Regular Singular Point"),
		new Option("Irregular", "Irregular Singular Point")]),
	new QuestionClass("Given $(x #5(#1))^2 (x #5(#2(#1)))y''+3(x #5(#2))y'-2(x #5(#1))y$, classify the point $x_0=#3(#2)$", "Regular", "",
		{"1": randIE, "2": (a) => randIntExclude(-9, 9, 0, a), "3": neg, "5": addsub},
		[new Option("Ordinary", "Ordinary Point"), new Option("Regular", "Regular Singular Point"),
		new Option("Irregular", "Irregular Singular Point")]),
	new QuestionClass("Given $(x #5(#1))^2 (x #5(#2(#1)))y''+3(x #5(#2))y'-2(x #5(#1))y$, classify the point $x_0=#3(#1)$", "Irregular", "",
		{ "1": randIE, "2": (a) => randIntExclude(-9, 9, 0, a), "3": neg, "5": addsub },
		[new Option("Ordinary", "Ordinary Point"), new Option("Regular", "Regular Singular Point"),
		new Option("Irregular", "Irregular Singular Point")]),
	new QuestionClass("Given $(x\\sin x)y''+3y'+xy$, classify the point $x_0=0$", "Irregular", "", {},
		[new Option("Ordinary", "Ordinary Point"), new Option("Regular", "Regular Singular Point"),
		new Option("Irregular", "Irregular Singular Point")]),
	new QuestionClass("Given $x^2y''+xy'+(x^2-4)y$, classify the point $x_0=2$", "Ordinary", "", {},
		[new Option("Ordinary", "Ordinary Point"), new Option("Regular", "Regular Singular Point"),
		new Option("Irregular", "Irregular Singular Point")]),
	new QuestionClass("Given $(x^2+x-2)y''+(x-1)^2y'+x(x-1)y$, classify the point $x_0=1$", "Ordinary", "", {},
		[new Option("Ordinary", "Ordinary Point"), new Option("Regular", "Regular Singular Point"),
		new Option("Irregular", "Irregular Singular Point")]),
], AnswerType.MultipleChoice);
const secondDefinitionsTerms = [wronskian, charEquation, analyticFunction, ordinarySingularPoints];

//-----------------------------------------------------------------------------
// Higher order ODEs
//-----------------------------------------------------------------------------

// Linear Homogeneous with constant coefficients -- 2 many constants
const pickCoefficients4th = function () {
	const randIndex = randInt(0, 1);
	coefficients = allCoefficients[randIndex][randInt(0, allCoefficients[randIndex].length - 1)];
};
var all3rdCoefficients = [[], [], []];
for (var i = -9; i < 10; i++) {
	for (var j = -9; j < 10; j++) {
		for (var k = -9; k < 10; k++) {
			if (i !== 0 && j !== 0 && k !== 0) {
				if (1 + i + j + k === 0 && i !== -1) {
					const quad = [1, i + 1, j + i + 1];
					const determinant = quad[1] * quad[1] - 4 * quad[0] * quad[2];
					if (determinant > 0) {
						const roots = [1, (-quad[1] + Math.sqrt(determinant)) / (2 * quad[0]), (-quad[1] - Math.sqrt(determinant)) / (2 * quad[0])];
						if (roots[1] !== 1 && roots[2] !== 1 && roots[1] !== 0 && roots[2] !== 0) {
							all3rdCoefficients[0].push([i, j, k, 0, roots]);
						}
					}
					else if (determinant === 0) {
						// second root is repeated
						const roots = [1, -quad[1] / (2 * quad[0])];
						if (roots[1] !== 1 && roots[1] !== 0) {
							all3rdCoefficients[1].push([i, j, k, 1, roots]);
						}
					}
					else {
						// [-1, lambda, mu]
						// roots are -1, l+ui, l-ui
						const roots = [1, -quad[1] / (2 * quad[0]), Math.sqrt(Math.abs(determinant)) / (2 * quad[0])];
						if (roots[1] !== 0) {
							all3rdCoefficients[2].push([i, j, k, 2, roots]);
						}
					}
				}
				else if (-1 + i - j + k === 0) {
					const quad = [1, i - 1, j - i + 1];
					const determinant = quad[1] * quad[1] - 4 * quad[0] * quad[2];
					if (determinant > 0) {
						const roots = [-1, (-quad[1] + Math.sqrt(determinant)) / (2 * quad[0]), (-quad[1] - Math.sqrt(determinant)) / (2 * quad[0])];
						if (roots[1] !== -1 && roots[2] !== -1 && roots[1] !== 0 && roots[2] !== 0) {
							all3rdCoefficients[0].push([i, j, k, 0, roots]);
						}
					}
					else if (determinant === 0) {
						// second root is repeated
						const roots = [-1, -quad[1] / (2 * quad[0])];
						if (roots[1] !== -1 && roots[1] !== 0) {
							all3rdCoefficients[1].push([i, j, k, 1, roots]);
						}
					}
					else {
						// [-1, lambda, mu]
						// roots are -1, l+ui, l-ui
						const roots = [-1, -quad[1] / (2 * quad[0]), Math.sqrt(Math.abs(determinant)) / (2 * quad[0])];
						if (roots[1] !== 0) {
							all3rdCoefficients[2].push([i, j, k, 2, roots]);
						}
					}
				}
			}
		}
	}
}
const pickCoefficients3rd = function () {
	const randIndex = randInt(0, 2);
	coefficients = all3rdCoefficients[randIndex][randInt(0, all3rdCoefficients[randIndex].length - 1)];
}
const solve3rdHomoAndFind = function (d, e, f, g, Y = 0, Yp = 0, Ypp = 0) {
	var sum = 0;
	const r = coefficients[4];
	const b = [d - Y, e - Yp, f - Ypp];
	if (coefficients[3] === 0) {
		// 3 real distinct roots
		var A = [[1, 1, 1], [r[0], r[1], r[2]], [r[0] * r[0], r[1] * r[1], r[2] * r[2]]];
		const c = rref(A, b);
		for (var i = 0; i < 3; i++) {
			sum += c[i] * Math.exp(r[i] * g);
		}
	}
	else if (coefficients[3] === 1) {
		// 2 real roots, 1 repeated root
		var A = [[1, 1, 0], [r[0], r[1], 1], [r[0] * r[0], r[1] * r[1], 2 * r[1]]];
		const c = rref(A, b);
		sum += c[0] * Math.exp(r[0] * g) + c[1] * Math.exp(r[1] * g);
		sum += c[2] * g * Math.exp(r[1] * g);
	}
	else {
		// 1 real root, 2 complex roots
		var A = [[1, 1, 0], [r[0], r[1], r[2]], [r[0] * r[0], r[1] * r[1] - r[2] * r[2], 2 * r[1] * r[2]]];
		const c = rref(A, b);
		sum += c[0] * Math.exp(r[0] * g);
		sum += c[1] * Math.exp(r[1] * g) * Math.cos(r[2] * g);
		sum += c[2] * Math.exp(r[1] * g) * Math.sin(r[2] * g);
	}
	return +(sum).toFixed(4);
}
const solve3rdHomo = function (d, e, f, Y = 0, Yp = 0, Ypp = 0) {
	var eq = "";
	const r = coefficients[4];
	const b = [d-Y, e-Yp, f-Ypp];
	if (coefficients[3] === 0) {
		// 3 real distinct roots
		var A = [[1, 1, 1], [r[0], r[1], r[2]], [r[0] * r[0], r[1] * r[1], r[2] * r[2]]];
		const c = rref(A, b);
		eq = +(c[0]).toFixed(2) + "e^{" + r[0] + "t}";
		for (var i = 1; i < 3; i++) {
			eq += addsub(+(c[i]).toFixed(2)) + "e^{" + +(r[i]).toFixed(2) + "t}";
		}
	}
	else if (coefficients[3] === 1) {
		// 2 real roots, 1 repeated root
		var A = [[1, 1, 0], [r[0], r[1], 1], [r[0] * r[0], r[1] * r[1], 2 * r[1]]];
		const c = rref(A, b);
		eq += +(c[0]).toFixed(2) + "e^{" + r[0] + "t}" + addsub(+(c[1]).toFixed(2)) + "e^{" + +(r[1]).toFixed(2) + "t}";
		eq += addsub(+(c[2]).toFixed(2)) + "te^{" + +(r[1]).toFixed(2) + "t}";
	}
	else {
		// 1 real root, 2 complex roots
		var A = [[1, 1, 0], [r[0], r[1], r[2]], [r[0] * r[0], r[1] * r[1] - r[2] * r[2], 2 * r[1] * r[2]]];
		const c = rref(A, b);
		eq += +(c[0]).toFixed(2) + "e^{" + r[0] + "t}";
		eq += addsub(+(c[1]).toFixed(2)) + "e^{" + +(r[1]).toFixed(2) + "t}\\cos(" + +(r[2]).toFixed(2) + "t)";
		eq += addsub(+(c[2]).toFixed(2)) + "e^{" + +(r[1]).toFixed(2) + "t}\\sin(" + +(r[2]).toFixed(2) + "t)";
	}
	return eq;
}
const linearHigherHomo = [new QuestionSet([
	new QuestionClass("Solve the initial value problem $#1 y^{(4)} #11(#2)y'' #11(#3)y=0, \\; y(0)=#4 ," +
		" \\; y'(0)=#5 , \\; y''(0)=#6 , \\; y'''(0)=#7 $ and find $y(#8 )$.", "#9(#1, #2, #3, #4, #5, #6, #7, #8)",
		"$y(t)=#10(#1, #2, #3, #4, #5, #6, #7)$",
		{
			"1": () => { pickCoefficients4th(); return coefficients[0]; }, "2": () => coefficients[1],
			"3": () => coefficients[2], "4": randI, "5": randI, "6": randI, "7": randI, "8": randIE, "11": addsub,
			"9": (a, b, c, d, e, f, g, h) => {
				const rsq1 = (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
				const rsq2 = (-b - Math.sqrt(b * b - 4 * a * c)) / (2 * a);
				const r = [Math.sqrt(Math.abs(rsq1)), Math.sqrt(Math.abs(rsq2)), -Math.sqrt(Math.abs(rsq1)), -Math.sqrt(Math.abs(rsq2))];
				var sum = 0;
				if (rsq1 > 0 && rsq2 > 0) {
					if (b * b - 4 * a * c === 0) {
						// repeated real roots: (r[0] r[1]), (r[2] r[3])
						var A = [[1, 0, 1, 0], [r[0], 1, r[2], 1], [r[0] * r[0], 2 * r[0], r[2] * r[2], 2 * r[2]],
						[r[0] ** 3, 3 * (r[0] ** 2), r[2] ** 3, 3 * (r[2] ** 2)]];
						const b = [d, e, f, g];
						const c = rref(A, b);
						for (var i = 0; i < 4; i += 2) {
							sum += c[i] * Math.exp(r[i] * h);
							sum += c[i + 1] * h * Math.exp(r[i] * h);
						}
					}
					else {
						// 4 real roots: r[0], r[1], r[2], r[3]
						var A = [[1, 1, 1, 1], r, [r[0] * r[0], r[1] * r[1], r[2] * r[2], r[3] * r[3]],
						[r[0] ** 3, r[1] ** 3, r[2] ** 3, r[3] ** 3]];
						const b = [d, e, f, g];
						const c = rref(A, b);
						for (var i = 0; i < 4; i++) {
							sum += c[i] * Math.exp(r[i] * h);
						}
					}
				}
				else if (rsq1 > 0 && rsq2 < 0) {
					// 2 real roots, 2 complex roots:  r[0] r[2], r[1]i r[3]i
					var A = [[1, 1, 1, 0], [r[0], r[2], 0, r[1]], [r[0] * r[0], r[2] * r[2], -r[1] * r[1], 0],
					[r[0] ** 3, r[2] ** 3, 0, -(r[1] ** 3)]];
					const b = [d, e, f, g];
					const c = rref(A, b);
					// c1*e^{r1 t}+c2*e^{r2 t}+c3*cos(ut)+c4*sin(ut)
					sum = c[0] * Math.exp(r[0] * h) + c[1] * Math.exp(r[2] * h) + c[2] * Math.cos(r[1] * h) + c[3] * Math.sin(r[1] * h);
				}
				else if (rsq1 < 0 && rsq2 > 0) {
					// 2 real roots, 2 complex roots:  r[1] r[3], r[0]i r[2]i
					var A = [[1, 1, 1, 0], [r[1], r[3], 0, r[0]], [r[1] * r[1], r[3] * r[3], -r[0] * r[0], 0],
					[r[1] ** 3, r[3] ** 3, 0, -(r[0] ** 3)]];
					const b = [d, e, f, g];
					const c = rref(A, b);
					// c1*e^{r1 t}+c2*e^{r2 t}+c3*cos(ut)+c4*sin(ut)
					sum = c[0] * Math.exp(r[1] * h) + c[1] * Math.exp(r[3] * h) + c[2] * Math.cos(r[0] * h) + c[3] * Math.sin(r[0] * h);
				}
				else {
					if (b * b - 4 * a * c === 0) {
						// repeated complex roots: (r[0]i r[1]i), (r[2]i r[3]i)
						const u = r[0];
						var A = [[1, 0, 0, 0], [0, 1, 0, u], [-u * u, 0, 2 * u, 0],
						[0, -3 * u * u, 0, -(u ** 3)]];
						const b = [d, e, f, g];
						const c = rref(A, b);
						// c1*cos(ut)+c2*t*cos(ut)+c3*t*sin(ut)+c4*sin(ut)
						sum = c[0] * Math.cos(u * h) + c[1] * h * Math.cos(u * h) + c[2] * h * Math.sin(u * h) + c[3] * Math.sin(u * h);
					}
					else {
						// 4 complex roots: r[0]i, r[1]i, r[2]i, r[3]i
						var A = [[1, 0, 1, 0], [0, r[0], 0, r[1]], [-r[0] * r[0], 0, -r[1] * r[1], 0],
						[0, -(r[0] ** 3), 0, -(r[1] ** 3)]];
						const b = [d, e, f, g];
						const c = rref(A, b);
						// c1*cos(r[0]t)+c2*sin(r[0]t)+c3*cos(r[1]t)+c4*sin(r[1]t)
						for (var i = 0; i < 4; i++) {
							if (i % 2 === 0) sum += c[i] * Math.cos(r[i / 2] * h);
							else sum += c[i] * Math.sin(r[(i - 1) / 2] * h);
						}
					}
				}
				return +(sum).toFixed(4);
			}, "10": (a, b, c, d, e, f, g) => {
				const rsq1 = (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
				const rsq2 = (-b - Math.sqrt(b * b - 4 * a * c)) / (2 * a);
				const r = [Math.sqrt(Math.abs(rsq1)), Math.sqrt(Math.abs(rsq2)), -Math.sqrt(Math.abs(rsq1)), -Math.sqrt(Math.abs(rsq2))];
				var eq = "";
				if (rsq1 > 0 && rsq2 > 0) {
					if (b * b - 4 * a * c === 0) {
						// repeated real roots: (r[0] r[1]), (r[2] r[3])
						var A = [[1, 0, 1, 0], [r[0], 1, r[2], 1], [r[0] * r[0], 2 * r[0], r[2] * r[2], 2 * r[2]],
						[r[0] ** 3, 3 * (r[0] ** 2), r[2] ** 3, 3 * (r[2] ** 2)]];
						const b = [d, e, f, g];
						const c = rref(A, b);
						eq = +(c[0]).toFixed(2) + "e^{" + +(r[0]).toFixed(2) + "t}" +
							addsub(+(c[1]).toFixed(2)) + "te^{" + +(r[0]).toFixed(2) + "t}" +
							addsub(+(c[2]).toFixed(2)) + "e^{" + +(r[2]).toFixed(2) + "t}" +
							addsub(+(c[3]).toFixed(2)) + "te^{" + +(r[2]).toFixed(2) + "t}";
					}
					else {
						// 4 real roots: r[0], r[1], r[2], r[3]
						var A = [[1, 1, 1, 1], r, [r[0] * r[0], r[1] * r[1], r[2] * r[2], r[3] * r[3]],
						[r[0] ** 3, r[1] ** 3, r[2] ** 3, r[3] ** 3]];
						const b = [d, e, f, g];
						const c = rref(A, b);
						eq = +(c[i]).toFixed(2) + "e^{" + +(r[i]).toFixed(2) + "t}";
						for (var i = 1; i < 4; i++) {
							eq += addsub(+(c[i]).toFixed(2)) + "e^{" + +(r[i]).toFixed(2) + "t}";
						}
					}
				}
				else if (rsq1 > 0 && rsq2 < 0) {
					// 2 real roots, 2 complex roots:  r[0] r[2], r[1]i r[3]i
					var A = [[1, 1, 1, 0], [r[0], r[2], 0, r[1]], [r[0] * r[0], r[2] * r[2], -r[1] * r[1], 0],
					[r[0] ** 3, r[2] ** 3, 0, -(r[1] ** 3)]];
					const b = [d, e, f, g];
					const c = rref(A, b);
					// c1*e^{r1 t}+c2*e^{r2 t}+c3*cos(ut)+c4*sin(ut)
					eq = +(c[0]).toFixed(2) + "e^{" + +(r[0]).toFixed(2) + "t}" +
						addsub(+(c[1]).toFixed(2)) + "e^{" + +(r[2]).toFixed(2) + "t}" +
						addsub(+(c[2]).toFixed(2)) + "\\cos(" + +(r[1]).toFixed(2) + "t)" +
						addsub(+(c[3]).toFixed(2)) + "\\sin(" + +(r[1]).toFixed(2) + "t)";
				}
				else if (rsq1 < 0 && rsq2 > 0) {
					// 2 real roots, 2 complex roots:  r[1] r[3], r[0]i r[2]i
					var A = [[1, 1, 1, 0], [r[1], r[3], 0, r[0]], [r[1] * r[1], r[3] * r[3], -r[0] * r[0], 0],
					[r[1] ** 3, r[3] ** 3, 0, -(r[0] ** 3)]];
					const b = [d, e, f, g];
					const c = rref(A, b);
					// c1*e^{r1 t}+c2*e^{r2 t}+c3*cos(ut)+c4*sin(ut)
					eq = +(c[0]).toFixed(2) + "e^{" + +(r[1]).toFixed(2) + "t}" +
						addsub(+(c[1]).toFixed(2)) + "e^{" + +(r[3]).toFixed(2) + "t}" +
						addsub(+(c[2]).toFixed(2)) + "\\cos(" + +(r[0]).toFixed(2) + "t)" +
						addsub(+(c[3]).toFixed(2)) + "\\sin(" + +(r[0]).toFixed(2) + "t)";
				}
				else {
					if (b * b - 4 * a * c === 0) {
						// repeated complex roots: (r[0]i r[1]i), (r[2]i r[3]i)
						const u = r[0];
						var A = [[1, 0, 0, 0], [0, 1, 0, u], [-u * u, 0, 2 * u, 0],
						[0, -3 * u * u, 0, -(u ** 3)]];
						const b = [d, e, f, g];
						const c = rref(A, b);
						// c1*cos(ut)+c2*t*cos(ut)+c3*t*sin(ut)+c4*sin(ut)
						eq = +(c[0]).toFixed(2) + "\\cos(" + +(u).toFixed(2) + "t)" + addsub(+(c[1].toFixed(2))) + "t\\cos(" + +(u).toFixed(2) + "t)" +
							addsub(+(c[3]).toFixed(2)) + "\\sin(" + +(u).toFixed(2) + "t)" + addsub(+(c[2]).toFixed(2)) + "t\\sin(" + +(u).toFixed(2) + "t)";
					}
					else {
						// 4 complex roots: r[0]i, r[1]i, r[2]i, r[3]i
						var A = [[1, 0, 1, 0], [0, r[0], 0, r[1]], [-r[0] * r[0], 0, -r[1] * r[1], 0],
						[0, -(r[0] ** 3), 0, -(r[1] ** 3)]];
						const b = [d, e, f, g];
						const c = rref(A, b);
						// c1*cos(r[0]t)+c2*sin(r[0]t)+c3*cos(r[1]t)+c4*sin(r[1]t)
						eq = +(c[0]).toFixed(2) + "\\cos(" + +(r[0]).toFixed(2) + "t)";
						for (var i = 1; i < 4; i++) {
							if (i % 2 === 0) eq += addsub(+(c[i]).toFixed(2)) + "\\cos(" + +(r[i / 2]).toFixed(2) + "t)";
							else eq += addsub(+(c[i]).toFixed(2)) + "\\sin(" + +(r[(i - 1) / 2]).toFixed(2) + "t)";
						}
					}
				}
				return eq;
			}
		}),
	new QuestionClass("Solve the initial value problem $y''' #10(#1)y'' #10(#2)y' #10(#3)y=0, \\; y(0)=#4 ," +
		" \\; y'(0)=#5 , \\; y''(0)=#6 $ and find $y(#7 )$.", "#8(#4, #5, #6, #7)",
		"$y(t)=#9(#4, #5, #6)$",
		{
			"1": () => { pickCoefficients3rd(); return coefficients[0]; }, "2": () => coefficients[1],
			"3": () => coefficients[2], "4": randI, "5": randI, "6": randI, "7": randIE,
			"10": addsub, "8": solve3rdHomoAndFind, "9": solve3rdHomo
		})
], AnswerType.Numeric)];
// Method of Undetermined Coefficients -- 3 moderate constants
const linearHigherNonHomo = [new QuestionSet([
	//dt
	new QuestionClass("Solve the initial value problem $y''' #11(#1)y'' #11(#2)y' #11(#3)y=#4 t, \\; y(0)=#5 ," +
		" \\; y'(0)=#6 , \\; y''(0)=#7 $ and find $y(#8 )$.", "#9(#2, #3, #4, #5, #6, #7, #8)",
		"$y(t)=#10(#2, #3, #4, #5, #6)$",
		{
			"1": () => { pickCoefficients3rd(); return coefficients[0]; }, "2": () => coefficients[1],
			"3": () => coefficients[2], "4": randIE, "5": randI, "6": randI, "7": randI, "8": randIE,
			"11": addsub, "9": (b, c, d, e, f, g) => {
				const A = d / c;
				const B = -b / (c * c);
				const nonHomo = A * g + B;
				return +(solve3rdHomoAndFind(d, e, f, g, B, A, 0) + nonHomo).toFixed(4);
			}, "10": (b, c, d, e, f) => {
				const nonHomo = "+\\frac{" + d + "}{" + c + "}t+\\frac{" + (-b) + "}{" + (c * c) + "}";
				return solve3rdHomo(d, e, f, -b / (c * c), d / c, 0) + nonHomo;
			}
		}),
	//e^{dt}
	new QuestionClass("Solve the initial value problem $y''' #11(#1)y'' #11(#2)y' #11(#3)y=e^{#4 t}, \\; y(0)=#5 ," +
		" \\; y'(0)=#6 , \\; y''(0)=#7 $ and find $y(#8 )$.", "#9(#1, #2, #3, #4, #5, #6, #7, #8)",
		"$y(t)=#10(#1, #2, #3, #4, #5, #6)$",
		{
			"1": () => { pickCoefficients3rd(); return coefficients[0]; }, "2": () => coefficients[1],
			"3": () => coefficients[2], "4": () => {
				if (coefficients[3] === 0) {
					return randIntExclude(-9, 9, 0, coefficients[4][0], coefficients[4][1], coefficients[4][2]);
				}
				else if (coefficients[3] === 1) {
					return randIntExclude(-9, 9, 0, coefficients[4][0], coefficients[4][1]);
				}
				else {
					return randIntExclude(-9, 9, 0, coefficients[4][0]);
				}
			}, "5": randI, "6": randI, "7": randI, "8": randIE,
			"11": addsub, "9": (a, b, c, d, e, f, g) => {
				const A = 1 / (d ** 3 + a * d * d + b * d + c);
				const nonHomo = A * Math.exp(d * g);
				return +(solve3rdHomoAndFind(d, e, f, g, A, A * d, A * d * d) + nonHomo).toFixed(4);
			}, "10": (a, b, c, d, e, f) => {
				const A = 1 / (d ** 3 + a * d * d + b * d + c);
				const nonHomo = "+\\frac{1}{" + (d ** 3 + a * d * d + b * d + c) + "}e^{" + d + "t}";
				return solve3rdHomo(d, e, f, A, A * d, A * d * d) + nonHomo;
			}
		}),
	//cos(dt)
	new QuestionClass("Solve the initial value problem $y''' #11(#1)y'' #11(#2)y' #11(#3)y=\\cos(#4 t), \\; y(0)=#5 ," +
		" \\; y'(0)=#6 , \\; y''(0)=#7 $ and find $y(#8 )$.", "#9(#1, #2, #3, #4, #5, #6, #7, #8)",
		"$y(t)=#10(#1, #2, #3, #4, #5, #6)$",
		{
			"1": () => { pickCoefficients3rd(); return coefficients[0]; }, "2": () => coefficients[1],
			"3": () => coefficients[2], "4": () => {
				if (coefficients[3] === 2) {
					return randIntExclude(-9, 9, 0, coefficients[4][2], -coefficients[4][2]);
				}
				else return randIntExclude(-9, 9, 0);
			}, "5": randI, "6": randI, "7": randI, "8": randIE,
			"11": addsub, "9": (a, b, c, d, e, f, g) => {
				const G = d ** 3 - b * d;
				const H = c - a * d * d;
				const A = H / (G * G + H * H);
				const B = -G / (G * G + H * H);
				const nonHomo = A*Math.cos(d*g)+B*Math.sin(d*g);
				return +(solve3rdHomoAndFind(d, e, f, g, A, B * d, -A * d * d) + nonHomo).toFixed(4);
			}, "10": (a, b, c, d, e, f) => {
				const G = d ** 3 - b * d;
				const H = c - a * d * d;
				const A = H / (G * G + H * H);
				const B = -G / (G * G + H * H);
				const nonHomo = "+\\frac{" + H + "}{" + (G * G + H * H) + "}\\cos(" + d + "t)" +
					"+\\frac{ " + (-G) + "}{ " + (G * G + H * H) + "}";
				return solve3rdHomo(d, e, f, A, B * d, -A * d * d) + nonHomo;
			}
		})
], AnswerType.Numeric)];

// Organized by decreasing level of importance (each level of importance will be done half as often as the level above it)
var diffEqProbs = [[separable, linear1stOrder, exactEq, linear2ndHomo, linear2ndNonHomo, laplaceTransform],
	[autonomous, numericalApprox, firstDefinitionsTerms, powerSeries, secondDefinitionsTerms],
	[reductionOfOrder, variationParameters2nd, linearHigherHomo, linearHigherNonHomo]];
var diffEqProbsBySubject = {
	"1st Order ODEs": [separable, linear1stOrder, autonomous, exactEq, numericalApprox, firstDefinitionsTerms],
	"2nd Order ODEs": [linear2ndHomo, linear2ndNonHomo, reductionOfOrder, variationParameters2nd, laplaceTransform, powerSeries, secondDefinitionsTerms],
	"Higher Order ODEs": [linearHigherHomo, linearHigherNonHomo]
};
var diffEqProbsNamed = {
	"Separable ODEs": separable, "Linear 1st Order ODEs": linear1stOrder, "Autonomous ODEs": autonomous, "Exact Equations": exactEq,
	"Numerical Approximation": numericalApprox, "1st Order Definition/Terms": firstDefinitionsTerms,
	"Linear Homogeneous 2nd Order ODEs": linear2ndHomo, "Linear Nonhomogeneous 2nd Order ODEs": linear2ndNonHomo,
	"Reduction of Order": reductionOfOrder, "Variation of Parameters": variationParameters2nd, "Laplace Transform": laplaceTransform, "Power Series Solutions": powerSeries,
	"2nd Order Definitions/Terms": secondDefinitionsTerms, "Higher Order Linear Homogeneous ODEs": linearHigherHomo, "Higher Order Linear nonHomogeneous ODEs": linearHigherNonHomo
};

module.exports = { diffEqProbs, diffEqProbsBySubject, diffEqProbsNamed };