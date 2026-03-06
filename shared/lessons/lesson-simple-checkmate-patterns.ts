import type { SharedLesson } from './types'

const lessonSimpleCheckmatePatterns: SharedLesson = {
  id: 'simple-checkmate-patterns',
  number: 11,
  title: 'Simple Checkmate Patterns',
  description: 'Recognise common checkmate patterns: queen boxing the king and checkmate in one.',
  duration: '8 min',
  steps: [
    {
      title: 'Queen and King: Boxing the King',
      text: 'With a queen and your king, you can checkmate the enemy king by **pushing it to the edge**. The queen controls rows and diagonals; you use it to take away squares from the enemy king while your own king helps. Step by step, the enemy king is "boxed" until it is on the back rank with no escape — then you deliver checkmate.\n\nHere White can give checkmate in one. The black king on h8 has no escape. Find **Qh7#**.',
      narrationText:
        'With a queen and your king, you checkmate by pushing the enemy king to the edge. Here White can give checkmate in one. The black king on h8 has no escape. Find Qh7 checkmate.',
      fen: '7k/8/8/8/8/8/5Q2/4K3 w - - 0 1',
      interactive: true,
      challenge: { from: 'f2', to: 'h7' },
    },
    {
      title: 'Checkmate in One',
      text: 'In games you will often see a position where one side can deliver **checkmate in one move**. The key is to look for checks that also take away every escape square from the enemy king.\n\nPattern recognition helps: back-rank mate (rook or queen on the last rank, king trapped), queen next to the king with support, two rooks on adjacent ranks (ladder). After you learn these shapes, you spot them quickly.',
      narrationText:
        'In games you will often see a position where one side can deliver checkmate in one move. Pattern recognition helps: back-rank mate, queen next to the king, two rooks. After you learn these shapes, you spot them quickly.',
      fen: '5rk1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1',
      interactive: false,
      fillSquares: ['e8', 'g8'],
      arrows: [['e1', 'e8', 'rgba(34,197,94,0.85)']],
    },
    {
      title: 'Find the Checkmate',
      text: 'White to move. The black king is on g8 with pawns on f7 and g7. The white rook on e1 can give check along the e-file — but the king can move to f8. So we need a check that leaves no escape. **Re8** is check, and the king cannot move (f8 is controlled by the rook). That is checkmate. Find **Re8#**.',
      narrationText:
        'White to move. Re8 is check, and the king cannot move to f8. That is checkmate. Find Re8.',
      fen: '5rk1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1',
      interactive: true,
      challenge: { from: 'e1', to: 'e8' },
    },
  ],
}

export default lessonSimpleCheckmatePatterns
