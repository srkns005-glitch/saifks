SaifKS Research Planner — Phase 15.1 FIXED

Critical fix:
- Phase 15 scripts now access the actual DB, activeTree, and plan variables declared by the main page.
- Previous Phase 15 loaded but returned before decorating nodes, so visually nothing changed.

Visible changes:
- Every node shows Current → Target.
- MAX appears only when Current and Target are both maximum.
- Research effect is shown directly under the node name.
- Every research node can be selected.
- Current never exceeds Target.
