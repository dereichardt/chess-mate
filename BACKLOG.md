# Backlog

Planned lessons, features, and bugs. Consult this file when adding or planning new lessons or features.

---

## Planned lessons

### Beginner curriculum (free)

A curriculum of **6 lessons** for players who have completed **New to Chess** (lessons 1–6) but are not yet advanced beginners. These lessons are **free** and sit between New to Chess and the paid Advanced Beginner curriculum. They give a repeatable move-finding system (Checks, Captures, Attacks) and habits that reduce blunders.

**Curriculum outline (6 lessons, numbers 7–12)** — ready for implementation. Each lesson follows the same format as Learn the Basics: theory steps with FENs and narration, plus interactive challenges where appropriate.

| # | Lesson | Purpose | Main content |
|---|--------|---------|--------------|
| 1 | **Checks, Captures, Attacks** | Give a repeatable move-finding system | **CCA:** Look for **checks** first (most forcing), then **captures**, then **attacks** (threats). Why this order; how it prevents missing simple tactics. Theory + 1–2 "find the best move using CCA" challenges. |
| 2 | **Piece Values & Simple Exchanges** | Know what you're trading | Piece values (P=1, N/B=3, R=5, Q=9). When a trade helps you (e.g. winning material, simplifying when ahead) vs hurts (giving a piece for nothing). "Don't leave pieces hanging." Optional: one "is this trade good?" challenge. |
| 3 | **Seeing Your Opponent's Threats** | One-move look-ahead | Before you move: What did they just play? What are they threatening? Find the threat so you don't walk into it. 1–2 "what is Black/White threatening?" or "find the move that stops the threat" challenges. |
| 4 | **Defending a Piece Under Attack** | Options when your piece is attacked | When your piece is attacked: **move it**, **defend it**, **block**, or **counter-attack**. When each is best. Simple examples; 1–2 "find the defence" challenges. Complements CCA (you look at your side too). |
| 5 | **Simple Checkmate Patterns** | Pattern recognition for common mates | Queen mate (boxing the king to the edge); checkmate in one; maybe a second pattern (e.g. two rooks ladder teaser). Visual, quick recognition. Keeps endgame feel without full Endgame Basics II. |
| 6 | **A Simple Thinking Routine** | Tie it together | Short, meta lesson: (1) Opponent's last move and threats, (2) Then CCA for your candidate moves, (3) Before playing, one more look. Puts CCA and "see their threats" into a single habit. Can include one combined "find the move" position. |

**Implementation notes (when building):**

- **Lesson IDs / slugs**: `checks-captures-attacks`, `piece-values-exchanges`, `seeing-opponent-threats`, `defending-under-attack`, `simple-checkmate-patterns`, `thinking-routine`. Add to shared lessons, backend lesson list, and Prisma seed. These lessons are **free** (no paywall).
- **Order**: Lesson numbers 7–12. Advanced Beginner becomes 13–18; Early Intermediate 19–24.

---

### Advanced Beginner curriculum (paid)

A curriculum of **6 lessons** (numbers **13–18**) that take a player to **advanced beginner** level. This curriculum is **paid** (gated by subscription); see [Monetization](#monetization). It builds on the free curriculum (New to Chess 1–6 and Beginner 7–12).

**Curriculum outline (6 lessons)** — ready for implementation. Order is chosen so tactics and endgame patterns build on the free curriculum. Each lesson should follow the same format as Learn the Basics: theory steps with FENs and narration, plus interactive challenges where appropriate.

| # | Lesson | Purpose | Main content |
|---|--------|---------|--------------|
| 1 | **Skewers & Discovered Attacks** ✅ | Extend tactics beyond fork/pin | **Skewer**: one piece attacks through another to a more valuable piece behind; the front piece must move, you win the one behind. **Discovered attack**: moving a piece reveals an attack from another (discovered check, or attack on a piece). Theory for each + 1–2 interactive challenges per motif. |
| 2 | **Endgame Basics II** | Essential checkmate patterns and endgame awareness | **Ladder mate**: two rooks (or rook + queen) on adjacent ranks/files, taking turns to give check and push the king to the edge. Theory + at least one challenge (e.g. deliver ladder mate with two rooks vs lone king). **Back-rank mate**: king trapped on the back rank by its own pieces; rook or queen gives checkmate along the rank. One theory step + one challenge. **Optional**: short reinforcement of stalemate awareness in endgames (link to Check/Checkmate/Stalemate). |
| 3 | **King and Pawn: Rule of the Square** | When can the defending king catch a passed pawn? | **Rule of the square**: simple visual rule to decide if the king can catch a pawn before it promotes. Theory with clear diagrams + 1–2 challenges (“can the king catch the pawn?” or “find the move that draws”). Keeps Endgame Basics II focused on checkmating; this lesson is the natural next step after king-and-pawn in the free Endgame Basics. |
| 4 | **The Back Rank & Making Luft** | Apply back-rank ideas in the middlegame | **Avoiding back-rank mate**: creating an escape square (“luft”) for the king (e.g. h3/h6, or moving a pawn in front of the king). When to make luft proactively. Theory + 1–2 challenges (e.g. “find the move that avoids back-rank mate” or “create luft”). Connects Endgame Basics II to practical play. |
| 5 | **Double Attack & Deflection** | More tactical weapons | **Double attack**: recap the idea of “two threats at once” (beyond knight fork); queen or other pieces attacking two targets. **Deflection** (and simple **decoy**): forcing a defending piece away so a key square or piece is undefended. Theory for each + 1–2 challenges. Builds on Basic Tactics and Skewers/Discovered. |
| 6 | **Simple Strategy: Weak Squares & Piece Activity** | First steps in positional play | **Weak squares**: squares that cannot be defended by pawns; outposts for knights. **Piece activity**: good vs bad pieces; the idea of “improve your worst piece.” No deep pawn-structure theory yet—keep it visual and practical. Theory with 1–2 illustrative positions; optional “find the improvement” challenge. Sets up future Study Openings / deeper strategy. |

**Implementation notes (when building):**

- **Lesson IDs / slugs**: e.g. `skewers-discovered`, `endgame-basics-ii`, `rule-of-the-square`, `back-rank-luft`, `double-attack-deflection`, `weak-squares-activity`. Add to shared lessons, backend lesson list, and Prisma seed; ensure they are gated as premium (lesson **number** 13–18).
- **Narration**: Same pattern as Learn the Basics—`narrationText` per step, backend TTS for premium lessons when implemented.
- **Paywall**: Any route or lesson list that serves these six lessons must check subscription; show upgrade CTA for free users (see [Monetization](#monetization)).
- **Order**: Lessons 13–18 are designed to be taken in sequence but could be relaxed to “recommended order” if you later allow jumping.
- **Optional merge**: If you prefer a 5-lesson curriculum, “Rule of the Square” (lesson 3) can be folded into Endgame Basics II as an extra section; the back-rank/luft lesson (4) still fits well after that.

---

### Early Intermediate curriculum (paid)

A second paid curriculum of **6 lessons** for **early intermediate** players who have completed the Advanced Beginner track. This curriculum is **paid** (gated by subscription); see [Monetization](#monetization). It assumes the player can spot basic tactics and simple positional ideas (weak squares, piece activity, etc.).

**Curriculum outline (6 lessons)** — for implementation when ready. Same format as other lessons: theory steps with FENs and narration, plus interactive challenges where appropriate.

| # | Lesson | Purpose | Main content |
|---|--------|---------|--------------|
| 1 | **Piece Continuity** | Avoid/exploit "forgot it no longer defends" errors | When a piece moves, it stops defending/attacking what it used to. Examples: moving a defender leaves a piece loose; opponent's move leaves a tactic. 1–2 "find the shot" challenges. |
| 2 | **Prophylaxis: Preventing Your Opponent's Plans** | Play with the opponent's ideas in mind | Ask "what does my opponent want?" (threats, pawn breaks, piece routes). Moves that improve your position and restrict theirs. Simple examples: preventing a pin, taking the sting out of a back-rank idea, blocking a dangerous advance. |
| 3 | **When to Trade Pieces** | Make exchange decisions intentional | Trade when ahead in material (simplify), when under pressure (reduce attackers), or to remove the opponent's best piece. Avoid trading when behind (need counterplay) or when your pieces are more active. Optional: bishop vs knight in open vs closed positions. |
| 4 | **Planning in the Middlegame** | Move from one-move threats to simple plans | After the opening: identify a weakness (piece to improve, square to target, pawn to attack), then play 2–3 moves toward that goal. "Improve your worst piece" and "play on the side where you are stronger" with one or two clear examples. |
| 5 | **Pawn Structure Basics** | Use structure to guide plans | Weak pawns (isolated, backward, doubled) and pawn islands; which structures favour knights vs bishops. One main structure (e.g. isolated queen pawn) with "what each side usually wants" — no heavy theory, just ideas. |
| 6 | **Piece Coordination** | Pieces working together | Batteries (rook behind queen/rook on a file), overload (one piece defending two things), and simple coordination vs scattered pieces. 1–2 positions where the right move coordinates; optional challenge "find the coordinating move." |

**Implementation notes (when building):**

- **Lesson IDs / slugs**: e.g. `piece-continuity`, `prophylaxis`, `when-to-trade`, `planning-middlegame`, `pawn-structure-basics`, `piece-coordination`. Add to shared lessons, backend lesson list, and Prisma seed; gate as premium (same pattern as Advanced Beginner).
- **Place in app:** Either a third section on the Learn page (e.g. "Early Intermediate") or a separate track/page; product decision at implementation time.
- **Order:** Assumes completion of Learn the Basics (1–6), Beginner (7–12), and Advanced Beginner (13–18). Early Intermediate can be numbered 19–24 or as a separate track.

---

## Implemented

- **Beginner curriculum (lessons 7–12)** — Six free lessons between New to Chess and Advanced Beginner: Checks, Captures, Attacks; Piece Values & Simple Exchanges; Seeing Your Opponent's Threats; Defending a Piece Under Attack; Simple Checkmate Patterns; A Simple Thinking Routine. Shared lessons, backend narration lookup, seed; three-section Learn page (New to Chess, Beginner, Advanced Beginner); Pro gating from lesson 13 onward.
- **Skewers & Discovered Attacks (Advanced Beginner lesson 13)** — Pro lesson at `/learn/skewers-discovered`. Skewer: queen in front, bishop behind, rook on e-file; Find the Skewer challenge (Re1). Discovered attack: bishop blocks rook on e-file; Bxc5 reveals discovered check, Find the Discovered Attack challenge with postChallenge visuals (arrow rook→king, king highlighted). Shared lesson, backend narration, seed; gated by Pro.
- **Lesson narration for lessons 2–6** — Narration (ElevenLabs) is available for all six Learn the Basics lessons. Backend resolves step text from shared lessons and caches audio; frontend shows the play/pause control on every lesson (interactive indicator sits just above narration on challenge steps).
- **Authenticated home / dashboard** — Logged-in users get a separate home experience (e.g. `/home` or `/learn`) with app layout (sidebar), where to continue, and ways to explore content; unauthenticated visitors keep the landing page at `/`. Further improvements planned later.

---

## Future features

- **Study Openings** — Build out the openings study feature (currently a placeholder page).
- **Solve Puzzles** — Build out the puzzle-solving feature (route and backend exist; UI not yet built).

---

## Data storage / Progress

**Status: Implemented.**

- **Logged-in users:** Progress is read from the backend on app load or login (`useProgressHydration` → GET `/api/progress`) and written when the user advances or completes a lesson (`useProgress` → POST `/api/progress/lesson/:lessonId`). The frontend progress store is in-memory only; the database is the source of truth for saved progress.
- **Not logged in:** Progress is in-memory only and is lost on refresh. No persistence.
- **On logout:** The progress store is cleared so the UI does not show the previous user’s progress.

**Implementation details:**
- Backend: GET `/api/progress` and POST `/api/progress/lesson/:lessonId` (auth required). Prisma `LessonProgress` model. Seed ensures `Lesson` ids match frontend slugs (e.g. `endgame-basics`, `how-pieces-move`).
- Frontend: `chessService.getProgress()` / `updateLessonProgress()`; API client sends Bearer token. Progress store has no persist; `clear()` is called on logout.

---

## Monetization

**Model:** Subscription. Simple free vs paid; no tiers for now.

- **Free:** Learn the Basics (lessons 1–6) and **Beginner curriculum** (lessons 7–12) — always accessible.
- **Paid:** Subscription (“Premium” or “Pro”) unlocks:
  - **Advanced Beginner curriculum** (lessons 13–18).
  - **Early Intermediate curriculum** (6 lessons: piece continuity, prophylaxis, when to trade, planning, pawn structure basics, piece coordination).
  - **Study Openings**.
  - **Solve Puzzles**.

**Paywall scope:** Access to the Advanced Beginner lessons, Early Intermediate lessons, Openings, and Puzzles (routes/APIs) requires an active subscription. Unauthenticated or free users see an upgrade CTA when visiting those areas.

**Implementation (future):**
- Payment provider: e.g. Stripe (Checkout or Customer Portal for subscriptions).
- Store subscription status: extend User model or add Subscription model; persist status from webhooks.
- Backend: check subscription before serving premium routes/APIs; return 402 or redirect to upgrade when not subscribed.
- Frontend: gate Advanced Beginner lessons, Early Intermediate lessons, /openings, and /puzzles (e.g. show upgrade prompt or paywall page when not subscribed).
- Pricing, billing interval (monthly/annual), and product naming TBD at implementation time.

---

## Bugs

_(Add bugs or issues here as needed.)_
