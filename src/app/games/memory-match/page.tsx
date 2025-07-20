
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MemoryMatchGame from './MemoryMatchGame';
import { GameBackgroundImage } from '@/components/GameBackgroundImage';

export default function MemoryMatchPage() {
  return (
    <>
      <GameBackgroundImage prompt="a whimsical 3D scene of floating, stylized game icons and puzzle pieces" />
      <main className="container mx-auto p-4 md:p-8 min-h-screen flex flex-col relative z-10">
        <div className="mb-8">
          <Button asChild variant="ghost" className="px-0 hover:bg-transparent text-accent hover:text-accent/80">
            <Link href="/" className="inline-flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Games
            </Link>
          </Button>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Memory Match</h1>
          <p className="text-foreground/80 mt-2">Flip the cards and find all the matching pairs. Test your memory!</p>
        </div>

        <div className="flex flex-col items-center justify-center flex-grow">
          <div className="w-full max-w-2xl">
            <MemoryMatchGame />
          </div>
        </div>
      </main>
    </>
  );
}
