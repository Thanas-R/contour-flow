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

    // Simplex noise for organic patterns
    class SimplexNoise {
      private perm: number[] = [];
      
      constructor(seed: number = Math.random() * 10000) {
        const p = [];
        for (let i = 0; i < 256; i++) {
          p[i] = Math.floor(((seed * (i + 1) * 16807) % 2147483647) / 2147483647 * 256);
        }
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

    const simplex = new SimplexNoise(42);

    // Smooth curve through points using Catmull-Rom spline
    const drawSmoothCurve = (points: { x: number; y: number }[]) => {
      if (points.length < 2) return;
      
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      
      if (points.length === 2) {
        ctx.lineTo(points[1].x, points[1].y);
      } else {
        // Catmull-Rom to Bezier conversion for smooth curves
        for (let i = 0; i < points.length - 1; i++) {
          const p0 = points[i === 0 ? i : i - 1];
          const p1 = points[i];
          const p2 = points[i + 1];
          const p3 = points[i + 2 >= points.length ? i + 1 : i + 2];
          
          const tension = 0.5;
          const cp1x = p1.x + (p2.x - p0.x) * tension / 3;
          const cp1y = p1.y + (p2.y - p0.y) * tension / 3;
          const cp2x = p2.x - (p3.x - p1.x) * tension / 3;
          const cp2y = p2.y - (p3.y - p1.y) * tension / 3;
          
          ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
        }
      }
      
      ctx.stroke();
    };

    const drawContours = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      const isDark = document.documentElement.classList.contains('dark');
      
      // Clear with background
      ctx.fillStyle = isDark ? '#0a0a0a' : '#fafafa';
      ctx.fillRect(0, 0, width, height);

      // Much larger scale for flowing, spread out contours
      const scale = 0.0012;
      const levels = 6; // Fewer contour levels
      const cellSize = 8; // Larger cells for smoother result

      const cols = Math.ceil(width / cellSize) + 1;
      const rows = Math.ceil(height / cellSize) + 1;
      const heightMap: number[][] = [];

      for (let y = 0; y < rows; y++) {
        heightMap[y] = [];
        for (let x = 0; x < cols; x++) {
          const nx = x * cellSize * scale;
          const ny = y * cellSize * scale;
          
          // Smooth, flowing noise with gentle animation
          let value = 0;
          value += simplex.noise(nx + time * 0.008, ny + time * 0.006) * 1;
          value += simplex.noise(nx * 1.5 + time * 0.004, ny * 1.5 - time * 0.005) * 0.5;
          
          heightMap[y][x] = value;
        }
      }

      // Very subtle, thin lines
      ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.12)';
      ctx.lineWidth = 1;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Extract and draw smooth contour lines
      for (let level = 0; level < levels; level++) {
        const threshold = -1.2 + (level / levels) * 2.4;
        
        // Collect line segments
        const segments: { x: number; y: number }[][] = [];
        
        for (let y = 0; y < rows - 1; y++) {
          for (let x = 0; x < cols - 1; x++) {
            const tl = heightMap[y][x];
            const tr = heightMap[y][x + 1];
            const br = heightMap[y + 1][x + 1];
            const bl = heightMap[y + 1][x];

            let caseIndex = 0;
            if (tl > threshold) caseIndex |= 8;
            if (tr > threshold) caseIndex |= 4;
            if (br > threshold) caseIndex |= 2;
            if (bl > threshold) caseIndex |= 1;

            if (caseIndex === 0 || caseIndex === 15) continue;

            const px = x * cellSize;
            const py = y * cellSize;

            const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
            const getT = (v1: number, v2: number) => {
              if (Math.abs(v2 - v1) < 0.0001) return 0.5;
              return Math.max(0, Math.min(1, (threshold - v1) / (v2 - v1)));
            };

            const top = { x: lerp(px, px + cellSize, getT(tl, tr)), y: py };
            const right = { x: px + cellSize, y: lerp(py, py + cellSize, getT(tr, br)) };
            const bottom = { x: lerp(px, px + cellSize, getT(bl, br)), y: py + cellSize };
            const left = { x: px, y: lerp(py, py + cellSize, getT(tl, bl)) };

            const addSegment = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
              segments.push([p1, p2]);
            };

            switch (caseIndex) {
              case 1: case 14: addSegment(left, bottom); break;
              case 2: case 13: addSegment(bottom, right); break;
              case 3: case 12: addSegment(left, right); break;
              case 4: case 11: addSegment(top, right); break;
              case 5:
                addSegment(left, top);
                addSegment(bottom, right);
                break;
              case 6: case 9: addSegment(top, bottom); break;
              case 7: case 8: addSegment(left, top); break;
              case 10:
                addSegment(top, right);
                addSegment(left, bottom);
                break;
            }
          }
        }

        // Connect segments into continuous paths
        const paths: { x: number; y: number }[][] = [];
        const used = new Set<number>();
        const tolerance = cellSize * 0.5;

        const findNearestSegment = (point: { x: number; y: number }, excludeIdx: number): { idx: number; end: 'start' | 'end' } | null => {
          let nearest: { idx: number; end: 'start' | 'end'; dist: number } | null = null;
          
          for (let i = 0; i < segments.length; i++) {
            if (used.has(i) || i === excludeIdx) continue;
            
            const seg = segments[i];
            const distStart = Math.hypot(seg[0].x - point.x, seg[0].y - point.y);
            const distEnd = Math.hypot(seg[1].x - point.x, seg[1].y - point.y);
            
            if (distStart < tolerance && (!nearest || distStart < nearest.dist)) {
              nearest = { idx: i, end: 'start', dist: distStart };
            }
            if (distEnd < tolerance && (!nearest || distEnd < nearest.dist)) {
              nearest = { idx: i, end: 'end', dist: distEnd };
            }
          }
          
          return nearest;
        };

        for (let i = 0; i < segments.length; i++) {
          if (used.has(i)) continue;
          
          used.add(i);
          const path = [...segments[i]];
          
          // Extend forward
          let next = findNearestSegment(path[path.length - 1], i);
          while (next) {
            used.add(next.idx);
            const seg = segments[next.idx];
            if (next.end === 'start') {
              path.push(seg[1]);
            } else {
              path.push(seg[0]);
            }
            next = findNearestSegment(path[path.length - 1], next.idx);
          }
          
          // Extend backward
          let prev = findNearestSegment(path[0], i);
          while (prev) {
            used.add(prev.idx);
            const seg = segments[prev.idx];
            if (prev.end === 'start') {
              path.unshift(seg[1]);
            } else {
              path.unshift(seg[0]);
            }
            prev = findNearestSegment(path[0], prev.idx);
          }
          
          if (path.length >= 3) {
            paths.push(path);
          }
        }

        // Draw smooth curves
        for (const path of paths) {
          drawSmoothCurve(path);
        }
      }

      time += 0.003; // Slow, gentle animation
      animationId = requestAnimationFrame(drawContours);
    };

    drawContours();

    const observer = new MutationObserver(() => {});
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
    />
  );
};

export default TopographicBackground;
