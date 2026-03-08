import { useState } from 'react';
import TopographicBackground, { type ContourDensity } from '@/components/TopographicBackground';
import ThemeToggle from '@/components/ThemeToggle';
import DensityControl from '@/components/DensityControl';
import { Github } from 'lucide-react';

const Index = () => {
  const [density, setDensity] = useState<ContourDensity>(
    () => (localStorage.getItem('contour-density') as ContourDensity) || 'medium'
  );

  return (
    <div className="relative min-h-screen">
      <TopographicBackground density={density} />
      <ThemeToggle />

      {/* GitHub button */}
      <a
        href="https://github.com/Thanas-R/contour-flow-test"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed top-6 left-6 z-50 rounded-full p-2.5 bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-background/90 transition-all duration-300 text-foreground"
        aria-label="View on GitHub"
      >
        <Github className="h-5 w-5" />
      </a>

      <DensityControl onChange={setDensity} />

      {/* Content overlay */}
      <div className="relative z-10 flex min-h-screen items-center justify-center">
      </div>
    </div>
  );
};

export default Index;
