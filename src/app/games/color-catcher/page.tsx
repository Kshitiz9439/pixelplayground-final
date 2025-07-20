
import Link from 'next/link';
import { Suspense } from 'react';
import { ArrowLeft } from 'lucide-react';
import ColorCatcherGame from './ColorCatcherGame';
import Leaderboard from './Leaderboard';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GameBackgroundImage } from '@/components/GameBackgroundImage';

function LeaderboardSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader>
        <Skeleton className="h-8 w-3/4" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
        </div>
         <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
        </div>
         <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-4 w-[100px]" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ColorCatcherPage() {
  return (
    <>
      <GameBackgroundImage prompt="vibrant, abstract 3D landscape of glowing crystal structures, cinematic lighting" />
      <main className="container mx-auto p-4 md:p-8 min-h-screen flex flex-col relative z-10">
        <div className="mb-8">
          <Button asChild variant="ghost" className="px-0 hover:bg-transparent text-accent hover:text-accent/80">
            <Link href="/" className="inline-flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Games
            </Link>
          </Button>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Color Catcher</h1>
          <p className="text-foreground/80 mt-2">Click the colored tile as fast as you can. Good luck!</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 flex-grow">
          <div className="w-full lg:w-2/3">
            <ColorCatcherGame />
          </div>
          <div className="w-full lg:w-1/3">
              <Suspense fallback={<LeaderboardSkeleton />}>
                <Leaderboard />
              </Suspense>
          </div>
        </div>
      </main>
    </>
  );
}
