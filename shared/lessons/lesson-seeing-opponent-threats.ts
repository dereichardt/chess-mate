import type { SharedLesson } from './types'
import { STARTING_FEN } from './constants'

const lessonSeeingOpponentThreats: SharedLesson = {
  id: 'seeing-opponent-threats',
  number: 9,
  title: "Seeing Your Opponent's Threats",
  description: "Before you move, ask: what did they just play, and what are they threatening?",
  duration: '7 min',
  steps: [
    {
      title: 'Look at Their Move First',
      text: 'Before you choose your move, **look at what your opponent just did**. Every move has a purpose. They might have attacked a piece, created a threat, or prepared something.\n\nAsk yourself: **What are they threatening?** If you ignore their threat, you might walk into a capture, a fork, or checkmate. A one-move look-ahead — "if I play this, what can they do?" — saves games.',
      narrationText:
        'Before you choose your move, look at what your opponent just did. Every move has a purpose. Ask yourself: what are they threatening? If you ignore their threat, you might walk into a capture, a fork, or checkmate. A one-move look-ahead saves games.',
      fen: STARTING_FEN,
      interactive: false,
    },
    {
      title: 'Example: Find the Threat',
      text: 'Black just played their knight to f6, attacking the white pawn on e4. If White ignores this and plays something else, Black can play **Nxe4** and win the pawn.\n\nWhite should defend the e4 pawn — for example with **Nc3** or **d3**. Here, find the move that defends e4 by playing the knight to c3.',
      narrationText:
        'Black just played their knight to f6, attacking the white pawn on e4. If White ignores this, Black can take the pawn. White should defend e4. Find the move that defends e4 by playing the knight to c3.',
      fen: 'r1bqkbnr/pppp1ppp/2n2n2/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 4 2',
      interactive: true,
      challenge: { from: 'b1', to: 'c3' },
    },
    {
      title: 'Stop the Threat',
      text: 'Sometimes the threat is checkmate or a big capture. Your job is to **find the move that stops it** — block, escape, defend, or counter-attack.\n\nMaking a habit of "what did they play? what do they want?" before you move will prevent many blunders. In the next lesson we look at your options when your piece is under attack.',
      narrationText:
        'Sometimes the threat is checkmate or a big capture. Your job is to find the move that stops it. Making a habit of asking what they played and what they want before you move will prevent many blunders.',
      fen: STARTING_FEN,
      interactive: false,
    },
  ],
}

export default lessonSeeingOpponentThreats
