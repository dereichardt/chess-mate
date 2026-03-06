import type { SharedLesson } from './types'
import { STARTING_FEN } from './constants'

const lessonPieceValuesExchanges: SharedLesson = {
  id: 'piece-values-exchanges',
  number: 8,
  title: 'Piece Values & Simple Exchanges',
  description: 'Learn piece values and when a trade helps you or hurts you.',
  duration: '6 min',
  steps: [
    {
      title: 'Piece Values',
      text: 'To decide if a trade is good, you need to know how much each piece is worth. Chess uses simple **point values**:\n\n**Pawn** = 1 · **Knight** = 3 · **Bishop** = 3 · **Rook** = 5 · **Queen** = 9\n\nThe king has no point value — you cannot trade it. These numbers are a guide: trading a knight (3) for a rook (5) wins 2 points; trading a queen (9) for a rook (5) loses 4 points unless you get something else (like checkmate).',
      narrationText:
        'To decide if a trade is good, you need to know how much each piece is worth. Pawn equals 1, Knight and Bishop equal 3, Rook equals 5, Queen equals 9. The king has no point value — you cannot trade it. These numbers are a guide for judging exchanges.',
      fen: STARTING_FEN,
      interactive: false,
    },
    {
      title: 'Good and Bad Trades',
      text: 'A **good trade** for you: you give up less (or equal) value and get more — for example, your knight for their rook. Or you trade when you are ahead in material to simplify and make winning easier.\n\nA **bad trade**: you give up more than you get — your rook for their knight. Or you trade when you are behind, making it harder to create counterplay.\n\n**Do not leave pieces hanging.** Before you move, check: are any of my pieces undefended and attacked? If so, your opponent can capture them for free.',
      narrationText:
        'A good trade: you give up less value and get more, or you simplify when ahead. A bad trade: you give up more than you get, or you trade when behind. Do not leave pieces hanging. Before you move, check if any of your pieces are undefended and attacked.',
      fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
      interactive: false,
    },
    {
      title: 'Is This Trade Good?',
      text: 'White can play **Bxf6**, capturing the black knight. Black can recapture with **gxf6**. White gives a bishop (3) for a knight (3) — equal material. But the trade also damages Black\'s pawn structure (doubled pawns on the f-file). So the trade is reasonable for White.\n\nFind the move: play Bxf6.',
      narrationText:
        'White can play Bxf6, capturing the black knight. Black can recapture with gxf6. White gives a bishop for a knight — equal material. But the trade damages Black\'s pawn structure. Find the move: play Bxf6.',
      fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
      interactive: true,
      challenge: { from: 'c4', to: 'f6' },
    },
  ],
}

export default lessonPieceValuesExchanges
