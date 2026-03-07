# Lesson Authoring Guide

This guide covers everything you need to write lesson content for Chess-Mate. Lessons are authored in `shared/lessons/` (TypeScript); the frontend and backend use this as the single source of truth. There is no backend CMS.

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
  challenge?: { from: string; to: string } | { from: string; to: string }[]  // One required move (or alternatives). Ignored when challengeSequence is set.
  challengeSequence?: ChallengeSequenceStep[]  // Multi-move challenge: user plays a sequence, with optional opponent responses. See Interactive Challenges.
  postChallenge?: PostChallengeVisuals
  interactive?: boolean     // Enable drag-and-drop. Required when challenge or challengeSequence is set.
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

Challenge steps ask the user to find and play the correct move(s). Use **one-move** challenges for Learn the Basics and for simple "find the move" practice. Use **multi-move** (`challengeSequence`) for Beginner lessons and beyond when the idea is best taught over two or more moves (e.g. attack then capture, or defend then recapture).

### One-move challenge

Both `interactive: true` and `challenge` must be set. When `challengeSequence` is not set, the step is complete after a single correct move.

```ts
{
  title: 'Find the Fork',
  text: 'Drag the knight to the square that attacks both pieces simultaneously.',
  fen: '8/8/2r3k1/8/8/5N2/8/8 w - - 0 1',
  interactive: true,
  challenge: { from: 'f3', to: 'e5' },
}
```

You can also pass an **array** of moves to accept any of them as correct: `challenge: [{ from: 'a', to: 'b' }, { from: 'c', to: 'd' }]`.

### Multi-move challenge (challengeSequence)

For **Beginner** and later sections, use `challengeSequence` when the step requires two or more user moves, with optional opponent replies in between. The user must play the full sequence correctly; on a wrong move the board resets to the start of the sequence.

Each element is either a user move `{ from, to }` or a user move plus a fixed opponent response `{ from, to, response: { from, to } }`:

```ts
{
  title: 'Attack, Then Capture',
  text: 'First find the attack on the knight. After Black moves the king, play the capture.',
  fen: '7k/8/8/4n3/8/8/1B6/4K3 w - - 0 1',
  interactive: true,
  challengeSequence: [
    { from: 'b2', to: 'd4', response: { from: 'h8', to: 'g8' } },  // User: Bd4. Black: Kg8.
    { from: 'd4', to: 'e5' },   // User: Bxe5.
  ],
  postChallenge: { fen: '6k1/8/8/4B3/8/8/8/4K3 b - - 0 2', movedFrom: 'd4' },
}
```

- **When to use 2-move (or N-move):** Where the pedagogy clearly benefits — e.g. "Play the attack; after Black's reply find the capture" (CCA), or "Defend, then after they take find the recapture" (Defending). Not every challenge needs to be multi-move.
- **Validation:** The script checks that every user move and every `response` is legal from the resulting position. If `postChallenge.fen` is set, it must match the final position after the full sequence (position + turn).

### Rules for challenge steps

- **Verify every move is legal** in the given FEN (and after each prior move in a sequence). Test on [lichess.org/analysis](https://lichess.org/analysis).
- The `from` square must have a piece; `to` is the destination.
- Do not add `highlightSquares` or arrows to challenge steps — the user should find the answer.
- The text should describe *what to achieve* ("attack both pieces", "complete the sequence") not the exact squares.

### Challenge step placement

- Always precede a challenge step with an explanatory step that teaches the pattern first.
- Use one-move challenges for Learn the Basics (lessons 1–6). Use two-move (or more) where it fits in Beginner (7–12) and Advanced Beginner / Early Intermediate (13+).

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

## Concept–content alignment

To avoid rework, ensure the board, challenge, and text all support the same learning goal.

### Lesson design workflow

Before writing FEN or challenge text:

1. **Define the lesson’s learning objective** in one sentence (e.g. "Learner can apply CCA: look for checks, then captures, then attacks").
2. **List the concepts** the lesson must teach (e.g. Check, Capture, Attack as three concepts).
3. **For each concept:** decide whether it gets a theory-only step, a challenge step, or both. Ensure every concept in the title/description has at least one step that teaches it and, where appropriate, one that tests it (challenge).

This prevents gaps where a concept appears in the lesson name but has no teaching or practice step.

### Alignment checks

- **Setup vs narrative:** For every step, the board (FEN + highlights/arrows) matches what the text describes (e.g. "the bishop on g5" → the bishop is on g5 in the FEN).
- **Challenge vs concept:** For every challenge step, the correct move(s) actually demonstrate the stated concept (e.g. "Find the block" → the challenge move is a block; "Deliver checkmate" → the challenge move gives checkmate).
- **Play-through:** Play through the lesson as a learner: complete every challenge, read every step. Confirm no step is uncompletable or confusing.

---

## Adding a New Lesson

1. Add a new lesson file under `shared/lessons/` (e.g. `lesson-my-topic.ts`) and export it from `shared/lessons/index.ts`, or edit an existing lesson file.
2. Keep lessons in order: do not skip `number` values.
3. Replace the "Coming Soon" stub if one exists for that lesson number.
4. Use the checklist below before considering it done.

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

## Describing interactive challenges

Interactive lessons and challenges are described **directly in the lesson file** using FEN positions plus `challenge` or `challengeSequence` (and optional `postChallenge`). There are no separate design documents. When adding or changing an interactive step, provide the FEN for the position and the correct move(s); verify the FEN and moves on [lichess.org/analysis](https://lichess.org/analysis), then run `npm run validate:lessons` and play through as a learner.

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

- [ ] **Run `npm run validate:lessons`** (from repo root) and fix any errors. The script checks FEN load, challenge move legality, square names, postChallenge.fen, and (for `challengeSequence`) that every user move and response is legal and that postChallenge.fen matches the final position when set.
- [ ] All FEN strings verified on [lichess.org/analysis](https://lichess.org/analysis)
- [ ] Lesson `id` is kebab-case and unique
- [ ] `number` is sequential with no gaps
- [ ] Each step has one focused concept
- [ ] Challenge / challengeSequence `from` squares have a piece in the corresponding FEN
- [ ] Challenge steps do not include highlights or arrows (keep them as puzzles)
- [ ] **Setup vs narrative:** For every step, the board (FEN + highlights/arrows) matches what the text describes.
- [ ] **Challenge vs concept:** For every challenge step, the correct move(s) demonstrate the stated concept (e.g. "Find the block" → the move is a block).
- [ ] **Play-through:** You have played through the lesson as a learner and completed every challenge.
- [ ] Text paragraphs separated with `\n\n`
- [ ] Bold (`**term**`) used for key chess terms
- [ ] Concept steps end with a sentence pointing to the board
- [ ] Lesson stub (if replacing one) keeps the same `id`
