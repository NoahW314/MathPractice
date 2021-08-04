# MathPractice
TODO List:

Next Project:
	Write Problems (Diff eq?)

//----------------------------------------------------------------------------
Major Projects:
//----------------------------------------------------------------------------

Write procedure for adding new problems (I will forget how to do this, so this is important!!)

Write Problems
	As we actually write some actual problems that I hope to use as part of the final program, I will discover more things to be done


//----------------------------------------------------------------------------
Minor Projects:
//----------------------------------------------------------------------------

Heroku Deployment
	Set this up using Heroku, so that I don't have to run it locally
	Also add a favicon.ico icon when we get to this step
	This is only useful when I have finished the program and am using it, so this is the last step.
	Add this project to Github, I seem remember integration between Github and Heroku, but it is a good idea idependently.

Answer Validation 
	this is probably better done on a problem by problem basis, but some general cases of validation have been done
	Test ComplexNumber parser.

	Possible specific cases include:
		simple expression answer (account for commutativity of addition/multiplication)
		complex expression answer (convert into a js function and check value at multiple points? [could be used for simple expression answer as well])
		example of answer (convert into js object and check that it has certain properties)
		(Note: None of these are probably needed.
		Writing problems for DiffEq indicates the evaluating expressions at certain point can be done 
		instead of checking the entire expression symbolically.  
		The third case can be avoided by generating mathematically objects in the code and presenting them to
		the user classify as certain properties or not [either using the MultipleChoice or SelectAll answer types])
