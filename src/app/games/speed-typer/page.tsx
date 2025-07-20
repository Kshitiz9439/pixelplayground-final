
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SpeedTyperGame from './SpeedTyperGame';
import { GameBackgroundImage } from '@/components/GameBackgroundImage';

export default function SpeedTyperPage() {
  return (
    <>
      <GameBackgroundImage prompt="a futuristic 3D environment with glowing data streams and floating keyboard keys" />
      <main className="container mx-auto p-4 md:p-8 min-h-screen flex flex-col relative z-10">
        <div className="mb-8">
          <Button asChild variant="ghost" className="px-0 hover:bg-transparent text-accent hover:text-accent/80">
            <Link href="/" className="inline-flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Games
            </Link>
          </Button>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Speed Typer</h1>
          <p className="text-foreground/80 mt-2">How fast can you type? Get a random passage from the AI and test your skills!</p>
        </div>

        <div className="flex flex-col items-center justify-center flex-grow">
          <div className="w-full max-w-3xl">
            <SpeedTyperGame />
          </div>
        </div>
      </main>
    </>
  );
}
