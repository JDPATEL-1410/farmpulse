
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

type AuthView = 'LOGIN' | 'SIGNUP' | 'FORGOT_PASSWORD';

export const Login: React.FC = () => {
  const { login, register, resetPassword } = useAuth();
  const [view, setView] = useState<AuthView>('LOGIN');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    if (!username || !password) return;

    setLoading(true);
    try {
      if (view === 'LOGIN') {
        await login(username, password);
      } else if (view === 'SIGNUP') {
        await register(username, password, email, fullName);
      } else if (view === 'FORGOT_PASSWORD') {
        await resetPassword(username, password);
        setSuccess('Password updated successfully! You can now log in.');
        setView('LOGIN');
      }
    } catch (err: any) {
      setError(err.message || 'Operation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleView = (newView: AuthView) => {
    clearMessages();
    setView(newView);
    setPassword('');
    setEmail('');
    setFullName('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(203 213 225 / 0.3) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-8 py-8 text-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold">FarmPulse</h1>
                <p className="text-emerald-100 text-sm font-medium">Farm Management System</p>
              </div>
            </div>
            <p className="text-emerald-50 text-sm">
              {view === 'LOGIN' ? 'Sign in to your account' : view === 'SIGNUP' ? 'Create your account' : 'Reset your password'}
            </p>
          </div>

          {/* Form Content */}
          <div className="p-8">
            {/* Alert Messages */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-red-800">Error</p>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
                <svg className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-emerald-800">Success</p>
                  <p className="text-sm text-emerald-700">{success}</p>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name (Signup only) */}
              {view === 'SIGNUP' && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-slate-900 placeholder:text-slate-400"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              )}

              {/* Email (Signup only) */}
              {view === 'SIGNUP' && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-slate-900 placeholder:text-slate-400"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              )}

              {/* Username */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Username
                </label>
                <input
                  required
                  type="text"
                  placeholder="Enter your username"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-slate-900 placeholder:text-slate-400"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  {view === 'FORGOT_PASSWORD' ? 'New Password' : 'Password'}
                </label>
                <input
                  required
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all text-slate-900 placeholder:text-slate-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Submit Button */}
              <button
                disabled={loading}
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-6 py-3.5 rounded-xl font-semibold shadow-lg shadow-emerald-200 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>
                    {view === 'LOGIN' ? 'Sign In' : view === 'SIGNUP' ? 'Create Account' : 'Reset Password'}
                  </span>
                )}
              </button>
            </form>

            {/* Navigation Links */}
            <div className="mt-6 text-center space-y-3">
              {view === 'LOGIN' ? (
                <>
                  <button
                    onClick={() => toggleView('FORGOT_PASSWORD')}
                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                  >
                    Forgot your password?
                  </button>
                  <p className="text-sm text-slate-600">
                    Don't have an account?{' '}
                    <button
                      onClick={() => toggleView('SIGNUP')}
                      className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
                    >
                      Sign up
                    </button>
                  </p>
                </>
              ) : (
                <button
                  onClick={() => toggleView('LOGIN')}
                  className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Already have an account?{' '}
                  <span className="text-emerald-600 hover:text-emerald-700 font-semibold">Sign in</span>
                </button>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-4 bg-slate-50 border-t border-slate-200">
            <p className="text-xs text-center text-slate-500">
              © 2026 FarmPulse. Secure farm management platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
