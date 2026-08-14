import React from 'react';

const DashboardSkeleton = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-6 w-full animate-pulse">
      
      {/* HeroCard Skeleton */}
      <div className="w-full bg-gray-200 rounded-xl p-8 shadow-sm flex justify-between items-center h-[280px]">
        <div className="flex flex-col space-y-4">
          <div className="h-4 bg-gray-300 rounded w-32"></div> {/* Location Name */}
          <div className="h-20 bg-gray-300 rounded w-48"></div> {/* Temperature */}
          <div className="h-6 bg-gray-300 rounded w-24"></div> {/* Condition */}
          
          <div className="flex space-x-4 pt-4">
            <div className="h-8 bg-gray-300 rounded-lg w-28"></div> {/* Humidity Badge */}
            <div className="h-8 bg-gray-300 rounded-lg w-32"></div> {/* Wind Badge */}
          </div>
        </div>
        
        {/* Weather Icon Skeleton */}
        <div className="h-32 w-32 bg-gray-300 rounded-full"></div>
      </div>

      {/* WeatherChart Skeleton */}
      <div className="w-full bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
        <div className="h-64 bg-gray-100 rounded w-full"></div>
      </div>

      {/* Grid Layout for Bottom Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Forecast Skeleton */}
        <div className="w-full bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="h-6 bg-gray-200 rounded w-32 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="h-4 bg-gray-100 rounded w-16"></div>
                <div className="h-6 w-6 bg-gray-100 rounded-full"></div>
                <div className="h-4 bg-gray-100 rounded w-24"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Air Quality/Map Skeleton */}
        <div className="w-full bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="h-6 bg-gray-200 rounded w-40 mb-6"></div>
          <div className="h-48 bg-gray-100 rounded-lg w-full mb-4"></div>
          <div className="flex space-x-4 justify-center">
            <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
            <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
            <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default DashboardSkeleton;