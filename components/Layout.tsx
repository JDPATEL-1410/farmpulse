
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const BottomNav: React.FC = () => {
  const navItems = [
    { to: '/', icon: '📊', label: 'Home', gradient: 'from-blue-500 to-cyan-500' },
    { to: '/farms', icon: '🌾', label: 'Farms', gradient: 'from-green-500 to-emerald-500' },
    { to: '/workers', icon: '👷', label: 'Workers', gradient: 'from-purple-500 to-pink-500' },
    { to: '/expenses', icon: '💰', label: 'Costs', gradient: 'from-amber-500 to-orange-500' },
    { to: '/reports', icon: '📈', label: 'Reports', gradient: 'from-red-500 to-rose-500' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200/50 px-2 py-3 flex justify-around items-center z-50 shadow-2xl">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `relative flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 group ${isActive ? 'scale-110' : 'scale-100 hover:scale-105'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-10 rounded-2xl animate-pulse`} />
              )}
              <div className={`relative z-10 transition-all duration-300 ${isActive ? 'transform -translate-y-1' : ''
                }`}>
                <span className={`text-2xl mb-1 block transition-transform duration-300 ${isActive ? 'scale-125' : 'group-hover:scale-110'
                  }`}>
                  {item.icon}
                </span>
                <span className={`text-[9px] uppercase tracking-widest font-black transition-all duration-300 ${isActive
                    ? 'text-emerald-600 opacity-100'
                    : 'text-slate-400 opacity-70 group-hover:opacity-100'
                  }`}>
                  {item.label}
                </span>
              </div>
              {isActive && (
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-500 rounded-full animate-bounce" />
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <div className="min-h-screen pb-28 max-w-md mx-auto relative bg-gradient-to-br from-slate-50 via-white to-slate-50 border-x border-slate-200/50 shadow-2xl">
      {/* Enhanced Header with Glassmorphism */}
      <header className="sticky top-0 z-40 glass-effect bg-white/90 backdrop-blur-2xl px-6 py-5 border-b border-slate-200/50 shadow-lg">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <div className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative w-11 h-11 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg transform group-hover:scale-105 transition-transform">
                🚜
              </div>
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight gradient-text bg-gradient-to-r from-emerald-600 to-emerald-800">
                FarmPulse
              </h1>
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                Enterprise Suite
              </p>
            </div>
          </div>

          {/* User Section */}
          <div className="flex items-center gap-3">
            {/* User Info Badge */}
            <div className="hidden sm:block relative">
              <div className="text-right px-4 py-2 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200/50 shadow-sm">
                <p className="text-[9px] font-black text-emerald-600 uppercase leading-none tracking-widest mb-0.5">
                  {user?.role}
                </p>
                <p className="text-xs font-bold text-slate-700">
                  {user?.username}
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="relative group w-11 h-11 rounded-2xl bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center text-xl hover:from-red-100 hover:to-red-200 transition-all duration-300 shadow-md hover:shadow-lg border border-red-200/50"
              title="Logout"
            >
              <span className="transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                🚪
              </span>
            </button>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="mt-3 flex items-center justify-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full w-fit mx-auto">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[8px] uppercase font-black text-emerald-600 tracking-[0.15em]">
            Live Sync • Cluster0
          </span>
        </div>
      </header>

      {/* Main Content with Fade In */}
      <main className="p-5 md:p-6 animate-fade-in">
        <div className="animate-slide-up">
          {children}
        </div>
      </main>

      {/* Enhanced Bottom Navigation */}
      <BottomNav />
    </div>
  );
};
