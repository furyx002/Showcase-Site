'use client';
import React, { useState, useEffect } from 'react';
import { Users, Sparkles, Clock, AlertTriangle, RefreshCw, ArrowRight } from 'lucide-react';
import { api } from '../lib/api';

export default function CustomersQueueView({ onSwitchTab }) {
  const [activeCustomers, setActiveCustomers] = useState([]);
  const [nextCustNo, setNextCustNo] = useState('CUST-1001');
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [resCust, resNext] = await Promise.all([
        api.getActiveCustomers(),
        api.getNextCustomerNo()
      ]);
      setActiveCustomers(resCust.data || []);
      if (resNext.customerNo) setNextCustNo(resNext.customerNo);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Page Header */}
      <div className="posline-card p-6 flex flex-col md:flex-row justify-between md:items-center gap-4 relative overflow-hidden bg-white dark:bg-[#121319]">
        <div className="space-y-1">
          <span className="text-[10px] font-black text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 px-3 py-1 rounded-full uppercase tracking-wider">
            ⚡ Live Active Customer Queue
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1">Active Customers Queue</h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Real-time status of playing customers with automated Customer IDs.</p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="bg-slate-50 dark:bg-[#0d0e14] border border-slate-200 dark:border-white/[0.08] rounded-2xl p-3 flex items-center space-x-3 shadow-inner">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 animate-spin" style={{ animationDuration: '8s' }} />
            <div>
              <div className="text-[9px] text-slate-500 dark:text-zinc-400 font-bold uppercase tracking-wider">Next Customer ID</div>
              <div className="text-xs font-mono font-bold text-slate-900 dark:text-white">{nextCustNo}</div>
            </div>
          </div>

          <button
            onClick={loadData}
            className="p-3 bg-slate-100 hover:bg-slate-200 dark:bg-[#14151e] dark:hover:bg-white/[0.08] text-slate-700 dark:text-zinc-300 rounded-2xl border border-slate-200 dark:border-white/10 transition-all duration-200 active:scale-95 shadow-xs"
            title="Refresh queue data"
          >
            <RefreshCw className={`w-4 h-4 text-blue-600 dark:text-blue-400 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Active Queue Cards Grid */}
      {activeCustomers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {activeCustomers.map((cust) => (
            <div
              key={cust.tableNumber}
              className={`posline-card p-6 space-y-4 transition-all duration-300 bg-white dark:bg-[#121319] ${
                cust.isExpired 
                  ? 'border-red-500/80 bg-red-50 dark:bg-red-950/20 shadow-xl' 
                  : 'border-slate-200 dark:border-white/[0.08] hover:border-blue-500'
              }`}
            >
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono font-black text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 px-2.5 py-1 rounded-xl">
                  {cust.customerNo}
                </span>
                <span className="font-extrabold text-slate-700 dark:text-zinc-300 bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 px-2.5 py-1 rounded-xl">
                  Table #{cust.tableNumber}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">{cust.customerName}</h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium mt-0.5">{cust.tableName}</p>
              </div>

              <div className="bg-slate-50 dark:bg-[#0d0e14] p-3.5 rounded-2xl border border-slate-200 dark:border-white/[0.06] space-y-1.5 text-xs font-medium shadow-inner">
                <div className="flex justify-between text-slate-600 dark:text-zinc-400">
                  <span>Session Start Time:</span>
                  <strong className="text-slate-900 dark:text-zinc-200 font-mono">{cust.startTimeFormatted}</strong>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-zinc-400">
                  <span>Duration Played:</span>
                  <strong className="text-blue-600 dark:text-blue-400 font-mono font-bold">{Math.floor((cust.netElapsedSecs || 0) / 60)} mins</strong>
                </div>
                {cust.timeLimitMinutes > 0 && (
                  <div className="flex justify-between text-slate-600 dark:text-zinc-400">
                    <span>Target Limit:</span>
                    <strong className="text-amber-600 dark:text-amber-400 font-mono">{cust.timeLimitMinutes} mins</strong>
                  </div>
                )}
              </div>

              {cust.isExpired && (
                <div className="bg-red-500/20 border border-red-500/40 rounded-2xl p-2.5 text-xs text-red-700 dark:text-red-200 flex items-center space-x-2 animate-bounce">
                  <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                  <span className="font-extrabold">⚠️ SESSION EXPIRED!</span>
                </div>
              )}

              <div className="flex justify-between items-center pt-2.5 border-t border-slate-100 dark:border-white/[0.08] text-xs">
                <span className="text-slate-600 dark:text-zinc-400 font-medium">Running Bill:</span>
                <span className="font-mono text-base font-black text-blue-600 dark:text-blue-400">PKR {cust.grandTotal.toFixed(2)}</span>
              </div>

              <button
                onClick={() => onSwitchTab('tables')}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-extrabold transition-all duration-200 text-center flex items-center justify-center space-x-1.5 shadow-md shadow-blue-600/30"
              >
                <span>Manage Table #{cust.tableNumber}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

            </div>
          ))}
        </div>
      ) : (
        <div className="posline-card p-12 text-center space-y-3 bg-white dark:bg-[#121319]">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 flex items-center justify-center mx-auto text-2xl">
            <Users className="w-8 h-8 text-slate-400 dark:text-zinc-500" />
          </div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">No Active Playing Customers</h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mx-auto font-medium">
            All 3 snooker tables are currently available. Start a session on any table to auto-generate a customer queue tag.
          </p>
        </div>
      )}

    </div>
  );
}
