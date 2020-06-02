/* e:nve|te|t..v|t t:n|v v:tA|V n:t[E*]|(E)|(E*)|{[..]E}|N
     dap map cap           avd    ap   parn list   lam     */
module.exports=grammar({name:'k',rules:{k:$=>$._e,

_e:$=>choice($.ass,$.dap,$.map,$.cap,$._t,$.exp), ass:$=>seq($._n,optional($.v),':',$._e),
                                                  exp:$=>seq(':',$._e),
                                                  dap:$=>seq(field('a',$._n),field('v',$._v),field('b',$._e)),
                                                  map:$=>seq(field('f',$._t),field('a',$._e)),
                                                  cap:$=>seq(choice($.cap,$._t),$._v),
_v:$=>choice($.avd,$.v), avd:$=>seq($._t,$.a),
_t:$=>choice($._n,$._v),
_n:$=>choice($.ap,$.parn,$.list,$.n,$.lam),

parn:$=>seq('(',$._e,')'),
list:$=>seq('(',optional($.seq),')'),
ap:  $=>prec(1,seq(field('f',$._e),'[',field('a',optional($.seq)),']')),

args:$=>seq($.var,repeat(seq(';',$.var))),
seq: $=>seq($._e,repeat(seq($._semi,$._e))),
lam: $=>seq('{[',field('v',optional($.args)),']',field('b',optional($.seq)),'}'),

n:   $=>choice($.int1,$.intv,$.flt1,$.var),
int1:$=>/-?\d+/, intv:$=>prec.right(1,seq($.int1,choice($.int1,$.intv))),
flt1:$=>/-?(\d+\.|\d*\.\d+)(e-?\d+)?/,

v:$=>/[+\-*%!&|<>=~,^#_$?@.]/,
a:$=>/[\/\\\']:?/,

var: $=>/[a-z][a-z0-9]*/, _semi:$=>/[;\n]/

},conflicts:$=>[[$.dap,$._t],[$.parn,$.seq],[$.cap,$._t],[$.ass,$.dap,$._t],[$.ass,$._v]]
})
