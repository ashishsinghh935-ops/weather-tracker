import Sidebar from './components/Sidebar';
import HeroCard from './components/HeroCard';
import WeatherChart from './components/WeatherChart';
import WeatherMap from './components/WeatherMap';

function App() {
  return (
    <div className="flex w-screen h-screen bg-slate-50 overflow-hidden text-slate-800">
      
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Delhi, India</h1>
            <p className="text-sm text-slate-500 mt-1">Live Weather & Analytics</p>
          </div>
        </header>
        
        <HeroCard />
        
        {/* Responsive Grid: Stacks on small screens, side-by-side on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
          <WeatherChart />
          <WeatherMap />
        </div>
        
      </main>

    </div>
  );
}

export default App;