import { useEffect, useState } from 'react';
import { Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type DensityLevel = 'low' | 'medium' | 'high';

const DensityToggle = () => {
  const [density, setDensity] = useState<DensityLevel>('medium');

  useEffect(() => {
    const saved = localStorage.getItem('contour-density') as DensityLevel | null;
    if (saved && ['low', 'medium', 'high'].includes(saved)) {
      setDensity(saved);
    }
  }, []);

  const changeDensity = (level: DensityLevel) => {
    setDensity(level);
    localStorage.setItem('contour-density', level);
    // Dispatch event so TopographicBackground can react
    window.dispatchEvent(new CustomEvent('density-change', { detail: level }));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-6 right-20 z-50 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-background/90 transition-all duration-300"
        >
          <Layers className="h-5 w-5 text-foreground" />
          <span className="sr-only">Change density</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[100px]">
        <DropdownMenuItem 
          onClick={() => changeDensity('low')}
          className={density === 'low' ? 'bg-accent' : ''}
        >
          Low
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => changeDensity('medium')}
          className={density === 'medium' ? 'bg-accent' : ''}
        >
          Medium
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => changeDensity('high')}
          className={density === 'high' ? 'bg-accent' : ''}
        >
          High
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DensityToggle;
