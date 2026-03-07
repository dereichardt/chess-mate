import type { SharedLesson } from './types'
import { STARTING_FEN } from './constants'

const lessonCheckAndCheckmate: SharedLesson = {
  id: 'check-and-checkmate',
  number: 4,
  title: 'Check, Checkmate & Stalemate',
  description:
    'Understand what check means, how to deliver checkmate, and what stalemate is.',
  duration: '10 min',
  steps: [
    {
      title: 'Introduction',
      text: 'Every chess game ends in one of three ways: one player delivers **checkmate**, the players agree to a draw, or a special drawing rule applies — including one called **stalemate**. Before any of that, though, you need to understand **check**.\n\nThese three ideas — check, checkmate, and stalemate — are built on the same foundation: what is happening to the king, and what can it do about it. Master them and you will understand exactly how every chess game ends.',
      narrationText: 'Every chess game ends in one of three ways: one player delivers checkmate, the players agree to a draw, or a special drawing rule applies — including one called stalemate. Before any of that, though, you need to understand check.\n\nThese three ideas — check, checkmate, and stalemate — are built on the same foundation: what is happening to the king, and what can it do about it. Master them and you will understand exactly how every chess game ends.',
      fen: STARTING_FEN,
      interactive: false,
    },
    {
      title: 'Check: The King Is Under Attack',
      text: 'A king is **in check** when it is directly attacked by one or more enemy pieces. The moment a king falls into check, that player must deal with it immediately — they cannot make any other move.\n\nHere the white rook on e1 fires straight up the e-file, putting the black king on e8 in check. The king must get out of danger before anything else can happen.',
      narrationText: 'A king is in check when it is directly attacked by one or more enemy pieces. The moment a king falls into check, that player must deal with it immediately — they cannot make any other move.\n\nHere the white rook on e1 fires straight up the e-file, putting the black king on e8 in check. The king must get out of danger before anything else can happen.',
      fen: '4k3/8/8/8/8/8/8/4R3 w - - 0 1',
      interactive: false,
      arrows: [['e1', 'e8', 'rgba(34,197,94,0.85)']],
      captureSquares: ['e8'],
    },
    {
      title: 'Escaping Check',
      text: 'There are exactly three ways to escape check:\n\n**Move the king** — step it to a safe square not attacked by any enemy piece.\n\n**Block the check** — place a friendly piece between the attacker and the king to break the line of attack.\n\n**Capture the attacker** — take the piece delivering the check.\n\nHere the black king on e8 can step to any of the highlighted squares. The rook controls the entire e-file, so the king must move off it entirely.',
      narrationText: 'There are exactly three ways to escape check:\n\n**Move the king** — step it to a safe square not attacked by any enemy piece.\n\n**Block the check** — place a friendly piece between the attacker and the king to break the line of attack.\n\n**Capture the attacker** — take the piece delivering the check.\n\nHere the black king on e8 can step to any of the highlighted squares. The rook controls the entire e-file, so the king must move off it entirely.',
      fen: '4k3/8/8/8/8/8/8/4R3 w - - 0 1',
      interactive: false,
      arrows: [['e1', 'e8', 'rgba(34,197,94,0.85)']],
      highlightSquares: ['d8', 'f8', 'd7', 'f7'],
    },
    {
      title: 'Block the Check',
      text: "Blocking is the second way to escape check. A friendly piece steps onto a square between the attacking piece and the king, cutting the line of attack.\n\nThe black king is in check from the white rook on e1. The black bishop is one diagonal step away from the e-file — it can step directly into the path of the rook and shield the king.\n\nFind the blocking square. Drag the bishop to the square that breaks the check.",
      narrationText: "Blocking is the second way to escape check. A friendly piece steps onto a square between the attacking piece and the king, cutting the line of attack.\n\nThe black king is in check from the white rook on e1. The black bishop is one diagonal step away from the e-file — it can step directly into the path of the rook and shield the king.\n\nFind the blocking square. Drag the bishop to the square that breaks the check.",
      fen: '4k3/8/7b/8/8/8/8/4R3 b - - 0 1',
      interactive: true,
      challenge: { from: 'h6', to: 'e3' },
    },
    {
      title: 'Checkmate: No Escape',
      text: "**Checkmate** occurs when a king is in check and there is absolutely no legal move to escape. The game ends immediately — the player who delivered checkmate wins.\n\nHere the black king on h8 is in check from the white queen on h7. Every escape route is sealed: g8 is covered by the queen's diagonal, g7 is covered by the queen along rank 7, and the king cannot capture the queen because it is defended by the white king on g6.\n\nNo move, no escape. Checkmate.",
      narrationText: "Checkmate occurs when a king is in check and there is absolutely no legal move to escape. The game ends immediately — the player who delivered checkmate wins.\n\nHere the black king on h8 is in check from the white queen on h7. Every escape route is sealed: g8 is covered by the queen's diagonal, g7 is covered by the queen along rank 7, and the king cannot capture the queen because it is defended by the white king on g6.\n\nNo move, no escape. Checkmate.",
      fen: '7k/7Q/6K1/8/8/8/8/8 b - - 0 1',
      interactive: false,
      arrows: [['h7', 'h8', 'rgba(34,197,94,0.85)']],
      captureSquares: ['h8'],
    },
    {
      title: 'Deliver Checkmate',
      text: 'The black king is already cornered on h8, and the white king on g6 controls all the escape squares. The white queen is one move away from ending the game.\n\nFind the move that delivers checkmate.',
      narrationText: 'The black king is already cornered on h8, and the white king on g6 controls all the escape squares. The white queen is one move away from ending the game.\n\nFind the move that delivers checkmate.',
      fen: '7k/Q7/6K1/8/8/8/8/8 w - - 0 1',
      interactive: true,
      challenge: [
        { from: 'a7', to: 'h7' },
        { from: 'a7', to: 'g7' },
        { from: 'a7', to: 'a8' },
        { from: 'a7', to: 'b8' },
      ],
    },
    {
      title: 'Stalemate: No Move, No Check',
      text: "**Stalemate** happens when the player to move has no legal moves — but their king is NOT in check. Unlike checkmate, stalemate is not a win. It is an immediate **draw**.\n\nHere it is Black's turn. The black king on a8 cannot move to a7 (covered by the queen's diagonal), b7 (covered by the queen's file), or b8 (covered by the queen's file). Yet the king is not in check. Black has no legal moves at all — stalemate, and the game ends as a draw.\n\nThe yellow squares show every square the king might consider — all of them are off-limits.",
      narrationText: "Stalemate happens when the player to move has no legal moves — but their king is NOT in check. Unlike checkmate, stalemate is not a win. It is an immediate draw.\n\nHere it is Black's turn. The black king on a8 cannot move to a7 (covered by the queen's diagonal), b7 (covered by the queen's file), or b8 (covered by the queen's file). Yet the king is not in check. Black has no legal moves at all — stalemate, and the game ends as a draw.\n\nThe yellow squares show every square the king might consider — all of them are off-limits.",
      fen: 'k7/8/1QK5/8/8/8/8/8 b - - 0 1',
      interactive: false,
      fillSquares: ['a7', 'b7', 'b8'],
    },
    {
      title: 'The Stalemate Trap',
      text: 'A player with a large material advantage can accidentally throw away a win by stalemating their opponent.\n\nHere White has queen and king against a lone black king — a theoretically won position. But if White carelessly plays **Qb6?**, the black king on a8 suddenly has no legal moves and is not in check. Instant draw by stalemate.\n\nWhen you are winning, always verify that your move leaves the enemy king at least one legal square to step into. Stalemate the opponent and your winning advantage disappears.',
      narrationText: 'A player with a large material advantage can accidentally throw away a win by stalemating their opponent.\n\nHere White has queen and king against a lone black king — a theoretically won position. But if White carelessly plays **Qb6?**, the black king on a8 suddenly has no legal moves and is not in check. Instant draw by stalemate.\n\nWhen you are winning, always verify that your move leaves the enemy king at least one legal square to step into. Stalemate the opponent and your winning advantage disappears.',
      fen: 'k7/8/8/8/8/8/8/KQ6 w - - 0 1',
      interactive: false,
      arrows: [['b1', 'b6', 'rgba(34,197,94,0.85)']],
    },
  ],
}

export default lessonCheckAndCheckmate
