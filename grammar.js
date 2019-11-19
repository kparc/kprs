// e:nve|te| t:n|v v:tA|V n:t[E]|(E)|{E}|N E:E;e|e  

module.exports=grammar({name:'k',rules:{

 punct:$=>/[\s;\n]+/,N:$=>/[\dxyzλπøØ∞]+/,
 V:$=>/[:+\-*%&|<>=~!,^#_?@.$]:?/,A:$=>/[\/\\']:?/,

 source_file: $ => repeat($.e),
 e:           $ => choice(seq($.n,$.v,$.e),seq($.t,$.e),$.punct),
 t:           $ => choice($.n,$.v),
 v:           $ => choice(seq($.t,$.A),$.V),
 n:           $ => seq($.t,choice($.brkE,$.prnE,$.crlE,$.N)),
 E:           $ => choice(repeat1($.E),$.e),
 brkE:        $ => seq('[',$.E,']'),
 prnE:        $ => seq('(',$.E,')'),
 crlE:        $ => seq('{',$.E,'}'),

}})//:~
