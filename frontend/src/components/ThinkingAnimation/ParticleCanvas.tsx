import { useEffect, useRef } from 'react';

interface ParticleCanvasProps {
  active: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  color: string;
}

interface CodeSymbol {
  x: number;
  y: number;
  char: string;
  speed: number;
  alpha: number;
  color: string;
  size: number;
}

const CODE_CHARS = ['<', '>', '{', '}', '/', '\\', ';', '=', '+', '*', '(', ')', '[', ']', '#', '&', '|', '!'];
const COLORS = ['#00E5FF', '#22C55E', '#94A3B8'];

export default function ParticleCanvas({ active }: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    let symbols: CodeSymbol[] = [];

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function initParticles() {
      if (!canvas) return;
      particles = Array.from({ length: 60 }, () => ({
        x: Math.random() * canvas!.width,
        y: Math.random() * canvas!.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.4 + 0.1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }));
    }

    function initSymbols() {
      if (!canvas) return;
      symbols = Array.from({ length: 20 }, () => ({
        x: Math.random() * canvas!.width,
        y: Math.random() * canvas!.height,
        char: CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)],
        speed: Math.random() * 0.3 + 0.1,
        alpha: Math.random() * 0.15 + 0.05,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: Math.random() * 10 + 8,
      }));
    }

    resize();
    initParticles();
    initSymbols();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!activeRef.current) {
        animRef.current = requestAnimationFrame(draw);
        return;
      }

      // Draw network lines between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0,229,255,${0.05 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas!.width;
        if (p.x > canvas!.width) p.x = 0;
        if (p.y < 0) p.y = canvas!.height;
        if (p.y > canvas!.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color.replace(')', `,${p.alpha})`).replace('rgb', 'rgba').replace('#00E5FF', `rgba(0,229,255,${p.alpha})`).replace('#22C55E', `rgba(34,197,94,${p.alpha})`).replace('#94A3B8', `rgba(148,163,184,${p.alpha})`);
        ctx.fill();
      });

      // Draw floating code symbols
      symbols.forEach((s) => {
        s.y += s.speed;
        if (s.y > canvas!.height + 20) {
          s.y = -20;
          s.x = Math.random() * canvas!.width;
          s.char = CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
        }
        ctx.font = `${s.size}px JetBrains Mono, monospace`;
        ctx.fillStyle = `rgba(0,229,255,${s.alpha})`;
        ctx.fillText(s.char, s.x, s.y);
      });

      animRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="particle-canvas w-full h-full"
    />
  );
}
