
"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Hand, Scissors, Gem } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type Choice = 'rock' | 'paper' | 'scissors';
type Result = 'win' | 'lose' | 'draw' | null;

const choices: { name: Choice; icon: React.ReactNode }[] = [
  { name: 'rock', icon: <Gem className="w-16 h-16" /> },
  { name: 'paper', icon: <Hand className="w-16 h-16" /> },
  { name: 'scissors', icon: <Scissors className="w-16 h-16" /> },
];

const RockPaperScissorsGame = () => {
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [computerChoice, setComputerChoice] = useState<Choice | null>(null);
  const [result, setResult] = useState<Result>(null);
  const [scores, setScores] = useState({ player: 0, computer: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handlePlayerChoice = (choice: Choice) => {
    if (result) {
        // Start next round
        setResult(null);
        setComputerChoice(null);
        setPlayerChoice(choice);
    } else {
        // First choice
        setPlayerChoice(choice);
    }
  };
  
  useEffect(() => {
    if (playerChoice && !result) {
      const newComputerChoice = choices[Math.floor(Math.random() * choices.length)].name;
      
      const timer = setTimeout(() => {
        setComputerChoice(newComputerChoice);
        determineWinner(playerChoice, newComputerChoice);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [playerChoice, result]);


  const determineWinner = (player: Choice, computer: Choice) => {
    if (player === computer) {
      setResult('draw');
    } else if (
      (player === 'rock' && computer === 'scissors') ||
      (player === 'paper' && computer === 'rock') ||
      (player === 'scissors' && computer === 'paper')
    ) {
      setResult('win');
      setScores(prev => ({ ...prev, player: prev.player + 1 }));
    } else {
      setResult('lose');
      setScores(prev => ({ ...prev, computer: prev.computer + 1 }));
    }
  };

  const getResultText = () => {
    switch (result) {
      case 'win': return "You Win!";
      case 'lose': return "You Lose!";
      case 'draw': return "It's a Draw!";
      default: return "Make your move!";
    }
  };
  
  const getResultColor = () => {
    switch (result) {
      case 'win': return "text-green-500";
      case 'lose': return "text-destructive";
      case 'draw': return "text-yellow-500";
      default: return "text-foreground";
    }
  }
  
  const resetRound = () => {
      setPlayerChoice(null);
      setComputerChoice(null);
      setResult(null);
  }

  const ChoiceButton = ({ choice }: { choice: Choice }) => {
    const { icon } = choices.find(c => c.name === choice)!;
    return (
        <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
        >
            <Button
                variant="outline"
                size="lg"
                className="w-32 h-32 md:w-40 md:h-40 flex flex-col gap-2 rounded-2xl shadow-lg"
                onClick={() => handlePlayerChoice(choice)}
                disabled={!!playerChoice && !result}
            >
                {icon}
                <span className="capitalize text-lg">{choice}</span>
            </Button>
        </motion.div>
    );
  };
  
  const ChoiceDisplay = ({ choice, label }: { choice: Choice | null, label: string }) => {
    const icon = choice ? choices.find(c => c.name === choice)!.icon : <div className="w-16 h-16" />;
    return (
        <div className="flex flex-col items-center gap-4">
            <h3 className="text-2xl font-semibold">{label}</h3>
            <Card className="w-40 h-40 md:w-48 md:h-48 flex items-center justify-center rounded-2xl bg-primary/10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={choice || 'placeholder'}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {icon}
                    </motion.div>
                </AnimatePresence>
            </Card>
        </div>
    )
  }

  if (!isClient) {
    return (
      <Card className="w-full shadow-lg">
        <CardContent className="p-4 md:p-6 flex flex-col items-center gap-8">
            <div className="flex justify-around w-full text-center">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-8 w-32" />
            </div>
            <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 min-h-[250px]">
                <div className="flex flex-col items-center gap-4">
                    <Skeleton className="h-8 w-36" />
                    <Skeleton className="w-40 h-40 md:w-48 md:h-48 rounded-2xl" />
                </div>
                 <div className="flex flex-col items-center gap-4">
                    <Skeleton className="h-8 w-36" />
                    <Skeleton className="w-40 h-40 md:w-48 md:h-48 rounded-2xl" />
                </div>
            </div>
            <Skeleton className="h-10 w-64" />
            <div className="flex justify-center gap-4 md:gap-8 mt-4">
                <Skeleton className="w-32 h-32 md:w-40 md:h-40 rounded-2xl" />
                <Skeleton className="w-32 h-32 md:w-40 md:h-40 rounded-2xl" />
                <Skeleton className="w-32 h-32 md:w-40 md:h-40 rounded-2xl" />
            </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full shadow-lg">
      <CardContent className="p-4 md:p-6 flex flex-col items-center gap-8">
        <div className="flex justify-around w-full text-center">
            <div className="text-2xl font-bold">Player: <span className="text-primary">{scores.player}</span></div>
            <div className="text-2xl font-bold">Computer: <span className="text-primary">{scores.computer}</span></div>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 min-h-[250px]">
            <ChoiceDisplay choice={playerChoice} label="Your Choice" />
            <AnimatePresence>
            {computerChoice && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-4xl font-bold"
                >
                    VS
                </motion.div>
            )}
            </AnimatePresence>
            <ChoiceDisplay choice={computerChoice} label="AI's Choice" />
        </div>
        
        <AnimatePresence mode="wait">
            <motion.div
                key={getResultText()}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className={`text-4xl font-bold text-center h-10 ${getResultColor()}`}
            >
                {getResultText()}
            </motion.div>
        </AnimatePresence>

        <div className="flex justify-center gap-4 md:gap-8 mt-4">
          {!result && choices.map(c => <ChoiceButton key={c.name} choice={c.name} />)}
        </div>
        
        {result && (
            <Button onClick={resetRound} className="mt-4" size="lg">
                Play Next Round
            </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default RockPaperScissorsGame;
