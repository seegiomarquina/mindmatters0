import React, { useEffect, useRef } from 'react';

export const PenCursor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const penRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const isFine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
    if (!isFine) return;

    const pen = penRef.current;
    const canvas = canvasRef.current;
    if (!pen || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let penX = mouseX;
    let penY = mouseY;
    let lastX = mouseX;
    let lastY = mouseY;
    let angle = 38;
    const dots: { x: number; y: number; life: number }[] = [];
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      pen.classList.add('active');
      const dist = Math.hypot(mouseX - lastX, mouseY - lastY);
      if (dist > 3) {
        dots.push({ x: mouseX, y: mouseY, life: 1 });
        lastX = mouseX;
        lastY = mouseY;
      }
    };

    const handleMouseLeave = () => {
      pen.classList.remove('active');
    };

    const handleMouseDown = () => {
      pen.classList.add('pressing');
    };

    const handleMouseUp = () => {
      pen.classList.remove('pressing');
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    const loop = () => {
      penX += (mouseX - penX) * 0.22;
      penY += (mouseY - penY) * 0.22;
      const targetAngle = Math.atan2(mouseY - penY, mouseX - penX) * (180 / Math.PI) + 45;
      if (Math.hypot(mouseX - lastX, mouseY - lastY) > 0.5) {
        angle += (targetAngle - angle) * 0.15;
      }

      pen.style.transform = `translate(${penX - 13}px, ${penY - 88.5}px) rotate(${angle}deg)`;

      ctx.clearRect(0, 0, w, h);
      for (let i = dots.length - 1; i >= 0; i--) {
        const d = dots[i];
        d.life -= 0.035;
        if (d.life <= 0) {
          dots.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.fillStyle = `rgba(27,27,47,${d.life * 0.28})`;
        ctx.arc(d.x, d.y, 2.2 * d.life, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <canvas id="ink-trail-canvas" ref={canvasRef} />
      <div id="pen-cursor" ref={penRef}>
        <svg viewBox="0 0 26 92" fill="none">
          <defs>
            <linearGradient id="barrelGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0f0f1c" />
              <stop offset="45%" stopColor="#4a4a6b" />
              <stop offset="100%" stopColor="#0f0f1c" />
            </linearGradient>
            <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#8a6a26" />
              <stop offset="50%" stopColor="#f0d488" />
              <stop offset="100%" stopColor="#8a6a26" />
            </linearGradient>
          </defs>
          <rect x="7" y="4" width="12" height="52" rx="5" fill="url(#barrelGrad)" />
          <path d="M18 8c4-1 5 1 5 5v14c0 3-1 4-5 3" fill="none" stroke="url(#goldGrad)" strokeWidth="2" />
          <rect x="6.4" y="14" width="13.2" height="3.2" rx="1.2" fill="url(#goldGrad)" />
          <rect x="7.2" y="52" width="11.6" height="3" rx="1.2" fill="url(#goldGrad)" />
          <path d="M7.6 55 L18.4 55 L15.8 68 L10.2 68 Z" fill="url(#barrelGrad)" />
          <path d="M11 66 L15 66 L18 79 C18 84 15 90 13 90 C11 90 8 84 8 79 Z" fill="url(#goldGrad)" />
          <line x1="13" y1="70" x2="13" y2="89" stroke="#5c451c" strokeWidth="0.7" />
          <circle cx="13" cy="88.5" r="0.9" fill="#1B1B2F" />
        </svg>
        <div className="nib-dot" />
      </div>
    </>
  );
};
