
import { AlertTriangle, MapPin, Shield } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-950 text-white min-h-[calc(100vh-4rem)]">
      <div className="max-w-4xl w-full space-y-12 text-center">
        <div className="space-y-6">
          <div className="inline-flex items-center justify-center p-3 bg-blue-600/10 rounded-full mb-4">
            <Shield className="w-12 h-12 text-blue-500" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent pb-2">
            Manhole Alert PK
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            A community-driven public safety initiative to map, report, and alert citizens about uncovered manholes and street hazards.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold text-lg transition-all shadow-lg shadow-blue-900/20">
              Report Hazard
            </button>
            <button className="px-8 py-4 bg-slate-800 hover:bg-slate-700 rounded-lg font-bold text-lg transition-all border border-slate-700">
              View Live Map
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 text-left">
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors">
            <AlertTriangle className="w-10 h-10 text-amber-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Real-time Alerts</h3>
            <p className="text-slate-400">Get instant notifications about dangers in your daily commute.</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors">
            <MapPin className="w-10 h-10 text-emerald-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Interactive Map</h3>
            <p className="text-slate-400">Visualizing hazardous zones with precise geolocation data.</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors">
            <Shield className="w-10 h-10 text-purple-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Community Verified</h3>
            <p className="text-slate-400">Reports are verified by trusted community members and authorities.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
