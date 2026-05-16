import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Sparkles, Download, ShoppingCart, ArrowLeft } from 'lucide-react';
import Skin3DViewer from '../components/Skin3DViewer';

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

export default function ItemDetail() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<SkinItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = () => {
      try {
        const skinsStr = localStorage.getItem('korax_skins') || '[]';
        const data = JSON.parse(skinsStr) as SkinItem[];
        const found = data.find(i => i.id === id);
        if (found) {
          setItem(found);
        }
      } catch (err) {
        console.error('Error fetching item:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="text-center py-32">
        <h3 className="text-2xl font-bold text-neutral-300">Item not found</h3>
        <Link to="/" className="text-indigo-400 hover:underline mt-4 inline-block">Return to Vault</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Link to="/" className="inline-flex items-center text-neutral-400 hover:text-white mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Vault
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Render 3D viewer in a nice white card */}
        <div className="relative w-full aspect-[3/4] bg-white rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center">
           <Skin3DViewer 
              skinUrl={item.type === 'skin' ? item.image_url : undefined} 
              capeUrl={item.type === 'cape' ? item.image_url : undefined} 
              className="w-full h-full bg-transparent pointer-events-auto cursor-move"
           />
           <div className="absolute top-4 left-4 z-10 pointer-events-none">
             <div className={`px-3 py-1.5 text-xs font-black rounded-lg uppercase tracking-wider backdrop-blur-md shadow-sm ${
               item.type === 'skin' ? 'bg-orange-500/10 text-orange-600 border border-orange-500/20' : 'bg-purple-500/10 text-purple-600 border border-purple-500/20'
             }`}>
               {item.type}
             </div>
           </div>
        </div>

        <div className="flex flex-col">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">{item.title}</h1>
          <p className="text-lg text-neutral-400 leading-relaxed mb-8">{item.description}</p>
          
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 mb-8">
            <div className="text-sm text-neutral-500 uppercase tracking-widest font-semibold mb-2">Access</div>
            <div className="text-3xl font-bold text-white mb-6">
               {item.is_free ? <span className="text-green-400 flex items-center gap-2">Free</span> : `$${item.price?.toFixed(2)}`}
            </div>
            
            <a 
              href={item.image_url} 
              download={`${item.title}.png`}
              className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-lg transition-all active:scale-95 ${
                item.is_free 
                  ? 'bg-white text-black hover:bg-neutral-200 shadow-md' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-indigo-500/20 shadow-lg'
              }`}
            >
              {item.is_free ? <><Download className="w-5 h-5" /> Download Item</> : <><ShoppingCart className="w-5 h-5" /> Purchase & Download</>}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
