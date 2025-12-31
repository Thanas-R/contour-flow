import TopographicBackground from '@/components/TopographicBackground';
import ThemeToggle from '@/components/ThemeToggle';

const Index = () => {
  return (
    <div className="relative min-h-screen">
      <TopographicBackground />
      <ThemeToggle />
      
      {/* Content overlay */}
      <div className="relative z-10 flex min-h-screen items-center justify-center">
        <div className="text-center px-6">
          <h1 className="text-5xl md:text-7xl font-light tracking-tight text-foreground mb-4 animate-fade-in">
            Topographic
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-light tracking-wide animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Flowing contours in motion
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
