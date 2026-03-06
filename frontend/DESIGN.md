# Chess-Mate Design Philosophy

This document is the single source of truth for how Chess-Mate looks and behaves. Use it when building or refactoring UI.

## Product focus

- **Puzzles and openings** are the core learning value.
- **Differentiator:** Cohesive, modern UI—professional, consistent, and purposeful (inspired by apps like Workday).

---

## 1. Core principles

| Principle | Meaning for Chess-Mate |
|-----------|------------------------|
| **Cohesion** | One visual language everywhere: same spacing scale, type scale, colors, and component behavior. No one-off "special" screens. |
| **Clarity** | Every screen has a clear primary action and hierarchy. Board, moves, and text are easy to scan. |
| **Consistency** | Same patterns for similar tasks (e.g. all list/card UIs behave the same; all primary actions look the same). |
| **Restraint** | Purposeful use of color and decoration. Backgrounds and chrome stay calm so boards and content stand out. |
| **Accessibility** | Contrast, focus states, and touch targets meet WCAG 2.1 AA where practical. |

---

## 2. Workday-like traits

- **Professional, not playful:** Feels trustworthy and focused on learning, not gamey.
- **Predictable layout:** Stable header, nav, and content areas; users always know where they are.
- **Strong information hierarchy:** Clear titles, sections, and emphasis (e.g. one H1 per view, consistent heading levels).
- **Generous whitespace:** Enough padding and spacing so puzzles and opening lines don't feel cramped.
- **Intentional color:** Limited palette; color indicates state (success, error, active) and key actions, not decoration.
- **Data and actions are obvious:** Tables, lists, and buttons follow consistent rules so "what I can do" is obvious.

---

## 3. Alignment with puzzles and openings

- **Puzzles:** UI keeps attention on the board and the "next move" action; feedback (correct/wrong, hints) is clear and consistent.
- **Openings:** Tree/list views and move orders are scannable; emphasis on names, move order, and "learn this" vs "review" actions.
- **Shared:** Progress and difficulty use the same badge/card patterns across puzzles and openings.

---

## 4. Design system (implementation)

The design system lives in:

- **Tokens:** [tailwind.config.js](tailwind.config.js) — color, spacing, typography, radius, shadow.
- **Global styles:** [src/index.css](src/index.css) — font, line-height, optional CSS variables.

### 4.1 Color

- **Primary:** Navy/slate scale (50–950); use for headings, links, and primary buttons. Keeps the UI professional (Workday-like).
- **Accent:** Orange (`accent`, `accent-hover`); use sparingly for labels, active nav indicator, and highlights.
- **Semantic:** `surface`, `border`, `text`, `textMuted`, `success`, `error`, `warning` — use these instead of ad-hoc grays or hex in components.

### 4.2 Spacing

- Use the shared scale (see Tailwind config). Prefer tokens like `space-section`, `space-card` for layout so all screens feel consistent.

### 4.3 Typography

- **Scale:** `text-display`, `text-h1`–`text-h3`, `text-body`, `text-caption`.
- **Font:** One primary sans (documented in index.css). Use the type scale for hierarchy.

### 4.4 Component patterns

- **Buttons:** Primary, secondary, ghost; one or two sizes. Same radius and padding from tokens.
- **Cards:** One default style for content blocks (puzzle card, opening card); optional elevated variant for modals/highlights.
- **Forms:** Inputs and labels use the same spacing and focus ring; errors use semantic `error` color.
- **Navigation:** Sidebar and header links share the same active and hover rules; icon + label pattern is consistent.

When building new screens (puzzles, openings), use only these tokens and patterns so the app stays cohesive.
