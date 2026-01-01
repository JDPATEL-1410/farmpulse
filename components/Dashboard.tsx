
import React, { useMemo } from 'react';
import { dbService } from '../services/db';
import { useAuth } from '../context/AuthContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.id || '';

  const stats = useMemo(() => {
    if (!userId) return null;
    return dbService.getDashboardStats(userId);
  }, [userId]);

  const farms = dbService.getFarms(userId);
  const userData = dbService.getUserData(userId);

  const metrics = useMemo(() => {
    const totalFertilizer = userData.fertilizers.reduce((sum, f) => sum + f.cost, 0);
    const totalTractor = userData.tractors.reduce((sum, t) => sum + t.cost, 0);
    const totalOther = userData.others.reduce((sum, o) => sum + o.amount, 0);

    const loans = userData.workerTransactions.filter(t => t.type === 'LOAN').reduce((sum, t) => sum + t.amount, 0);
    const payments = userData.workerTransactions.filter(t => t.type === 'PAYMENT').reduce((sum, t) => sum + t.amount, 0);

    return {
      totalExpenses: totalFertilizer + totalTractor + totalOther,
      workerDues: loans - payments,
      farmsCount: farms.length,
      workersCount: userData.workers.filter(w => w.isActive).length,
      categoryData: [
        { name: 'Fertilizer', value: totalFertilizer, color: '#10b981' },
        { name: 'Tractor', value: totalTractor, color: '#3b82f6' },
        { name: 'Other', value: totalOther, color: '#f59e0b' },
      ]
    };
  }, [farms.length, userData, userId]);

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Dashboard</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Welcome back, {user?.username}!</p>
        </div>
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg animate-bounce">
          👋
        </div>
      </div>

      {/* Hero Stats Card with Gradient */}
      <div className="relative overflow-hidden rounded-[2rem] shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl"></div>

        <div className="relative z-10 p-8 text-white">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <p className="text-emerald-400 text-xs font-black uppercase tracking-[0.2em]">Financial Overview</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Total Expenses */}
            <div className="group">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl">💸</span>
                <div>
                  <p className="text-4xl font-black tracking-tight">₹{metrics.totalExpenses.toLocaleString()}</p>
                  <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mt-1">Total Expenses</p>
                </div>
              </div>
            </div>

            {/* Worker Dues */}
            <div className="group">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl">👷</span>
                <div>
                  <p className={`text-4xl font-black tracking-tight ${metrics.workerDues > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                    ₹{Math.abs(metrics.workerDues).toLocaleString()}
                  </p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                    {metrics.workerDues > 0 ? 'Worker Dues' : 'Advance Paid'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Bar */}
          <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <span className="text-sm">🌾</span>
              </div>
              <div>
                <p className="text-lg font-black">{metrics.farmsCount}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Farms</p>
              </div>
            </div>
            <div className="w-px h-10 bg-white/10"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <span className="text-sm">👥</span>
              </div>
              <div>
                <p className="text-lg font-black">{metrics.workersCount}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Workers</p>
              </div>
            </div>
            <div className="w-px h-10 bg-white/10"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <span className="text-sm">📊</span>
              </div>
              <div>
                <p className="text-lg font-black">{metrics.categoryData.filter(d => d.value > 0).length}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Categories</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expense Breakdown Chart */}
      <div className="card card-hover animate-slide-up">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-black text-lg text-slate-800 flex items-center gap-2">
              <span className="text-2xl">📊</span> Expense Distribution
            </h3>
            <p className="text-xs text-slate-500 mt-1">Breakdown by category</p>
          </div>
          <div className="badge badge-success">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            Live Data
          </div>
        </div>

        {metrics.totalExpenses > 0 ? (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metrics.categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {metrics.categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'rgba(15, 23, 42, 0.95)',
                    border: 'none',
                    borderRadius: '1rem',
                    padding: '12px 16px',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '12px'
                  }}
                />
                <Legend
                  wrapperStyle={{
                    paddingTop: '20px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-72 flex flex-col items-center justify-center text-slate-400">
            <p className="text-6xl mb-4 opacity-20">📊</p>
            <p className="text-sm font-bold uppercase tracking-widest">No expense data yet</p>
          </div>
        )}
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card card-hover text-center group cursor-pointer animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
            <div className="relative">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all">
                🌾
              </div>
              <p className="text-3xl font-black text-slate-800 mb-1">{metrics.farmsCount}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Farms</p>
            </div>
          </div>
        </div>

        <div className="card card-hover text-center group cursor-pointer animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
            <div className="relative">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all">
                👷
              </div>
              <p className="text-3xl font-black text-slate-800 mb-1">{metrics.workersCount}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Team Members</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
