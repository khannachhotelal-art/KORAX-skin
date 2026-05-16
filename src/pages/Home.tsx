import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Skin3DViewer from '../components/Skin3DViewer';
import { Download, ShoppingCart, Sparkles, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SkinItem {
  id: string;
  type: 'skin' | 'cape';
  title: string;
  description: string;
  image_url: string;
  price: number;
  is_free: boolean;
  uploader_id: string;
  created_at: string;
}

export default function Home() {
  const [items, setItems] = useState<SkinItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'skin' | 'cape'>('all');

  useEffect(() => {
    const fetchSkins = () => {
      try {
        const skinsStr = localStorage.getItem('korax_skins') || '[]';
        const data = JSON.parse(skinsStr);
        // sort by newest
        data.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setItems(data as SkinItem[]);
      } catch (err) {
        console.error('Error fetching skins:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSkins();
  }, []);

  const filteredItems = items.filter(item => filter === 'all' || item.type === filter);

  return (
    <div className="space-y-6">
      
      {/* Header section */}
      <div>
        <h1 className="text-3xl font-extrabold text-white mb-1 tracking-tight">Minecraft Skins</h1>
        <p className="text-[#a0a0a0] text-sm font-medium">Discover thousands of Minecraft skins</p>
      </div>
      
      {/* Fake Banner */}
      <div className="w-full h-24 bg-indigo-600 rounded-lg flex items-center justify-center font-black text-white text-3xl tracking-widest uppercase shadow-md my-6 overflow-hidden relative">
         <div className="absolute inset-0 bg-[url('https://textures.minecraft.net/texture/4abeee6d1f1489e240212f71f6bedeaa4ae2baeb3e31c81cc6574f260be7fa01')] bg-cover bg-center opacity-10 filter blur-sm"></div>
         VOICE CHAT <span className="text-yellow-400 ml-2">FOR MINECRAFT</span>
      </div>

      {/* Search Bar */}
      <div className="relative flex items-center bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl px-4 py-3">
         <Sparkles className="w-5 h-5 text-neutral-500 mr-3" />
         <input 
           type="text" 
           placeholder="Hot" 
           className="bg-transparent border-none outline-none text-neutral-300 w-full placeholder:text-neutral-600 font-medium"
         />
         <button className="flex items-center gap-2 bg-[#2a2a2a] hover:bg-[#333] px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-400 transition-colors ml-2">
           <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l8.29-8.29c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></svg>
           Tags
         </button>
      </div>

      <div className="flex gap-2 p-1 bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl w-full">
        {(['all', 'skin', 'cape'] as const).map(f => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 py-3 items-center justify-center flex rounded-lg text-sm font-semibold transition-colors ${
              filter === f 
                ? 'bg-[#2a2a2a] text-white' 
                : 'bg-transparent text-neutral-500 hover:text-white hover:bg-[#222]'
            }`}
          >
            {f === 'all' ? '🔥 Trending Today' : f === 'skin' ? '👑 Most used' : '🕒 Latest'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-32">
           <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-32 bg-neutral-900/50 rounded-3xl border border-neutral-800/50 backdrop-blur-sm">
          <Sparkles className="w-12 h-12 text-neutral-600 mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-bold text-neutral-300">The Vault is empty</h3>
          <p className="text-neutral-500 mt-2">New arrivals are currently being crafted. Check back soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 mt-6">
          {filteredItems.map(item => (
            <Link to={`/item/${item.id}`} key={item.id} className="group">
              <div className="relative w-full aspect-[4/5] bg-[#1c1c1c] border border-[#2a2a2a] rounded-xl flex flex-col items-center justify-between overflow-hidden hover:bg-[#242424] transition-colors">
                <div className="absolute inset-0 pt-6 px-4 pb-12">
                  <Skin3DViewer 
                    skinUrl={item.type === 'skin' ? item.image_url : undefined} 
                    capeUrl={item.type === 'cape' ? item.image_url : undefined} 
                    autoRotate={true}
                    className="w-full h-full bg-transparent pointer-events-none"
                  />
                </div>
                
                {/* Information area at bottom */}
                <div className="absolute inset-x-0 bottom-0 p-3 flex justify-center items-center z-10 text-xs font-semibold text-neutral-400">
                  <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                    <UserIcon className="w-3.5 h-3.5" />
                    <span>{Math.floor(Math.random() * 20000)}</span> {/* mock user count */}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
