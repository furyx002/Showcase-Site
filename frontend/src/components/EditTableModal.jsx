'use client';
import React, { useState, useEffect } from 'react';
import { X, Edit3, Save } from 'lucide-react';

export default function EditTableModal({ table, isOpen, onClose, onConfirm }) {
  const [name, setName] = useState('');
  const [hourlyRate, setHourlyRate] = useState(600);
  const [perMinuteRate, setPerMinuteRate] = useState(10);
  const [ball15Single, setBall15Single] = useState(200);
  const [ball15Double, setBall15Double] = useState(400);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (table) {
      setName(table.name || '');
      setHourlyRate(table.hourlyRate || 600);
      setPerMinuteRate(table.perMinuteRate || 10);
      const r = table.rates || {};
      setBall15Single(r.ball15Single || 200);
      setBall15Double(r.ball15Double || 400);
    }
  }, [table]);

  if (!isOpen || !table) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onConfirm(table.tableNumber, {
        name,
        hourlyRate: parseFloat(hourlyRate) || 600,
        perMinuteRate: parseFloat(perMinuteRate) || 10,
        rates: {
          ball15Single: parseFloat(ball15Single) || 200,
          ball15Double: parseFloat(ball15Double) || 400
        }
      });
      onClose();
    } catch (err) {
      alert(err.message || 'Failed to update table settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-[#121319] border border-slate-200 dark:border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl text-slate-900 dark:text-white">
        
        <div className="p-4 border-b border-slate-200 dark:border-white/[0.08] flex justify-between items-center bg-slate-50 dark:bg-[#181922]">
          <div className="flex items-center space-x-2">
            <Edit3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-black text-slate-900 dark:text-white">Edit Table #{table.tableNumber} Poster Rates</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          <div className="space-y-1">
            <label className="text-xs font-extrabold text-slate-700 dark:text-zinc-300">Table Display Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Table 1 - 6x12 Championship"
              className="w-full bg-slate-50 dark:bg-[#0d0e14] border border-slate-200 dark:border-white/[0.08] rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none font-bold"
              required
            />
          </div>

          <div className="bg-slate-50 dark:bg-[#0d0e14] p-3.5 rounded-2xl border border-slate-200 dark:border-white/[0.08] space-y-2 text-xs">
            <div className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 tracking-wider">Poster Ball Rates (PKR):</div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-semibold text-slate-600 dark:text-zinc-400">Single (2 Players):</label>
                <input
                  type="number"
                  value={ball15Single}
                  onChange={(e) => setBall15Single(e.target.value)}
                  className="w-full bg-white dark:bg-[#181920] border border-slate-200 dark:border-white/10 rounded-xl p-2 text-xs text-slate-900 dark:text-white font-mono font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-slate-600 dark:text-zinc-400">Double (4 Players):</label>
                <input
                  type="number"
                  value={ball15Double}
                  onChange={(e) => setBall15Double(e.target.value)}
                  className="w-full bg-white dark:bg-[#181920] border border-slate-200 dark:border-white/10 rounded-xl p-2 text-xs text-slate-900 dark:text-white font-mono font-bold"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-zinc-400">Per Min Rate (PKR/min):</label>
              <input
                type="number"
                value={perMinuteRate}
                onChange={(e) => setPerMinuteRate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#0d0e14] border border-slate-200 dark:border-white/[0.08] rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-mono font-bold"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-zinc-400">Hourly Rate (PKR/hr):</label>
              <input
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#0d0e14] border border-slate-200 dark:border-white/[0.08] rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white font-mono font-bold"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 px-4 rounded-2xl text-xs transition-all duration-200 shadow-md shadow-blue-600/30 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving Rates...' : 'Save All Table Rates'}</span>
          </button>

        </form>

      </div>
    </div>
  );
}
