import { useState } from 'react'
import { Chess } from 'chess.js'
import { GameState } from '../types/chess'

export function useChessGame() {
  const [game] = useState(new Chess())
  const [gameState, setGameState] = useState<GameState>({
    fen: game.fen(),
    moves: [],
    isCheck: game.isCheck(),
    isCheckmate: game.isCheckmate(),
    isStalemate: game.isStalemate(),
  })

  const makeMove = (from: string, to: string) => {
    try {
      const move = game.move({ from, to })
      if (move) {
        setGameState({
          fen: game.fen(),
          moves: [...gameState.moves, { from, to }],
          isCheck: game.isCheck(),
          isCheckmate: game.isCheckmate(),
          isStalemate: game.isStalemate(),
        })
        return true
      }
      return false
    } catch (error) {
      return false
    }
  }

  const resetGame = () => {
    game.reset()
    setGameState({
      fen: game.fen(),
      moves: [],
      isCheck: false,
      isCheckmate: false,
      isStalemate: false,
    })
  }

  return {
    gameState,
    makeMove,
    resetGame,
  }
}
