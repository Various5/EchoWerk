// frontend/src/hooks/useMousePosition.js
import { useState, useEffect } from 'react';

export const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updateMousePosition);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  return mousePosition;
};

export const useMouseVelocity = () => {
  const [velocity, setVelocity] = useState({ x: 0, y: 0, magnitude: 0 });
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const [lastTime, setLastTime] = useState(Date.now());

  useEffect(() => {
    const updateVelocity = (e) => {
      const now = Date.now();
      const deltaTime = now - lastTime;

      if (deltaTime > 0) {
        const deltaX = e.clientX - lastPosition.x;
        const deltaY = e.clientY - lastPosition.y;

        const vx = deltaX / deltaTime * 1000; // pixels per second
        const vy = deltaY / deltaTime * 1000;
        const magnitude = Math.sqrt(vx * vx + vy * vy);

        setVelocity({ x: vx, y: vy, magnitude });
        setLastPosition({ x: e.clientX, y: e.clientY });
        setLastTime(now);
      }
    };

    window.addEventListener('mousemove', updateVelocity);

    return () => {
      window.removeEventListener('mousemove', updateVelocity);
    };
  }, [lastPosition, lastTime]);

  return velocity;
};