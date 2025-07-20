
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RockPaperScissorsGame from './RockPaperScissorsGame';
import { GameBackgroundImage } from '@/components/GameBackgroundImage';

export default function RockPaperScissorsPage() {
  return (
    <>
      <GameBackgroundImage prompt="epic 3D rendering of giant rock, paper, and scissors statues in a dramatic landscape" />
      <main className="container mx-auto p-4 md:p-8 min-h-screen flex flex-col relative z-10">
        <div className="mb-8">
          <Button asChild variant="ghost" className="px-0 hover:bg-transparent text-accent hover:text-accent/80">
            <Link href="/" className="inline-flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Games
            </Link>
          </Button>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Rock Paper Scissors</h1>
          <p className="text-foreground/80 mt-2">The ultimate game of chance and psychology. Make your move!</p>
        </div>

        <div className="flex flex-col items-center justify-center flex-grow">
          <div className="w-full max-w-lg">
            <RockPaperScissorsGame />
          </div>
        </div>
      </main>
    </>
  );
}
