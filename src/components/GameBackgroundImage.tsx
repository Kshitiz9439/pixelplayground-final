
import Image from 'next/image';
import { generateGameBackground } from '@/ai/flows/generate-game-background';
import { Skeleton } from './ui/skeleton';

export async function GameBackgroundImage({ prompt }: { prompt: string }) {
  let imageUrl: string | null = null;
  try {
    const result = await generateGameBackground({ prompt });
    imageUrl = result.imageUrl;
  } catch (error) {
    console.error(`Failed to generate background for prompt "${prompt}":`, error);
    // Fallback to a simple gradient if image generation fails
    return (
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-background to-secondary" />
    );
  }

  return (
    <>
        <Image
          src={imageUrl}
          alt="AI generated game background"
          fill
          className="fixed inset-0 -z-10 object-cover"
          priority
        />
        <div className="fixed inset-0 -z-10 bg-black/30 backdrop-blur-md" />
    </>
  );
}

export function GameBackgroundImageSkeleton() {
    return <Skeleton className="fixed inset-0 -z-10" />
}
