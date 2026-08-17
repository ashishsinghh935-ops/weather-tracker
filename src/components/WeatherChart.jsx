import React from 'react';
import { motion } from 'framer-motion';

const WeatherChart = ({ hourlyData, isDay }) => {
  if (!hourlyData || !hourlyData.time || !hourlyData.temperature_2m) return null;

  // 1. Isolate the next 24 hours of data
  const now = new Date();
  const currentIndex = hourlyData.time.findIndex(t => new Date(t) >= now);
  const startIndex = currentIndex !== -1 ? currentIndex : 0;
  const dataPoints = hourlyData.temperature_2m.slice(startIndex, startIndex + 24);
  const times = hourlyData.time.slice(startIndex, startIndex + 24);

  if (dataPoints.length === 0) return null;

  // 2. Dynamic SVG Coordinate Mapping
  const width = 900;
  const height = 250;
  const padding = 50;
  
  const minTemp = Math.min(...dataPoints) - 2;
  const maxTemp = Math.max(...dataPoints) + 2;
  const tempRange = maxTemp - minTemp || 1;

  const points = dataPoints.map((temp, index) => {
    const x = padding + (index / (dataPoints.length - 1)) * (width - padding * 2);
    const y = height - padding - ((temp - minTemp) / tempRange) * (height - padding * 2);
    return { x, y, temp, time: times[index] };
  });

  // 3. Custom Bezier Curve Generator for a smooth, premium line
  const createCurve = (points) => {
    if (points.length === 0) return "";
    let path = `M ${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const xCenter = (points[i].x + points[i + 1].x) / 2;
      path += ` C ${xCenter},${points[i].y} ${xCenter},${points[i+1].y} ${points[i+1].x},${points[i+1].y}`;
    }
    return path;
  };

  const linePath = createCurve(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x},${height - padding} L ${points[0].x},${height - padding} Z`;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`w-full p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border backdrop-blur-xl ${
        isDay ? 'bg-white/70 border-white/40' : 'bg-[#18181b]/70 border-zinc-800/50'
      }`}
    >
      <h3 className={`text-lg font-extrabold mb-6 tracking-wide ${isDay ? 'text-gray-900' : 'text-zinc-100'}`}>
        24-Hour Temperature Trend
      </h3>
      
      <div className="w-full overflow-x-auto overflow-y-hidden custom-scrollbar">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[700px] h-auto drop-shadow-lg overflow-visible">
          <defs>
            <linearGradient id="gradientFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isDay ? "#4f46e5" : "#818cf8"} stopOpacity="0.4" />
              <stop offset="100%" stopColor={isDay ? "#4f46e5" : "#818cf8"} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Background Grid Lines */}
          {[...Array(5)].map((_, i) => {
            const y = padding + (i / 4) * (height - padding * 2);
            return (
              <line 
                key={i} x1={padding} y1={y} x2={width - padding} y2={y} 
                stroke={isDay ? "#e5e7eb" : "#3f3f46"} strokeWidth="1.5" strokeDasharray="6 6" 
                opacity="0.6"
              />
            );
          })}

          {/* 1. The Area Fill (Fades in slowly after the line draws) */}
          <motion.path
            d={areaPath}
            fill="url(#gradientFill)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 1.2 }} // Waits for line to draw
          />

          {/* 2. The Cinematic SVG Line Draw */}
          <motion.path
            d={linePath}
            fill="none"
            stroke={isDay ? "#4f46e5" : "#818cf8"}
            strokeWidth="5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.8, ease: "easeInOut" }} // Smooth 1.8s draw
          />

          {/* 3. Data Points & Labels (Staggered spring pop-in) */}
          {points.map((p, i) => (
            <g key={i}>
              <motion.circle
                cx={p.x}
                cy={p.y}
                r="6"
                fill={isDay ? "#ffffff" : "#18181b"}
                stroke={isDay ? "#4f46e5" : "#818cf8"}
                strokeWidth="3"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.5 + i * 0.05, type: "spring", stiffness: 400 }}
              />
              
              {/* Only show temperature and time labels for every 3rd point to keep it clean */}
              {i % 3 === 0 && (
                <>
                  <motion.text
                    x={p.x}
                    y={p.y - 18}
                    textAnchor="middle"
                    fill={isDay ? "#1f2937" : "#f4f4f5"}
                    fontSize="13"
                    fontWeight="bold"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.8 + i * 0.03 }}
                  >
                    {Math.round(p.temp)}°
                  </motion.text>
                  
                  <motion.text
                    x={p.x}
                    y={height - 15}
                    textAnchor="middle"
                    fill={isDay ? "#6b7280" : "#a1a1aa"}
                    fontSize="11"
                    fontWeight="600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                  >
                    {new Date(p.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </motion.text>
                </>
              )}
            </g>
          ))}
        </svg>
      </div>
    </motion.div>
  );
};

export default WeatherChart;