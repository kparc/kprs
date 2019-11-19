## kprs

```

NVA are 3 parts of speech, non-intersecting terminals:
N is a lexical noun (` or 1 or "abc")
V is a native verb (+ or +:)
A is an adverb (' / \ etc)
everything else is a non-terminal or punctuation:
v can be formed by an adverb (tA) or it is a native verb
E:E;e|e is two rules: E:E;e and E:e, first rule reads E is 1;2
punctuation are :   | and space  ( ->  | and \n )
t and n are cyclic

/

:  assign                  '  each      n bar    char  " ab"       `c
+  add         flip        /  over      n div    name  ``a`b       `n
-  subtract    negate      \  scan      n mod    int   Ø 0 2       `i
*  multiply    first       ': eachprior peach    float ø 2.3 π ∞   `f
%  divideby    inverse     /: eachright sv|join  date 2019-06-28   `D .z.D
&  min|and     where       \: eachleft  vs|split time 12:34:56.789 `t .z.t
|  max|or      reverse
<  less        up          I/O (0:i close)       list (2;3.4;`c)   `.
>  more        down        0: read/write line    dict ``b!(2;`c)   `a
=  equal       group       1: read/write byte    tabl +{b:2 3 4}   `A
~  match       not         2: read/write data    expr :32+9*f%5    `0
!  key         enum        3: set/conn (.Z.s)    func {(+/x)%#x}   `1
,  catenate    enlist      4: get/http (.Z.gGP)
^  except      asc
#  take(f#)    count       #[t;c;b[;a]] select   \l f.k  load       \h help
_  drop(f_)    floor       _[t;c;b[;a]] update   \t[:n]x milli/time \l log
?  find        unique      ?[x;i;f[;y]] splice   \u[:n]x micro/trace
@  index       type        @[x;i;f[;y]] amend    \v [d] vars        \f [d] fns
.  apply       value       .[x;i;f[;y]] dmend    \lf file \lc char  \ll line
$  cast|pad    string      $[c;t;f]     cond     \cd [d] get[set]   \gr x file

\

```