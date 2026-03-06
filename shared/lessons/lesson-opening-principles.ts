import type { SharedLesson } from './types'
import { STARTING_FEN } from './constants'

const lessonOpeningPrinciples: SharedLesson = {
  id: 'opening-principles',
  number: 5,
  title: 'Opening Principles',
  description:
    'The three golden rules for the opening: control the center, develop your pieces, and castle early.',
  duration: '12 min',
  steps: [
    {
      title: 'Introduction',
      text: 'The opening is roughly the first ten moves of a chess game. What you do in these moves sets the tone for everything that follows — a strong opening gives you space, activity, and a safe king; a careless one can leave you struggling before the middlegame even begins.\n\nFortunately you do not need to memorise long sequences of moves. Almost every good opening follows three golden rules:\n\n**1. Control the center.**\n**2. Develop your pieces.**\n**3. Castle early.**\n\nLearn these principles and you will know what to do in any opening position.',
      narrationText: 'The opening is roughly the first ten moves of a chess game. What you do in these moves sets the tone for everything that follows — a strong opening gives you space, activity, and a safe king; a careless one can leave you struggling before the middlegame even begins.\n\nFortunately you do not need to memorise long sequences of moves. Almost every good opening follows three golden rules:\n\n**1. Control the center.**\n**2. Develop your pieces.**\n**3. Castle early.**\n\nLearn these principles and you will know what to do in any opening position.',
      fen: STARTING_FEN,
      interactive: false,
    },
    {
      title: 'Rule 1: Control the Center',
      text: 'The four squares in the very middle of the board — d4, d5, e4, and e5 — are the most important real estate in chess. A piece placed in the center controls more squares and can reach either side of the board quickly.\n\nPawns are the ideal tool for claiming the center early on. A pawn on e4 or d4 stakes a permanent claim and opens lines for your bishops and queen.\n\nWhenever you are unsure what to do in the opening, ask yourself: "Can I put a pawn or a piece in or near the center?" If the answer is yes, that is usually a good move.',
      narrationText: 'The four squares in the very middle of the board — d4, d5, e4, and e5 — are the most important real estate in chess. A piece placed in the center controls more squares and can reach either side of the board quickly.\n\nPawns are the ideal tool for claiming the center early on. A pawn on e4 or d4 stakes a permanent claim and opens lines for your bishops and queen.\n\nWhenever you are unsure what to do in the opening, ask yourself: "Can I put a pawn or a piece in or near the center?" If the answer is yes, that is usually a good move.',
      fen: STARTING_FEN,
      interactive: false,
      fillSquares: ['d4', 'd5', 'e4', 'e5'],
    },
    {
      title: 'Grab the Center',
      text: "It is White's first move. Stake a claim in the center by pushing one of the two central pawns two squares forward.\n\nDrag the pawn to its destination.",
      narrationText: "It is White's first move. Stake a claim in the center by pushing one of the two central pawns two squares forward.\n\nDrag the pawn to its destination.",
      fen: STARTING_FEN,
      interactive: true,
      challenge: [
        { from: 'e2', to: 'e4' },
        { from: 'd2', to: 'd4' },
      ],
    },
    {
      title: 'Rule 2: Develop Your Pieces',
      text: 'Development means moving your knights and bishops off the back rank to active squares where they influence the center and the rest of the board. A piece sitting on its starting square does nothing — it needs to get into the fight.\n\nA useful guideline: **knights before bishops**. Knights have fewer good squares (typically c3/f3 for White, c6/f6 for Black), so develop them first while you decide where the bishops belong.\n\nHere White has played 1.e4 e5 2.Nf3. The knight already attacks the central squares d4 and e5, and it clears the way for the king to castle later.',
      narrationText: 'Development means moving your knights and bishops off the back rank to active squares where they influence the center and the rest of the board. A piece sitting on its starting square does nothing — it needs to get into the fight.\n\nA useful guideline: **knights before bishops**. Knights have fewer good squares (typically c3/f3 for White, c6/f6 for Black), so develop them first while you decide where the bishops belong.\n\nHere White has played 1.e4 e5 2.Nf3. The knight already attacks the central squares d4 and e5, and it clears the way for the king to castle later.',
      fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2',
      interactive: false,
      highlightSquares: ['f3'],
      captureSquares: ['e5'],
      arrows: [
        ['f3', 'd4', 'rgba(34,197,94,0.85)'],
        ['f3', 'e5', 'rgba(34,197,94,0.85)'],
      ],
    },
    {
      title: 'Develop a Knight',
      text: 'White has grabbed the center with 1.e4 and Black responded 1…e5. Now it is time to develop a piece.\n\nBring the kingside knight toward the center, where it attacks the most squares and prepares castling.',
      narrationText: 'White has grabbed the center with 1.e4 and Black responded 1…e5. Now it is time to develop a piece.\n\nBring the kingside knight toward the center, where it attacks the most squares and prepares castling.',
      fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
      interactive: true,
      challenge: { from: 'g1', to: 'f3' },
      postChallenge: {
        fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2',
        movedFrom: 'g1',
        captureSquares: ['e5'],
        arrows: [
          ['f3', 'd4', 'rgba(34,197,94,0.85)'],
          ['f3', 'e5', 'rgba(34,197,94,0.85)'],
        ],
      },
    },
    {
      title: 'Rule 3: Castle Early',
      text: 'Castling does two things at once: it whisks the king away from the exposed center and it brings a rook toward the middle of the board where it can join the action.\n\nA king stuck in the center is a sitting target — open files and diagonals make it easy for the opponent to launch an attack. Once you have developed the knight and bishop on the kingside, castle immediately.\n\nHere White has played 1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5. The knight and bishop are developed, and the squares between the king and the h1 rook are clear. Everything is ready to castle.',
      narrationText: 'Castling does two things at once: it whisks the king away from the exposed center and it brings a rook toward the middle of the board where it can join the action.\n\nA king stuck in the center is a sitting target — open files and diagonals make it easy for the opponent to launch an attack. Once you have developed the knight and bishop on the kingside, castle immediately.\n\nHere White has played 1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5. The knight and bishop are developed, and the squares between the king and the h1 rook are clear. Everything is ready to castle.',
      fen: 'r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
      interactive: false,
      arrows: [['e1', 'g1', 'rgba(34,197,94,0.85)']],
    },
    {
      title: 'Castle Your King',
      text: 'White has a pawn commanding the center on e4, a knight developed to f3, and a bishop active on c4. The path between the king and the h1 rook is completely clear.\n\nTuck the king to safety — drag it two squares toward the rook to castle kingside.',
      narrationText: 'White has a pawn commanding the center on e4, a knight developed to f3, and a bishop active on c4. The path between the king and the h1 rook is completely clear.\n\nTuck the king to safety — drag it two squares toward the rook to castle kingside.',
      fen: 'r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
      interactive: true,
      challenge: { from: 'e1', to: 'g1' },
      postChallenge: {
        fen: 'r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQ1RK1 b kq - 5 4',
        movedFrom: 'e1',
      },
    },
    {
      title: 'Common Opening Mistakes',
      text: 'Now that you know the three golden rules, here are three mistakes beginners make that violate them:\n\n**Bringing the queen out too early.** The queen is powerful but vulnerable — minor pieces can chase it around, and every retreat costs a move of development. Here White played 2.Qh5?! instead of developing a knight or bishop. Black simply plays 2…Nc6, developing with tempo while the queen sits awkwardly.\n\n**Moving the same piece twice.** Every move spent shuffling an already-developed piece is a move not spent developing a new one.\n\n**Grabbing pawns instead of developing.** Snatching a wing pawn while your pieces sit on the back rank is an invitation for your opponent to attack your exposed king.',
      narrationText: 'Now that you know the three golden rules, here are three mistakes beginners make that violate them:\n\n**Bringing the queen out too early.** The queen is powerful but vulnerable — minor pieces can chase it around, and every retreat costs a move of development. Here White played 2.Qh5?! instead of developing a knight or bishop. Black simply plays 2…Nc6, developing with tempo while the queen sits awkwardly.\n\n**Moving the same piece twice.** Every move spent shuffling an already-developed piece is a move not spent developing a new one.\n\n**Grabbing pawns instead of developing.** Snatching a wing pawn while your pieces sit on the back rank is an invitation for your opponent to attack your exposed king.',
      fen: 'r1bqkbnr/pppp1ppp/2n5/4p2Q/4P3/8/PPPP1PPP/RNB1KBNR w KQkq - 2 3',
      interactive: false,
      arrows: [
        ['c6', 'd4', 'rgba(34,197,94,0.85)'],
        ['c6', 'e5', 'rgba(34,197,94,0.85)'],
      ],
    },
    {
      title: 'Putting It All Together',
      text: 'After just four moves — 1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.O-O — White has followed every golden rule:\n\nA pawn on e4 commands the center. The knight on f3 and bishop on c4 are developed to active squares. The king is safely castled behind the f2, g2, and h2 pawns, and the rook on f1 is already closer to the center.\n\nYou do not need to memorise specific openings. Just ask yourself three questions on every move: "Am I fighting for the center? Am I developing a new piece? Is my king safe?" Answer yes to all three and you will leave the opening with a solid, playable position every time.',
      narrationText: 'After just four moves — 1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.O-O — White has followed every golden rule:\n\nA pawn on e4 commands the center. The knight on f3 and bishop on c4 are developed to active squares. The king is safely castled behind the f2, g2, and h2 pawns, and the rook on f1 is already closer to the center.\n\nYou do not need to memorise specific openings. Just ask yourself three questions on every move: "Am I fighting for the center? Am I developing a new piece? Is my king safe?" Answer yes to all three and you will leave the opening with a solid, playable position every time.',
      fen: 'r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQ1RK1 b kq - 5 4',
      interactive: false,
      fillSquares: ['e4', 'f3', 'c4', 'f1', 'g1'],
    },
  ],
}

export default lessonOpeningPrinciples
