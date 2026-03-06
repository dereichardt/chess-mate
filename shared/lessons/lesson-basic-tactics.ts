import type { SharedLesson } from './types'
import { STARTING_FEN } from './constants'

const lessonBasicTactics: SharedLesson = {
  id: 'basic-tactics',
  number: 3,
  title: 'Basic Tactics: Forks & Pins',
  description: 'Discover the two most common tactical patterns: the fork and the pin.',
  duration: '8 min',
  steps: [
    {
      title: 'Introduction to Tactics',
      text: 'So far you have learned how pieces move and how the board is organised. Now we turn to tactics — short sequences of moves that win material or deliver checkmate by force.\n\nA tactic works by creating a threat your opponent cannot fully answer. The two most fundamental tactical patterns are the **fork** and the **pin**. Master these and you will immediately start winning more games.',
      narrationText: 'So far you have learned how pieces move and how the board is organised. Now we turn to tactics — short sequences of moves that win material or deliver checkmate by force.\n\nA tactic works by creating a threat your opponent cannot fully answer. The two most fundamental tactical patterns are the fork and the pin. Master these and you will immediately start winning more games.',
      fen: STARTING_FEN,
      interactive: false,
    },
    {
      title: 'The Fork',
      text: 'A fork is a single move that attacks two or more enemy pieces at the same time. Because your opponent can only move one piece per turn, they cannot save both — you are guaranteed to win at least one of them.\n\nHere the white knight on e5 simultaneously attacks the black rook on c6 and the black king on g6. Black must move the king out of check, and White captures the rook for free.\n\nAny piece can deliver a fork, but the **knight** is the most feared forker — its L-shaped leap is notoriously hard to see coming.',
      narrationText: 'A fork is a single move that attacks two or more enemy pieces at the same time. Because your opponent can only move one piece per turn, they cannot save both — you are guaranteed to win at least one of them.\n\nHere the white knight on e5 simultaneously attacks the black rook on c6 and the black king on g6. Black must move the king out of check, and White captures the rook for free.\n\nAny piece can deliver a fork, but the knight is the most feared forker — its L-shaped leap is notoriously hard to see coming.',
      fen: '8/8/2r3k1/4N3/8/8/8/8 w - - 0 1',
      interactive: false,
      captureSquares: ['c6', 'g6'],
      arrows: [
        ['e5', 'g6', 'rgba(34,197,94,0.85)'],
        ['e5', 'c6', 'rgba(34,197,94,0.85)'],
      ],
    },
    {
      title: 'Find the Fork',
      text: 'The white knight is one jump away from forking the black rook and king at the same time.\n\nCan you find the square? Drag the knight to the square that attacks both pieces simultaneously.',
      narrationText: 'The white knight is one jump away from forking the black rook and king at the same time.\n\nCan you find the square? Drag the knight to the square that attacks both pieces simultaneously.',
      fen: '8/8/2r3k1/8/8/5N2/8/8 w - - 0 1',
      interactive: true,
      challenge: { from: 'f3', to: 'e5' },
    },
    {
      title: 'The Pin',
      text: "A pin is an attack on a piece that cannot move without exposing a more valuable piece behind it to capture.\n\nHere the white bishop on b2 fires along the b2–h8 diagonal, pinning the black knight on e5. If the knight moves, the bishop captures the king — which is illegal. The knight is frozen in place.\n\nA pin against the king (where the pinned piece literally cannot move) is called an **absolute pin**. Pinned pieces make poor defenders — look for ways to attack them further.",
      narrationText: "A pin is an attack on a piece that cannot move without exposing a more valuable piece behind it to capture.\n\nHere the white bishop on b2 fires along the b2–h8 diagonal, pinning the black knight on e5. If the knight moves, the bishop captures the king — which is illegal. The knight is frozen in place.\n\nA pin against the king (where the pinned piece literally cannot move) is called an absolute pin. Pinned pieces make poor defenders — look for ways to attack them further.",
      fen: '7k/8/8/4n3/8/8/1B6/8 w - - 0 1',
      interactive: false,
      captureSquares: ['e5'],
      arrows: [['b2', 'h8', 'rgba(34,197,94,0.85)']],
    },
    {
      title: 'Find the Pin',
      text: "The white bishop is not yet on the pinning diagonal — but it can slide there in one move.\n\nFind the square where the bishop pins the black knight against the king, making it unable to move.",
      narrationText: "The white bishop is not yet on the pinning diagonal — but it can slide there in one move.\n\nFind the square where the bishop pins the black knight against the king, making it unable to move.",
      fen: '7k/8/8/4n3/8/8/8/2B5 w - - 0 1',
      interactive: true,
      challenge: { from: 'c1', to: 'b2' },
    },
  ],
}

export default lessonBasicTactics
