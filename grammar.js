/* e:nve|te|t..v|t t:n|v v:tA|V n:t[E*]|(E)|(E*)|{[..]E}|N
     dap map cap           avd    ap   parn list   lam     */
A=alias; F=field; O=optional; C=choice; R=repeat; R1=repeat1; S=seq; P=prec; D=P.dynamic;
module.exports=grammar({name:'k',
           rules:{k:$=>S(R($._ksep),F('k',$._k),O($.nb),R(S($._ksep,F('k',$._k),O($.nb)))),
                 _k:$=>C(D(2,$._v),$._e,$._pe),

_pe:$=>D(-1,C($.pass,$.pdap,$.pdam,$.pmap,$.pexp)),
   pass:$=>D(1,P(1,S(F('v',$._n),         F('f',O($.op)),':',              F('a',$._pe)))),
   pexp:$=>                                            S(':',                    $._pe),
   pdap:$=>    D(2,S(F('a',$._n),O($._sp),F('v',$._v),          O($._sp),O(F('z',$._pe)))),
   pdam:$=>    D(2,S(F('a',$._n),         F('v',A($._ugh,$.op)),O($._sp),O(F('z',$._pe)))),
   pmap:$=>    D(1,C(F('v',$._v),       S(F('f',$._t),          O($._sp),  F('z',$._pe)))),

_e:$=>D(-1,C($.ass,$.dap,$.dam,$.map,$.exp,$._t)),
   ass:$=>D(1,P(1,S(F('v',$._n),         F('f',O($.op)),':',          F('a',O($._e))))),
   exp:$=>                                            S(':',                  $._e),
   dap:$=>    D(2,S(F('a',$._n),O($._sp),F('v',$._v),          O($._sp),F('b',$._e))),
   dam:$=>    D(2,S(F('a',$._n),         F('v',A($._ugh,$.op)),O($._sp),F('b',$._e))),
   map:$=>    D(1,S(F('f',$._t),                               O($._sp),F('a',$._e))),

_t:$=>C($._n,$._v),
_n:$=>C($.ap,$.parn,$.list,$.lit,$.lam), _v:$=>C($.avd,$.op), avd:$=>S(F('f',$._t),F('a',$.a)),

parn:$=>S('(',$._k,    ')'),
list:$=>S('(',O($.seq),')'),                 ap:$=>P(2,S(F('f',$._e),'[',F('a',O($.seq)),']')),

lam: $=>S('{[',F('v',O($.args)),']',F('b',O($.seq)),'}'),     args:$=>S($.var,R(S(';',$.var))),
seq: $=>C(R1($._semi),S(R($._semi),S($._k,R(S($._semi,O($._k)))))),

lit: $=>C($.int1,$.intv,$.flt1,$.fltv,$.sym1,$.symv,$.chr1,$.chrv,$.var), //move everything to lexer
int1:$=>/-?\d+/,                        intv:$=>/-?\d+( -?\d+)+/,
flt1:$=>/-?(\d+\.|\d*\.\d+)(e-?\d+)?/,  fltv:$=>/-?(\d+\.?|\d*\.?\d+)(e-?\d+)?( -?(\d+\.?|\d*\.\d+)(e-?\d+)?)+/,
sym1:$=>/`[\w.]*/,                      symv:$=>/(`[\w.]*)+/,
chr1:$=>/"([^\"]|\\.)"/,                chrv:$=>C(/""/,/"([^\"]|\\.)+"/),

op:$=>C('-',/[+*%!&|<>=~,^#_$?@.]/),   a:$=>/[\/\\\']:?/,    _sp:$=>' ',    nb:$=>/\s+\/[^\n]+/,  
var:$=>/[a-zA-Z][a-zA-Z0-9]*/,   _semi:$=>C(/;\s*/,S(O($.nb),/\n\s+/)), _ksep:$=>C(/;\s*/,/\n/),

},conflicts:$=>[[$.pmap,$.pdap,$._e],[$.pass,$.ass],[$.pmap,$._e],[$.pmap,$.pdap],[$.dap,$.map],
                [$.pmap,$._k,$._e],[$.parn,$.seq]],
  externals:$=>[$._ugh],  inline:$=>[$._t],  supertypes:$=>[$._e,$._pe,$._n,$._v],  extras:$=>[]
})
