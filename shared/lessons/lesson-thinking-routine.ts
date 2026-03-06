import type { SharedLesson } from './types'
import { STARTING_FEN } from './constants'

const lessonThinkingRoutine: SharedLesson = {
  id: 'thinking-routine',
  number: 12,
  title: 'A Simple Thinking Routine',
  description: 'Tie it together: look at their move and threats, then use CCA, then look once more before you play.',
  duration: '6 min',
  steps: [
    {
      title: 'The Routine',
      text: 'You have learned **Checks, Captures, Attacks** and the importance of **seeing your opponent\'s threats**. Now put them into one simple routine for every turn:\n\n**1. What did they just play? What are they threatening?** — Do not move until you understand their last move. If they threatened something, make sure you address it.\n\n**2. Then use CCA for your move** — Look for checks, then captures, then attacks. Find your best candidate.\n\n**3. Before you play, one more look** — Is my move safe? Am I leaving a piece hanging? Is there a simple tactic for them? This final check catches many blunders.',
      narrationText:
        'Put everything into one routine. One: What did they just play? What are they threatening? Two: Use CCA for your move — checks, captures, attacks. Three: Before you play, one more look. Is my move safe? Am I leaving a piece hanging? This final check catches many blunders.',
      fen: STARTING_FEN,
      interactive: false,
    },
    {
      title: 'Practice: Find the Move',
      text: 'White to move. Use the routine: (1) What is Black threatening? The knight on f6 attacks e4. (2) CCA: any check? **Qh5** gives check and attacks f7. (3) Is Qh5 safe? The queen is not attacked. Find **Qh5**.',
      narrationText:
        'White to move. What is Black threatening? The knight attacks e4. CCA: Qh5 gives check and attacks f7. Is Qh5 safe? Yes. Find Qh5.',
      fen: 'rnbqkbnr/pppp1ppp/8/4p3/2B1P3/8/PPPP1PPP/RNBQKBNR w KQkq - 2 2',
      interactive: true,
      challenge: { from: 'd1', to: 'h5' },
    },
    {
      title: 'Summary',
      text: 'Your **thinking routine**: (1) Their move and threats, (2) CCA for your move, (3) One more look before you play. Use it every game. With the free curriculum complete — New to Chess and Beginner — you are ready for the **Advanced Beginner** lessons: skewers, discovered attacks, endgame patterns, and more.',
      narrationText:
        'Your thinking routine: their move and threats, then CCA, then one more look. Use it every game. You are ready for the Advanced Beginner lessons.',
      fen: STARTING_FEN,
      interactive: false,
    },
  ],
}

export default lessonThinkingRoutine
