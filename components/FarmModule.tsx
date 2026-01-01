
import React, { useState } from 'react';
import { dbService } from '../services/db';
import { useAuth } from '../context/AuthContext';
import { Farm } from '../types';

export const FarmModule: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.id || '';

  const [farms, setFarms] = useState<Farm[]>(dbService.getFarms(userId));
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    areaSize: 0,
    season: 'Kharif 2024'
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newFarm = dbService.addFarm(userId, formData);
    setFarms([...farms, newFarm]);
    setIsAdding(false);
    setFormData({ name: '', location: '', areaSize: 0, season: 'Kharif 2024' });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure? This will not delete historical costs but will remove the farm entry.')) {
      dbService.deleteFarm(userId, id);
      setFarms(farms.filter(f => f.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <span className="text-4xl">🌾</span>
            My Farms
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-1">{farms.length} active farm{farms.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className={`btn ${isAdding ? 'btn-secondary' : 'btn-primary'} shadow-lg hover-lift`}
        >
          {isAdding ? '✕ Close' : '+ New Farm'}
        </button>
      </div>

      {/* Add Farm Form */}
      {isAdding && (
        <div className="card animate-slide-down">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
              🌱
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-800">Add New Farm</h3>
              <p className="text-xs text-slate-500">Register a new farming unit</p>
            </div>
          </div>

          <form onSubmit={handleAdd} className="space-y-5">
            <div>
              <label className="block text-xs font-black text-slate-600 uppercase mb-2 tracking-widest">
                🏷️ Farm Name
              </label>
              <input
                required
                type="text"
                className="input"
                placeholder="e.g. North Fields"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-slate-600 uppercase mb-2 tracking-widest">
                  📍 Location
                </label>
                <input
                  required
                  type="text"
                  className="input"
                  placeholder="Village/City"
                  value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-600 uppercase mb-2 tracking-widest">
                  📏 Area (Acres)
                </label>
                <input
                  required
                  type="number"
                  step="0.1"
                  className="input"
                  placeholder="0.0"
                  value={formData.areaSize || ''}
                  onChange={e => setFormData({ ...formData, areaSize: Number(e.target.value) })}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full">
              <span>✨</span> Create Farm
            </button>
          </form>
        </div>
      )}

      {/* Farms List */}
      <div className="space-y-4">
        {farms.length === 0 ? (
          <div className="card text-center py-16 border-2 border-dashed border-slate-200">
            <div className="text-6xl mb-4 opacity-20">🏜️</div>
            <p className="text-slate-400 font-bold uppercase text-sm tracking-widest mb-4">No farms registered yet</p>
            <button
              onClick={() => setIsAdding(true)}
              className="btn btn-primary mx-auto"
            >
              + Add Your First Farm
            </button>
          </div>
        ) : farms.map((farm, index) => (
          <div
            key={farm.id}
            className="card card-hover group relative animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Delete Button */}
            <button
              onClick={() => handleDelete(farm.id)}
              className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 transition-all duration-300 hover:scale-110"
              title="Delete farm"
            >
              <span className="text-xl">🗑️</span>
            </button>

            <div className="flex items-start gap-4">
              {/* Farm Icon */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl blur-lg group-hover:blur-xl transition-all"></div>
                <div className="relative w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all">
                  🌾
                </div>
              </div>

              {/* Farm Details */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-black text-xl text-slate-800 tracking-tight mb-1">{farm.name}</h3>
                    <p className="text-sm text-slate-500 font-medium flex items-center gap-1.5">
                      <span>📍</span> {farm.location}
                    </p>
                  </div>
                  <span className="badge badge-success">
                    {farm.season}
                  </span>
                </div>

                {/* Stats */}
                <div className="flex gap-6 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                      <span className="text-sm">📏</span>
                    </div>
                    <div>
                      <p className="text-lg font-black text-slate-800">{farm.areaSize}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Acres</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                      <span className="text-sm">📅</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-700">{new Date(farm.createdAt).toLocaleDateString()}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Registered</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
