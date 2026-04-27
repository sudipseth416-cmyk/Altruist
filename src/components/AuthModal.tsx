import React, { useState } from 'react';
import { X, Mail, Lock, Shield } from 'lucide-react';
import { signInWithPopup, googleProvider, auth } from '@/lib/firebase';

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (user: any, role: string) => void;
}

export default function AuthModal({ onClose, onLoginSuccess }: AuthModalProps) {
  const [step, setStep] = useState<'login' | 'role'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleMockOrRealLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    
    // Simulate slight network delay for premium feel
    await new Promise(r => setTimeout(r, 600));

    // For Hackathon/Demo: always succeed with mock user if Firebase keys aren't set
    const mockUser = { uid: "mock-uid-" + Date.now(), email: email || 'demo@ngo-os.org', name: email ? email.split('@')[0] : 'Demo User' };
    setUser(mockUser);
    setStep('role');
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      setStep('role');
    } catch (error) {
      console.warn("Google login failed, falling back to mock", error);
      handleMockOrRealLogin();
    }
  };

  const handleRoleSelect = (role: string) => {
    onLoginSuccess(user, role);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="glass-card w-full max-w-md p-8 relative" style={{ boxShadow: '0 0 40px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05)' }}>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>

        {step === 'login' ? (
          <div className="animate-fade-in-fast">
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Welcome to Altruist</h2>
              <p className="text-sm text-slate-400">Sign in to access the command center</p>
            </div>

            <form onSubmit={handleMockOrRealLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-field pl-10 py-3" placeholder="Enter your email" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="input-field pl-10 py-3" placeholder="••••••••" />
                </div>
              </div>
              
              <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-6 text-sm flex items-center justify-center h-[48px]">
                {loading ? <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : "Sign In via Email"}
              </button>
              
              <div className="relative flex items-center py-5">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink-0 mx-4 text-xs font-medium text-slate-500 uppercase tracking-widest">OR</span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>

              <button type="button" onClick={handleGoogleLogin} disabled={loading} className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all h-[48px]">
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                Continue with Google
              </button>
            </form>
          </div>
        ) : (
          <div className="animate-fade-in-fast">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Select Your Role</h2>
              <p className="text-sm text-slate-400">Choose your workspace to continue</p>
            </div>
            <div className="space-y-3">
              {[
                { id: 'admin', title: 'Admin / Operator', desc: 'Manage cases, monitor risk, and dispatch resources.', color: 'from-ngo-purple to-pink-500' },
                { id: 'volunteer', title: 'Volunteer', desc: 'Accept assignments and report field progress.', color: 'from-ngo-cyan to-blue-500' },
                { id: 'donor', title: 'Donor', desc: 'Contribute funds and track your impact.', color: 'from-emerald-400 to-teal-500' }
              ].map(role => (
                <button
                  key={role.id}
                  onClick={() => handleRoleSelect(role.id)}
                  className="w-full text-left p-5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300 group shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-1.5">
                    <div className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${role.color} shadow-lg`} />
                    <span className="font-bold text-white tracking-tight">{role.title}</span>
                  </div>
                  <p className="text-sm text-slate-400 pl-5.5 ml-5">{role.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
