(lam) @local.scope
(lam v:(args v:(var) @local.definition))
;(exp) @local.scope
(ass v:(lit (var) @local.definition))
(lit (var) @local.reference)

