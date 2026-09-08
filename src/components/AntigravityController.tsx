import React, { useEffect } from 'react';

export const AntigravityController: React.FC = () => {
  useEffect(() => {
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      targetX = e.clientX - cx;
      targetY = e.clientY - cy;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;

      const floaters = document.querySelectorAll<HTMLElement>('.antigravity');
      floaters.forEach((el) => {
        const depth = parseFloat(el.getAttribute('data-depth') || '0.03');
        const moveX = currentX * depth;
        const moveY = currentY * depth;
        el.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return null;
};
