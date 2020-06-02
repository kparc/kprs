all:gen

gen:	
	tree-sitter generate && tree-sitter parse t.k	

test:
	tree-sitter generate && tree-sitter test

install:
	npm i tree-sitter-cli -g
