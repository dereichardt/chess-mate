import type { SharedLesson } from './types'
import { STARTING_FEN } from './constants'

const lessonDefendingUnderAttack: SharedLesson = {
  id: 'defending-under-attack',
  number: 10,
  title: 'Defending a Piece Under Attack',
  description: 'When your piece is attacked, you have four options: move it, defend it, block, or counter-attack.',
  duration: '7 min',
  steps: [
    {
      title: 'Four Ways to Respond',
      text: 'When your opponent attacks one of your pieces, you have four main options:\n\n**1. Move it** — Get the piece out of danger to a safe square.\n**2. Defend it** — Add a defender so that if they capture, you recapture (or win material).\n**3. Block** — Put a piece between the attacker and your piece (works against long-range pieces like rooks and bishops).\n**4. Counter-attack** — Attack something of theirs — often a more valuable piece — so they must respond and may not have time to take yours.\n\nChoose the option that keeps you safe or wins material.',
      narrationText:
        'When your opponent attacks one of your pieces, you have four options. One: move it to a safe square. Two: defend it so that if they capture, you recapture. Three: block — put a piece between the attacker and your piece. Four: counter-attack — attack something of theirs so they must respond. Choose the option that keeps you safe or wins material.',
      fen: STARTING_FEN,
      interactive: false,
    },
    {
      title: 'Defend or Move',
      text: 'Here the black bishop on c5 attacks the white knight on f2. White has two simple options: **move** the knight (e.g. Nd3 or Ne4) or **defend** it (e.g. Qe2 or Nc3).\n\nIf White defends with **Nc3**, the knight on f2 is now defended by the queen. If Black plays Bxf2+, White recaptures with Kxf2 and the position is roughly equal. Find the defending move Nc3.',
      narrationText:
        'The black bishop attacks the white knight on f2. White can move the knight or defend it. Defend with Nc3 so the knight is defended by the queen. Find the move Nc3.',
      fen: 'r1bqk1nr/pppp1ppp/2n5/2b1p3/4P3/8/PPPP1NPP/RNBQKB1R w KQkq - 4 3',
      interactive: true,
      challenge: { from: 'b1', to: 'c3' },
    },
    {
      title: 'Defend, Then Recapture',
      text: 'First **defend** the knight on f2 by playing Nc3. Black may still take the pawn with **Bxf2+**. Then find White\'s recapture: **Kxf2** to keep the position equal.',
      narrationText:
        'First defend the knight on f2 by playing Nc3. Black may still take the pawn with Bxf2 plus. Then find White\'s recapture: Kxf2 to keep the position equal.',
      fen: 'r1bqk1nr/pppp1ppp/2n5/2b1p3/4P3/8/PPPP1NPP/RNBQKB1R w KQkq - 4 3',
      interactive: true,
      challengeSequence: [
        { from: 'b1', to: 'c3', response: { from: 'c5', to: 'f2' } },
        { from: 'e1', to: 'f2' },
      ],
    },
    {
      title: 'Summary',
      text: 'When your piece is under attack, think: **move, defend, block, or counter-attack**. Often the best choice is clear — move to safety or add a defender. Blocking works when the attacker is a bishop, rook, or queen on a long line. Counter-attacking is strong when you can threaten something more valuable. Combine this with CCA when it is your turn to move.',
      narrationText:
        'When your piece is under attack, think: move, defend, block, or counter-attack. Combine this with CCA when it is your turn to move.',
      fen: STARTING_FEN,
      interactive: false,
    },
  ],
}

export default lessonDefendingUnderAttack
