import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Store, Lock, Mail, AlertCircle } from 'lucide-react';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithEmailAndPassword, signInWithPopup, createUserWithEmailAndPassword } from 'firebase/auth';

export function LoginView() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setLoading(true);
    setError(null);
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Invalid credentials.');
      } else if (err.code === 'auth/email-already-in-use') {
         setError('Email already in use.');
      } else {
        setError(err.message || 'An error occurred during authentication.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      setError(err.message || 'Error signing in with Google.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex flex-col justify-center items-center p-4 relative overflow-hidden"
      style={{
        backgroundImage: 'linear-gradient(to bottom, rgba(2, 6, 23, 0.7), rgba(2, 6, 23, 0.9)), url("https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=2000")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-emerald-500 opacity-20 blur-3xl mix-blend-screen"></div>
      <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 rounded-full bg-emerald-700 opacity-20 blur-3xl mix-blend-screen"></div>

      <div className="mb-8 text-center flex flex-col items-center relative z-10">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 p-4 rounded-2xl mb-4 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
          <Store className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-black tracking-tight text-white">Smart<span className="text-emerald-500">Shelf</span></h1>
        <p className="text-slate-400 mt-2 font-medium tracking-wide">Premium Grocery Supply Chain</p>
      </div>

      <Card className="w-full max-w-md border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-2xl relative z-10">
        <CardHeader className="space-y-1 pb-6 border-b border-slate-800/50">
          <CardTitle className="text-2xl font-bold text-center text-white">Owner Login</CardTitle>
          <p className="text-center text-sm text-slate-400">Enter your credentials to access the dashboard</p>
        </CardHeader>
        <CardContent className="pt-6">
          {error && (
            <div className="mb-4 bg-red-900/30 border border-red-500/50 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleEmailAuth} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                <input
                  type="email"
                  className="flex h-11 w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 pl-10 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="owner@supermarket.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-500" />
                <input
                  type="password"
                  className="flex h-11 w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 pl-10 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-12 rounded-lg mt-8 transition-colors text-md shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Authenticating...' : (isRegistering ? 'Create Account' : 'Sign In')}
            </Button>
          </form>

          <div className="mt-4 flex items-center justify-between">
            <hr className="w-full border-slate-800" />
            <span className="p-2 text-xs text-slate-500 font-medium uppercase min-w-max">Or</span>
            <hr className="w-full border-slate-800" />
          </div>

          <Button 
            type="button" 
            variant="outline" 
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full mt-4 h-12 border-slate-700 bg-slate-800/30 text-white hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
           <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              <path d="M1 1h22v22H1z" fill="none"/>
            </svg>
            Continue with Google
          </Button>

          <div className="mt-6 text-center text-sm text-slate-400">
            {isRegistering ? "Already have an account?" : "Don't have an account?"}
            <button 
              type="button" 
              onClick={() => { setIsRegistering(!isRegistering); setError(null); }} 
              className="ml-2 text-emerald-500 hover:text-emerald-400 font-medium"
            >
              {isRegistering ? 'Sign In' : 'Create one'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
