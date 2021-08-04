import { QuestionSet, QuestionClass, AnswerType } from "../questions.js";
import { randInt } from "../util.js";

const powerInt = function (upper, lower, coefficient, power, constant) {
	return +(coefficient * Math.pow(upper, power + 1) / (power + 1) + constant * upper
		- coefficient * Math.pow(lower, power + 1) / (power + 1) - constant * lower).toFixed(4);
};
const intPowerIntegral = new QuestionClass("Evaluate $\\int^{#1 }_{#2 }#3 x^{#4 }+#5 \\,dx.$", "#6(#1, #2, #3, #4, #5)",
	"$\\int x^{#4 } \\,dx = \\frac{x^{#7(#4)}}{#7 }+C$ <br>" +
	"$\\int #3 x^{#4 }+#5 \\,dx = \\frac{#3 x^{#7 }}{#7 }+#5 x + C$ <br>" +
	"$\\int^{#1 }_{#2 }#3 x^{#4 }+#5 \\,dx = \\dfrac{#3 x^{#7 }}{#7 }+#5 x \\Big|^{#1 }_{#2 } " +
	"= \\frac{#3 \\cdot{#1 }^{#7 }}{#7 }+#5 \\cdot #1 - \\frac{#3 \\cdot{#2 }^{#7 }}{#7 }-#5 \\cdot #2 = #6 $",
	{
		"1": () => randInt(-10, 10),
		"2": () => randInt(-10, 10),
		"3": () => randInt(1, 15),
		"4": () => randInt(1, 6),
		"5": () => randInt(1, 20),
		"6": powerInt,
		"7": (val) => val+1
	});

const simpleIntegral = [new QuestionSet([intPowerIntegral], AnswerType.Numeric)];

var calc1Probs = [simpleIntegral];
export default calc1Probs;