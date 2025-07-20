
import { Crown, Medal, Trophy } from 'lucide-react';
import { generateLeaderboard, type GenerateLeaderboardInput } from '@/ai/flows/generate-leaderboard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const playerStats = {
  PlayerOne: { clicks: 50, misses: 5 },
  SpeedyGonzales: { clicks: 45, misses: 2 },
  SlowPoke: { clicks: 30, misses: 10 },
  ClickMaster: { clicks: 55, misses: 8 },
  ProGamerX: { clicks: 60, misses: 3 },
  NoobSlayer: { clicks: 48, misses: 6 },
  PixelHunter: { clicks: 52, misses: 4 },
};

const rankIcons: { [key: number]: React.ReactNode } = {
  1: <Crown className="h-5 w-5 text-yellow-500" />,
  2: <Medal className="h-5 w-5 text-slate-500" />,
  3: <Trophy className="h-5 w-5 text-orange-500" />,
};

const rankRowClass: { [key: number]: string } = {
    1: 'bg-yellow-500/10 hover:bg-yellow-500/20',
    2: 'bg-slate-500/10 hover:bg-slate-500/20',
    3: 'bg-orange-500/10 hover:bg-orange-500/20',
}

export default async function Leaderboard() {
  const input: GenerateLeaderboardInput = {
    gameName: 'Color Catcher',
    playerStats,
    difficultyLevel: 5,
  };

  try {
    const result = await generateLeaderboard(input);
    const leaderboardData = result.leaderboard;

    return (
      <Card className="h-full shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="text-primary" />
            AI-Powered Leaderboard
          </CardTitle>
          <CardDescription>Rankings are dynamically generated based on performance and difficulty.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Rank</TableHead>
                <TableHead>Player</TableHead>
                <TableHead className="text-right">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboardData.map((player) => (
                <TableRow key={player.playerId} className={cn(rankRowClass[player.rank])}>
                  <TableCell className="font-medium">
                    <div className="flex items-center justify-center w-6 h-6">
                      {rankIcons[player.rank] || <span>{player.rank}</span>}
                    </div>
                  </TableCell>
                  <TableCell>{player.playerId}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary">{player.score.toLocaleString()}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  } catch (error) {
    console.error("Failed to generate leaderboard:", error);
    return (
        <Alert variant="destructive" className="h-full">
            <Trophy className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
                Could not load the AI-powered leaderboard. Please try again later.
            </AlertDescription>
        </Alert>
    )
  }
}
