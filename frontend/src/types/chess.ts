export type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king'
export type Color = 'white' | 'black'
export type Square = string // e.g., "e4"

export interface Piece {
  type: PieceType
  color: Color
  square: Square
}

export interface Move {
  from: Square
  to: Square
  promotion?: PieceType
}

export interface GameState {
  fen: string
  moves: Move[]
  isCheck: boolean
  isCheckmate: boolean
  isStalemate: boolean
}
