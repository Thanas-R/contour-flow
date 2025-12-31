import { useEffect, useRef } from 'react';

const TopographicBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    // Simplex noise implementation for organic patterns
    class SimplexNoise {
      private perm: number[] = [];
      
      constructor() {
        const p = [];
        for (let i = 0; i < 256; i++) p[i] = Math.floor(Math.random() * 256);
        for (let i = 0; i < 512; i++) this.perm[i] = p[i & 255];
      }

      private grad(hash: number, x: number, y: number): number {
        const h = hash & 7;
        const u = h < 4 ? x : y;
        const v = h < 4 ? y : x;
        return ((h & 1) ? -u : u) + ((h & 2) ? -2 * v : 2 * v);
      }

      noise(x: number, y: number): number {
        const F2 = 0.5 * (Math.sqrt(3) - 1);
        const G2 = (3 - Math.sqrt(3)) / 6;

        const s = (x + y) * F2;
        const i = Math.floor(x + s);
        const j = Math.floor(y + s);

        const t = (i + j) * G2;
        const X0 = i - t;
        const Y0 = j - t;
        const x0 = x - X0;
        const y0 = y - Y0;

        let i1: number, j1: number;
        if (x0 > y0) { i1 = 1; j1 = 0; }
        else { i1 = 0; j1 = 1; }

        const x1 = x0 - i1 + G2;
        const y1 = y0 - j1 + G2;
        const x2 = x0 - 1 + 2 * G2;
        const y2 = y0 - 1 + 2 * G2;

        const ii = i & 255;
        const jj = j & 255;

        let n0 = 0, n1 = 0, n2 = 0;

        let t0 = 0.5 - x0 * x0 - y0 * y0;
        if (t0 >= 0) {
          t0 *= t0;
          n0 = t0 * t0 * this.grad(this.perm[ii + this.perm[jj]], x0, y0);
        }

        let t1 = 0.5 - x1 * x1 - y1 * y1;
        if (t1 >= 0) {
          t1 *= t1;
          n1 = t1 * t1 * this.grad(this.perm[ii + i1 + this.perm[jj + j1]], x1, y1);
        }

        let t2 = 0.5 - x2 * x2 - y2 * y2;
        if (t2 >= 0) {
          t2 *= t2;
          n2 = t2 * t2 * this.grad(this.perm[ii + 1 + this.perm[jj + 1]], x2, y2);
        }

        return 70 * (n0 + n1 + n2);
      }
    }

    const simplex = new SimplexNoise();

    const drawContours = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Get computed styles for theme colors
      const computedStyle = getComputedStyle(document.documentElement);
      const isDark = document.documentElement.classList.contains('dark');
      
      // Clear with background
      ctx.fillStyle = isDark ? '#0a0a0a' : '#fafafa';
      ctx.fillRect(0, 0, width, height);

      // Contour settings
      const scale = 0.003;
      const levels = 15;
      const cellSize = 4;

      // Create height map with animation
      const cols = Math.ceil(width / cellSize) + 1;
      const rows = Math.ceil(height / cellSize) + 1;
      const heightMap: number[][] = [];

      for (let y = 0; y < rows; y++) {
        heightMap[y] = [];
        for (let x = 0; x < cols; x++) {
          const nx = x * cellSize * scale;
          const ny = y * cellSize * scale;
          
          // Layer multiple octaves of noise for organic feel
          let value = 0;
          value += simplex.noise(nx + time * 0.02, ny + time * 0.015) * 1;
          value += simplex.noise(nx * 2 + time * 0.01, ny * 2 - time * 0.01) * 0.5;
          value += simplex.noise(nx * 4 - time * 0.005, ny * 4 + time * 0.008) * 0.25;
          
          heightMap[y][x] = value;
        }
      }

      // Marching squares for contour lines
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.35)';
      ctx.lineWidth = 0.8;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      for (let level = 0; level < levels; level++) {
        const threshold = -1.5 + (level / levels) * 3;
        
        ctx.beginPath();

        for (let y = 0; y < rows - 1; y++) {
          for (let x = 0; x < cols - 1; x++) {
            const tl = heightMap[y][x];
            const tr = heightMap[y][x + 1];
            const br = heightMap[y + 1][x + 1];
            const bl = heightMap[y + 1][x];

            // Marching squares case
            let caseIndex = 0;
            if (tl > threshold) caseIndex |= 8;
            if (tr > threshold) caseIndex |= 4;
            if (br > threshold) caseIndex |= 2;
            if (bl > threshold) caseIndex |= 1;

            if (caseIndex === 0 || caseIndex === 15) continue;

            const px = x * cellSize;
            const py = y * cellSize;

            // Interpolation function
            const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
            const getT = (v1: number, v2: number) => {
              if (Math.abs(v2 - v1) < 0.0001) return 0.5;
              return (threshold - v1) / (v2 - v1);
            };

            // Edge midpoints with interpolation
            const top = lerp(px, px + cellSize, getT(tl, tr));
            const right = lerp(py, py + cellSize, getT(tr, br));
            const bottom = lerp(px, px + cellSize, getT(bl, br));
            const left = lerp(py, py + cellSize, getT(tl, bl));

            // Draw line segments based on case
            switch (caseIndex) {
              case 1:
              case 14:
                ctx.moveTo(px, left);
                ctx.lineTo(bottom, py + cellSize);
                break;
              case 2:
              case 13:
                ctx.moveTo(bottom, py + cellSize);
                ctx.lineTo(px + cellSize, right);
                break;
              case 3:
              case 12:
                ctx.moveTo(px, left);
                ctx.lineTo(px + cellSize, right);
                break;
              case 4:
              case 11:
                ctx.moveTo(top, py);
                ctx.lineTo(px + cellSize, right);
                break;
              case 5:
                ctx.moveTo(px, left);
                ctx.lineTo(top, py);
                ctx.moveTo(bottom, py + cellSize);
                ctx.lineTo(px + cellSize, right);
                break;
              case 6:
              case 9:
                ctx.moveTo(top, py);
                ctx.lineTo(bottom, py + cellSize);
                break;
              case 7:
              case 8:
                ctx.moveTo(px, left);
                ctx.lineTo(top, py);
                break;
              case 10:
                ctx.moveTo(top, py);
                ctx.lineTo(px + cellSize, right);
                ctx.moveTo(px, left);
                ctx.lineTo(bottom, py + cellSize);
                break;
            }
          }
        }
        
        ctx.stroke();
      }

      time += 0.008;
      animationId = requestAnimationFrame(drawContours);
    };

    drawContours();

    // Listen for theme changes
    const observer = new MutationObserver(drawContours);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ background: 'transparent' }}
    />
  );
};

export default TopographicBackground;
