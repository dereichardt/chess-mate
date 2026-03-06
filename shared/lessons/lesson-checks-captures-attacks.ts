import type { SharedLesson } from './types'
import { STARTING_FEN } from './constants'

const lessonChecksCapturesAttacks: SharedLesson = {
  id: 'checks-captures-attacks',
  number: 7,
  title: 'Checks, Captures, Attacks',
  description:
    'A simple method to find good moves every turn: look for checks, then captures, then attacks.',
  duration: '8 min',
  steps: [
    {
      title: 'Introduction',
      text: 'You know the rules and basic tactics like forks and pins. But when it is your turn, how do you actually find good moves? The **Checks, Captures, Attacks** method — or CCA — gives you a repeatable order to look at moves so you do not miss simple wins.\n\nOn every turn, look at **checks** first, then **captures**, then **attacks** (threats). Forcing moves like checks and captures limit what your opponent can do and often lead to winning material or checkmate.',
      narrationText:
        'You know the rules and basic tactics like forks and pins. But when it is your turn, how do you actually find good moves? The Checks, Captures, Attacks method — or CCA — gives you a repeatable order to look at moves so you do not miss simple wins.\n\nOn every turn, look at checks first, then captures, then attacks — threats. Forcing moves like checks and captures limit what your opponent can do and often lead to winning material or checkmate.',
      fen: STARTING_FEN,
      interactive: false,
    },
    {
      title: 'Checks First',
      text: '**Checks** are the most forcing moves. Your opponent must respond to a check — they cannot ignore it. So the first thing to ask is: do I have any check? Sometimes a check wins material, delivers checkmate, or forces the king into a bad position.\n\nHere White can play **Qh5**, giving check and attacking the loose pawn on f7. White\'s **light-squared bishop** on c4 is part of the attack too — it defends the queen so Black cannot simply take it. Black must deal with the check; White will win the pawn or more.',
      narrationText:
        'Checks are the most forcing moves. Your opponent must respond to a check — they cannot ignore it. So the first thing to ask is: do I have any check? Sometimes a check wins material, delivers checkmate, or forces the king into a bad position.\n\nHere White can play Qh5, giving check and attacking the loose pawn on f7. White\'s light-squared bishop on c4 is part of the attack too — it defends the queen so Black cannot simply take it. Black must deal with the check; White will win the pawn or more.',
      fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 0 1',
      interactive: false,
      fillSquares: ['h5', 'c4'],
      captureSquares: ['f7'],
      arrows: [['h5', 'f7', 'rgba(34,197,94,0.85)']],
    },
    {
      title: 'Then Captures',
      text: 'After looking for checks, look for **captures**. A capture that wins material or forces a good reply is often the best move. Ask: can I capture something? Is the capture safe? Do I win material?\n\nHere Black\'s e5 pawn is undefended. White can play **Nxe5**, capturing the pawn. White wins a pawn for nothing — a clear gain. Good captures are ones where you take something your opponent cannot recapture, or where you gain material.',
      narrationText:
        'After looking for checks, look for captures. A capture that wins material or forces a good reply is often the best move. Ask: can I capture something? Is the capture safe? Do I win material?\n\nHere Black\'s e5 pawn is undefended. White can play Nxe5, capturing the pawn. White wins a pawn for nothing — a clear gain. Good captures are ones where you take something your opponent cannot recapture, or where you gain material.',
      fen: 'rnbqkb1r/pppp1ppp/5n2/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3',
      interactive: false,
      fillSquares: ['f3'],
      captureSquares: ['e5'],
      arrows: [['f3', 'e5', 'rgba(34,197,94,0.85)']],
    },
    {
      // TODO: Revisit — consider an interactive challenge that emphasises the A (Attack/threat), e.g. find a move that creates a threat rather than a check or capture.
      title: 'Find the Best Move',
      text: 'White to move. Use CCA: is there a check? A capture? An attack?\n\nThe black queen on d8 is undefended. Find the white move that captures it: **Qxd8**. (After you take, you even give check — so Black cannot recapture.)',
      narrationText:
        'White to move. Use CCA: is there a check? A capture? An attack? The black queen on d8 is undefended. Find the white move that captures it: Q takes d8. After you take, you even give check, so Black cannot recapture.',
      fen: '3q2k1/3Q4/8/8/8/8/8/4K3 w - - 0 1',
      interactive: true,
      challenge: { from: 'd7', to: 'd8' },
    },
    {
      title: 'Summary',
      text: 'On every turn, use **Checks, Captures, Attacks**:\n\n1. **Checks** — Do I have a check? It forces a reply.\n2. **Captures** — Can I capture something? Is it safe? Do I gain material?\n3. **Attacks** — What threats can I create? What do I attack?\n\nThis order helps you not miss simple tactics. In the next lessons you will add piece values, defence, and a full thinking routine.',
      narrationText:
        'On every turn, use Checks, Captures, Attacks. One: Checks — do I have a check? It forces a reply. Two: Captures — can I capture something? Is it safe? Do I gain material? Three: Attacks — what threats can I create? This order helps you not miss simple tactics.',
      fen: STARTING_FEN,
      interactive: false,
    },
  ],
}

export default lessonChecksCapturesAttacks
