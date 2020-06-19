#include<tree_sitter/parser.h>                   //the mighty lexer.  (c) 2020-now lelf; kparc
#include"c.h"
#define wup x->lookahead
#define adv() x->advance(x,0)
typedef unsigned U; enum TokenType{UGH};

V*tree_sitter_k_external_scanner_create      (){R 0;}
V tree_sitter_k_external_scanner_destroy     (V*p){}
U tree_sitter_k_external_scanner_serialize   (V*p,S b){R 0;}
V tree_sitter_k_external_scanner_deserialize (V*p,CS b,U n){}
I tree_sitter_k_external_scanner_scan        (V*p,TSLexer*x,const I*vs){
 P(wup!='-',0);adv();if(wup=='.')adv();P('0'>wup||wup>'9',0);R x->result_symbol=UGH,1;}
