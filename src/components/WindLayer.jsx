import React, { useEffect, useRef } from 'react';

const WindLayer = ({ windSpeed = 0, windDirection = 0, weatherCode = 0 }) => {
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

    // 1. Determine Physics Mode based on Open-Meteo Weather Codes
    let mode = 'wind'; // Default to wind for clear/cloudy days
    const rainCodes = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99];
    const snowCodes = [71, 73, 75, 77, 85, 86];
    
    if (rainCodes.includes(weatherCode)) mode = 'rain';
    else if (snowCodes.includes(weatherCode)) mode = 'snow';

    const PARTICLE_COUNT = mode === 'snow' ? 100 : 200;
    const particles = [];

    // Base wind vectors
    const angleInRadians = (windDirection - 90) * (Math.PI / 180);
    const baseVx = Math.cos(angleInRadians) * (windSpeed * 0.3);
    const baseVy = Math.sin(angleInRadians) * (windSpeed * 0.3);

    // Initialize particles with randomized offsets for fluttering
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: Math.random() * 20 + 10,
        opacity: Math.random() * 0.5 + 0.2,
        size: Math.random() * 2 + 1, 
        offset: Math.random() * 100 
      });
    }

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.05;

      particles.forEach(p => {
        ctx.beginPath();
        
        if (mode === 'rain') {
          // RAIN PHYSICS: Heavy gravity + wind push
          const vx = baseVx * 0.5;
          const vy = 15 + (windSpeed * 0.1); 
          ctx.strokeStyle = `rgba(147, 197, 253, ${p.opacity})`; // Tailwind Blue-300
          ctx.lineWidth = 1.5;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + vx, p.y + vy * (p.length / 10));
          ctx.stroke();
          
          p.x += vx;
          p.y += vy;
          
        } else if (mode === 'snow') {
          // SNOW PHYSICS: Slow falling + sine wave flutter + wind drift
          const vx = (baseVx * 0.2) + Math.sin(time + p.offset) * 1.5;
          const vy = 3 + (windSpeed * 0.05); 
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          
          p.x += vx;
          p.y += vy;
          
        } else {
          // WIND PHYSICS: The original sweeping vector field
          ctx.strokeStyle = `rgba(148, 163, 184, ${p.opacity})`; // Tailwind Slate-400
          ctx.lineWidth = 1.2;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + baseVx * p.length, p.y + baseVy * p.length);
          ctx.stroke();
          
          p.x += baseVx;
          p.y += baseVy;
        }

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
  }, [windSpeed, windDirection, weatherCode]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-[400]"
    />
  );
};

export default WindLayer;