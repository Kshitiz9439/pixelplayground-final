
"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { RefreshCw, Star, Trophy } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Activity, Anchor, Atom, Axe, Award, Banana, Bomb, Bot, Brain, Bug, Bus, Cake, Camera, Cat, Cherry, Cloud, Code, Coffee, Cog, Diamond, Dna, Dog, DollarSign, Dumbbell, Feather, File, Film, Fish, Flag, Flame, FlaskConical, Gamepad2, Gem, Ghost, Gift, GitBranch, GlassWater, Globe, Grab, Guitar, Hammer, Heart, HelpCircle, Home, Image as ImageIcon, Infinity, Key, Lamp, Leaf, LifeBuoy, Lightbulb, Link, Lock, LogIn, Mail, Map, Mic, Moon, MousePointer, Music, Navigation, Package, Palette, Pen, Percent, Phone, Pin, Pizza, Plane, Plug, Plus, Puzzle, Quote, Rocket, Save, Scissors, Search, Settings, Shield, ShoppingCart, Siren, Smile, Snowflake, Speaker, Square, Sticker, Sun, Sunset, Swords, Tag, Target, Tent, Terminal, ThumbsUp, Timer, ToyBrick, Train, Trash, TreePine, Trello, Truck, Tv, Umbrella, Unlink, User, Video, Wallet, Watch, Wifi, Wind, Zap
} from 'lucide-react';

const icons = [
  Activity, Anchor, Atom, Axe, Award, Banana, Bomb, Bot, Brain, Bug, Bus, Cake, Camera, Cat, Cherry, Cloud, Code, Coffee, Cog, Diamond, Dna, Dog, DollarSign, Dumbbell, Feather, File, Film, Fish, Flag, Flame, FlaskConical, Gamepad2, Gem, Ghost, Gift, GitBranch, GlassWater, Globe, Grab, Guitar, Hammer, Heart, HelpCircle, Home, ImageIcon, Infinity, Key, Lamp, Leaf, LifeBuoy, Lightbulb, Link, Lock, LogIn, Mail, Map, Mic, Moon, MousePointer, Music, Navigation, Package, Palette, Pen, Percent, Phone, Pin, Pizza, Plane, Plug, Plus, Puzzle, Quote, Rocket, Save, Scissors, Search, Settings, Shield, ShoppingCart, Siren, Smile, Snowflake, Speaker, Square, Sticker, Sun, Sunset, Swords, Tag, Target, Tent, Terminal, ThumbsUp, Timer, ToyBrick, Train, Trash, TreePine, Trello, Truck, Tv, Umbrella, Unlink, User, Video, Wallet, Watch, Wifi, Wind, Zap
].filter(Boolean); // Filter out any potential undefined values

const GRID_SIZE = 16; // 4x4 grid

type CardState = {
  id: number;
  icon: React.ElementType;
  isFlipped: boolean;
  isMatched: boolean;
};

const createBoard = (): CardState[] => {
  const selectedIcons = icons.sort(() => 0.5 - Math.random()).slice(0, GRID_SIZE / 2);
  const cardPairs = [...selectedIcons, ...selectedIcons];
  const shuffledCards = cardPairs.sort(() => 0.5 - Math.random());

  return shuffledCards.map((Icon, index) => ({
    id: index,
    icon: Icon,
    isFlipped: false,
    isMatched: false,
  }));
};

const MemoryMatchGame = () => {
  const [board, setBoard] = useState<CardState[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    resetGame();
  }, []);

  useEffect(() => {
    if (flippedIndices.length === 2) {
      setIsChecking(true);
      const [firstIndex, secondIndex] = flippedIndices;
      const firstCard = board[firstIndex];
      const secondCard = board[secondIndex];

      if (firstCard.icon === secondCard.icon) {
        // Matched
        setBoard(prev =>
          prev.map(card =>
            card.icon === firstCard.icon ? { ...card, isMatched: true } : card
          )
        );
        resetFlipped();
      } else {
        // Not a match
        setTimeout(() => {
          setBoard(prev =>
            prev.map(card =>
              !card.isMatched ? { ...card, isFlipped: false } : card
            )
          );
          resetFlipped();
        }, 1000);
      }
      setMoves(prev => prev + 1);
    }
  }, [flippedIndices, board]);

  useEffect(() => {
    if (board.length > 0 && board.every(card => card.isMatched)) {
      setIsGameWon(true);
    }
  }, [board]);

  const resetFlipped = () => {
    setFlippedIndices([]);
    setIsChecking(false);
  };

  const handleCardClick = (index: number) => {
    if (isChecking || board[index].isFlipped || board[index].isMatched || isGameWon) {
      return;
    }

    const newBoard = [...board];
    newBoard[index].isFlipped = true;
    setBoard(newBoard);

    setFlippedIndices(prev => [...prev, index]);
  };

  const resetGame = () => {
    setBoard(createBoard());
    setFlippedIndices([]);
    setMoves(0);
    setIsChecking(false);
    setIsGameWon(false);
  };
  
  if (!isClient) {
      return (
         <Card className="w-full shadow-lg relative overflow-hidden">
            <CardContent className="p-4 md:p-6 flex flex-col items-center gap-4">
                 <div className="flex justify-between w-full items-center px-4 py-2 rounded-lg bg-primary/10">
                    <Skeleton className="h-7 w-24" />
                    <Skeleton className="h-9 w-32" />
                </div>
                <div className="grid grid-cols-4 gap-2 md:gap-4 w-full">
                    {Array(GRID_SIZE).fill(null).map((_, i) => (
                        <Skeleton key={i} className="aspect-square rounded-lg" />
                    ))}
                </div>
            </CardContent>
        </Card>
      )
  }

  return (
    <Card className="w-full shadow-lg relative overflow-hidden">
      <CardContent className="p-4 md:p-6 flex flex-col items-center gap-4">
        <div className="flex justify-between w-full items-center px-4 py-2 rounded-lg bg-primary/10">
          <div className="text-lg font-semibold">Moves: <span className="text-primary">{moves}</span></div>
          <Button onClick={resetGame} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" /> Reset Game
          </Button>
        </div>
        
        <div className="grid grid-cols-4 gap-2 md:gap-4 w-full">
          {board.map((card, index) => (
            <MemoryCard
              key={card.id}
              card={card}
              onClick={() => handleCardClick(index)}
            />
          ))}
        </div>

        <AnimatePresence>
          {isGameWon && (
            <motion.div
              className="absolute inset-0 bg-background/90 backdrop-blur-sm flex flex-col items-center justify-center z-10 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Trophy className="w-24 h-24 text-yellow-500" />
              <h2 className="text-4xl font-bold mt-4">You Won!</h2>
              <p className="text-xl mt-2">You matched all cards in {moves} moves.</p>
              <Button onClick={resetGame} size="lg" className="mt-8">
                <RefreshCw className="mr-2" /> Play Again
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

const MemoryCard = ({ card, onClick }: { card: CardState; onClick: () => void }) => {
  const { isFlipped, isMatched, icon: Icon } = card;

  return (
    <motion.div
      className="aspect-square cursor-pointer"
      onClick={onClick}
      initial={false}
      animate={{ rotateY: isFlipped ? 180 : 0 }}
      transition={{ duration: 0.5 }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="w-full h-full absolute" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
        <div className={cn("w-full h-full rounded-lg flex items-center justify-center bg-primary/20", {
          'cursor-not-allowed': isMatched
        })}>
          <Star className="w-1/2 h-1/2 text-primary/50" />
        </div>
      </div>
      <div
        className={cn(
          "w-full h-full absolute rounded-lg flex items-center justify-center",
          isMatched ? 'bg-green-500/30' : 'bg-accent'
        )}
        style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
      >
        <Icon className={cn("w-1/2 h-1/2", isMatched ? 'text-green-900' : 'text-accent-foreground')} />
      </div>
    </motion.div>
  );
};

export default MemoryMatchGame;
