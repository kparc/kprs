// e:nve|te| t:n|v v:tA|V n:t[E]|(E)|{E}|N E:E;e|e  

module.exports=grammar({name:'k',rules:{

 source_file: $ => seq($.e,repeat(seq($._sep,$.e)),optional($._sep)),
 e:           $ => prec.right(choice(prec(1,seq($.n,$.v,$.e)),seq($.t,$.e),$.t)),
 t:           $ => choice($.n,$.v),
 v:           $ => choice(seq($.t,$.A),$.V),
 n:           $ => choice(seq($.t,$.brkE),$.prnE,$.crlE,$.N),
 E:           $ => choice(seq($.E,$.e),$.e),
 prnE:        $ => seq('(',$.E,')'),
 brkE:        $ => seq('[',$.E,']'),
 crlE:        $ => seq('{',$.E,'}'),

 N:$=> choice($.int, /[xyzλπøØ∞]+/), int:$=>/\d+/,

 _sep:$=>/[\n;]/,
 V:$=>/[:+\-*%&|<>=~!,^#_?@.$]:?/,
 A:$=>/[\/\\\']:?/,

}
})//:~
