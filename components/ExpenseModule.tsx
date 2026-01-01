
import React, { useState } from 'react';
import { dbService } from '../services/db';
import { useAuth } from '../context/AuthContext';
import { ExpenseCategory } from '../types';

export const ExpenseModule: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.id || '';

  const farms = dbService.getFarms(userId);
  const [activeTab, setActiveTab] = useState<ExpenseCategory>(ExpenseCategory.FERTILIZER);
  const [selectedFarmId, setSelectedFarmId] = useState(farms[0]?.id || '');
  const [msg, setMsg] = useState('');

  const [fertForm, setFertForm] = useState({ name: '', quantity: 0, unit: 'kg', cost: 0, date: new Date().toISOString().split('T')[0] });
  const [tractorForm, setTractorForm] = useState({ tractorName: '', hoursUsed: 0, cost: 0, date: new Date().toISOString().split('T')[0] });
  const [otherForm, setOtherForm] = useState({ name: '', category: ExpenseCategory.OTHER, amount: 0, date: new Date().toISOString().split('T')[0], notes: '' });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFarmId) return alert('Select a target farm first');

    if (activeTab === ExpenseCategory.FERTILIZER) {
      dbService.addFertilizer(userId, { ...fertForm, farmId: selectedFarmId });
      setFertForm({ name: '', quantity: 0, unit: 'kg', cost: 0, date: new Date().toISOString().split('T')[0] });
    } else if (activeTab === ExpenseCategory.TRACTOR) {
      dbService.addTractor(userId, { ...tractorForm, farmId: selectedFarmId });
      setTractorForm({ tractorName: '', hoursUsed: 0, cost: 0, date: new Date().toISOString().split('T')[0] });
    } else {
      dbService.addOtherExpense(userId, { ...otherForm, farmId: selectedFarmId });
      setOtherForm({ name: '', category: ExpenseCategory.OTHER, amount: 0, date: new Date().toISOString().split('T')[0], notes: '' });
    }

    setMsg('Data Synced to Cluster0 ✅');
    setTimeout(() => setMsg(''), 2500);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-slate-800 tracking-tighter">Cost Logging</h2>

      <div className="bg-emerald-900 text-white p-6 rounded-3xl shadow-xl">
        <label className="block text-[10px] font-black text-emerald-400 uppercase mb-2 tracking-[0.2em]">Deployment Target</label>
        <select
          className="w-full p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 text-white font-bold outline-none appearance-none cursor-pointer"
          value={selectedFarmId}
          onChange={e => setSelectedFarmId(e.target.value)}
        >
          <option value="">Select Target Farm...</option>
          {farms.map(f => <option key={f.id} value={f.id}>{f.name} ({f.location})</option>)}
        </select>
      </div>

      <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
        {[ExpenseCategory.FERTILIZER, ExpenseCategory.TRACTOR, ExpenseCategory.OTHER].map(cat => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === cat ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <form onSubmit={handleSave} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6 animate-slide-up">
        {activeTab === ExpenseCategory.FERTILIZER && (
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Asset Name</label>
              <input required type="text" className="w-full p-4 bg-slate-50 rounded-2xl mt-2 border border-slate-100 focus:ring-2 focus:ring-emerald-500 transition-all font-bold" value={fertForm.name} onChange={e => setFertForm({ ...fertForm, name: e.target.value })} placeholder="e.g. NPK 19-19-19" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Units (bags)</label>
                <input required type="number" className="w-full p-4 bg-slate-50 rounded-2xl mt-2 border border-slate-100 font-bold" value={fertForm.quantity || ''} onChange={e => setFertForm({ ...fertForm, quantity: Number(e.target.value) })} />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Asset Cost (₹)</label>
                <input required type="number" className="w-full p-4 bg-slate-50 rounded-2xl mt-2 border border-slate-100 font-bold text-emerald-600" value={fertForm.cost || ''} onChange={e => setFertForm({ ...fertForm, cost: Number(e.target.value) })} />
              </div>
            </div>
          </div>
        )}

        {activeTab === ExpenseCategory.TRACTOR && (
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Machinery ID</label>
              <input required type="text" className="w-full p-4 bg-slate-50 rounded-2xl mt-2 border border-slate-100 font-bold" value={tractorForm.tractorName} onChange={e => setTractorForm({ ...tractorForm, tractorName: e.target.value })} placeholder="e.g. MH-20-X-4421" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Engine Hours</label>
                <input required type="number" step="0.5" className="w-full p-4 bg-slate-50 rounded-2xl mt-2 border border-slate-100 font-bold" value={tractorForm.hoursUsed || ''} onChange={e => setTractorForm({ ...tractorForm, hoursUsed: Number(e.target.value) })} />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Hire/Fuel Cost (₹)</label>
                <input required type="number" className="w-full p-4 bg-slate-50 rounded-2xl mt-2 border border-slate-100 font-bold text-emerald-600" value={tractorForm.cost || ''} onChange={e => setTractorForm({ ...tractorForm, cost: Number(e.target.value) })} />
              </div>
            </div>
          </div>
        )}

        {activeTab === ExpenseCategory.OTHER && (
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Expense Title</label>
              <input required type="text" className="w-full p-4 bg-slate-50 rounded-2xl mt-2 border border-slate-100 font-bold" value={otherForm.name} onChange={e => setOtherForm({ ...otherForm, name: e.target.value })} placeholder="e.g. Pump Repair" />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Capital Amount (₹)</label>
              <input required type="number" className="w-full p-4 bg-slate-50 rounded-2xl mt-2 border border-slate-100 font-bold text-emerald-600" value={otherForm.amount || ''} onChange={e => setOtherForm({ ...otherForm, amount: Number(e.target.value) })} />
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Internal Notes</label>
              <textarea className="w-full p-4 bg-slate-50 rounded-2xl mt-2 border border-slate-100 font-medium text-sm" rows={3} value={otherForm.notes} onChange={e => setOtherForm({ ...otherForm, notes: e.target.value })} placeholder="Any specific details..." />
            </div>
          </div>
        )}

        <div className="pt-4 flex flex-col gap-4">
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
            <span className="text-xl">📅</span>
            <input type="date" className="bg-transparent font-black text-slate-700 outline-none w-full" value={new Date().toISOString().split('T')[0]} />
          </div>
          <button type="submit" className="w-full bg-slate-900 text-white p-5 rounded-2xl font-black text-lg shadow-2xl active:scale-95 transition-all">
            Commit Record
          </button>
        </div>
        {msg && <p className="text-center text-emerald-600 font-black text-xs uppercase tracking-widest animate-bounce">{msg}</p>}
      </form>
    </div>
  );
};
