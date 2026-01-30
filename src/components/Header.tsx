
import { Menu, Zap } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-blue-600 rounded-lg group-hover:bg-blue-500 transition-colors">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">Manhole Alert PK</span>
        </Link>
        
        <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors md:hidden">
          <Menu className="w-6 h-6" />
        </button>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <Link href="/map" className="hover:text-white transition-colors">Live Map</Link>
          <Link href="/report" className="hover:text-white transition-colors">Report Issue</Link>
          <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md transition-colors font-semibold">
            Login
          </button>
        </nav>
      </div>
    </header>
  );
}
