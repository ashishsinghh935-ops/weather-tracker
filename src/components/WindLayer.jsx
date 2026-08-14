import React, { useEffect, useRef } from 'react';

const WindLayer = ({ windSpeed = 10, windDirection = 45 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Resize canvas to perfectly match the map container
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle system configuration
    const PARTICLE_COUNT = 150;
    const particles = [];

    // Convert degrees to radians for our matrix transformation
    const angleInRadians = (windDirection - 90) * (Math.PI / 180);
    
    // Calculate the velocity vector
    const velocityX = Math.cos(angleInRadians) * (windSpeed * 0.2);
    const velocityY = Math.sin(angleInRadians) * (windSpeed * 0.2);

    // Initialize random particle positions
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: Math.random() * 15 + 5,
        opacity: Math.random() * 0.5 + 0.1
      });
    }

    const render = () => {
      // Create a slight fading trail effect
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 1.5;

      particles.forEach(p => {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(79, 70, 229, ${p.opacity})`; // Tailwind Indigo-600
        
        // Draw the particle vector
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + velocityX * p.length, p.y + velocityY * p.length);
        ctx.stroke();

        // Apply transformation matrix shift
        p.x += velocityX;
        p.y += velocityY;

        // Boundary collision detection (wrap around the screen)
        if (p.x > canvas.width) p.x = 0;
        if (p.x < 0) p.x = canvas.width;
        if (p.y > canvas.height) p.y = 0;
        if (p.y < 0) p.y = canvas.height;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [windSpeed, windDirection]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-[400] mix-blend-multiply opacity-60"
    />
  );
};

export default WindLayer;