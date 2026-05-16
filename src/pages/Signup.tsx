import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useAuth, User } from '../contexts/AuthContext';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loginState } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setError('');
    setLoading(true);
    
    setTimeout(() => {
      // Mock Users DB in localStorage
      const usersStr = localStorage.getItem('korax_users') || '[]';
      let users = [];
      try {
        users = JSON.parse(usersStr);
      } catch(e) {}
      
      const existingUser = users.find((u: any) => u.email === email);
      if (existingUser) {
        setError('Email pahle se registered hai. Kripya login karein.');
        setLoading(false);
        return;
      }
      
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        password, // Usually hashed, but stored plain for local dev mock
        user_metadata: {
          username
        }
      };
      
      users.push(newUser);
      localStorage.setItem('korax_users', JSON.stringify(users));
      
      const sessionUser: User = {
        id: newUser.id,
        email: newUser.email,
        user_metadata: { username: newUser.user_metadata.username }
      };
      
      loginState(sessionUser);
      setLoading(false);
      navigate('/');
    }, 500);
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-neutral-900 p-8 rounded-2xl border border-neutral-800 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
      
      <div className="flex justify-center mb-6">
        <div className="w-12 h-12 bg-neutral-800 rounded-xl flex items-center justify-center">
          <UserPlus className="w-6 h-6 text-indigo-400" />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-center mb-2 text-white">Create an Account</h2>
      <p className="text-center text-neutral-400 mb-8 text-sm">Join to explore and share skins.</p>
      
      {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl mb-6 text-sm">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-white placeholder-neutral-600"
            placeholder="Steve123"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-white placeholder-neutral-600"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-white placeholder-neutral-600"
            placeholder="••••••••"
            minLength={6}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-1">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-white placeholder-neutral-600"
            placeholder="••••••••"
            minLength={6}
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white font-medium py-3 rounded-xl hover:bg-indigo-500 transition-colors disabled:opacity-50 mt-4"
        >
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
      
      <div className="mt-8 text-center text-sm text-neutral-500">
        Already have an account? <Link to="/login" className="text-indigo-400 hover:text-indigo-300 hover:underline font-medium">Log in here</Link>
      </div>
    </div>
  );
}
