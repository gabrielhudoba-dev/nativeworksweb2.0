---
name: project_spacing_tokens
description: Spacing scale is 8pt (s1–s18 = N×8px); vertical rhythm is 24px baseline (s3). All line-heights are multiples of 24.
metadata:
  type: project
---

Spacing: 8pt scale, s1=8px … s18=144px. Every padding/margin/gap uses a token.

Vertical rhythm unit = **24px** (s3 = 3×8). Every `line-height` in the type scale is an integer multiple of 24:

| Token | Font | LH | Multiple |
|-------|------|----|---------|
| h2 | 72px | 72px | 3×24 |
| hpage | 56px | 72px | 3×24 |
| numb1 | 60px | 72px | 3×24 |
| h3 | 32px | 48px | 2×24 |
| h4 | 28px | 48px | 2×24 |
| h5 | 20px | 24px | 1×24 |
| p0 | 28px | 48px | 2×24 |
| p1/p2 | 20px | 24px | 1×24 |
| p3 | 16px | 24px | 1×24 |
| l1/l2/l3 | 16/12px | 24px | 1×24 |

**Why:** 24px baseline rhythm — tried 32px (2026-05-31) but reverted; 32px felt too loose especially on h3/h4.

**How to apply:** When adding new type styles, line-height must be a multiple of 32. Use `off-rhythm` class on elements that should opt out of baseline alignment.
