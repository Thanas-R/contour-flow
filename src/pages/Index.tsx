import TopographicBackground from '@/components/TopographicBackground';
import ThemeToggle from '@/components/ThemeToggle';
const Index = () => {
  return <div className="relative min-h-screen">
      <TopographicBackground />
      <ThemeToggle />
      
      {/* Content overlay */}
      <div className="relative z-10 flex min-h-screen items-center justify-center">
        
      </div>
    </div>;
};
export default Index;