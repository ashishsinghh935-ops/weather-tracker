import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const HeroCard = () => {
  // We use this reference to attach our 3D canvas directly to the div
  const mountRef = useRef(null);

  useEffect(() => {
    // 1. Standard Three.js Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    
    // alpha: true allows our Tailwind gradient background to show through the 3D canvas
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    // 2. Build a simple 3D Particle System (Placeholder for Rain/Snow)
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    for (let i = 0; i < 1000; i++) {
      vertices.push(THREE.MathUtils.randFloatSpread(2000)); // x
      vertices.push(THREE.MathUtils.randFloatSpread(2000)); // y
      vertices.push(THREE.MathUtils.randFloatSpread(2000)); // z
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    
    const material = new THREE.PointsMaterial({ color: 0xffffff, size: 3, transparent: true, opacity: 0.8 });
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    camera.position.z = 500;

    // 3. Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      particles.rotation.y += 0.001; // Slowly rotate the particle field
      renderer.render(scene, camera);
    };
    animate();

    // 4. Cleanup Function (Crucial for React so it doesn't leak memory!)
    return () => {
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-72 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg overflow-hidden flex items-center p-8 mt-6">
      
      {/* 3D Canvas Container */}
      <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none"></div>
      
      {/* Weather Data UI Overlay (z-10 keeps it above the 3D animation) */}
      <div className="relative z-10 text-white w-full flex justify-between items-center">
        <div>
          <h2 className="text-6xl font-bold mb-2">28°C</h2>
          <p className="text-xl font-medium text-indigo-100">Mostly Clear</p>
          <div className="flex gap-4 mt-4 text-sm font-medium">
            <span className="bg-white/20 px-3 py-1.5 rounded-lg backdrop-blur-sm shadow-sm flex items-center">
              <i className="fa-solid fa-droplet w-5"></i> Humidity: 45%
            </span>
            <span className="bg-white/20 px-3 py-1.5 rounded-lg backdrop-blur-sm shadow-sm flex items-center">
              <i className="fa-solid fa-wind w-5"></i> Wind: 12 km/h
            </span>
          </div>
        </div>
        <div className="text-right">
           <i className="fa-solid fa-sun text-8xl text-yellow-300 drop-shadow-2xl"></i>
        </div>
      </div>
    </div>
  );
};

export default HeroCard;