import { useEffect, useRef } from 'react';

const TopographicBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 20;
    };

    const animate = () => {
      currentX += (mouseX - currentX) * 0.05;
      currentY += (mouseY - currentY) * 0.05;
      
      const layers = container.querySelectorAll('.topo-layer');
      layers.forEach((layer, index) => {
        const depth = (index + 1) * 0.3;
        const element = layer as HTMLElement;
        element.style.transform = `translate(${currentX * depth}px, ${currentY * depth}px)`;
      });
      
      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 overflow-hidden bg-background">
      {/* Layer 1 - Slowest, largest patterns */}
      <svg
        className="topo-layer absolute inset-0 w-full h-full animate-topo-drift-1"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g className="stroke-contour opacity-20" fill="none" strokeWidth="1">
          <path d="M-100,200 Q150,100 300,200 T600,180 T900,220 T1200,200" className="animate-flow-1" />
          <path d="M-100,280 Q200,180 350,280 T650,260 T950,300 T1250,280" className="animate-flow-1" />
          <path d="M-100,360 Q180,260 330,360 T630,340 T930,380 T1230,360" className="animate-flow-1" />
          <path d="M-100,500 Q200,400 350,500 T650,480 T950,520 T1250,500" className="animate-flow-1" />
          <path d="M-100,640 Q180,540 330,640 T630,620 T930,660 T1230,640" className="animate-flow-1" />
          <path d="M-100,780 Q200,680 350,780 T650,760 T950,800 T1250,780" className="animate-flow-1" />
        </g>
      </svg>

      {/* Layer 2 - Medium speed */}
      <svg
        className="topo-layer absolute inset-0 w-full h-full animate-topo-drift-2"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g className="stroke-contour opacity-30" fill="none" strokeWidth="0.8">
          <path d="M-50,150 C100,80 200,220 350,150 S500,80 650,150 S800,220 950,150 S1100,80 1200,150" className="animate-flow-2" />
          <path d="M-50,250 C100,180 200,320 350,250 S500,180 650,250 S800,320 950,250 S1100,180 1200,250" className="animate-flow-2" />
          <path d="M-50,350 C100,280 200,420 350,350 S500,280 650,350 S800,420 950,350 S1100,280 1200,350" className="animate-flow-2" />
          <path d="M-50,450 C100,380 200,520 350,450 S500,380 650,450 S800,520 950,450 S1100,380 1200,450" className="animate-flow-2" />
          <path d="M-50,550 C100,480 200,620 350,550 S500,480 650,550 S800,620 950,550 S1100,480 1200,550" className="animate-flow-2" />
          <path d="M-50,650 C100,580 200,720 350,650 S500,580 650,650 S800,720 950,650 S1100,580 1200,650" className="animate-flow-2" />
          <path d="M-50,750 C100,680 200,820 350,750 S500,680 650,750 S800,820 950,750 S1100,680 1200,750" className="animate-flow-2" />
          <path d="M-50,850 C100,780 200,920 350,850 S500,780 650,850 S800,920 950,850 S1100,780 1200,850" className="animate-flow-2" />
        </g>
      </svg>

      {/* Layer 3 - Organic contour shapes */}
      <svg
        className="topo-layer absolute inset-0 w-full h-full animate-topo-drift-3"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g className="stroke-contour opacity-40" fill="none" strokeWidth="0.6">
          {/* Organic blob contours */}
          <path d="M300,300 Q350,250 400,280 Q450,310 420,360 Q390,410 340,390 Q290,370 280,320 Q270,270 300,300" className="animate-flow-3" />
          <path d="M280,280 Q340,220 410,260 Q480,300 450,370 Q420,440 350,420 Q280,400 260,340 Q240,280 280,280" className="animate-flow-3" />
          <path d="M260,260 Q330,190 420,240 Q510,290 480,380 Q450,470 360,450 Q270,430 240,360 Q210,290 260,260" className="animate-flow-3" />
          
          <path d="M650,500 Q700,450 750,480 Q800,510 770,560 Q740,610 690,590 Q640,570 630,520 Q620,470 650,500" className="animate-flow-3" />
          <path d="M630,480 Q690,420 760,460 Q830,500 800,570 Q770,640 700,620 Q630,600 610,540 Q590,480 630,480" className="animate-flow-3" />
          <path d="M610,460 Q680,390 770,440 Q860,490 830,580 Q800,670 710,650 Q620,630 590,560 Q560,490 610,460" className="animate-flow-3" />
          
          <path d="M150,700 Q200,650 250,680 Q300,710 270,760 Q240,810 190,790 Q140,770 130,720 Q120,670 150,700" className="animate-flow-3" />
          <path d="M130,680 Q190,620 260,660 Q330,700 300,770 Q270,840 200,820 Q130,800 110,740 Q90,680 130,680" className="animate-flow-3" />
          
          <path d="M800,200 Q850,150 900,180 Q950,210 920,260 Q890,310 840,290 Q790,270 780,220 Q770,170 800,200" className="animate-flow-3" />
          <path d="M780,180 Q840,120 910,160 Q980,200 950,270 Q920,340 850,320 Q780,300 760,240 Q740,180 780,180" className="animate-flow-3" />
        </g>
      </svg>

      {/* Layer 4 - Fine detail lines */}
      <svg
        className="topo-layer absolute inset-0 w-full h-full animate-topo-drift-4"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g className="stroke-contour opacity-50" fill="none" strokeWidth="0.5">
          <path d="M0,100 Q250,50 500,100 T1000,100" className="animate-flow-4" />
          <path d="M0,180 Q250,130 500,180 T1000,180" className="animate-flow-4" />
          <path d="M0,260 Q250,210 500,260 T1000,260" className="animate-flow-4" />
          <path d="M0,340 Q250,290 500,340 T1000,340" className="animate-flow-4" />
          <path d="M0,420 Q250,370 500,420 T1000,420" className="animate-flow-4" />
          <path d="M0,500 Q250,450 500,500 T1000,500" className="animate-flow-4" />
          <path d="M0,580 Q250,530 500,580 T1000,580" className="animate-flow-4" />
          <path d="M0,660 Q250,610 500,660 T1000,660" className="animate-flow-4" />
          <path d="M0,740 Q250,690 500,740 T1000,740" className="animate-flow-4" />
          <path d="M0,820 Q250,770 500,820 T1000,820" className="animate-flow-4" />
          <path d="M0,900 Q250,850 500,900 T1000,900" className="animate-flow-4" />
        </g>
      </svg>

      {/* Layer 5 - Fastest, closest detail */}
      <svg
        className="topo-layer absolute inset-0 w-full h-full animate-topo-drift-5"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g className="stroke-contour opacity-60" fill="none" strokeWidth="0.4">
          <ellipse cx="200" cy="400" rx="80" ry="60" className="animate-flow-5" />
          <ellipse cx="200" cy="400" rx="120" ry="90" className="animate-flow-5" />
          <ellipse cx="200" cy="400" rx="160" ry="120" className="animate-flow-5" />
          
          <ellipse cx="700" cy="300" rx="70" ry="50" className="animate-flow-5" />
          <ellipse cx="700" cy="300" rx="110" ry="80" className="animate-flow-5" />
          <ellipse cx="700" cy="300" rx="150" ry="110" className="animate-flow-5" />
          
          <ellipse cx="500" cy="700" rx="90" ry="70" className="animate-flow-5" />
          <ellipse cx="500" cy="700" rx="130" ry="100" className="animate-flow-5" />
          <ellipse cx="500" cy="700" rx="170" ry="130" className="animate-flow-5" />
          
          <ellipse cx="850" cy="650" rx="60" ry="45" className="animate-flow-5" />
          <ellipse cx="850" cy="650" rx="100" ry="75" className="animate-flow-5" />
          <ellipse cx="850" cy="650" rx="140" ry="105" className="animate-flow-5" />
        </g>
      </svg>
    </div>
  );
};

export default TopographicBackground;
