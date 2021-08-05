import { QuestionSet, QuestionClass, AnswerType } from "../questions.js";
import { randInt } from "../util.js";

const exponentSeries = new QuestionClass("Does the series $\\sum^\\infty_{n=0} n^{#1 }$ converge?", "No",
	"There is no explanation", {"1": () => randInt(-10, 10)}, ["Yes", "No"]);

const sequenceConvergence = [new QuestionSet([exponentSeries], AnswerType.MultipleChoice)];

var calc2Probs = [sequenceConvergence];
export default calc2Probs;