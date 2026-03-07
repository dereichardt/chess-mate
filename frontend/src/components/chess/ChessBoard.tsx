import { useState, useCallback, useEffect, useRef } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess, type Square } from 'chess.js';
import type { ChallengeSequenceStep } from '../../data/lessons';

// Cburnett piece set — SVGs served from /public/pieces/cburnett/.
// Each piece must be a named function component; arrow functions in a map
// closure can be silently ignored by react-chessboard's reconciler.
function makePiece(code: string) {
  return function CburnettPiece({ squareWidth }: { squareWidth: number }) {
    return (
      <img
        src={`/pieces/cburnett/${code}.svg`}
        style={{ width: squareWidth, height: squareWidth, display: 'block', pointerEvents: 'none' }}
        draggable={false}
        alt={code}
      />
    );
  };
}

const cburnettPieces = {
  wP: makePiece('wP'), wR: makePiece('wR'), wN: makePiece('wN'),
  wB: makePiece('wB'), wQ: makePiece('wQ'), wK: makePiece('wK'),
  bP: makePiece('bP'), bR: makePiece('bR'), bN: makePiece('bN'),
  bB: makePiece('bB'), bQ: makePiece('bQ'), bK: makePiece('bK'),
};

// Single source of truth for lesson board square colors (see Board guide + LESSON_AUTHORING).
export const SQUARE_COLORS = {
  yellowExplanation: 'rgba(250, 204, 21, 0.42)',
  lightGreenMovedFrom: 'rgba(134, 239, 172, 0.45)',
  greenLegal: 'rgba(34, 197, 94, 0.35)',
  redCapture: 'rgba(239, 68, 68, 0.30)',
  // Click-to-select mode (lessons 2–6, puzzles, opening study)
  selectedPiece: 'rgba(250, 204, 21, 0.55)',
  legalMoveDot: 'rgba(80, 80, 80, 0.2)',
} as const;

interface ChessBoardProps {
  fen: string;
  onMove?: (fen: string) => void;
  boardWidth?: number;
  highlightSquares?: string[];
  captureSquares?: string[];
  fillSquares?: string[];
  arrows?: [string, string, string?][];
  /** Optional square to show as light green "moved from" (e.g. after a challenge, when showing postChallenge visuals). */
  movedFromSquare?: string;
  /** Single-move challenge: one required move (or any of the array). Ignored when challengeSequence is set. */
  correctMove?: { from: string; to: string } | { from: string; to: string }[];
  /** Multi-move challenge: sequence of user moves with optional opponent responses. When set, step completes only after full sequence. */
  challengeSequence?: ChallengeSequenceStep[];
  onChallengeResult?: (
    solved: boolean,
    result?: { fen: string; movedFrom: string; movedTo: string; arrows: [string, string, string][]; captureSquares: string[] }
  ) => void;
  interactive?: boolean;
  /**
   * When true, clicking a piece shows its legal moves as dark-grey dots (non-captures)
   * and red highlights (captures). Designed for lessons 2–6 and reusable for puzzles /
   * opening study. Lesson 1 leaves this false to preserve the existing drag-only UX.
   */
  showClickToSelectLegalMoves?: boolean;
}

// chess.js requires both kings to validate a position. Lesson boards often
// show isolated pieces with no kings, so we always skip validation.
function makeGame(fen: string): Chess {
  const game = new Chess();
  game.load(fen, { skipValidation: true });
  return game;
}

function movesFrom(fen: string, square: string) {
  try {
    const game = makeGame(fen);
    const piece = game.get(square as Square);
    if (!piece) return [];

    // chess.js only returns moves for the side whose turn it is.
    // After a move the turn flips, so the piece we just moved belongs to the
    // "wrong" side. Fix by swapping the active-color field in the FEN so we
    // can ask for that piece's legal moves regardless of whose turn it is.
    const parts = fen.split(' ');
    if (parts[1] !== piece.color) {
      parts[1] = piece.color;
      return makeGame(parts.join(' ')).moves({ square: square as Square, verbose: true });
    }
    return game.moves({ square: square as Square, verbose: true });
  } catch {
    return [];
  }
}

function legalSquaresFrom(fen: string, square: string): string[] {
  return movesFrom(fen, square).map((m) => m.to);
}

// Returns squares of enemy pieces the piece on `square` can capture.
function attackedEnemySquares(fen: string, square: string): string[] {
  return movesFrom(fen, square)
    .filter((m) => m.captured)
    .map((m) => m.to);
}

// If the position (with turn flipped to opponent) is checkmate, returns the checkmated king's square.
function checkmatedKingSquare(explorationFen: string): string | null {
  try {
    const parts = explorationFen.split(' ');
    parts[1] = parts[1] === 'w' ? 'b' : 'w';
    const oppFen = parts.join(' ');
    const game = makeGame(oppFen);
    if (!game.isCheckmate()) return null;
    const color = game.turn();
    const files = 'abcdefgh';
    for (let r = 8; r >= 1; r--) {
      for (let f = 0; f < 8; f++) {
        const sq = (files[f] + r) as Square;
        const piece = game.get(sq);
        if (piece?.type === 'k' && piece.color === color) return sq;
      }
    }
    return null;
  } catch {
    return null;
  }
}

// Arrow geometry helpers

function isKnightArrow(from: string, to: string): boolean {
  const dx = Math.abs(to.charCodeAt(0) - from.charCodeAt(0));
  const dy = Math.abs(parseInt(to[1]) - parseInt(from[1]));
  return (dx === 1 && dy === 2) || (dx === 2 && dy === 1);
}

function squareCenter(sq: string, size: number): [number, number] {
  const file = sq.charCodeAt(0) - 97; // 'a'=0
  const rank = parseInt(sq[1]) - 1;   // '1'=0
  return [file * size + size / 2, (7 - rank) * size + size / 2];
}

// Returns the pixel coordinates of the elbow point for an L-shaped knight move.
// Convention: move along the long arm (2 squares) first, then the short arm (1 square).
function knightElbow(from: string, to: string, size: number): [number, number] {
  const fromFile = from.charCodeAt(0) - 97;
  const fromRank = parseInt(from[1]) - 1;
  const dx = (to.charCodeAt(0) - 97) - fromFile;
  const dy = (parseInt(to[1]) - 1) - fromRank;
  let elbowFile: number;
  let elbowRank: number;
  if (Math.abs(dx) === 2) {
    elbowFile = fromFile + dx;
    elbowRank = fromRank;
  } else {
    elbowFile = fromFile;
    elbowRank = fromRank + dy;
  }
  return [elbowFile * size + size / 2, (7 - elbowRank) * size + size / 2];
}

export default function ChessBoard({
  fen,
  onMove,
  boardWidth = 560,
  highlightSquares = [],
  captureSquares = [],
  fillSquares = [],
  arrows = [],
  movedFromSquare,
  correctMove,
  challengeSequence,
  onChallengeResult,
  interactive = true,
  showClickToSelectLegalMoves = false,
}: ChessBoardProps) {
  const [prevFen, setPrevFen] = useState(fen);
  const [currentFen, setCurrentFen] = useState(fen);
  /** Index into challengeSequence when in multi-move challenge mode. */
  const [sequenceIndex, setSequenceIndex] = useState(0);
  /** When set, we are showing "after White's move" and will apply Black's response after a short delay. */
  const [pendingBlackResponse, setPendingBlackResponse] = useState<{
    afterWhiteFen: string;
    response: { from: string; to: string };
    nextSequenceIndex: number;
  } | null>(null);
  const blackResponseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Lesson-defined move-destination squares — shown as green dots.
  const [activeHighlights, setActiveHighlights] = useState<string[]>(highlightSquares);
  // Legal-move dots populated after the user drops a piece (exploration / lesson-1).
  const [legalSquares, setLegalSquares] = useState<string[]>([]);
  const [activeCaptureSquares, setActiveCaptureSquares] = useState<string[]>(captureSquares);
  // Lesson 2 file/rank squares — shown as solid golden-yellow fills.
  const [activeFillSquares, setActiveFillSquares] = useState<string[]>(fillSquares);
  // Arrows drawn after a challenge move to show attacked enemy pieces.
  const [postMoveArrows, setPostMoveArrows] = useState<[string, string, string][]>([]);
  const [lastMovedFrom, setLastMovedFrom] = useState<string | null>(null);
  const [lastMovedTo, setLastMovedTo] = useState<string | null>(null);

  // Click-to-select state (lessons 2–6 and future puzzle/study modes).
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [clickSelectCaptures, setClickSelectCaptures] = useState<string[]>([]);
  const [clickSelectNonCaptures, setClickSelectNonCaptures] = useState<string[]>([]);

  const isSequenceMode = challengeSequence != null && challengeSequence.length > 0;

  // Derived-state pattern: update synchronously during render when the step
  // changes so there is never an intermediate paint with the old position.
  // (useEffect fires after paint and causes a visible flash.)
  if (prevFen !== fen) {
    if (blackResponseTimeoutRef.current) {
      clearTimeout(blackResponseTimeoutRef.current);
      blackResponseTimeoutRef.current = null;
    }
    setPendingBlackResponse(null);
    setPrevFen(fen);
    setCurrentFen(fen);
    setSequenceIndex(0);
    setActiveHighlights(highlightSquares);
    setLegalSquares([]);
    setActiveCaptureSquares(captureSquares);
    setActiveFillSquares(fillSquares);
    setPostMoveArrows([]);
    setLastMovedFrom(null);
    setLastMovedTo(null);
    setSelectedSquare(null);
    setClickSelectCaptures([]);
    setClickSelectNonCaptures([]);
  }

  // After user (White) plays in a sequence challenge, show the position then play Black's move after a short delay.
  useEffect(() => {
    if (!pendingBlackResponse) return;
    blackResponseTimeoutRef.current = setTimeout(() => {
      blackResponseTimeoutRef.current = null;
      const { afterWhiteFen, response: resp, nextSequenceIndex } = pendingBlackResponse;
      const gameAfterUser = makeGame(afterWhiteFen);
      const responseMove = gameAfterUser.move({ from: resp.from, to: resp.to });
      if (responseMove) {
        setCurrentFen(gameAfterUser.fen());
        setLastMovedFrom(resp.from);
        setLastMovedTo(resp.to);
        setPostMoveArrows([]);
      }
      setSequenceIndex(nextSequenceIndex);
      setPendingBlackResponse(null);
    }, 700);
    return () => {
      if (blackResponseTimeoutRef.current) {
        clearTimeout(blackResponseTimeoutRef.current);
        blackResponseTimeoutRef.current = null;
      }
    };
  }, [pendingBlackResponse]);

  // Always render currentFen so the board holds its position when interactive
  // is turned off after a correct challenge move. Static steps are safe because
  // arePiecesDraggable/onPieceDrop guards prevent currentFen from ever changing.
  const resolvedFen = currentFen;
  const isExploration = interactive && !correctMove && !isSequenceMode;

  const squareStyles: Record<string, React.CSSProperties> = {};

  // Interactive challenge result: move-from and move-to in same green; otherwise yellow for explanation squares.
  const fillColor =
    movedFromSquare != null ? SQUARE_COLORS.lightGreenMovedFrom : SQUARE_COLORS.yellowExplanation;
  for (const sq of activeFillSquares) {
    squareStyles[sq] = { backgroundColor: fillColor };
  }
  // In exploration mode, possible-move squares are green; otherwise yellow.
  const highlightColor = isExploration ? SQUARE_COLORS.greenLegal : SQUARE_COLORS.yellowExplanation;
  for (const sq of activeHighlights) {
    squareStyles[sq] = { backgroundColor: highlightColor };
  }

  // Green: legal moves (lesson-1 exploration post-move).
  for (const sq of legalSquares) {
    squareStyles[sq] = { backgroundColor: SQUARE_COLORS.greenLegal };
  }

  // Red: capture / attack squares (lesson-defined, post-challenge, or lesson-1 post-move).
  for (const sq of activeCaptureSquares) {
    squareStyles[sq] = { backgroundColor: SQUARE_COLORS.redCapture };
  }

  // Click-to-select: capture squares of the selected piece (red).
  if (showClickToSelectLegalMoves && selectedSquare) {
    for (const sq of clickSelectCaptures) {
      squareStyles[sq] = { backgroundColor: SQUARE_COLORS.redCapture };
    }
    // Gold tint on the selected piece's square.
    squareStyles[selectedSquare] = { backgroundColor: SQUARE_COLORS.selectedPiece };
  }

  // Light green: square the piece moved from and the square it moved to.
  const movedFrom = lastMovedFrom ?? movedFromSquare;
  const movedTo = lastMovedTo;
  if (movedFrom) {
    squareStyles[movedFrom] = { backgroundColor: SQUARE_COLORS.lightGreenMovedFrom };
  }
  if (movedTo) {
    squareStyles[movedTo] = { backgroundColor: SQUARE_COLORS.lightGreenMovedFrom };
  }

  // Reset move/selection state after a successful move. Called by all move paths.
  const applyMoveState = useCallback(
    (explorationFen: string, targetSquare: string, sourceSquare: string) => {
      setCurrentFen(explorationFen);
      setLastMovedFrom(sourceSquare);
      setLastMovedTo(targetSquare);
      setActiveHighlights([]);
      setActiveCaptureSquares([]);
      setSelectedSquare(null);
      setClickSelectCaptures([]);
      setClickSelectNonCaptures([]);
    },
    [],
  );

  // Reset board to initial step state (used when user plays wrong move in sequence mode).
  const resetToInitial = useCallback(() => {
    setCurrentFen(fen);
    setSequenceIndex(0);
    setActiveHighlights(highlightSquares);
    setLegalSquares([]);
    setActiveCaptureSquares(captureSquares);
    setActiveFillSquares(fillSquares);
    setPostMoveArrows([]);
    setLastMovedFrom(null);
    setLastMovedTo(null);
    setSelectedSquare(null);
    setClickSelectCaptures([]);
    setClickSelectNonCaptures([]);
  }, [fen, highlightSquares, captureSquares, fillSquares]);

  // Shared move-execution logic used by both drag (onDrop) and click (onSquareClick).
  const executeMoveFrom = useCallback(
    (sourceSquare: string, targetSquare: string): boolean => {
      try {
        const game = makeGame(resolvedFen);
        const move = game.move({
          from: sourceSquare,
          to: targetSquare,
          promotion: 'q',
        });

        if (!move) return false;

        // Flip the active color back to the moved piece's color so the user
        // can keep moving the same piece for free exploration within the step.
        const parts = game.fen().split(' ');
        parts[1] = move.color;
        const explorationFen = parts.join(' ');

        if (isSequenceMode && challengeSequence) {
          const el = challengeSequence[sequenceIndex];
          const expectedFrom = el.from;
          const expectedTo = el.to;
          if (sourceSquare !== expectedFrom || targetSquare !== expectedTo) {
            applyMoveState(explorationFen, targetSquare, sourceSquare);
            onChallengeResult?.(false);
            return true; // move was legal, show wrong position until parent timeout resets
          }
          applyMoveState(explorationFen, targetSquare, sourceSquare);
          setLegalSquares([]);
          const attacked = attackedEnemySquares(explorationFen, targetSquare);
          setPostMoveArrows(
            attacked.map((sq) => [targetSquare, sq, 'rgba(34,197,94,0.85)'] as [string, string, string]),
          );
          const isLastStep = sequenceIndex === challengeSequence.length - 1;
          if (isLastStep) {
            const kingSq = checkmatedKingSquare(explorationFen);
            const captureSqs = kingSq ? [kingSq] : attacked;
            setActiveCaptureSquares(captureSqs);
            const arrowColor = 'rgba(34,197,94,0.85)';
            const resultArrows = attacked.map((sq) => [targetSquare, sq, arrowColor] as [string, string, string]);
            onChallengeResult?.(true, {
              fen: explorationFen,
              movedFrom: sourceSquare,
              movedTo: targetSquare,
              arrows: resultArrows,
              captureSquares: captureSqs,
            });
          } else {
            if ('response' in el && el.response) {
              const resp = el.response;
              // Show position after White's move (turn = Black), then play Black's move after a short delay.
              const afterWhiteFen = game.fen();
              setCurrentFen(afterWhiteFen);
              setLastMovedFrom(sourceSquare);
              setPendingBlackResponse({
                afterWhiteFen,
                response: resp,
                nextSequenceIndex: sequenceIndex + 1,
              });
            } else {
              setSequenceIndex((i) => i + 1);
            }
          }
          onMove?.(explorationFen);
          return true;
        }

        applyMoveState(explorationFen, targetSquare, sourceSquare);

        if (correctMove) {
          // Challenge step: suppress legal-move dots; show attack arrows instead.
          setLegalSquares([]);
          const attacked = attackedEnemySquares(explorationFen, targetSquare);
          setPostMoveArrows(
            attacked.map((sq) => [targetSquare, sq, 'rgba(34,197,94,0.85)'] as [string, string, string]),
          );
          const correctMoves = Array.isArray(correctMove) ? correctMove : [correctMove];
          const solved = correctMoves.some(
            (m) => m.from === sourceSquare && m.to === targetSquare,
          );
          if (solved) {
            const kingSq = checkmatedKingSquare(explorationFen);
            const captureSqs = kingSq ? [kingSq] : attacked;
            setActiveCaptureSquares(captureSqs);
            const arrowColor = 'rgba(34,197,94,0.85)';
            const resultArrows = attacked.map((sq) => [targetSquare, sq, arrowColor] as [string, string, string]);
            onChallengeResult?.(true, {
              fen: explorationFen,
              movedFrom: sourceSquare,
              movedTo: targetSquare,
              arrows: resultArrows,
              captureSquares: captureSqs,
            });
          } else {
            onChallengeResult?.(false);
          }
        } else if (!showClickToSelectLegalMoves) {
          // Lesson-1 exploration: show capture squares in red, non-capture legal moves in green.
          const moves = movesFrom(explorationFen, targetSquare);
          const captureSqs = moves.filter((m) => m.captured).map((m) => m.to);
          const pushSqs = moves.filter((m) => !m.captured).map((m) => m.to);
          setActiveCaptureSquares(captureSqs);
          setActiveHighlights(pushSqs);
          setLegalSquares([]);
        } else {
          // Lessons 2–6 exploration: no automatic post-move highlights; user clicks to inspect.
          setLegalSquares([]);
        }

        onMove?.(explorationFen);
        return true;
      } catch {
        return false;
      }
    },
    [
      resolvedFen,
      correctMove,
      challengeSequence,
      isSequenceMode,
      sequenceIndex,
      showClickToSelectLegalMoves,
      onChallengeResult,
      onMove,
      applyMoveState,
      resetToInitial,
    ],
  );

  const onPromotionPieceSelect = useCallback(
    (piece?: string, promoteFromSquare?: string, promoteToSquare?: string) => {
      if (!promoteFromSquare || !promoteToSquare || !piece) return false;
      const promotion = piece[1]?.toLowerCase();
      if (promotion !== 'q' && promotion !== 'r' && promotion !== 'b' && promotion !== 'n') return false;
      try {
        const game = makeGame(resolvedFen);
        const move = game.move({
          from: promoteFromSquare,
          to: promoteToSquare,
          promotion: promotion as 'q' | 'r' | 'b' | 'n',
        });
        if (!move) return false;

        const parts = game.fen().split(' ');
        parts[1] = move.color;
        const explorationFen = parts.join(' ');

        if (isSequenceMode && challengeSequence) {
          const el = challengeSequence[sequenceIndex];
          const expectedFrom = el.from;
          const expectedTo = el.to;
          if (promoteFromSquare !== expectedFrom || promoteToSquare !== expectedTo || promotion !== 'q') {
            onChallengeResult?.(false);
            resetToInitial();
            return true;
          }
          applyMoveState(explorationFen, promoteToSquare, promoteFromSquare);
          setLegalSquares([]);
          const attacked = attackedEnemySquares(explorationFen, promoteToSquare);
          setPostMoveArrows(
            attacked.map((sq) => [promoteToSquare, sq, 'rgba(34,197,94,0.85)'] as [string, string, string]),
          );
          const isLastStep = sequenceIndex === challengeSequence.length - 1;
          if (isLastStep) {
            const kingSq = checkmatedKingSquare(explorationFen);
            const captureSqs = kingSq ? [kingSq] : attacked;
            setActiveCaptureSquares(captureSqs);
            const arrowColor = 'rgba(34,197,94,0.85)';
            const resultArrows = attacked.map((sq) => [promoteToSquare, sq, arrowColor] as [string, string, string]);
            onChallengeResult?.(true, {
              fen: explorationFen,
              movedFrom: promoteFromSquare,
              movedTo: promoteToSquare,
              arrows: resultArrows,
              captureSquares: captureSqs,
            });
          } else {
            if ('response' in el && el.response) {
              const resp = el.response;
              const afterWhiteFen = game.fen();
              setCurrentFen(afterWhiteFen);
              setLastMovedFrom(promoteFromSquare);
              setPendingBlackResponse({
                afterWhiteFen,
                response: resp,
                nextSequenceIndex: sequenceIndex + 1,
              });
            } else {
              setSequenceIndex((i) => i + 1);
            }
          }
          onMove?.(explorationFen);
          return true;
        }

        if (correctMove) {
          const correctMoves = Array.isArray(correctMove) ? correctMove : [correctMove];
          const moveMatches = correctMoves.some(
            (m) => m.from === promoteFromSquare && m.to === promoteToSquare,
          );
          if (!moveMatches || promotion !== 'q') {
            onChallengeResult?.(false);
            return false;
          }
          setLegalSquares([]);
          const attacked = attackedEnemySquares(explorationFen, promoteToSquare);
          setPostMoveArrows(
            attacked.map((sq) => [promoteToSquare, sq, 'rgba(34,197,94,0.85)'] as [string, string, string]),
          );
          applyMoveState(explorationFen, promoteToSquare, promoteFromSquare);
          const kingSq = checkmatedKingSquare(explorationFen);
          const captureSqs = kingSq ? [kingSq] : attacked;
          setActiveCaptureSquares(captureSqs);
          const arrowColor = 'rgba(34,197,94,0.85)';
          const resultArrows = attacked.map((sq) => [promoteToSquare, sq, arrowColor] as [string, string, string]);
          onChallengeResult?.(true, {
            fen: explorationFen,
            movedFrom: promoteFromSquare,
            movedTo: promoteToSquare,
            arrows: resultArrows,
            captureSquares: captureSqs,
          });
        } else {
          applyMoveState(explorationFen, promoteToSquare, promoteFromSquare);
          if (!showClickToSelectLegalMoves) {
            setActiveHighlights(legalSquaresFrom(explorationFen, promoteToSquare));
          }
          setLegalSquares([]);
        }

        onMove?.(explorationFen);
        return true;
      } catch {
        return false;
      }
    },
    [
      resolvedFen,
      correctMove,
      challengeSequence,
      isSequenceMode,
      sequenceIndex,
      showClickToSelectLegalMoves,
      onChallengeResult,
      onMove,
      applyMoveState,
      resetToInitial,
    ],
  );

  const onDrop = useCallback(
    (sourceSquare: string, targetSquare: string) => executeMoveFrom(sourceSquare, targetSquare),
    [executeMoveFrom],
  );

  // Click-to-select handler: only wired to the board when showClickToSelectLegalMoves is true.
  const onSquareClick = useCallback(
    (square: string, piece: string | undefined) => {
      if (!showClickToSelectLegalMoves || !interactive) return;

      const activeColor = resolvedFen.split(' ')[1]; // 'w' or 'b'
      const pieceColor = piece ? piece[0] : null;    // 'w', 'b', or null

      // If a piece is already selected, check if the clicked square is a legal target.
      if (selectedSquare) {
        const allTargets = [...clickSelectNonCaptures, ...clickSelectCaptures];
        if (allTargets.includes(square)) {
          executeMoveFrom(selectedSquare, square);
          return;
        }
      }

      if (pieceColor === activeColor) {
        if (selectedSquare === square) {
          // Clicking the same piece again deselects it.
          setSelectedSquare(null);
          setClickSelectCaptures([]);
          setClickSelectNonCaptures([]);
        } else {
          // Select the clicked piece and compute its legal moves.
          const moves = movesFrom(resolvedFen, square);
          setSelectedSquare(square);
          setClickSelectCaptures(moves.filter((m) => m.captured).map((m) => m.to));
          setClickSelectNonCaptures(moves.filter((m) => !m.captured).map((m) => m.to));
          // Clear any lingering post-move exploration arrows/highlights.
          setActiveHighlights([]);
          setPostMoveArrows([]);
        }
      } else {
        // Empty square or enemy piece (not a legal capture target): clear selection.
        setSelectedSquare(null);
        setClickSelectCaptures([]);
        setClickSelectNonCaptures([]);
      }
    },
    [
      showClickToSelectLegalMoves, interactive, resolvedFen,
      selectedSquare, clickSelectCaptures, clickSelectNonCaptures,
      executeMoveFrom,
    ],
  );

  const squareSize = boardWidth / 8;
  const ranks = [8, 7, 6, 5, 4, 3, 2, 1];
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const labelStyle: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: 600,
    color: '#486581',
    fontFamily: 'Inter, system-ui, sans-serif',
    userSelect: 'none',
  };

  // Partition all arrows: knight moves render as L-shaped SVG polylines;
  // everything else goes through react-chessboard's built-in straight arrows.
  const allArrows = [...arrows, ...postMoveArrows] as [string, string, string][];
  const regularArrows = allArrows.filter(([f, t]) => !isKnightArrow(f, t));
  const knightArrows = allArrows.filter(([f, t]) => isKnightArrow(f, t));

  // Dot radius: ~15% of square size (30% diameter), capped for small boards.
  const dotRadius = squareSize * 0.15;

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        {/* Rank labels — left of board */}
        <div style={{ width: '20px', display: 'flex', flexDirection: 'column', marginRight: '6px' }}>
          {ranks.map((rank) => (
            <div
              key={rank}
              style={{ height: squareSize, display: 'flex', alignItems: 'center', justifyContent: 'center', ...labelStyle }}
            >
              {rank}
            </div>
          ))}
        </div>

        {/* Board + overlays */}
        <div style={{ position: 'relative', width: boardWidth, height: boardWidth }}>
          <Chessboard
            position={resolvedFen}
            onPieceDrop={interactive && !pendingBlackResponse ? onDrop : undefined}
            onPromotionPieceSelect={interactive && !pendingBlackResponse ? onPromotionPieceSelect : undefined}
            onSquareClick={showClickToSelectLegalMoves && interactive && !pendingBlackResponse ? onSquareClick : undefined}
            arePiecesDraggable={interactive && !pendingBlackResponse}
            boardWidth={boardWidth}
            animationDuration={0}
            customSquareStyles={squareStyles}
            customPieces={cburnettPieces}
            customArrows={regularArrows as [Square, Square, string?][]}
            areArrowsAllowed={false}
            showBoardNotation={false}
            customBoardStyle={{
              borderRadius: '10px',
              boxShadow: '0 6px 32px rgba(0,0,0,0.16)',
            }}
            customDarkSquareStyle={{ backgroundColor: '#6b7fa0' }}
            customLightSquareStyle={{ backgroundColor: '#ecf0f7' }}
          />

          {/* Legal-move dots overlay (click-to-select mode, non-capture squares only). */}
          {showClickToSelectLegalMoves && selectedSquare && clickSelectNonCaptures.length > 0 && (
            <svg
              style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', overflow: 'visible' }}
              width={boardWidth}
              height={boardWidth}
            >
              {clickSelectNonCaptures.map((sq) => {
                const [cx, cy] = squareCenter(sq, squareSize);
                return (
                  <circle
                    key={sq}
                    cx={cx}
                    cy={cy}
                    r={dotRadius}
                    fill={SQUARE_COLORS.legalMoveDot}
                  />
                );
              })}
            </svg>
          )}

          {/* L-shaped knight arrow overlay. */}
          {knightArrows.length > 0 && (
            <svg
              style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none', overflow: 'visible' }}
              width={boardWidth}
              height={boardWidth}
            >
              <defs>
                {knightArrows.map(([,, color], i) => (
                  <marker
                    key={i}
                    id={`knight-arrow-${i}`}
                    markerWidth="2"
                    markerHeight="2.5"
                    refX="1.25"
                    refY="1.25"
                    orient="auto"
                  >
                    <polygon
                      points="0.3 0, 2 1.25, 0.3 2.5"
                      fill={color ?? 'rgba(34,197,94,0.85)'}
                    />
                  </marker>
                ))}
              </defs>
              {knightArrows.map(([from, to, color], i) => {
                const [sx, sy] = squareCenter(from, squareSize);
                const [ex, ey] = knightElbow(from, to, squareSize);
                const [tx, ty] = squareCenter(to, squareSize);
                return (
                  <polyline
                    key={i}
                    points={`${sx},${sy} ${ex},${ey} ${tx},${ty}`}
                    stroke={color ?? 'rgba(34,197,94,0.85)'}
                    strokeWidth={boardWidth / 40}
                    opacity={0.65}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    markerEnd={`url(#knight-arrow-${i})`}
                  />
                );
              })}
            </svg>
          )}
        </div>
      </div>

      {/* File labels — below board, offset by rank label column width + gap */}
      <div style={{ display: 'flex', marginLeft: '26px', marginTop: '6px' }}>
        {files.map((file) => (
          <div
            key={file}
            style={{ width: squareSize, textAlign: 'center', ...labelStyle }}
          >
            {file}
          </div>
        ))}
      </div>
    </div>
  );
}
