# Adding new subjects and problems

To facilitate testing of new subjects and problems, I put lines in *question.js* and *processing.js* that allow you to set which topic, QuestionSet, and QuestionClass is chosen.  I marked these with "//TODO: Unhack" markers.

## Adding a new subject

 1. Create a new file in the *subjects* folder.  The file should be named after the subject.
 2. Add 3 groupings to the end of the file modeled after those in the DiffEq example and export them. (The meanings are explained in the *question.js* docs)
 3. Create low-level topic arrays as needed.
 4. Add the subject name in the "subject_select" selector in *index.html*.
 5. In *processing.js*, add an require statement like the one for DiffEq. (The names of the objects imported should match those in the subject file.)
 6. Update the `problems`, `problemsBySubject`, and `problemsNamed` objects to include the problems for the new subject. (The keys for these objects should match the value for the subject on the "subject_select" selector.)

## Adding a new QuestionSet

 1. If needed, create an array to represent the low-level topic for this Set.
 2. Create a new QuestionSet object within the array. (Or outside it and reference it with a variable).
 3. The first parameter is an array containing the various QuestionClasses (See below for creating a new QuestionClass).
 4. The second parameter is the answer type--the type of response that the user will give (multiple choice, select all that apply, number, exact expression, etc.).  If there are multiple parts to the answer (e.x. a numeric answer and a multiple choice classification), then an array of AnswerTypes can be provided. 
	 - If desired, the answer type may be wrapped in an array with a string to give different text for the answer input. (e.x ["Order", AnswerType.Exact] gives an answer input with "Order" instead of "Answer" as the label.  This works with all answer types.)
 5.  Each AnswerType has a validator function that checks the user's answer against the correct answer.  If desired, this can be overridden with a custom validator function that is passed as the third parameter.  If an array of AnswerTypes was given, then an array of validators needs to be provided if any of them should be overwritten (use `undefined` for any validators that shouldn't be overwritten).
 6. The fourth parameter allows the hints to be overridden. (the little info circle near the answer input that tells what answer type is expected.)  Like the third parameter, if an array of AnswerTypes was given, an array should be given with any un-overwritten hint spots set to undefined.  The hint should be a string and will be parsed as html.

## Adding a new QuestionClass

 1. The first parameter of a QuestionClass object is a string for the text of the question.  This string will be parsed as LaTeX and can have "constant functions" (see below for rules on using constant functions). Note that `\` has to be escaped within strings, so most LaTeX commands will look like this `"\\frac{}{}"`.
 2. The second parameter is the correct answer for the question and must be a string that will be parsed as LaTeX with constant function support (it is automatically surrounded by dollar signs, unless it is a multiple choice or select all question).  
	 - Typically, this is just a constant function that takes all the constants from the equation as parameters and computes the answer (or in the case of multiple choice or select all, it may be a constant string).  
	 - If the question has multiple answer parts, then an array of answers should be given.  If the question has the SelectAll answer type, then an array of correct answers should be given (possibly nested within the array of answers for multiple question parts.)
 3. The third parameter is the explanation of the answer that appears when "Show Answer" is clicked.  This parameter must be a string and will be parsed as LaTeX with constant function support.  If no explanation is to be given, then a string with a single space *must* be passed.  Again, for multiple answer parts, multiple explanations must be given, with omitted explanations being `" "`.
 4. The fourth parameter should be an object which maps the constant function names used to actual functions.  Lambda functions and storing functions in variables are frequently helpful.
 5. The fifth parameter must be set only when there is one or more MultipleChoice or SelectAll answer parts to the question.
	 - If there is a single answer part, then an array of strings, the various choices, should be passed.  The answer(s) provided earlier should match the correct string(s) exactly*.
	- If there are multiple answer parts, then an array containing the above array should be used.  Any answer parts which aren't MultipleChoice or SelectAll should have an empty array `[]` in their spot in this array.
	 - The string will be parsed as LaTeX with constant function support, however since the answer need match this, it is preferably (maybe necessary?) to use `Option` if need either of these things to be supported.
	 - *Instead of a string, an `Option` object can be used.  This object has two properties, a value and a display.  The value should match the answer given as the 2nd parameter and will not be parsed, while the display doesn't have to match anything and will be parsed as Latex with constant function support.
 6. The sixth parameter is used when there is a Matrix or Vectors answer type to the question.  The value is the name (as a string) of the constant function whose value is a matrix or vector set with the same dimensions as the answer should have (typically, we use the actual answer).  As usual, if there are multiple answer parts, then an array must be passed with non-Matrix/Vectors answer parts set to undefined.
 7. The seventh parameter is used with custom validators.  When a validator needs extra information from the question to determine if the answer is right, it can be passed via this parameter.  This parameter is an array of strings which are the names of constant functions whose values will be passed in an array as the fourth parameter to the validator (answers to the previous question parts is the third parameter).  All of these values will be passed to each custom validator for the entire question (regardless of the part).

## Constant functions
To denote and choose arbitrary constants within the text or answer of questions, we have what I call "constant functions" (since they are functions that give mathematical constants).

When the string is parsed, each constant function is replaced with the result of calling the specified function.  The syntax is `"#name "`, where `name` is the name of the function.  The `#` signals the beginning of the name and the space marks the end.  The name can be anything, though we use numbers WLOG.  This syntax only works when the function doesn't get passed any parameters.

To pass parameters (typically other constant functions), use this syntax:
`#name(#param1, #param2, #param3)`.  No spaces are required after any of the names even if there is only one parameter.  That is, `#func(#param)` with no space is *required*.  Functions can be nested, so `#func1(#func2(#param1))` works. 
Non-constant functions can be passed as parameters, but it is usually easier to just pass them normally using a lambda function in replacements (e.x. `() => func(1, "Hello")`).

After a function has been called once the last value of the function call can be accessed by just doing `"#func "` without having to repass the parameters.  Note that this function could have been called with different parameters since the last time you used it, so it best not to rely on this behavior too much.

Each constant function accessed should have a corresponding property in the `replacements` object.  So if `"#add "` is used  somewhere, then there should an `"add"` property in `replacements`.

# Structure Documentation
## Overview
The main files that are used in this project are *index.html, server.js, processing.js, question.js, util.js*.  Additionally, there is a *subjects* folder that contains all the files for the various mathematical subjects, Calculus, Differential Equations, Linear Algebra, etc.  

The *Calc1.js* and *Calc2.js* files are small examples that illustrate the basics of adding a new subject and new problems, while *DiffEq.js* is a complete subject intended for actual use.

*util.js* provides some utility functions that are useful in creating randomized problems.  The `randInt` and `randIntExclude` functions are particularly useful for generating random, conveniently-sized integers for problems.

*index.html* contains the html code for the web app.  It is rather sparse since most elements are dynamically added with jQuery in the *processing.js* file, however it does contain all of the CSS (sparse though that is).

*server.js* is the back-end server file that uses Node.js to create a server and serve files to the browser.  Currently, that is all it does, respond with the *index.html* file and any *.js* file, when requested.  It responds to any other request with an empty text string.  All processing is done client-side in *processing.js*.  This file also has an place to test random code that is dependent on other code in our project (e.x. test/debug our rref function).  When the code is in the right place, navigate to "/test" to run the code.  This allows us to use the server-side debugger, which is much easier to use than the client-side debugger.

### processing.js
This file is responsible for almost all of the JavaScript code that does any sort of computation or response to user input.  The main user response functions are buttons like the "Submit" and "Show Latex" buttons.  One unique user response function is for the enter key.  When the user is focused on an answer input area, pressing the enter key will submit their answer.  Then, if the enter key is pressed again and the answer was correct, the "New/Next Question" button will be clicked programmatically, loading a new question to be displayed for the user.

The `getNewQuestion` function is the largest function in the file and is the function that selects a question to be displayed to the user and updates all the html to make this happen.  The structure of questions is dealt with under *question.js*, but the rest of the function simply consists of going through each answer part for the new question and adding the correct type of answer input html to the screen with the text for that question.

### question.js
The question structure is complex, so I will try to illustrate it visually with lists and some text explaining it below.  Using Differential Equations as the example subject, the main structure is this:

 - Subject (Diff Eq, Linear Algebra)
	 - Low-level topic (Autonomous ODEs, Separable Equations)
		 - QuestionSet (Find the long-term behavior of an autonomous ODE)
			 - QuestionClass (Find the long-term behavior of *this* autonomous ODE , $y'=ay+b$)
				 - Question (Find the long-term behavior of *this* autonomous ODE, $y'=2y-3$)

Each subject is exported as an array of the low-level topics.  Each low-level topic is an array of one (occasionally more) QuestionSet.  A QuestionSet is a general type of problem that has a certain AnswerType, typically this means the wording of the question will be the same, but the equation form has not been specified.  This is more a grouping tactic than a code-enforced thing.  A QuestionClass specifies the question wording and equation form (the specific function), but leaves constants undetermined.  The constants are chosen by functions when a Question instance is created. (See adding problems for more info on this.)

The confusing part of all this is that 3 arrays are exported per subject file.  Each array contains a different grouping of the low-level topics.  The first array `diffEqProbs` groups the topics by importance with the most important topics listed first.  The second,`diffEqProbsBySubject`, groups the low-level topics into high-level topics and is actually an object that maps a name to a array.  For Diff Eq, these names are "1st Order ODEs", "2nd Order ODEs", and "Higher Order ODEs".  The last grouping is `diffEqProbsNamed`, which maps a name to each low-level topic.  These last two groupings allow high-level and low-level topics to be selected by the user, so that problems only come from the selected topic.
