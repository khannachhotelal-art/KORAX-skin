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
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-indigo-500/30">
      <header className="bg-neutral-900/80 backdrop-blur-md border-b border-neutral-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
                K
              </div>
              <span className="font-bold text-xl tracking-tight hidden sm:block bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">Korax Skin</span>
            </Link>

            <nav className="flex items-center gap-2 sm:gap-6">
              <Link to="/" className="text-neutral-400 hover:text-white font-medium flex items-center gap-2 transition-colors">
                <Compass className="w-4 h-4 hidden sm:block" />
                Gallery
              </Link>
              {isAdmin && (
                <Link to="/admin" className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-2 transition-colors bg-indigo-500/10 px-3 py-1.5 rounded-lg">
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:block">Admin Panel</span>
                </Link>
              )}
              
              {user ? (
                <div className="flex items-center gap-4 ml-2 sm:ml-6 pl-2 sm:pl-6 border-l border-neutral-800">
                  <div className="flex items-center gap-2 bg-neutral-800/50 px-3 py-1.5 rounded-full border border-neutral-700/50 cursor-default">
                    <UserIcon className="w-4 h-4 text-neutral-400" />
                    <span className="text-sm font-medium text-neutral-300 hidden md:block max-w-[150px] truncate">{user.user_metadata?.username || user.email}</span>
                  </div>
                  <button onClick={handleLogout} className="text-neutral-400 hover:text-red-400 transition-colors p-2 hover:bg-red-500/10 rounded-full" title="Log out">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3 ml-2 sm:ml-6 pl-2 sm:pl-6 border-l border-neutral-800">
                  <Link to="/login" className="text-neutral-400 font-medium hover:text-white transition-colors text-sm sm:text-base">Log In</Link>
                  <Link to="/signup" className="bg-white text-black px-4 py-2 text-sm sm:text-base rounded-full font-bold hover:bg-neutral-200 transition-colors shadow-lg active:scale-95">Sign Up</Link>
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
