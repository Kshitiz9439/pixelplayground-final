
"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';

type Player = 'X' | 'O';
type Square = Player | null;

const winningLines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6],             // diagonals
];

const TicTacToeGame = () => {  
  const [board, setBoard] = useState<Square[]>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const checkWinner = (currentBoard: Square[]) => {
    for (const line of winningLines) {
      const [a, b, c] = line;
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return currentBoard[a];
      }
    }
    if (currentBoard.every(square => square !== null)) {
        return 'draw';
    }
    return null;
  };

  const handlePlayerMove = (index: number) => {
    if (board[index] || winner || !isPlayerTurn) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if(gameWinner) {
        setWinner(gameWinner);
    } else {
        setIsPlayerTurn(false);
    }
  };

  const getBestMove = (currentBoard: Square[]): number => {
    // 1. Check if computer can win
    for (const line of winningLines) {
      const [a, b, c] = line;
      const lineValues = [currentBoard[a], currentBoard[b], currentBoard[c]];
      if (lineValues.filter(v => v === 'O').length === 2 && lineValues.filter(v => v === null).length === 1) {
        const emptyIndex = line.find(i => currentBoard[i] === null);
        if (emptyIndex !== undefined) return emptyIndex;
      }
    }
    
    // 2. Check if player is about to win and block them
    for (const line of winningLines) {
      const [a, b, c] = line;
      const lineValues = [currentBoard[a], currentBoard[b], currentBoard[c]];
      if (lineValues.filter(v => v === 'X').length === 2 && lineValues.filter(v => v === null).length === 1) {
        const emptyIndex = line.find(i => currentBoard[i] === null);
        if (emptyIndex !== undefined) return emptyIndex;
      }
    }

    // 3. Take center if available
    if (currentBoard[4] === null) return 4;

    // 4. Otherwise, pick a random available move
    const availableMoves = currentBoard
      .map((square, index) => (square === null ? index : null))
      .filter(val => val !== null) as number[];
    
    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    return availableMoves[randomIndex];
  };

  useEffect(() => {
    if (!isPlayerTurn && !winner) {
      const computerMove = getBestMove(board);
    
      const newBoard = [...board];
      newBoard[computerMove] = 'O';
      
      setTimeout(() => {
          setBoard(newBoard);
          const gameWinner = checkWinner(newBoard);
          if(gameWinner) {
              setWinner(gameWinner);
          } else {
              setIsPlayerTurn(true);
          }
      }, 500);
    }
  }, [isPlayerTurn, winner, board]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setWinner(null);
  };
  
  const renderSquare = (index: number) => {
    const player = board[index];
    return (
        <motion.div
            className="aspect-square flex items-center justify-center bg-primary/10 rounded-lg cursor-pointer"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            onClick={() => handlePlayerMove(index)}
        >
            <button
                className="w-full h-full flex items-center justify-center rounded-lg transition-colors duration-200 hover:bg-primary/20 disabled:cursor-not-allowed"
                disabled={!!player || !!winner || !isPlayerTurn}
                aria-label={`Square ${index}`}
            >
                <AnimatePresence>
                    {player && (
                        <motion.div 
                            initial={{ scale: 0 }} 
                            animate={{ scale: 1 }}
                            className={player === 'X' ? 'text-accent' : 'text-blue-500'}
                        >
                            {player === 'X' ? (
                                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                 <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                  <circle cx="12" cy="12" r="8" />
                                </svg>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </button>
      </motion.div>
    );
  };
  
  if (!isClient) {
      return (
         <Card className="w-full shadow-lg">
            <CardContent className="p-4 md:p-6">
                <div className="grid grid-cols-3 gap-2 md:gap-4 max-w-md mx-auto">
                    {Array(9).fill(null).map((_, i) => (
                        <Skeleton key={i} className="aspect-square rounded-lg" />
                    ))}
                </div>
                <div className="mt-6 flex justify-center">
                    <Skeleton className="h-10 w-36" />
                </div>
            </CardContent>
        </Card>
      )
  }

  return (
    <Card className="w-full shadow-lg">
      <CardContent className="p-4 md:p-6">
        <div className="grid grid-cols-3 gap-2 md:gap-4 max-w-md mx-auto">
          {Array(9).fill(null).map((_, i) => (
             renderSquare(i)
          ))}
        </div>
        <AnimatePresence>
          {winner && (
            <Dialog open={!!winner} onOpenChange={() => winner && resetGame()}>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle className="text-3xl font-bold text-center">
                        {winner === 'draw' ? "It's a Draw!" : `Player ${winner} Wins!`}
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        {winner === 'X' ? "Congratulations, you beat the AI!" : (winner === 'O' ? "The AI reigns supreme this time. Better luck next time!" : "A hard-fought battle ends in a draw.")}
                    </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                    <Button onClick={resetGame} size="lg" className="w-full">
                        <RefreshCw className="mr-2" />
                        Play Again
                    </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
          )}
        </AnimatePresence>
        <div className="mt-6 flex justify-center">
            <Button onClick={resetGame} variant="outline">
                <RefreshCw className="mr-2" />
                Reset Game
            </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TicTacToeGame;
