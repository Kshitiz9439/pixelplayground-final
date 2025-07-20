
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Loader2, RefreshCw, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { getGameFeedback, type GetGameFeedbackInput } from '@/ai/flows/get-game-feedback';
import { Skeleton } from '@/components/ui/skeleton';

type GameStatus = "idle" | "playing" | "finished" | "loadingFeedback";
const GRID_SIZE = 4;
const GAME_DURATION = 30; // seconds
const TILE_INTERVAL = 1200; // ms

interface GameResult {
    score: number;
    feedback: string;
}

export default function ColorCatcherGame() {
  const [status, setStatus] = useState<GameStatus>("idle");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [activeTile, setActiveTile] = useState<[number, number] | null>(null);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!audioRef.current && isClient) {
        audioRef.current = new Audio('https://cdn.pixabay.com/audio/2022/10/21/audio_4df1b5722a.mp3');
        audioRef.current.loop = true;
        audioRef.current.volume = 0.3;
    }

    return () => {
        audioRef.current?.pause();
        if (timerRef.current) clearInterval(timerRef.current);
        if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isClient]);
  
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const getRandomTile = useCallback(() => {
    const row = Math.floor(Math.random() * GRID_SIZE);
    const col = Math.floor(Math.random() * GRID_SIZE);
    return [row, col] as [number, number];
  }, []);

  const advanceGame = useCallback(() => {
    setActiveTile(getRandomTile());
  }, [getRandomTile]);

  const stopGame = useCallback(async (isMiss: boolean = true) => {
    if (status !== 'playing') return;

    setStatus("loadingFeedback");
    audioRef.current?.pause();
    if (timerRef.current) clearInterval(timerRef.current);
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    timerRef.current = null;
    gameLoopRef.current = null;
    setActiveTile(null);
    
    try {
        const feedback = await getGameFeedback({ gameName: 'Color Catcher', score });
        setGameResult({ score, feedback: feedback.feedback });
    } catch (error) {
        console.error("Failed to get game feedback:", error);
        setGameResult({ score, feedback: "Great effort! You're a natural." });
    } finally {
        setStatus("finished");
    }

  }, [score, status]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setStatus("playing");
    setGameResult(null);
    advanceGame();

    if (audioRef.current) {
        audioRef.current.currentTime = 0;
        if (!isMuted) {
          audioRef.current.play().catch(e => console.error("Audio play failed:", e));
        }
    }

    gameLoopRef.current = setInterval(advanceGame, TILE_INTERVAL);

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          stopGame(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTileClick = (isCorrect: boolean) => {
    if (status !== 'playing') return;

    if (isCorrect) {
      setScore(prev => prev + 10);
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
      advanceGame();
      gameLoopRef.current = setInterval(advanceGame, TILE_INTERVAL);
    } else {
      stopGame(true);
    }
  };

  const toggleMute = () => {
      setIsMuted(current => !current);
  };
  
  if (!isClient) {
      return (
         <Card className="w-full h-full shadow-lg flex flex-col">
            <CardContent className="p-4 md:p-6 flex flex-col flex-grow">
                 <div className="flex justify-between items-center mb-4 p-4 rounded-lg bg-primary/10">
                    <Skeleton className="h-7 w-24" />
                    <Skeleton className="h-9 w-9" />
                    <Skeleton className="h-7 w-28" />
                </div>
                <div className="flex-grow aspect-square relative flex items-center justify-center">
                    <div className="grid grid-cols-4 gap-2 md:gap-4 w-full max-w-md mx-auto">
                        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
                            <Skeleton key={i} className="aspect-square rounded-md" />
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
      )
  }

  const grid = Array.from({ length: GRID_SIZE }, (_, rowIndex) => 
    Array.from({ length: GRID_SIZE }, (_, colIndex) => {
      const isActive = activeTile?.[0] === rowIndex && activeTile?.[1] === colIndex;
      return (
        <motion.div
          key={`${rowIndex}-${colIndex}`}
          className="aspect-square rounded-lg flex items-center justify-center"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <button
            onClick={() => handleTileClick(isActive)}
            className={cn(
                "w-full h-full rounded-md transition-colors duration-200",
                "bg-primary/20",
                isActive ? "bg-accent hover:bg-accent/90 cursor-pointer" : "cursor-default",
                status !== 'playing' && "cursor-not-allowed"
            )}
            aria-label={`Tile ${rowIndex}, ${colIndex}`}
            disabled={status !== 'playing'}
          />
        </motion.div>
      );
    })
  );

  return (
    <Card className="w-full h-full shadow-lg flex flex-col">
      <CardContent className="p-4 md:p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-4 p-4 rounded-lg bg-primary/10">
          <div className="text-lg">Score: <span className="font-bold text-primary">{score}</span></div>
          <Button onClick={toggleMute} variant="ghost" size="icon">
              {isMuted ? <VolumeX /> : <Volume2 />}
              <span className="sr-only">{isMuted ? 'Unmute' : 'Mute'}</span>
          </Button>
          <div className="text-lg">Time Left: <span className="font-bold text-primary">{timeLeft}s</span></div>
        </div>

        <div className="flex-grow aspect-square relative flex items-center justify-center">
            <AnimatePresence>
                {status === 'playing' && (
                    <motion.div 
                        className="grid grid-cols-4 gap-2 md:gap-4 w-full max-w-md mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                    >
                        {grid}
                    </motion.div>
                )}
            </AnimatePresence>
            
            {(status === 'idle' || status === 'finished' || status === 'loadingFeedback') && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-b-lg p-4">
                    {status === 'idle' && (
                        <>
                            <h2 className="text-3xl font-bold">Ready to Play?</h2>
                            <p className="text-foreground/70 mt-2 mb-6 text-center">Click the colored tiles as fast as you can when they appear!</p>
                            <Button onClick={startGame} size="lg">Start Game</Button>
                        </>
                    )}
                    {status === 'loadingFeedback' && (
                        <div className='text-center'>
                             <h2 className="text-3xl font-bold text-primary">Game Over!</h2>
                             <p className="text-xl mt-4">Analyzing your performance...</p>
                             <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mt-6" />
                        </div>
                    )}
                    {status === 'finished' && gameResult && (
                         <motion.div 
                            className="w-full max-w-sm"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                         >
                            <Card className="shadow-2xl text-center">
                                <CardHeader>
                                    <CardTitle className="text-4xl font-bold text-primary">Game Over!</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-lg">Your final score is:</p>
                                    <p className="text-6xl font-bold my-4">{gameResult.score}</p>
                                    <div className="mt-6 p-4 rounded-lg bg-secondary/50 text-secondary-foreground italic text-center">
                                        <Sparkles className="inline-block h-5 w-5 mr-2 text-accent"/>
                                        {gameResult.feedback}
                                    </div>
                                    <Button onClick={startGame} size="lg" className="mt-8 w-full">
                                        <RefreshCw className="mr-2" />
                                        Play Again
                                    </Button>
                                </CardContent>
                            </Card>
                         </motion.div>
                    )}
                </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
