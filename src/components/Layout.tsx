import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { LogOut, User as UserIcon, LayoutDashboard, Compass } from 'lucide-react';

export default function Layout() {
  const { user, isAdmin, logoutState } = useAuth();

  const handleLogout = () => {
    logoutState();
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-neutral-100 flex flex-col font-sans selection:bg-indigo-500/30">
      <header className="bg-[#0f0f0f] border-b border-[#1c1c1c] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded flex items-center justify-center text-black font-black text-xl shadow-lg shadow-white/10 group-hover:shadow-white/20 transition-shadow">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/></svg>
              </div>
              <span className="font-extrabold text-xl tracking-wide hidden sm:block text-white uppercase">KORAX</span>
            </Link>

            <nav className="flex items-center gap-2 sm:gap-6">
              <div className="hidden lg:flex items-center gap-6 mr-4 text-sm font-semibold">
                 <Link to="/" className="text-neutral-400 hover:text-white transition-colors">Client</Link>
                 <Link to="/" className="text-white hover:text-white transition-colors">Skins</Link>
                 <Link to="/" className="text-neutral-400 hover:text-white transition-colors">Capes</Link>
                 <Link to="/" className="text-neutral-400 hover:text-white transition-colors">Shop</Link>
                 <Link to="/" className="text-neutral-400 hover:text-white transition-colors flex items-center gap-1">Community <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg></Link>
              </div>

              <button className="text-neutral-400 hover:text-white p-2 shrink-0">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </button>

              {isAdmin && (
                <Link to="/admin" className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-2 transition-colors bg-indigo-500/10 px-3 py-1.5 rounded-lg text-sm">
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:block">Admin</span>
                </Link>
              )}
              
              {user ? (
                <div className="flex items-center gap-4 ml-2 pl-2 sm:pl-4 border-l border-[#2a2a2a]">
                  <div className="flex items-center gap-2 bg-[#1c1c1c] hover:bg-[#222] transition-colors px-3 py-1.5 rounded-lg border border-[#2a2a2a] cursor-pointer">
                    <UserIcon className="w-4 h-4 text-neutral-400" />
                    <span className="text-sm font-bold text-neutral-300 hidden md:block max-w-[150px] truncate">{user.user_metadata?.username || user.email}</span>
                  </div>
                  <button onClick={handleLogout} className="text-neutral-400 hover:text-red-400 transition-colors p-2 hover:bg-neutral-900 rounded-lg" title="Log out">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3 ml-2 pl-2">
                  <Link to="/login" className="bg-white text-black px-4 py-2 text-sm rounded-lg font-extrabold hover:bg-neutral-200 transition-colors flex items-center gap-2">
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>
                     Login
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Outlet />
      </main>

      <footer className="bg-neutral-950 border-t border-neutral-900 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-neutral-800 rounded-lg flex items-center justify-center text-white font-bold opacity-50">K</div>
             <span className="text-neutral-500 font-medium">Korax Skin &copy; {new Date().getFullYear()}</span>
          </div>
          <p className="text-neutral-600 text-sm">Building the best community gallery for Minecraft.</p>
        </div>
      </footer>
    </div>
  );
}
