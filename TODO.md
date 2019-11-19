## TODO

There MUST NOT be a space before ([) and the adverbs('/\).
There MUST be a space before a comment(/) and trace(\).
e.g. +/x is summation whereas  + /x is a comment.

There MUST be a space between the verbs(._) and alphanumerics.
e.g. x _ y is x drop y whereas  x_y is a name.
 
Numbers separated by spaces form vector constants, e.g. 2 3 4
Names and constants separated by spaces cause application, e.g. f g x

There is no notation for lists of length 0 or 1. (except "" and ())
Length 1 lists are displayed with a leading ','. Empties with '0#'.

Verbs will take nouns on the left.
e.g. f@+/x is f at sum x whereas f +/x is sum x with initial state f.

Symbols are local iff immediately to left of single ':'. 
e.g. f:{[a;b]c:d::e[0]:f+:a} / a,b are params; c is local; d,e,f are global

Newline causes a break(like ';') (k is poetry - not prose)
e.g. a function with a trailing } on its own will return _n(can use :result)

If a function is called with fewer arguments than parameters it will project.
e.g. {x+y}[2] is the 2+ function. (x,y,z are default args)

Niladic functions are called with a single ignored argument.

