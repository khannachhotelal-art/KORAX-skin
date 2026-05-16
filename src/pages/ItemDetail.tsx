import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Sparkles, Download, ShoppingCart, ArrowLeft, Play, Pause, Share2, RotateCw, User as UserIcon } from 'lucide-react';
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
  
  const [animation, setAnimation] = useState<'walk' | 'run' | 'fly' | 'idle' | 'none'>('walk');
  const [playing, setPlaying] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const [copied, setCopied] = useState(false);

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

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
      <div className="flex flex-col gap-6">
        
        {/* Breadcrumb & Title */}
        <div>
          <div className="flex items-center gap-2 text-sm text-neutral-400 font-semibold mb-4">
            <Link to="/" className="hover:text-white transition-colors">Minecraft Skins</Link>
            <span>›</span>
            <span className="text-neutral-300">{item.title} Minecraft {item.type === 'cape' ? 'Cape' : 'Skin'}</span>
          </div>
          <div className="flex items-center gap-3">
             <Link to="/" className="p-2 bg-[#1c1c1c] border border-[#2a2a2a] rounded-lg hover:bg-[#222] transition-colors text-neutral-300 pointer-events-auto">
               <ArrowLeft className="w-5 h-5" />
             </Link>
             <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{item.title} Minecraft {item.type === 'cape' ? 'Cape' : 'Skin'}</h1>
          </div>
        </div>

        {/* Fake Banner */}
        <div className="w-full h-20 bg-white rounded-lg flex flex-col md:flex-row items-center justify-between px-6 py-2 border border-neutral-200">
           <div className="flex items-center gap-4">
             <img src="https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=100&h=70" className="h-14 w-20 object-cover rounded hidden sm:block" alt="Ad" />
             <div className="flex flex-col text-black">
               <h4 className="font-bold text-sm tracking-tight leading-tight">It's 'Business in the Front, Party in the Back' for This<br/>Remodeled Cottage in Santa Cruz. See the Before and...</h4>
               <span className="text-xs text-neutral-600 italic">Sponsored by: Mansion Global</span>
             </div>
           </div>
           <button className="text-xs font-bold text-indigo-600 border border-indigo-200 rounded px-8 py-2 mt-2 md:mt-0 whitespace-nowrap">
             LEARN MORE
           </button>
        </div>

        <div className="relative w-full aspect-[4/3] sm:aspect-video bg-[#1c1c1c] border border-[#2a2a2a] rounded-3xl overflow-hidden shadow-2xl flex flex-col items-center justify-between group">
             
             {/* Main Viewer Area */}
             <div className="absolute inset-0 pt-8 px-4 pb-20">
               <Skin3DViewer 
                  skinUrl={item.type === 'skin' ? item.image_url : undefined} 
                  capeUrl={item.type === 'cape' ? item.image_url : undefined} 
                  animation={animation}
                  playing={playing}
                  autoRotate={autoRotate}
                  className="w-full h-full bg-transparent pointer-events-auto cursor-move"
               />
             </div>
             
             <div className="absolute top-4 left-4 z-10 pointer-events-none">
               <div className={`px-3 py-1.5 text-xs font-black rounded-lg uppercase tracking-wider shadow-sm ${
                 item.type === 'skin' ? 'bg-orange-500 text-black' : 'bg-purple-500 text-white'
               }`}>
                 {item.type}
               </div>
             </div>

             {/* Overlay Controls */}
             <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center bg-[#111] p-1.5 rounded-3xl shadow-lg border border-[#333]">
                <a 
                  href={item.image_url} 
                  download={`${item.title}.png`}
                  className="w-10 h-10 flex text-neutral-400 items-center justify-center rounded-full hover:text-white transition-colors"
                  title="Download texture"
                >
                  <Download className="w-5 h-5" />
                </a>
                
                <button 
                  onClick={() => {
                    const anims: typeof animation[] = ['walk', 'run', 'fly', 'idle'];
                    const next = anims[(anims.indexOf(animation) + 1) % anims.length];
                    setAnimation(next);
                  }}
                  className="w-10 h-10 flex text-neutral-400 items-center justify-center rounded-full bg-[#111] border border-[#333] hover:text-white transition-colors z-20 scale-125 mx-1"
                  title="Change Animation"
                >
                  <UserIcon className="w-5 h-5" />
                </button>

                <button 
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${autoRotate ? 'text-white' : 'text-neutral-400 hover:text-white'}`}
                  title="Toggle Auto Rotation"
                >
                  <RotateCw className={`w-5 h-5 ${autoRotate ? 'animate-spin [animation-duration:3s]' : ''}`} />
                </button>

                <button 
                  onClick={() => setPlaying(!playing)}
                  className="w-10 h-10 flex text-neutral-400 items-center justify-center rounded-full hover:text-white transition-colors"
                  title={playing ? "Pause Animation" : "Play Animation"}
                >
                  {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
             </div>
          </div>
          
          <div className="flex gap-2 w-full">
            <a 
              href={item.image_url} 
              download={`${item.title}.png`}
              className="flex-1 flex items-center justify-center bg-[#1e58ff] hover:bg-[#1c4ee0] text-white py-4 rounded-xl shadow-lg font-bold transition-colors shadow-[#1e58ff]/20"
            >
              <Download className="w-5 h-5 mr-3" />
              Download
            </a>
            <button 
              onClick={handleShare}
              className="w-[60px] h-full flex items-center justify-center bg-[#1c1c1c] border border-[#2a2a2a] text-neutral-400 hover:text-white rounded-xl transition-colors hover:bg-[#222]"
            >
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
            </button>
          </div>
          
          {/* Tags */}
          <div className="mt-8">
            <div className="flex items-center text-xl font-bold text-white mb-6">
               <svg className="w-5 h-5 mr-3 text-indigo-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l8.29-8.29c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></svg>
               Tags
            </div>
            
            <div className="bg-[#111] border border-[#2a2a2a] p-5 rounded-2xl flex flex-wrap gap-2">
              <span className="px-4 py-2 bg-[#1c1c1c] border border-[#2a2a2a] rounded-lg text-neutral-300 text-sm font-semibold flex items-center gap-2">
                 <span>👑</span> {item.type}
              </span>
              <span className="px-4 py-2 bg-[#1c1c1c] border border-[#2a2a2a] rounded-lg text-neutral-300 text-sm font-semibold flex items-center gap-2">
                 <span>👓</span> Glasses
              </span>
              <span className="px-4 py-2 bg-[#1c1c1c] border border-[#2a2a2a] rounded-lg text-neutral-300 text-sm font-semibold flex items-center gap-2">
                 <span>👔</span> Suit
              </span>
            </div>
          </div>

          <div className="mt-8 mb-16">
            <div className="flex items-center text-xl font-bold text-white mb-6">
               <UserIcon className="w-5 h-5 mr-3 text-indigo-500" />
               4506 Users
            </div>
            
            <div className="bg-[#111] border border-[#2a2a2a] p-5 pb-8 rounded-2xl flex flex-wrap gap-2 justify-center">
              {['Swight', 'zStylersLX', 'MrDipsyPe', 'DAlKlxex', 'SkillsFindDark', 'itz_stiks', 'ZRzeans', 'Tyhpa', 'Alcamen', 'iwantabaddie', 'Ringowillycat', 'yReal1827', 'x4dan', 'Gayla1_', '1Emiry', 'hmey3110', 'Plinkos', 'Carrot8860', 'Realified', 'Wrappingsz', 'shinjitgamer', 'GenexXD', 'tangjalearn', 'Ghosteds', '___yuki_______', 'ConstxII', 'RcmEnjoyer', 'nexovi', 'D4faultkid', 'JustWanteddd', 'Kxnwnn', 'Cryptic', 'MariaJoseLozano', 'Draculablade', 'MakaveIITheDon'].map(u => (
                 <span key={u} className="px-3 py-1.5 bg-[#1c1c1c] border border-[#2a2a2a] rounded-lg text-neutral-300 text-xs font-semibold hover:bg-[#222] cursor-pointer">
                    {u}
                 </span>
              ))}
              
              <div className="w-full flex justify-center mt-6">
                 <button className="px-5 py-2 rounded-full border border-[#2a2a2a] bg-[#1c1c1c] text-neutral-400 text-xs font-bold hover:text-white transition-colors flex items-center gap-2">
                   Show more
                   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                 </button>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
