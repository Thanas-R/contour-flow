import { useState } from 'react';
import { Layers } from 'lucide-react';
import type { ContourDensity } from './TopographicBackground';

const DENSITY_KEY = 'contour-density';

const labels: Record<ContourDensity, string> = {
  low: 'Low',
  medium: 'Med',
  high: 'High',
};

interface DensityControlProps {
  onChange: (d: ContourDensity) => void;
}

const DensityControl = ({ onChange }: DensityControlProps) => {
  const [density, setDensity] = useState<ContourDensity>(
    () => (localStorage.getItem(DENSITY_KEY) as ContourDensity) || 'medium'
  );
  const [open, setOpen] = useState(false);

  const options: ContourDensity[] = ['low', 'medium', 'high'];

  const select = (d: ContourDensity) => {
    setDensity(d);
    localStorage.setItem(DENSITY_KEY, d);
    onChange(d);
    setOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="mb-2 flex flex-col gap-1 rounded-xl border border-border/50 bg-background/80 backdrop-blur-sm p-2 animate-fade-in">
          {options.map((o) => (
            <button
              key={o}
              onClick={() => select(o)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                density === o
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              {labels[o]}
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="rounded-full p-2.5 bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-background/90 transition-all duration-300 text-foreground"
        aria-label="Contour density"
      >
        <Layers className="h-4 w-4" />
      </button>
    </div>
  );
};

export default DensityControl;
