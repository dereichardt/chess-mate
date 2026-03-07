import type { SharedLesson } from './types'
import { STARTING_FEN } from './constants'

const lessonSkewersDiscovered: SharedLesson = {
  id: 'skewers-discovered',
  number: 13,
  title: 'Skewers & Discovered Attacks',
  description:
    'Extend your tactics beyond forks and pins: the skewer and the discovered attack.',
  duration: '10 min',
  steps: [
    {
      title: 'Introduction',
      text: 'You already know the **fork** (one piece attacks two) and the **pin** (a piece cannot move without exposing a more valuable piece behind it). Two more powerful ideas complete your tactical toolkit: the **skewer** and the **discovered attack**.\n\nA **skewer** is the opposite of a pin: you attack the more valuable piece first. It must move, and you then capture the piece behind it. A **discovered attack** happens when you move one piece and reveal an attack from another — often with devastating effect.',
      narrationText:
        'You already know the fork and the pin. Two more powerful ideas complete your tactical toolkit: the skewer and the discovered attack.\n\nA skewer is the opposite of a pin: you attack the more valuable piece first. It must move, and you then capture the piece behind it. A discovered attack happens when you move one piece and reveal an attack from another — often with devastating effect.',
      fen: STARTING_FEN,
      interactive: false,
    },
    {
      title: 'The Skewer',
      text: 'In a **skewer**, your piece attacks two enemy pieces on the same line — with the *more* valuable piece in front. The valuable piece must move, and you then capture the piece behind it.\n\nHere White\'s rook on e1 attacks the black queen on e5. The queen is the more valuable piece and must move (or White takes it). Wherever the queen goes, it cannot defend the bishop on e8 — so after the queen moves, White plays **Rxe8** and wins the bishop. That is a classic rook skewer: attack the valuable piece first, then take the one behind.',
      narrationText:
        'In a skewer, your piece attacks two enemy pieces on the same line — with the more valuable piece in front. The valuable piece must move, and you then capture the piece behind it.\n\nHere White\'s rook on e1 attacks the black queen on e5. The queen is the more valuable piece and must move, or White takes it. Wherever the queen goes, it cannot defend the bishop on e8. So after the queen moves, White plays Rxe8 and wins the bishop. That is a classic rook skewer: attack the valuable piece first, then take the one behind.',
      fen: '4b3/8/8/4q3/8/8/8/4R3 w - - 0 1',
      interactive: false,
      fillSquares: ['e1', 'e5', 'e8'],
      arrows: [['e1', 'e8', 'rgba(34,197,94,0.85)']],
    },
    {
      title: 'Find the Skewer',
      text: 'White can play a rook move that skewers the black queen and bishop on the e-file.\n\nFind the square for the white rook that attacks the queen. After the queen moves, you will take the bishop on e8.',
      narrationText:
        'White can play a rook move that skewers the black queen and bishop on the e-file. Find the square for the white rook that attacks the queen. After the queen moves, you will take the bishop on e8.',
      fen: '4b3/8/8/4q3/8/8/8/R7 w - - 0 1',
      interactive: true,
      challenge: { from: 'a1', to: 'e1' },
    },
    {
      title: 'The Discovered Attack',
      text: 'A **discovered attack** happens when one of your pieces is blocking another on the same line. When you move the blocking piece away, the piece behind it **reveals** an attack — often with devastating effect.\n\nHere the white bishop on e3 is blocking the rook on e1. The rook would give check to the black king on e8 if the bishop weren\'t in the way. When White plays **Bxc5**, the bishop moves off the e-file and **captures** the black bishop on c5. At the same time, the rook is now **unmasked** and gives check on e8. Black must move the king; White has won a piece for free. That is a **discovered check**: the piece that moves does something (here, capture), and the piece behind gives check.',
      narrationText:
        'A discovered attack happens when one of your pieces is blocking another on the same line. When you move the blocking piece away, the piece behind it reveals an attack — often with devastating effect.\n\nHere the white bishop on e3 is blocking the rook on e1. The rook would give check to the black king on e8 if the bishop weren\'t in the way. When White plays Bxc5, the bishop moves off the e-file and captures the black bishop on c5. At the same time, the rook is now unmasked and gives check on e8. Black must move the king; White has won a piece for free. That is a discovered check: the piece that moves does something — here, capture — and the piece behind gives check.',
      fen: '4k3/8/8/2b5/8/4B3/8/4R1K1 w - - 0 1',
      interactive: false,
      fillSquares: ['e3', 'e1', 'e8', 'c5'],
      arrows: [
        ['e1', 'e8', 'rgba(34,197,94,0.85)'],
        ['e3', 'c5', 'rgba(239,68,68,0.7)'],
      ],
    },
    {
      title: 'Find the Discovered Attack',
      text: 'The white bishop on e3 is blocking the rook on e1 from the e-file. The black king is on e8 — so if the bishop moves off the file, the rook will give check.\n\nFind the bishop move that captures a black piece and at the same time reveals the rook\'s check. Black will have to move the king, and you will have won material.',
      narrationText:
        'The white bishop on e3 is blocking the rook on e1 from the e-file. The black king is on e8 — so if the bishop moves off the file, the rook will give check. Find the bishop move that captures a black piece and at the same time reveals the rook\'s check. Black will have to move the king, and you will have won material.',
      fen: '4k3/8/8/2b5/8/4B3/8/4R1K1 w - - 0 1',
      interactive: true,
      challenge: { from: 'e3', to: 'c5' },
      postChallenge: {
        fen: '4k3/8/8/2B5/8/8/8/4R1K1 b - - 0 1',
        movedFrom: 'e3',
        captureSquares: ['e8'],
        arrows: [['e1', 'e8', 'rgba(34,197,94,0.85)']],
      },
    },
  ],
}

export default lessonSkewersDiscovered
