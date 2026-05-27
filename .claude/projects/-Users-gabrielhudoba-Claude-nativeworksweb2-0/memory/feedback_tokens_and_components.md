---
name: tokens-and-components-rule
description: All UI work must use design tokens and existing components; create new components instead of ad-hoc markup.
metadata:
  type: feedback
---

All code must use design tokens (from `globals.css @theme`) and components (from `app/components/`). Never write hardcoded values or one-off markup.

**Rules:**
1. Every visual value (color, spacing, radius, shadow, font, type size) must reference a token via a Tailwind utility (e.g. `bg-accent`, `text-body`, `rounded-lg`, `p-24`). Never hardcode `px`, `#hex`, `rgba()`, etc. in component/page files.
2. Before writing any JSX, check if an existing atom/molecule/organism covers the need. Use the existing component even if it needs a `className` override for minor tweaks.
3. If no existing component fits, create a new component in the correct atomic tier (`atoms/`, `molecules/`, `organisms/`, `templates/`) and export it from the tier's `index.ts`.
4. Never stretch a component beyond its contract just to avoid creating a new one — if the variant list needs extending, extend it properly inside the component file.

**Why:** The user enforced this as an absolute rule for the project. Violating it produces inconsistent, unmaintainable UI.

**How to apply:** Before every JSX block, ask: "Am I using a token? Am I using an existing component?" — if not, fix it before saving.
