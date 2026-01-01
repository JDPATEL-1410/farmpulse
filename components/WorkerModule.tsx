
import React, { useState, useMemo } from 'react';
import { dbService } from '../services/db';
import { useAuth } from '../context/AuthContext';
import { Worker, TransactionType, Farm } from '../types';

export const WorkerModule: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.id || '';

  const farms = dbService.getFarms(userId);
  const [workers, setWorkers] = useState<Worker[]>(dbService.getWorkers(userId));
  const [selectedFarm, setSelectedFarm] = useState<string>('ALL');
  const [isAdding, setIsAdding] = useState(false);
  const [activeWorker, setActiveWorker] = useState<Worker | null>(null);

  const [workerForm, setWorkerForm] = useState({
    name: '',
    mobile: '',
    farmId: farms[0]?.id || '',
    joiningDate: new Date().toISOString().split('T')[0]
  });

  const [txForm, setTxForm] = useState({
    amount: 0,
    type: TransactionType.LOAN,
    remarks: '',
    date: new Date().toISOString().split('T')[0]
  });

  const filteredWorkers = useMemo(() => {
    return dbService.getWorkers(userId, selectedFarm);
  }, [workers, selectedFarm, userId]);

  const handleAddWorker = (e: React.FormEvent) => {
    e.preventDefault();
    const w = dbService.addWorker(userId, workerForm);
    setWorkers([...workers, w]);
    setIsAdding(false);
  };

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeWorker) return;
    dbService.addTransaction(userId, {
      ...txForm,
      workerId: activeWorker.id
    });
    setTxForm({ ...txForm, amount: 0, remarks: '' });
    // Trigger re-render by updating workers state lightly
    setWorkers([...workers]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-slate-800 tracking-tighter">Field Workers</h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-2xl font-bold shadow-lg shadow-emerald-200 active:scale-95 transition-all"
        >
          {isAdding ? 'Close' : '+ Onboard'}
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        <button
          onClick={() => setSelectedFarm('ALL')}
          className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap border transition-all ${selectedFarm === 'ALL' ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-400 border-slate-200'
            }`}
        >
          Entire Fleet
        </button>
        {farms.map(f => (
          <button
            key={f.id}
            onClick={() => setSelectedFarm(f.id)}
            className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap border transition-all ${selectedFarm === f.id ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg' : 'bg-white text-slate-400 border-slate-200'
              }`}
          >
            {f.name}
          </button>
        ))}
      </div>

      {isAdding && (
        <form onSubmit={handleAddWorker} className="bg-white p-6 rounded-3xl shadow-xl space-y-4 border border-emerald-100 animate-slide-up">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Full Identity</label>
            <input
              required
              type="text"
              className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="Full Name"
              value={workerForm.name}
              onChange={e => setWorkerForm({ ...workerForm, name: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Mobile</label>
              <input
                required
                type="tel"
                className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100"
                placeholder="Primary #"
                value={workerForm.mobile}
                onChange={e => setWorkerForm({ ...workerForm, mobile: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Assign Farm</label>
              <select
                className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold"
                value={workerForm.farmId}
                onChange={e => setWorkerForm({ ...workerForm, farmId: e.target.value })}
              >
                {farms.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            </div>
          </div>
          <button type="submit" className="w-full bg-slate-900 text-white p-4 rounded-2xl font-black text-lg">Register Worker</button>
        </form>
      )}

      <div className="space-y-3">
        {filteredWorkers.map(worker => {
          const balance = dbService.getWorkerBalance(userId, worker.id);
          const isActive = activeWorker?.id === worker.id;

          return (
            <div key={worker.id} className={`bg-white rounded-3xl border transition-all ${isActive ? 'ring-2 ring-emerald-500 border-transparent shadow-2xl' : 'border-slate-100 shadow-sm'}`}>
              <div
                className="p-5 flex justify-between items-center cursor-pointer"
                onClick={() => setActiveWorker(isActive ? null : worker)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all ${isActive ? 'bg-emerald-500 text-white' : 'bg-slate-100'}`}>👷</div>
                  <div>
                    <h4 className="font-black text-slate-800 tracking-tight">{worker.name}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{worker.mobile}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-black tracking-tighter ${balance > 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                    ₹{Math.abs(balance).toLocaleString()}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{balance > 0 ? 'Due to user' : 'User Advance'}</p>
                </div>
              </div>

              {isActive && (
                <div className="px-5 pb-5 border-t border-slate-50 animate-in slide-in-from-top-2">
                  <div className="mt-5 bg-slate-900 p-5 rounded-2xl text-white">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-[0.2em]">Transaction Registry</h5>
                    <form onSubmit={handleAddTransaction} className="space-y-4">
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <input
                            type="number"
                            placeholder="Amount (₹)"
                            className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold placeholder:text-slate-600"
                            value={txForm.amount || ''}
                            onChange={e => setTxForm({ ...txForm, amount: Number(e.target.value) })}
                          />
                        </div>
                        <select
                          className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-[10px] font-black uppercase tracking-widest"
                          value={txForm.type}
                          onChange={e => setTxForm({ ...txForm, type: e.target.value as TransactionType })}
                        >
                          <option value={TransactionType.LOAN}>Issue Loan</option>
                          <option value={TransactionType.PAYMENT}>Settle Pay</option>
                        </select>
                      </div>
                      <input
                        type="text"
                        placeholder="Log Description..."
                        className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-sm font-medium placeholder:text-slate-600"
                        value={txForm.remarks}
                        onChange={e => setTxForm({ ...txForm, remarks: e.target.value })}
                      />
                      <button className="w-full bg-emerald-500 text-slate-900 p-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">
                        Commit to Ledger
                      </button>
                    </form>
                  </div>

                  <div className="mt-6">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">Registry Logs</h5>
                    <div className="max-h-52 overflow-y-auto space-y-2 pr-1 no-scrollbar">
                      {dbService.getWorkerTransactions(userId, worker.id).map(t => (
                        <div key={t.id} className="flex justify-between items-center text-xs p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                          <div>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${t.type === 'LOAN' ? 'text-red-500' : 'text-emerald-600'}`}>
                              {t.type}
                            </span>
                            <p className="font-bold text-slate-700 mt-0.5">{t.remarks || 'Standard Transaction'}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-black text-slate-900 text-sm">₹{t.amount.toLocaleString()}</p>
                            <p className="text-[10px] font-bold text-slate-400">{new Date(t.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
