
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Sidebar } from '@/components/Sidebar';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useMemo, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const allGames = [
  {
    title: 'Color Catcher',
    description: 'Test your reflexes by catching the colored tile before it disappears!',
    href: '/games/color-catcher',
    imageUrl: 'https://placehold.co/600x400/A06CD5/ffffff',
    dataAiHint: 'vibrant abstract',
    category: 'Action',
  },
  {
    title: 'Tic Tac Toe',
    description: "The classic game of X's and O's. Can you beat the computer?",
    href: '/games/tic-tac-toe',
    imageUrl: 'https://placehold.co/600x400/74B9D6/ffffff',
    dataAiHint: 'glowing neon',
    category: 'Strategy',
  },
  {
    title: 'Rock Paper Scissors',
    description: 'An old favorite. Can you outsmart the AI?',
    href: '/games/rock-paper-scissors',
    imageUrl: 'https://placehold.co/600x400/E5D9F2/000000',
    dataAiHint: 'stone paper',
    category: 'Action',
  },
  {
    title: 'Speed Typer',
    description: 'How fast can you type? A classic game to measure your typing speed.',
    href: '/games/speed-typer',
    imageUrl: 'https://placehold.co/600x400/c084fc/ffffff',
    dataAiHint: 'futuristic keyboard',
    category: 'Puzzle',
  },
  {
    title: 'Memory Match',
    description: 'Find all the matching pairs of cards in this classic memory game.',
    href: '/games/memory-match',
    imageUrl: 'https://placehold.co/600x400/fbbf24/ffffff',
    dataAiHint: 'playing cards',
    category: 'Puzzle',
  },
];

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const filteredGames = useMemo(() => {
    let games = allGames;

    if (activeFilter && activeFilter !== 'Home') {
      games = games.filter(game => game.category === activeFilter);
    }

    if (searchQuery) {
      games = games.filter(game =>
        game.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return games;
  }, [searchQuery, activeFilter]);
  
  const handleFilterChange = (category: string | null) => {
    setActiveFilter(category);
  }

  return (
    <div className="flex min-h-screen bg-background">
      {isClient ? <Sidebar activeFilter={activeFilter} onFilterChange={handleFilterChange} /> : <Skeleton className="w-20 h-screen" />}
      <div className="flex-1 flex flex-col">
        <header className="p-4 border-b sticky top-0 bg-background/80 backdrop-blur-sm z-20 flex items-center justify-between">
            <h1 className="text-xl font-bold">Pixel Playground</h1>
            <div className="relative w-full max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Search games..." 
                  className="pl-10 bg-secondary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <div className="flex items-center gap-4">
              <Button asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/register">Register</Link>
              </Button>
            </div>
        </header>
        
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="mb-8">
            <h2 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">{isClient && activeFilter && activeFilter !== 'Home' ? activeFilter : 'All'} Games</h2>
            <p className="mt-2 text-muted-foreground">Browse our collection of fun and exciting games.</p>
          </div>
          {isClient ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredGames.map((game) => (
                <Link href={game.href} key={game.title}>
                  <Card className="overflow-hidden group transition-all duration-300 hover:scale-105 hover:shadow-primary/20 hover:shadow-lg">
                      <div className="aspect-[4/3] relative">
                        <Image
                          src={game.imageUrl}
                          alt={game.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                          data-ai-hint={game.dataAiHint}
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold truncate">{game.title}</h3>
                        <p className="text-sm text-muted-foreground">{game.category}</p>
                      </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="aspect-[4/3] w-full" />
                  <div className="p-4">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
