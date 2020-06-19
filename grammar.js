/* e:nve|te|t..v|t t:n|v v:tA|V n:t[E*]|(E)|(E*)|{[..]E}|N
     dap map cap           avd    ap   parn list   lam     */
A=alias; F=field; O=optional; C=choice; R=repeat; R1=repeat1; S=seq; P=prec; D=P.dynamic;
module.exports=grammar({name:'k',rules:{k:$=>S(R($._ksep),$._k,O($.nb),R(S($._ksep,$._k,O($.nb)))),
                                       _k:$=>C(D(1,$._v),$._e,$._pe),

_pe:$=>D(-1,C($.pass,$.pdap,$.pdam,$.pmap)),
   pass:$=>D(1,S(F('v',$._n),F('f',O($.v)),':',F('a',O($._pe)))),
   pdap:$=>D(2,S(F('a',$._n),O($._sp),F('v',$._v),         O($._sp),O(F('z',$._pe)))),
   pdam:$=>D(2,S(F('a',$._n),         F('v',A($._ugh,$.v)),O($._sp),O(F('z',$._pe)))),
   pmap:$=>D(1,C(F('v',$.v),        S(F('f',$._t),         O($._sp),F('z',C($._v,$._pe))))),

_e:$=>D(-1,C($.ass,$.dap,$.dam,$.map,$._t,$.exp)),
   ass:$=>D(3,P(1,S(F('v',$._n),F('f',O($.v)),':',F('a',O($._e))))),
   exp:$=>                                  S(':',        $._k),
   dap:$=>D(2,S(F('a',$._n),O($._sp),F('v',$._v),         O($._sp),F('b',$._e))),
   dam:$=>D(2,S(F('a',$._n),         F('v',A($._ugh,$.v)),O($._sp),F('b',$._e))),
   map:$=>D(1,S(F('f',$._t),O($._sp),F('a',$._e))),

_v:$=>C($.avd,$.v), avd:$=>S(F('f',$._t),F('a',$.a)),
_t:$=>C($._n,$._v),
_n:$=>C($.ap,$.parn,$.list,$.n,$.lam),

parn:$=>S('(',$._k,')'),
list:$=>S('(',O($.seq),')'),
ap:  $=>P(2,S(F('f',$._e),'[',F('a',O($.seq)),']')),

args:$=>S($.var,R(S(';',$.var))),
seq: $=>C(R1($._semi),S(R($._semi),S($._k,R(S($._semi,O($._k)))))),
lam: $=>S('{[',F('v',O($.args)),']',F('b',O($.seq)),'}'),

n:   $=>C($.int1,$.intv,$.flt1,$.fltv,$.sym1,$.symv,$.chr1,$.chrv,$.var), //move everything to lexer
int1:$=>/-?\d+/,                        intv:$=>/-?\d+( -?\d+)+/,
flt1:$=>/-?(\d+\.|\d*\.\d+)(e-?\d+)?/,  fltv:$=>/-?(\d+\.?|\d*\.?\d+)(e-?\d+)?( -?(\d+\.?|\d*\.\d+)(e-?\d+)?)+/,
sym1:$=>/`[\w.]*/,                      symv:$=>/(`[\w.]*)+/,
chr1:$=>/"([^\"]|\\.)"/,                chrv:$=>C(/""/,/"([^\"]|\\.)+"/),

v:$=>C('-',/[+*%!&|<>=~,^#_$?@.]/), _sp:$=>' ', nb:$=>/\s+\/[^\n]+/,
a:$=>/[\/\\\']:?/,

var: $=>/[a-zA-Z][a-zA-Z0-9]*/, _semi:$=>C(/;\s*/,S(O($.nb),/\n\s+/)), _ksep:$=>C(/;\s*/,/\n/),

},conflicts:$=>[[$.parn,$.seq],[$._k,$._t],[$._k,$.pass],
                [$.dap,$._t],[$.pmap,$._t],[$.pdap,$._t],[$.ass,$.dap,$.pdap,$._t],[$.dap,$.pdap,$._t],[$.pmap,$._v]
                ],
  externals:$=>[$._ugh],
  extras:$=>[]
})
