
# Structure Documentation
## Overview
The main files that are used in this project are *index.html, server.js, processing.js, question.js, util.js*.  Additionally, there is a *subjects* folder that contains all the files for the various mathematical subjects, Calculus, Differential Equations, Linear Algebra, etc.  

The *Calc1.js* and *Calc2.js* files are small examples that illustrate the basics of adding a new subject and new problems, while *DiffEq.js* is a complete subject intended for actual use.

*util.js* provides some utility functions that are useful in creating randomized problems.  The `randInt` and `randIntExclude` functions are particularly useful for generating random, conveniently-sized integers for problems.

*index.html* contains the html code for the web app.  It is rather sparse since most elements are dynamically added with jQuery in the *processing.js* file, however it does contain all of the CSS (sparse though that is).

*server.js* is the back-end server file that uses Node.js to create a server and serve files to the browser.  Currently, that is all it does, respond with the *index.html* file and any *.js* file, when requested.  It responds to any other request with an empty text string.  All processing is done client-side in *processing.js*.

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
