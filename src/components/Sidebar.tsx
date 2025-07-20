
import Link from 'next/link';
import { Home, Swords, Puzzle, Brain, Users, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const sidebarItems = [
  { href: '#', icon: Home, label: 'Home' },
  { href: '#', icon: Swords, label: 'Action' },
  { href: '#', icon: Puzzle, label: 'Puzzle' },
  { href: '#', icon: Brain, label: 'Strategy' },
  { href: '#', icon: Users, label: 'Multiplayer' },
];

interface SidebarProps {
  activeFilter: string | null;
  onFilterChange: (category: string | null) => void;
}

export function Sidebar({ activeFilter, onFilterChange }: SidebarProps) {
  const handleItemClick = (label: string) => {
    if (label === 'Home') {
      onFilterChange(null);
    } else {
      onFilterChange(label);
    }
  };
  
  return (
    <aside className="w-20 bg-secondary p-4 flex flex-col items-center space-y-6 sticky top-0 h-screen">
      <Link href="/">
        <div className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 12L22 7" stroke="currentColor" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 12V22" stroke="currentColor" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 12L2 7" stroke="currentColor" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </Link>
      <TooltipProvider>
        <nav className="flex flex-col items-center space-y-4">
          {sidebarItems.map((item) => (
            <Tooltip key={item.label}>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-muted-foreground hover:text-primary hover:bg-primary/10 data-[active=true]:text-primary data-[active=true]:bg-primary/10"
                  data-active={activeFilter === item.label || (activeFilter === null && item.label === 'Home')}
                  onClick={() => handleItemClick(item.label)}
                >
                  <item.icon className="h-6 w-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </nav>
      </TooltipProvider>
      <div className="mt-auto">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button asChild variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-primary/10">
                <Link href="#">
                  <HelpCircle className="h-6 w-6" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Help</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </aside>
  );
}
