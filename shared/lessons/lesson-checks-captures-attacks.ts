import type { SharedLesson } from './types'
import { STARTING_FEN } from './constants'

const lessonChecksCapturesAttacks: SharedLesson = {
  id: 'checks-captures-attacks',
  number: 7,
  title: 'Checks, Captures, Attacks',
  description:
    'A simple method to find good moves every turn: look for checks, then captures, then attacks.',
  duration: '12 min',
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
      title: 'Then Attacks (Threats)',
      text: 'If there is no winning check or capture, look for **attacks** — moves that create **threats**. An attack can mean moving a piece so it attacks an enemy piece (especially one that is undefended). Your opponent then has to deal with the threat; next move you may capture or win material.\n\nHere White has played **Bd4**, attacking the black knight on e5. The knight is undefended — nothing guards it. Next move White can play **Bxe5**, winning the knight for nothing. The attack was the first step of a simple tactic.',
      narrationText:
        'If there is no winning check or capture, look for attacks — moves that create threats. An attack can mean moving a piece so it attacks an enemy piece, especially one that is undefended. Your opponent then has to deal with the threat; next move you may capture or win material.\n\nHere White has played Bd4, attacking the black knight on e5. The knight is undefended — nothing guards it. Next move White can play B takes e5, winning the knight for nothing. The attack was the first step of a simple tactic.',
      fen: '7k/8/8/4n3/3B4/8/8/4K3 w - - 0 1',
      interactive: false,
      fillSquares: ['d4', 'e5'],
      arrows: [['d4', 'e5', 'rgba(34,197,94,0.85)']],
    },
    {
      title: 'Find the Check',
      text: 'White to move. Use CCA: **first** look for checks. Black\'s king is stuck on the back rank.\n\nFind the two-move sequence that delivers check-mate. Focus on finding check during each move.',
      narrationText:
        'White to move. Use CCA: first look for checks. Black\'s king is stuck on the back rank. Find the two-move sequence that delivers check-mate. Focus on finding check during each move.',
      fen: '6k1/2qb1ppp/p2p4/1pp5/8/4Q3/PP4PP/4R1K1 w - - 0 1',
      interactive: true,
      challengeSequence: [
        { from: 'e3', to: 'e8', response: { from: 'd7', to: 'e8' } },
        { from: 'e1', to: 'e8' },
      ],
      postChallenge: {
        fen: '4R1k1/2q2ppp/p2p4/1pp5/8/8/PP4PP/6K1 b - - 0 2',
        movedFrom: 'e1',
        fillSquares: ['e8'],
      },
    },
    {
      title: 'Find the Capture',
      text: 'No winning check here — so next in CCA we look for **captures**. Can White capture something and gain material?\n\n**Black has a pawn on d5 that White can capture.** Find the move that wins the pawn.',
      narrationText:
        'No winning check here — so next in CCA we look for captures. Can White capture something and gain material? Black has a pawn on d5 that White can capture. Find the move that wins the pawn.',
      fen: 'r1bq1rk1/ppp2ppp/2n2n2/2bpp3/2B1P3/2NP1N2/PPP2PPP/R1BQ1RK1 w - d6 0 7',
      interactive: true,
      challenge: { from: 'e4', to: 'd5' },
      postChallenge: {
        fen: 'r1bq1rk1/ppp2ppp/2n2n2/2bPp3/2B5/2NP1N2/PPP2PPP/R1BQ1RK1 b - - 0 7',
        movedFrom: 'e4',
        fillSquares: ['d5'],
        arrows: [['d5', 'c6', 'rgba(34,197,94,0.85)']],
      },
    },
    {
      title: 'Find the Attack',
      text: 'No winning check, no winning capture — so we look for **attacks**. Find the move that creates a threat by attacking an undefended black piece. Next move you would capture it.',
      narrationText:
        'No winning check, no winning capture — so we look for attacks. Find the move that creates a threat by attacking an undefended black piece. Next move you would capture it.',
      fen: '6k1/1p3p2/6p1/1P1n3p/P7/3N3P/5PP1/3B2K1 w - - 0 1',
      interactive: true,
      challenge: [
        { from: 'd1', to: 'b3' },
        { from: 'd1', to: 'f3' },
      ],
      postChallenge: {
        fen: '6k1/1p3p2/6p1/1P1n3p/P7/1B1N3P/5PP1/6K1 b - - 1 1',
        movedFrom: 'd1',
        fillSquares: ['b3', 'd5'],
        arrows: [['b3', 'd5', 'rgba(34,197,94,0.85)']],
      },
    },
    {
      title: 'Summary',
      text: 'On every turn, use **Checks, Captures, Attacks**:\n\n1. **Checks** — Do I have a check? It forces a reply.\n2. **Captures** — Can I capture something? Is it safe? Do I gain material?\n3. **Attacks** — What threats can I create? What do I attack?\n\nYou have practiced finding a check, a capture, and an attack — use this order every turn so you do not miss simple tactics. In the next lessons you will add piece values, defence, and a full thinking routine.',
      narrationText:
        'On every turn, use Checks, Captures, Attacks. One: Checks — do I have a check? It forces a reply. Two: Captures — can I capture something? Is it safe? Do I gain material? Three: Attacks — what threats can I create? You have practiced finding a check, a capture, and an attack — use this order every turn so you do not miss simple tactics.',
      fen: STARTING_FEN,
      interactive: false,
    },
  ],
}

export default lessonChecksCapturesAttacks
