
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, RefreshCw } from 'lucide-react';
import { generateTypingText } from '@/ai/flows/generate-typing-text';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

type GameStatus = 'idle' | 'loading' | 'ready' | 'typing' | 'finished';

const topics = ["space exploration", "ancient history", "ocean life", "future technology", "classic literature"];

const SpeedTyperGame = () => {
  const [status, setStatus] = useState<GameStatus>('idle');
  const [textToType, setTextToType] = useState('');
  const [userInput, setUserInput] = useState('');
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [isClient, setIsClient] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const startTimeRef = useRef<number | null>(null);

  const fetchNewText = useCallback(async () => {
    setStatus('loading');
    setUserInput('');
    setWpm(0);
    setAccuracy(0);
    setTimeElapsed(0);
    startTimeRef.current = null;
    if (timerRef.current) clearInterval(timerRef.current);
    
    try {
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];
      const result = await generateTypingText({ topic: randomTopic });
      setTextToType(result.text);
      setStatus('ready');
    } catch (error) {
      console.error("Failed to generate text:", error);
      setTextToType("The quick brown fox jumps over the lazy dog. This is a fallback text, please try refreshing the game.");
      setStatus('ready');
    }
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      fetchNewText();
    }
  }, [isClient, fetchNewText]);

  useEffect(() => {
    if (status === 'ready' && textToType) {
        inputRef.current?.focus();
    }
  }, [status, textToType]);

  const startGame = () => {
    if (status !== 'ready') return;
    setStatus('typing');
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      if (startTimeRef.current) {
        setTimeElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }
    }, 1000);
  };
  
  const endGame = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setStatus('finished');
  }, []);

  useEffect(() => {
    if (status !== 'typing') return;
    
    // WPM Calculation
    const wordsTyped = userInput.trim().split(/\s+/).filter(Boolean).length;
    const timeInMinutes = timeElapsed / 60;
    const calculatedWpm = timeInMinutes > 0 ? Math.round(wordsTyped / timeInMinutes) : 0;
    setWpm(calculatedWpm);

    // Accuracy Calculation
    let correctChars = 0;
    const currentTextChunk = textToType.substring(0, userInput.length);
    for (let i = 0; i < userInput.length; i++) {
        if (userInput[i] === currentTextChunk[i]) {
            correctChars++;
        }
    }
    const calculatedAccuracy = userInput.length > 0 ? Math.round((correctChars / userInput.length) * 100) : 0;
    setAccuracy(calculatedAccuracy);

  }, [userInput, timeElapsed, textToType, status]);


  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (status === 'finished') return;
    if (status === 'ready' && value.length > 0) {
      startGame();
    }
    setUserInput(value);
    if (value.length >= textToType.length) {
      endGame();
    }
  };

  const renderText = () => {
    return textToType.split('').map((char, index) => {
      let colorClass = 'text-foreground/50';
      if (index < userInput.length) {
        colorClass = char === userInput[index] ? 'text-primary' : 'text-destructive';
      }
      return <span key={index} className={cn(colorClass, 'transition-colors')}>{char}</span>;
    });
  };

  if (!isClient) {
    return (
      <Card className="w-full shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-32" />
            <div className="flex gap-4 text-center">
              <Skeleton className="h-10 w-16" />
              <Skeleton className="h-10 w-16" />
              <Skeleton className="h-10 w-16" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-[120px] w-full" />
          <Skeleton className="h-[100px] w-full" />
        </CardContent>
        <CardFooter className="flex justify-center">
           <Skeleton className="h-10 w-36" />
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Speed Typer</CardTitle>
          <div className="flex gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">Time</p>
              <p className="text-2xl font-bold">{timeElapsed}s</p>
            </div>
             <div>
              <p className="text-sm text-muted-foreground">WPM</p>
              <p className="text-2xl font-bold">{wpm}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Accuracy</p>
              <p className="text-2xl font-bold">{accuracy}%</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-6 rounded-lg bg-primary/10 text-lg md:text-xl font-mono leading-relaxed tracking-wider min-h-[120px]">
          {status === 'loading' ? <Loader2 className="animate-spin" /> : renderText()}
        </div>
        <Textarea
          ref={inputRef}
          value={userInput}
          onChange={handleInputChange}
          className="font-mono text-lg md:text-xl"
          placeholder="Start typing here..."
          disabled={status === 'loading' || status === 'finished' || status === 'idle'}
        />
      </CardContent>
      <CardFooter className="flex justify-center">
        {status === 'finished' ? (
           <motion.div initial={{scale: 0.8}} animate={{scale: 1}}>
                <Button onClick={fetchNewText} size="lg">
                    <RefreshCw className="mr-2" /> Play Again
                </Button>
            </motion.div>
        ) : (
             <Button onClick={fetchNewText} variant="outline" disabled={status === 'loading'}>
                <RefreshCw className="mr-2"/> 
                {status === 'loading' ? 'Loading new text...' : 'New Text'}
             </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default SpeedTyperGame;
