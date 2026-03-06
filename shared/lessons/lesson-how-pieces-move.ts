/**
 * Single source of truth for Lesson 1 (How the Pieces Move): display content and
 * optional narration text for TTS. Backend uses narrationText when present, else text.
 */

import type { SharedLesson } from './types'

const STARTING_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'

const lessonHowPiecesMove: SharedLesson = {
  id: 'how-pieces-move',
  number: 1,
  title: 'How the Pieces Move',
  description:
    'Learn the movement rules for every chess piece — from the humble pawn to the mighty queen.',
  duration: '10 min',
  steps: [
    {
      title: 'Introduction',
      text: "Chess is played on an 8×8 board between two players — White and Black. Each player starts with 16 pieces: 1 king, 1 queen, 2 rooks, 2 bishops, 2 knights, and 8 pawns.\n\nThe goal is to checkmate your opponent's king — put it in a position where it is under attack and cannot escape. Before we get to strategy, we need to understand how each piece moves.",
      narrationText:
        "Chess is played on an 8 by 8 board between two players — White and Black. Each player starts with 16 pieces: 1 king, 1 queen, 2 rooks, 2 bishops, 2 knights, and 8 pawns.\n\nThe goal is to checkmate your opponent's king — put it in a position where it is under attack and cannot escape. Before we get to strategy, we need to understand how each piece moves.",
      fen: STARTING_FEN,
      interactive: false,
    },
    {
      title: 'The Pawn',
      text: 'Pawns are the foot soldiers of chess. They move forward one square at a time — but on their very first move they may advance two squares.\n\nPawns capture diagonally: one square forward and to either side. They cannot capture straight ahead.\n\nHere a white pawn sits on f2, its starting square. Move it to f4 and see how the board highlights e5 and g5 as capture squares (red) and f5 as a legal push (green).',
      narrationText:
        'Pawns are the foot soldiers of chess. They move forward one square at a time — but on their very first move they may advance two squares.\n\nPawns capture diagonally: one square forward and to either side. They cannot capture straight ahead.\n\nHere a white pawn sits on f2, its starting square. Move it to f4 and see how the board highlights e5 and g5 as capture squares, shown in red, and f5 as a legal push, shown in green.',
      fen: '8/8/8/4p1p1/8/8/5P2/8 w - - 0 1',
      highlightSquares: ['f3', 'f4'],
      interactive: true,
    },
    {
      title: 'The Rook',
      text: 'The rook moves any number of squares horizontally or vertically — along ranks (rows) or files (columns). It cannot jump over other pieces.\n\nRooks are most powerful in open positions where no pawns block their paths. Two rooks working together on the seventh rank can be devastating.\n\nHere a white rook sits on d4. It can reach any highlighted square in a single move.',
      narrationText: 'The rook moves any number of squares horizontally or vertically — along ranks (rows) or files (columns). It cannot jump over other pieces.\n\nRooks are most powerful in open positions where no pawns block their paths. Two rooks working together on the seventh rank can be devastating.\n\nHere a white rook sits on d4. It can reach any highlighted square in a single move.',
      fen: '8/8/8/8/3R4/8/8/8 w - - 0 1',
      highlightSquares: ['d1', 'd2', 'd3', 'd5', 'd6', 'd7', 'd8', 'a4', 'b4', 'c4', 'e4', 'f4', 'g4', 'h4'],
      interactive: true,
    },
    {
      title: 'The Knight',
      text: 'The knight is the only piece that can jump over other pieces. It moves in an "L" shape: two squares in one direction, then one square perpendicular — or vice versa.\n\nBecause it jumps, the knight is especially useful in crowded positions where other pieces are blocked.\n\nHere a white knight sits on d4. It can jump to any of the highlighted squares.',
      narrationText: 'The knight is the only piece that can jump over other pieces. It moves in an "L" shape: two squares in one direction, then one square perpendicular — or vice versa.\n\nBecause it jumps, the knight is especially useful in crowded positions where other pieces are blocked.\n\nHere a white knight sits on d4. It can jump to any of the highlighted squares.',
      fen: '8/8/8/8/3N4/8/8/8 w - - 0 1',
      highlightSquares: ['c2', 'e2', 'b3', 'f3', 'b5', 'f5', 'c6', 'e6'],
      interactive: true,
    },
    {
      title: 'The Bishop',
      text: 'The bishop moves any number of squares diagonally. Because of this, each bishop is permanently bound to the color of the square it starts on — one bishop travels light squares, the other dark squares.\n\nBishops thrive in open positions with long diagonals. A bishop on a long unobstructed diagonal can control both sides of the board.\n\nHere a white bishop sits on d4. Notice it can only ever reach squares of one color.',
      narrationText: 'The bishop moves any number of squares diagonally. Because of this, each bishop is permanently bound to the color of the square it starts on — one bishop travels light squares, the other dark squares.\n\nBishops thrive in open positions with long diagonals. A bishop on a long unobstructed diagonal can control both sides of the board.\n\nHere a white bishop sits on d4. Notice it can only ever reach squares of one color.',
      fen: '8/8/8/8/3B4/8/8/8 w - - 0 1',
      highlightSquares: ['a1', 'b2', 'c3', 'e5', 'f6', 'g7', 'h8', 'a7', 'b6', 'c5', 'e3', 'f2', 'g1'],
      interactive: true,
    },
    {
      title: 'The Queen',
      text: 'The queen is the most powerful piece on the board. She combines the moves of the rook and the bishop — she can move any number of squares horizontally, vertically, or diagonally.\n\nBecause of her power, losing the queen is usually catastrophic. Players often say "losing the queen for a rook" (a trade of queen for rook) is a major disadvantage.\n\nHere a white queen sits on d4 — she can reach an enormous number of squares in one move.',
      narrationText: 'The queen is the most powerful piece on the board. She combines the moves of the rook and the bishop — she can move any number of squares horizontally, vertically, or diagonally.\n\nBecause of her power, losing the queen is usually catastrophic. Players often say "losing the queen for a rook" (a trade of queen for rook) is a major disadvantage.\n\nHere a white queen sits on d4 — she can reach an enormous number of squares in one move.',
      fen: '8/8/8/8/3Q4/8/8/8 w - - 0 1',
      highlightSquares: [
        'd1', 'd2', 'd3', 'd5', 'd6', 'd7', 'd8',
        'a4', 'b4', 'c4', 'e4', 'f4', 'g4', 'h4',
        'a1', 'b2', 'c3', 'e5', 'f6', 'g7', 'h8',
        'a7', 'b6', 'c5', 'e3', 'f2', 'g1',
      ],
      interactive: true,
    },
    {
      title: 'The King',
      text: "The king can move one square in any direction — horizontally, vertically, or diagonally. He is slow but essential: if he is captured, the game is over.\n\nThe most important rule: the king can never move to a square where it would be in check (under attack by an enemy piece).\n\nProtecting your king is crucial, especially in the opening and middlegame. Castling — a special move involving the king and a rook — is the main way to get your king to safety.",
      narrationText: "The king can move one square in any direction — horizontally, vertically, or diagonally. He is slow but essential: if he is captured, the game is over.\n\nThe most important rule: the king can never move to a square where it would be in check (under attack by an enemy piece).\n\nProtecting your king is crucial, especially in the opening and middlegame. Castling — a special move involving the king and a rook — is the main way to get your king to safety.",
      fen: '8/8/8/8/8/8/8/4K3 w - - 0 1',
      highlightSquares: ['d1', 'd2', 'e2', 'f2', 'f1'],
      interactive: true,
    },
  ],
}

export { lessonHowPiecesMove }
export default lessonHowPiecesMove
