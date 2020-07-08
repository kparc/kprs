EMOPT=${shell grep -v '@see' opt | xargs}

all: dep wsm

wsm:
	tree-sitter generate
	cp c.h scanner.c src
	tree-sitter build-wasm && mv tree-sitter-k.wasm web/
cli:
	gcc -O0 -g -o p3 *.c src/parser.c -Itree-sitter/lib/include -Ltree-sitter -ltree-sitter

wsm-cli:
	emcc -Itree-sitter/lib/include *.c src/parser.c -O0 -g \
		-s TOTAL_MEMORY=1500MB $(EMOPT) -c
dep:
	@#curl -L https://github.com/tree-sitter/tree-sitter/releases/download/0.14.7/tree-sitter.js > web/tree-sitter.js
	@#curl -L https://github.com/tree-sitter/tree-sitter/releases/download/0.14.7/tree-sitter.wasm > web/tree-sitter.wasm
	cd tree-sitter && script/build-wasm
	cp tree-sitter/lib/binding_web/tree-sitter.{wasm,js} web/
	
