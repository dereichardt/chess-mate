# Lesson Authoring Guide

This guide covers everything you need to write lesson content for Chess-Mate. All lessons live in `frontend/src/data/lessons.ts` — there is no backend CMS.

---

## Table of Contents

1. [Lesson Structure](#lesson-structure)
2. [Step Structure](#step-structure)
3. [FEN Positions](#fen-positions)
4. [Highlight Types](#highlight-types)
5. [Arrows](#arrows)
6. [Interactive Challenges](#interactive-challenges)
7. [Writing the Text](#writing-the-text)
8. [Adding a New Lesson](#adding-a-new-lesson)
9. [Common Patterns](#common-patterns)
10. [Checklist](#checklist)

---

## Lesson Structure

```ts
{
  id: string        // URL slug — used in /learn/:lessonId. kebab-case. Never change once published.
  number: number    // Display order. Must be sequential (1, 2, 3...).
  title: string     // Short title shown on the lesson card and header.
  description: string  // One sentence shown on the lesson card.
  duration: string  // Estimated read time, e.g. "10 min". Rough guide only.
  steps: LessonStep[]
}
```

**Example:**
```ts
{
  id: 'check-and-checkmate',
  number: 4,
  title: 'Check, Checkmate & Stalemate',
  description: 'Understand what check means, how to deliver checkmate, and what stalemate is.',
  duration: '10 min',
  steps: [ ... ],
}
```

---

## Step Structure

Each step in `steps[]` maps to one screen the user sees. The board updates and the text updates together.

```ts
interface LessonStep {
  title: string             // Step heading shown above the text panel.
  text: string              // Explanatory text (supports **bold** formatting).
  fen: string               // Board position for this step.
  highlightSquares?: string[]  // Green dot indicators (legal move destinations).
  captureSquares?: string[]    // Softer green dots (capture squares).
  fillSquares?: string[]       // Yellow-tinted full-square highlight (educational emphasis).
  arrows?: [string, string, string?][]  // Visual arrows — see Arrows section.
  challenge?: { from: string; to: string }  // Required move the user must play.
  interactive?: boolean     // Enable drag-and-drop. Required when challenge is set.
}
```

Keep each step focused on **one idea**. If a step is teaching two different things, split it into two steps.

---

## FEN Positions

FEN (Forsyth–Edwards Notation) describes a board position as a string. Every step needs a valid FEN.

### Format

```
<pieces>  <turn>  <castling>  <en passant>  <halfmove>  <fullmove>
```

**Example — starting position:**
```
rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
```

A constant `STARTING_FEN` is already defined at the top of `lessons.ts` — use it instead of typing the string.

### Piece symbols

| Symbol | Piece |
|--------|-------|
| `K` / `k` | White / Black King |
| `Q` / `q` | White / Black Queen |
| `R` / `r` | White / Black Rook |
| `B` / `b` | White / Black Bishop |
| `N` / `n` | White / Black Knight |
| `P` / `p` | White / Black Pawn |
| `8` | Eight empty squares in a row |
| `/` | New rank (from rank 8 to rank 1) |

### Verify your FEN

Always test FEN strings before using them. Paste into [lichess.org/analysis](https://lichess.org/analysis) — if the board looks correct, the FEN is valid.

### Minimal FEN for isolated piece demos

When showing a single piece with no other context, use a minimal FEN:

```
// White knight on d4, everything else empty
'8/8/8/8/3N4/8/8/8 w - - 0 1'

// White bishop on b2, black king on h8, black knight on e5
'7k/8/8/4n3/8/8/1B6/8 w - - 0 1'
```

---

## Highlight Types

Four square highlight roles are used consistently across lessons. The board guide (Board indicators) shows users what each color means.

| Role | Color | Props | Use for |
|------|--------|--------|--------|
| Lesson explanation / detail | **Yellow** | `highlightSquares`, `fillSquares` | Key squares, piece reach, files/ranks, conceptual emphasis. |
| Legal moves | **Green** | (set by board after user moves) | Where the piece can move — shown after a move in exploration steps. |
| Capture / attack | **Red** | `captureSquares` | Capture squares, attacked pieces, threats. |
| Square piece moved from | **Light green** | (set by board after user moves) | Origin square only; not used in lesson data. |

### `highlightSquares` — yellow (explanation)

Use for: **squares that explain an idea** — where a piece can move, key squares, tactical targets. Renders as a yellow full-square tint.

```ts
highlightSquares: ['e3', 'e4', 'd3', 'f3']
```

### `fillSquares` — yellow (explanation)

Use for: **named squares**, entire ranks/files, conceptual emphasis. Same yellow tint as `highlightSquares`. Does not imply movement — it just draws attention.

```ts
fillSquares: ['e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8']
```

### `captureSquares` — red (capture / attack)

Use for: **capture destinations** and **attack squares** (e.g. threatened king, pinned piece).

```ts
captureSquares: ['d3', 'f3']
```

### Combining highlight types

You can use yellow (highlight + fill) and red (capture) on the same step:

```ts
fen: '8/8/8/8/8/8/4P3/8 w - - 0 1',
highlightSquares: ['e3', 'e4'],   // yellow: can move here
captureSquares: ['d3', 'f3'],     // red: can capture here (if enemy piece present)
```

---

## Arrows

Arrows draw directional lines on the board to illustrate attack lines, pins, knight moves, or any relationship between two squares.

### Format

```ts
arrows: [
  [fromSquare, toSquare, color?],
  ...
]
```

Each arrow is a tuple of 2–3 elements:
- `fromSquare` — algebraic notation (e.g. `'e5'`)
- `toSquare` — algebraic notation (e.g. `'g6'`)
- `color` — optional RGBA string. If omitted, uses the default color.

### Standard colors

Use these consistently for semantic meaning:

| Purpose | Color value |
|---------|------------|
| Attack / threat | `'rgba(239,68,68,0.85)'` (red) |
| Pin / tactic | `'rgba(232,108,11,0.85)'` (orange — accent color) |
| Neutral / move illustration | `'rgba(99,102,241,0.85)'` (indigo) |

### Examples

```ts
// Red arrows — knight forking two pieces
arrows: [
  ['e5', 'g6', 'rgba(239,68,68,0.85)'],
  ['e5', 'c6', 'rgba(239,68,68,0.85)'],
]

// Orange arrow — bishop pinning a piece
arrows: [
  ['b2', 'h8', 'rgba(232,108,11,0.85)'],
]
```

### Knight moves

The chess board component handles knight moves specially — it renders them as L-shaped arrows automatically when the from/to squares match an L-shaped path. No special configuration needed.

---

## Interactive Challenges

A challenge step asks the user to drag and drop the correct piece. It validates the move and calls `onChallengeComplete()` when correct.

### Requirements

Both `interactive: true` and `challenge` must be set together:

```ts
{
  title: 'Find the Fork',
  text: 'Drag the knight to the square that attacks both pieces simultaneously.',
  fen: '8/8/2r3k1/8/8/5N2/8/8 w - - 0 1',
  interactive: true,
  challenge: { from: 'f3', to: 'e5' },
}
```

### Rules for challenge steps

- **Verify the move is legal** in the given FEN before writing the challenge. Test on [lichess.org/analysis](https://lichess.org/analysis).
- The `from` square must have a piece in the FEN. The `to` square is the destination.
- Only one move is validated — the exact `from` → `to` pair.
- Do not add `highlightSquares` or arrows to challenge steps — the user should have to find the answer themselves.
- The text should describe *what outcome to achieve* ("attack both pieces") not *where to move* ("move to e5"). The challenge is a puzzle, not a guided click.

### Challenge step placement

- Always precede a challenge step with an explanatory step that teaches the pattern first.
- Challenge steps work well as the last step of a conceptual block, or as a lesson's final step.

---

## Writing the Text

### Formatting

- Use `**bold**` for key chess terms, piece names, and important concepts. This renders as bold in the UI.
- Use `\n\n` for paragraph breaks (double newline in the string).
- Keep paragraphs short — 2–4 sentences. The text panel is narrow.

### Tone

- Direct and instructional, not chatty.
- Assume the reader is a complete beginner unless the lesson explicitly builds on prior lessons.
- Introduce one new concept per step.

### Text length

- **Introduction steps** — 2–3 short paragraphs.
- **Concept steps** — 1–2 paragraphs explaining the idea, 1 sentence pointing to the board.
- **Challenge steps** — 2–3 sentences maximum. Set up the task, don't over-explain.

### Board callout convention

End concept steps with a sentence that explicitly connects the text to the board visual:

> "Here a white rook sits on d4. It can reach any highlighted square in a single move."

> "Here the white bishop on b2 fires along the b2–h8 diagonal, pinning the black knight on e5."

---

## Adding a New Lesson

1. Open `frontend/src/data/lessons.ts`
2. Add a new object to the `lessons` array **in order** — do not skip `number` values
3. Replace the "Coming Soon" stub if one exists for that lesson number
4. Use the checklist below before considering it done

```ts
// Replace this stub:
{
  id: 'check-and-checkmate',
  number: 4,
  title: 'Check, Checkmate & Stalemate',
  description: '...',
  duration: '10 min',
  steps: [
    {
      title: 'Coming Soon',
      text: 'This lesson is under construction...',
      fen: STARTING_FEN,
    },
  ],
},

// With the full lesson:
{
  id: 'check-and-checkmate',   // ← keep the same id — it's already in users' progress records
  number: 4,
  title: 'Check, Checkmate & Stalemate',
  description: 'Understand what check means, how to deliver checkmate, and what stalemate is.',
  duration: '10 min',
  steps: [
    // ... full steps here
  ],
},
```

**Important:** Never change a lesson's `id` after it has been published. The `id` is used as the URL slug and as the key in `progressStore`. Changing it breaks existing user progress records.

---

## Common Patterns

### Introduction step (no highlights)

```ts
{
  title: 'Introduction',
  text: 'Opening paragraph.\n\nSecond paragraph.',
  fen: STARTING_FEN,
  interactive: false,
}
```

### Piece movement demo

```ts
{
  title: 'The Rook',
  text: 'Explanation of movement...\n\nHere a white rook sits on d4. It can reach any highlighted square in a single move.',
  fen: '8/8/8/8/3R4/8/8/8 w - - 0 1',
  highlightSquares: ['d1', 'd2', 'd3', 'd5', 'd6', 'd7', 'd8', 'a4', 'b4', 'c4', 'e4', 'f4', 'g4', 'h4'],
}
```

### Tactical pattern with arrows

```ts
{
  title: 'The Pin',
  text: 'Explanation of pin...\n\nHere the white bishop on b2 pins the black knight on e5.',
  fen: '7k/8/8/4n3/8/8/1B6/8 w - - 0 1',
  interactive: false,
  highlightSquares: ['e5'],
  arrows: [['b2', 'h8', 'rgba(232,108,11,0.85)']],
}
```

### Challenge (find the move)

```ts
{
  title: 'Find the Pin',
  text: 'The white bishop is not yet on the pinning diagonal — but it can get there in one move.\n\nFind the square where the bishop pins the black knight against the king.',
  fen: '7k/8/8/4n3/8/8/8/2B5 w - - 0 1',
  interactive: true,
  challenge: { from: 'c1', to: 'b2' },
}
```

---

## Checklist

Before committing a new or updated lesson:

- [ ] All FEN strings verified on [lichess.org/analysis](https://lichess.org/analysis)
- [ ] Lesson `id` is kebab-case and unique
- [ ] `number` is sequential with no gaps
- [ ] Each step has one focused concept
- [ ] Challenge `from` squares have a piece in the corresponding FEN
- [ ] Challenge steps do not include highlights or arrows (keep them as puzzles)
- [ ] Text paragraphs separated with `\n\n`
- [ ] Bold (`**term**`) used for key chess terms
- [ ] Concept steps end with a sentence pointing to the board
- [ ] Lesson stub (if replacing one) keeps the same `id`
