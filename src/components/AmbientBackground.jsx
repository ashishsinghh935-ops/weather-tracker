import React from 'react';
import { motion } from 'framer-motion';

const AmbientBackground = ({ weatherCode, isDay }) => {
  // Decode the Open-Meteo weather codes
  const isClear = weatherCode === 0;
  const isCloudy = weatherCode >= 1 && weatherCode <= 48;
  const isRain = weatherCode >= 51 && weatherCode <= 67;
  const isSnow = weatherCode >= 71 && weatherCode <= 77;
  const isStorm = weatherCode >= 95;

  // Generate an array of 40 particles for rain or snow
  const particles = Array.from({ length: 40 });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      
      {/* 1. CLEAR DAY: Soft pulsating Sun Flare */}
      {isClear && isDay && (
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-yellow-400/30 rounded-full blur-[120px]"
        />
      )}

      {/* 2. CLEAR NIGHT: Subtle twinkling stars */}
      {isClear && !isDay && (
        <div className="absolute inset-0">
          {particles.slice(0, 25).map((_, i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.1, 0.8, 0.1] }}
              transition={{ repeat: Infinity, duration: Math.random() * 3 + 2, delay: Math.random() * 2 }}
              className="absolute bg-white rounded-full w-1 h-1 shadow-[0_0_5px_white]"
              style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
            />
          ))}
        </div>
      )}

      {/* 3. CLOUDY: Massive, slow-drifting atmospheric blurs */}
      {isCloudy && (
        <motion.div
          animate={{ x: ['-20%', '120%'] }}
          transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
          className={`absolute top-20 w-[800px] h-[300px] rounded-full blur-[100px] ${isDay ? 'bg-white/40' : 'bg-slate-700/20'}`}
        />
      )}

      {/* 4. RAIN OR SNOW: Physics-based falling particles */}
      {(isRain || isSnow) && (
        <div className="absolute inset-0">
          {particles.map((_, i) => (
            <motion.div
              key={i}
              initial={{ top: "-10%", left: `${Math.random() * 100}%` }}
              animate={{ top: "110%", left: `${Math.random() * 100 + (isSnow ? Math.random() * 20 - 10 : 5)}%` }}
              transition={{
                repeat: Infinity,
                duration: isSnow ? Math.random() * 3 + 4 : Math.random() * 0.8 + 0.6, // Rain falls faster than snow
                ease: "linear",
                delay: Math.random() * 2
              }}
              className={`absolute ${
                isSnow 
                  ? 'w-2 h-2 bg-white/80 rounded-full blur-[1px]' 
                  : 'w-[2px] h-8 bg-blue-400/40' // Rain is a thin blue streak
              }`}
            />
          ))}
        </div>
      )}

      {/* 5. STORM: Cinematic Lightning Flashes */}
      {isStorm && (
        <motion.div
          animate={{ opacity: [0, 0, 0.8, 0, 0, 0.5, 0] }}
          transition={{ repeat: Infinity, duration: 7, times: [0, 0.8, 0.85, 0.9, 0.92, 0.95, 1] }}
          className="absolute inset-0 bg-white mix-blend-overlay z-10"
        />
      )}
    </div>
  );
};

export default AmbientBackground;