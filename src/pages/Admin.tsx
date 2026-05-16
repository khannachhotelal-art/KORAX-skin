import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Upload, ShieldPlus, FolderDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [type, setType] = useState<'skin'|'cape'>('skin');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [isFree, setIsFree] = useState(true);
  
  const [imageBase64, setImageBase64] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [adminEmail, setAdminEmail] = useState('');
  const [adminMsg, setAdminMsg] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && user && !isAdmin) {
      navigate('/');
    }
  }, [user, isAdmin, navigate, loading]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check if png
    if (file.type !== 'image/png') {
       alert('Only PNG files are allowed for skins and capes.');
       return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageBase64(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageBase64) {
      alert("Please select a PNG file.");
      return;
    }
    setLoading(true);
    setMessage('');
    
    setTimeout(() => {
      try {
        const skinsStr = localStorage.getItem('korax_skins') || '[]';
        const skins = JSON.parse(skinsStr);
        
        const newItem = {
          id: Math.random().toString(36).substr(2, 9),
          type,
          title,
          description,
          image_url: imageBase64,
          price: isFree ? 0 : price,
          is_free: isFree,
          uploader_id: user!.id,
          created_at: new Date().toISOString()
        };
        
        skins.push(newItem);
        localStorage.setItem('korax_skins', JSON.stringify(skins));

        setMessage('Item uploaded successfully!');
        setTitle('');
        setDescription('');
        setPrice(0);
        setImageBase64('');
        setIsFree(true);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } catch (err: any) {
        console.error(err);
        setMessage(err.message || 'Failed to upload.');
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  const handleGrantAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAdminMsg('');
    
    setTimeout(() => {
      try {
        const usersStr = localStorage.getItem('korax_users') || '[]';
        const users = JSON.parse(usersStr);

        const targetUser = users.find((u: any) => u.email === adminEmail);

        if (!targetUser && adminEmail !== 'khannachhotelal@gmail.com') {
           // We can still grant if not found in mock, just store in admins list
        }
        
        const adminsStr = localStorage.getItem('korax_admins') || '[]';
        let admins: string[] = [];
        try {
          admins = JSON.parse(adminsStr);
        } catch(e) {}
        
        if (!admins.includes(adminEmail)) {
          admins.push(adminEmail);
          localStorage.setItem('korax_admins', JSON.stringify(admins));
        }

        setAdminMsg('Admin rights granted successfully!');
        setAdminEmail('');
      } catch (err: any) {
        console.error(err);
        setAdminMsg(err.message || 'Error granting admin rights.');
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  if (!isAdmin) return <div className="text-center py-32 text-neutral-500">Access Denied: Missing clearance.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div>
         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold mb-4 uppercase tracking-widest">
          <ShieldPlus className="w-4 h-4" /> Restricted Area
        </div>
        <h1 className="text-4xl font-black text-white">System Override</h1>
        <p className="text-neutral-400 mt-2">Manage vault contents and personnel clearance levels.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Form */}
        <div className="bg-neutral-900/80 backdrop-blur-sm p-8 rounded-2xl border border-neutral-800 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500"></div>
          <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-3">
            <Upload className="w-5 h-5 text-emerald-400" /> Vault Intake
          </h2>
          {message && <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 font-medium text-sm">{message}</div>}
          
          <form onSubmit={handleUploadItem} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-neutral-400 uppercase tracking-widest mb-2">Category</label>
              <select value={type} onChange={e => setType(e.target.value as any)} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all">
                <option value="skin">Skin</option>
                <option value="cape">Cape</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-neutral-400 uppercase tracking-widest mb-2">Identifier</label>
              <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder-neutral-600" placeholder="e.g. Diamond Knight" />
            </div>

             <div>
              <label className="block text-sm font-bold text-neutral-400 uppercase tracking-widest mb-2">Lore / Details</label>
              <textarea required value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none h-28 placeholder-neutral-600" placeholder="Describe the item origin..." />
            </div>

            <div className="flex items-center gap-6 bg-neutral-950 p-4 rounded-xl border border-neutral-800">
              <label className="flex items-center gap-3 text-white font-medium cursor-pointer">
                <input type="checkbox" checked={isFree} onChange={e => setIsFree(e.target.checked)} className="w-5 h-5 text-emerald-500 rounded border-neutral-700 bg-neutral-900 focus:ring-emerald-500 focus:ring-offset-neutral-950" />
                Public access (Free)
              </label>
              {!isFree && (
                 <div className="flex-1">
                  <input type="number" min="0.01" step="0.01" required value={price} onChange={e => setPrice(Number(e.target.value))} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Price ($)" />
                </div>
              )}
            </div>

            <div className="pt-2">
              <label className="block text-sm font-bold text-neutral-400 uppercase tracking-widest mb-2">Asset File (PNG)</label>
              <div className="relative border-2 border-dashed border-neutral-700 hover:border-emerald-500/50 rounded-xl p-6 transition-colors bg-neutral-950 text-center">
                <input type="file" required accept="image/png" onChange={handleImageChange} ref={fileInputRef} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <FolderDown className="w-8 h-8 text-neutral-500 mx-auto mb-2" />
                <span className="text-sm text-neutral-400 font-medium">{imageBase64 ? "File mapped" : "Drop PNG or click to browse"}</span>
              </div>
            </div>

            <button disabled={loading} type="submit" className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-500 transition-colors disabled:opacity-50 mt-4 active:scale-95 shadow-lg shadow-emerald-500/20">
              {loading ? 'Transmitting...' : 'Upload Asset'}
            </button>
          </form>
        </div>

        {/* Grant Admin Form */}
        <div className="bg-neutral-900/80 backdrop-blur-sm p-8 rounded-2xl border border-neutral-800 shadow-xl relative h-fit overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>
          <h2 className="text-xl font-bold mb-2 text-white flex items-center gap-3">
            <ShieldPlus className="w-5 h-5 text-red-400" /> Clearance Authorization
          </h2>
          <p className="text-sm text-neutral-500 mb-6 font-medium">Target operator must be active in system.</p>
          
          {adminMsg && <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-medium text-sm">{adminMsg}</div>}
          
          <form onSubmit={handleGrantAdmin} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-neutral-400 uppercase tracking-widest mb-2">Operator Email</label>
              <input type="email" required value={adminEmail} onChange={e => setAdminEmail(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all placeholder-neutral-600" placeholder="admin@example.com" />
            </div>
             <button disabled={loading} type="submit" className="w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-500 transition-colors disabled:opacity-50 mt-2 active:scale-95 shadow-lg shadow-red-500/20">
              {loading ? 'Processing...' : 'Authorize Operator'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
