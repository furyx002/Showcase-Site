'use client';
import React, { useState } from 'react';
import { X, ArrowRightLeft, ShieldAlert, Check } from 'lucide-react';

export default function TransferModal({ table, allTables, isOpen, onClose, onConfirm }) {
  const [targetTableNumber, setTargetTableNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !table) return null;

  const availableTables = allTables.filter(t => t.tableNumber !== table.tableNumber && t.status === 'AVAILABLE');

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!targetTableNumber) {
      setError('Please select a target table');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await onConfirm(table.tableNumber, targetTableNumber);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to move table');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-[#121319] border border-slate-200 dark:border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl text-slate-900 dark:text-white">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-white/[0.08] flex justify-between items-center bg-slate-50/50 dark:bg-[#181922]/90">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-extrabold">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Transfer Table Session</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Move Table {table.tableNumber} session & tab</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-white/[0.08]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleTransfer} className="p-6 space-y-5">

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-600 dark:text-red-300 flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <div className="bg-slate-50 dark:bg-[#0d0e14] p-4 rounded-2xl border border-slate-200 dark:border-white/[0.08] space-y-1">
            <div className="text-xs text-slate-500 dark:text-zinc-400 font-bold">Moving Customer:</div>
            <div className="text-sm font-extrabold text-slate-900 dark:text-white flex justify-between">
              <span>{table.activeSession?.customerName}</span>
              <span className="font-mono text-blue-600 dark:text-blue-400">{table.activeSession?.customerNo}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-extrabold text-slate-700 dark:text-zinc-300">Select Available Destination Table:</label>

            {availableTables.length > 0 ? (
              <div className="space-y-2">
                {availableTables.map(target => (
                  <button
                    key={target.tableNumber}
                    type="button"
                    onClick={() => setTargetTableNumber(target.tableNumber)}
                    className={`w-full p-3.5 rounded-2xl border text-left flex justify-between items-center transition-all ${
                      Number(targetTableNumber) === target.tableNumber
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/30 font-extrabold'
                        : 'bg-slate-50 dark:bg-[#0d0e14] border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-zinc-300 hover:border-blue-500'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 flex items-center justify-center font-black text-sm text-blue-600 dark:text-blue-400">
                        #{target.tableNumber}
                      </div>
                      <div>
                        <div className="text-xs font-black">{target.name}</div>
                        <div className="text-[10px] opacity-80">PKR {target.hourlyRate}/hr</div>
                      </div>
                    </div>
                    {Number(targetTableNumber) === target.tableNumber && (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-slate-50 dark:bg-[#0d0e14] rounded-2xl border border-slate-200 dark:border-white/[0.08] text-center text-xs text-amber-600 dark:text-amber-400 font-bold">
                No other tables are currently available for transfer.
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !targetTableNumber}
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 px-4 rounded-2xl text-xs shadow-md shadow-blue-600/30 transition-all active:scale-98 disabled:opacity-50"
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>{loading ? 'Transferring Session...' : 'Confirm Table Transfer'}</span>
          </button>

        </form>
      </div>
    </div>
  );
}
