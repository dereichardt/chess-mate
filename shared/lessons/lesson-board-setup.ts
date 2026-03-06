import type { SharedLesson } from './types'
import { STARTING_FEN } from './constants'

const lessonBoardSetup: SharedLesson = {
  id: 'board-setup',
  number: 2,
  title: 'Board Setup & Notation',
  description:
    'Learn to set up the board correctly and read chess notation so you can follow any game.',
  duration: '8 min',
  steps: [
    {
      title: 'The Board',
      text: 'Chess is played on a board of 64 squares — 8 rows and 8 columns — alternating between light and dark squares.\n\nWhite always occupies ranks 1 and 2 at the start. Black occupies ranks 7 and 8. The board must always be placed so that each player has a light square in the bottom-right corner — remember: "light on right."\n\nThe board you see here shows the correct starting setup.',
      narrationText: 'Chess is played on a board of 64 squares — 8 rows and 8 columns — alternating between light and dark squares.\n\nWhite always occupies ranks 1 and 2 at the start. Black occupies ranks 7 and 8. The board must always be placed so that each player has a light square in the bottom-right corner — remember: "light on right."\n\nThe board you see here shows the correct starting setup.',
      fen: STARTING_FEN,
      interactive: false,
    },
    {
      title: 'Files: the Columns',
      text: "The 8 vertical columns are called files. They are labeled a through h, running from left to right when viewed from White's side.\n\n• File a is on White's left.\n• File h is on White's right.\n• The highlighted squares show the entire **e-file**\n\nFiles describe the left-rigth position of any piece or square.",
      narrationText: "The 8 vertical columns are called files. They are labeled a through h, running from left to right when viewed from White's side.\n\n• File a is on White's left.\n• File h is on White's right.\n• The highlighted squares show the entire **e-file**\n\nFiles describe the left-rigth position of any piece or square.",
      fen: STARTING_FEN,
      interactive: false,
      fillSquares: ['e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8'],
    },
    {
      title: 'Ranks: the Rows',
      text: "The 8 horizontal rows are called ranks. They are numbered 1 through 8, starting from White's side of the board.\n\nRank 1 is White's back rank — where the king, queen, rooks, bishops, and knights begin. Rank 8 is Black's back rank. The highlighted squares show rank 4, the center of the board.\n\nRanks describe the near-far position of any piece or square.",
      narrationText: "The 8 horizontal rows are called ranks. They are numbered 1 through 8, starting from White's side of the board.\n\nRank 1 is White's back rank — where the king, queen, rooks, bishops, and knights begin. Rank 8 is Black's back rank. The highlighted squares show rank 4, the center of the board.\n\nRanks describe the near-far position of any piece or square.",
      fen: STARTING_FEN,
      interactive: false,
      fillSquares: ['a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4'],
    },
    {
      title: 'Naming Squares',
      text: 'Every square on the board has a unique name made up of its file letter and rank number — file first, rank second.\n\nFor example: e4 is on file e, rank 4. d5 is on file d, rank 5. a1 is the bottom-left corner. h8 is the top-right corner.\n\nThe four highlighted squares give you a feel for how coordinates work across different parts of the board. Once you can read square names, you can follow any chess game ever played.',
      narrationText: 'Every square on the board has a unique name made up of its file letter and rank number — file first, rank second.\n\nFor example: e4 is on file e, rank 4. d5 is on file d, rank 5. a1 is the bottom-left corner. h8 is the top-right corner.\n\nThe four highlighted squares give you a feel for how coordinates work across different parts of the board. Once you can read square names, you can follow any chess game ever played.',
      fen: '8/8/8/8/8/8/8/8 w - - 0 1',
      interactive: false,
      fillSquares: ['a1', 'e4', 'd5', 'h8'],
    },
  ],
}

export default lessonBoardSetup
