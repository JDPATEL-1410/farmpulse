
import React, { useState, useMemo } from 'react';
import { dbService } from '../services/db';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const ReportModule: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.id || '';

  const farms = dbService.getFarms(userId);
  const [selectedFarm, setSelectedFarm] = useState(farms[0]?.id || '');
  const [range, setRange] = useState({ start: '', end: '' });

  const reportData = useMemo(() => {
    if (!selectedFarm) return null;
    return dbService.getFarmReport(userId, selectedFarm, range.start, range.end);
  }, [selectedFarm, range, userId]);

  const chartData = [
    { name: 'Fertilizer', value: reportData?.fertilizerCost || 0, color: '#10b981' },
    { name: 'Tractor', value: reportData?.tractorCost || 0, color: '#3b82f6' },
    { name: 'Other', value: reportData?.otherExpenseCost || 0, color: '#f59e0b' },
  ];

  const handleDownload = () => {
    if (!reportData) return;

    const farm = dbService.getFarmById(userId, selectedFarm);
    const rows = [
      ['Date', 'Category', 'Item/Name', 'Quantity/Hours', 'Cost/Amount', 'Notes'],
    ];

    reportData.records.fertilizers.forEach(f => rows.push([f.date, 'Fertilizer', f.name, f.quantity.toString(), f.cost.toString(), '']));
    reportData.records.tractors.forEach(t => rows.push([t.date, 'Tractor', t.tractorName, t.hoursUsed.toString(), t.cost.toString(), '']));
    reportData.records.others.forEach(o => rows.push([o.date, 'Other', o.name, '-', o.amount.toString(), o.notes || '']));

    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Report_${user?.username || 'user'}_${farm?.name}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-slate-800 tracking-tighter">Business Intel</h2>
        {reportData && (
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all"
          >
            <span>📥</span> Export CSV
          </button>
        )}
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">Select Operational Unit</label>
          <select
            className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold outline-none"
            value={selectedFarm}
            onChange={e => setSelectedFarm(e.target.value)}
          >
            <option value="">Choose Unit...</option>
            {farms.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">From</label>
            <input type="date" className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs font-bold" onChange={e => setRange({ ...range, start: e.target.value })} />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">To</label>
            <input type="date" className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs font-bold" onChange={e => setRange({ ...range, end: e.target.value })} />
          </div>
        </div>
      </div>

      {reportData && farms.length > 0 ? (
        <div className="animate-in fade-in duration-700">
          <div className="bg-emerald-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden mb-6">
            <div className="relative z-10">
              <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Total Capital Infusion</p>
              <h3 className="text-4xl font-black tracking-tighter">₹{reportData.total.toLocaleString()}</h3>
              <div className="mt-6 flex items-center gap-4">
                <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
                  {reportData.count} Records Synced
                </span>
              </div>
            </div>
            <div className="absolute bottom-[-50px] right-[-50px] w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 mb-6">
            <h4 className="font-black text-slate-800 mb-8 uppercase text-[10px] tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span> Cost Distribution
            </h4>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <XAxis dataKey="name" fontSize={10} fontWeight={900} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} />
                  <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Audit Trail</p>
              <p className="text-2xl font-black text-slate-800">{reportData.count}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Total Entries</p>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Efficiency</p>
              <p className="text-2xl font-black text-slate-800">₹{(reportData.count ? (reportData.total / reportData.count) : 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase">Avg. Ticket</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 opacity-50">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">Initialize filters to generate audit</p>
        </div>
      )}
    </div>
  );
};
