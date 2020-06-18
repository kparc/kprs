/* e:nve|te|t..v|t t:n|v v:tA|V n:t[E*]|(E)|(E*)|{[..]E}|N
     dap map cap           avd    ap   parn list   lam     */
F=field; O=optional; C=choice; R=repeat; R1=repeat1; S=seq; D=prec.dynamic; D1=x=>D(1,x);
module.exports=grammar({name:'k',rules:{k:$=>S(R($._ksep),$._k,R(S($._ksep,O($._k)))),
                                       _k:$=>C($._v,$._e,$._pe),

_pe:$=>C($.pdap,$.pmap),
   pdap:$=>D1(S(F('a',$._n),O($._sp),F('v',$._v),O($._sp),O(F('z',$._pe)))),
   pmap:$=>   C(F('v',$.v),S(F('f',$._t),O($._sp),F('z',C($._v,$._pe)))),

_e:$=>D(-1,C($.ass,$.dap,$.map,$._t,$.exp)),
   ass:$=>D1(S(F('v',$._n),F('f',O($.v)),':',F('a',O($._e)))),
   exp:$=>   S(':',$._e),
   dap:$=>D1(S(F('a',$._n),O($._sp),F('v',$._v),O($._sp),F('b',$._e))),
   map:$=>   S(F('f',$._t),O($._sp),F('a',$._e)),
   cap:$=>D1(S(C(F('ca',$.cap),F('ta',$._t)),F('b',$._v))),

_v:$=>C($.avd,$.v), avd:$=>S(F('f',$._t),F('a',$.a)),
_t:$=>C($._n,$._v),
_n:$=>C($.ap,$.parn,$.list,$.n,$.lam),

parn:$=>S('(',$._e,')'),
list:$=>S('(',O($.seq),')'),
ap:  $=>prec(1,S(F('f',$._e),'[',F('a',O($.seq)),']')),

args:$=>S($.var,R(S(';',$.var))),
seq: $=>C(R1($._semi),S(R($._semi),S($._e,R(S($._semi,O($._e)))))),
lam: $=>S('{[',F('v',O($.args)),']',F('b',O($.seq)),'}'),

n:   $=>C($.int1,$.intv,$.flt1,$.var),

int1:$=>S(O('-'),$._pint1), _pint1:$=>/\d+/,
intv:$=>S(O('-'),$._pintv), _pintv:$=>/\d+( -?\d+)+/,
flt1:$=>S(O('-'),$._pflt1), _pflt1:$=>/(\d+\.|\d*\.\d+)(e-?\d+)?/,

v:$=>C('-',/[+*%!&|<>=~,^#_$?@.]/), _sp:$=>' ',
a:$=>/[\/\\\']:?/,

var: $=>/[a-zA-Z][a-zA-Z0-9]*/, _semi:$=>/;|\n\s+/, _ksep:$=>/;|\n/

},conflicts:$=>[[$.dap,$._t],[$.parn,$.seq],[$.cap,$._t],[$.ass,$.dap,$._t],[$.ass,$._v],[$.dap,$.map],
                [$.int1,$.v],[$.flt1,$.v],[$.n,$.intv],[$.intv],[$.intv,$.v],
                [$.pmap,$._t],[$.ass,$.dap,$.pdap,$._t],[$.dap,$.pdap,$._t],[$.pmap,$._v],[$._k,$._t]],
  extras:$=>[]
})
