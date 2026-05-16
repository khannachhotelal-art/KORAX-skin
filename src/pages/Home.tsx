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
    <div className="space-y-8">
      <div className="flex justify-center gap-3">
        {(['all', 'skin', 'cape'] as const).map(f => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              filter === f 
                ? 'bg-neutral-800 text-white' 
                : 'bg-transparent text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            {f === 'all' ? 'All' : f === 'skin' ? 'Skins' : 'Capes'}
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10 mt-8">
          {filteredItems.map(item => (
            <Link to={`/item/${item.id}`} key={item.id} className="flex flex-col group items-center">
              <div className="relative w-full aspect-[2/3] bg-white rounded-2xl flex items-center justify-center overflow-hidden shadow-lg group-hover:scale-[1.02] transition-transform duration-300">
                <div className="absolute inset-0">
                  <Skin3DViewer 
                    skinUrl={item.type === 'skin' ? item.image_url : undefined} 
                    capeUrl={item.type === 'cape' ? item.image_url : undefined} 
                    className="w-full h-full bg-transparent pointer-events-none"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-between items-end z-10">
                  <span className={`text-[10px] font-black shadow-black drop-shadow-md uppercase tracking-widest ${item.type === 'skin' ? 'text-orange-400' : 'text-purple-400'}`}>
                    {item.type}
                  </span>
                  <div 
                    title={item.is_free ? "Download for free" : `Buy for $${item.price?.toFixed(2)}`}
                    className="text-white drop-shadow-md"
                  >
                    {item.is_free ? <Download className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                  </div>
                </div>
              </div>
              <div className="mt-4 text-center px-2 w-full">
                <h3 className="font-bold text-sm text-neutral-200 truncate">{item.title}</h3>
                <span className="text-xs text-indigo-400 font-bold block mt-1">
                  {item.is_free ? <span className="text-green-400">Free</span> : `$${item.price?.toFixed(2)}`}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
