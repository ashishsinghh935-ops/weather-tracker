import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Notice we added { data, isLoading } inside the parentheses
const HeroCard = ({ data, isLoading }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    for (let i = 0; i < 1000; i++) {
      vertices.push(THREE.MathUtils.randFloatSpread(2000));
      vertices.push(THREE.MathUtils.randFloatSpread(2000));
      vertices.push(THREE.MathUtils.randFloatSpread(2000));
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    
    const material = new THREE.PointsMaterial({ color: 0xffffff, size: 3, transparent: true, opacity: 0.8 });
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    camera.position.z = 500;

    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      particles.rotation.y += 0.001; 
      renderer.render(scene, camera);
    };
    animate();

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
      <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none"></div>
      
      <div className="relative z-10 text-white w-full flex justify-between items-center">
        {/* Dynamic Data Injection */}
        <div>
          {isLoading ? (
            <h2 className="text-6xl font-bold mb-2 animate-pulse">--°C</h2>
          ) : (
            <h2 className="text-6xl font-bold mb-2">{Math.round(data?.temperature_2m)}°C</h2>
          )}
          
          <p className="text-xl font-medium text-indigo-100">Live Telemetry</p>
          
          <div className="flex gap-4 mt-4 text-sm font-medium">
            <span className="bg-white/20 px-3 py-1.5 rounded-lg backdrop-blur-sm shadow-sm flex items-center">
              <i className="fa-solid fa-droplet w-5"></i> 
              Humidity: {isLoading ? "--" : data?.relative_humidity_2m}%
            </span>
            <span className="bg-white/20 px-3 py-1.5 rounded-lg backdrop-blur-sm shadow-sm flex items-center">
              <i className="fa-solid fa-wind w-5"></i> 
              Wind: {isLoading ? "--" : data?.wind_speed_10m} km/h
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