// frontend/src/components/ParticleBackground.js
import React, { useEffect, useRef, useState } from 'react';
import { useMousePosition } from '../hooks/useMousePosition';

const ParticleBackground = ({
  particleCount = 50,
  connectionDistance = 100,
  particleColor = 'rgba(59, 130, 246, 0.6)',
  lineColor = 'rgba(59, 130, 246, 0.3)',
  particleSize = 2,
  speed = 0.5,
  interactive = true
}) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef();
  const mousePosition = useMousePosition();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Initialize particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateDimensions = () => {
      const rect = canvas.getBoundingClientRect();
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Create particles
  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;

    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        originalX: 0,
        originalY: 0,
        size: Math.random() * particleSize + 1,
        opacity: Math.random() * 0.8 + 0.2,
        life: Math.random() * 100,
        maxLife: 100,
      });
    }

    particles.forEach(particle => {
      particle.originalX = particle.x;
      particle.originalY = particle.y;
    });

    particlesRef.current = particles;
  }, [dimensions, particleCount, speed, particleSize]);

  // Animation loop
  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    const animate = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      const particles = particlesRef.current;

      // Update and draw particles
      particles.forEach((particle, index) => {
        // Mouse interaction
        if (interactive && mousePosition.x && mousePosition.y) {
          const dx = mousePosition.x - particle.x;
          const dy = mousePosition.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            const force = (150 - distance) / 150;
            const angle = Math.atan2(dy, dx);
            particle.vx -= Math.cos(angle) * force * 0.01;
            particle.vy -= Math.sin(angle) * force * 0.01;
          }
        }

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Return to original position gradually
        const returnForce = 0.001;
        particle.vx += (particle.originalX - particle.x) * returnForce;
        particle.vy += (particle.originalY - particle.y) * returnForce;

        // Apply friction
        particle.vx *= 0.99;
        particle.vy *= 0.99;

        // Boundary collision
        if (particle.x < 0 || particle.x > dimensions.width) {
          particle.vx *= -0.8;
          particle.x = Math.max(0, Math.min(dimensions.width, particle.x));
        }
        if (particle.y < 0 || particle.y > dimensions.height) {
          particle.vy *= -0.8;
          particle.y = Math.max(0, Math.min(dimensions.height, particle.y));
        }

        // Update life
        particle.life += 0.5;
        if (particle.life >= particle.maxLife) {
          particle.life = 0;
          particle.opacity = Math.random() * 0.8 + 0.2;
        }

        // Breathing effect
        const breathe = Math.sin(particle.life * 0.1) * 0.3 + 0.7;

        // Draw particle
        ctx.save();
        ctx.globalAlpha = particle.opacity * breathe;
        ctx.fillStyle = particleColor;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw connections
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 1;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            const opacity = (1 - distance / connectionDistance) * 0.5;
            ctx.save();
            ctx.globalAlpha = opacity;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      // Mouse connection
      if (interactive && mousePosition.x && mousePosition.y) {
        particles.forEach(particle => {
          const dx = mousePosition.x - particle.x;
          const dy = mousePosition.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance * 1.5) {
            const opacity = (1 - distance / (connectionDistance * 1.5)) * 0.8;
            ctx.save();
            ctx.globalAlpha = opacity;
            ctx.strokeStyle = 'rgba(139, 92, 246, 0.6)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(mousePosition.x, mousePosition.y);
            ctx.stroke();
            ctx.restore();
          }
        });

        // Mouse glow effect
        const gradient = ctx.createRadialGradient(
          mousePosition.x, mousePosition.y, 0,
          mousePosition.x, mousePosition.y, 100
        );
        gradient.addColorStop(0, 'rgba(139, 92, 246, 0.3)');
        gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');

        ctx.save();
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(mousePosition.x, mousePosition.y, 100, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions, mousePosition, interactive, connectionDistance, particleColor, lineColor]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        background: 'transparent',
      }}
    />
  );
};

export default ParticleBackground;