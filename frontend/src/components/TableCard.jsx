'use client';
import React, { useState, useEffect } from 'react';
import { 
  Play, Pause, Plus, ArrowRightLeft, CreditCard, Clock, AlertTriangle, 
  ShoppingCart, User, Edit3, Trash2, ShieldCheck, Flame, Sparkles, Zap
} from 'lucide-react';

export default function TableCard({ 
  table, 
  onStart, 
  onPause, 
  onResume, 
  onAddItem, 
  onTransfer, 
  onCheckout,
  onEditTable,
  onEditSession,
  onDeleteItemFromSession
}) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const { tableNumber, name, hourlyRate, status, activeSession } = table;

  let displayElapsedSecs = 0;
  let isExpired = false;
  let overtimeSecs = 0;
  let remainingSecs = 0;
  let liveTableCharge = 0;
  let hasLimit = false;
  let progressPercent = 0;

  if (activeSession && (status === 'OCCUPIED' || status === 'PAUSED')) {
    const startTimeMs = new Date(activeSession.startTime).getTime();
    let pausedSecs = activeSession.pausedTotalSeconds || 0;

    if (status === 'PAUSED' && activeSession.lastPausedAt) {
      const currentPauseMs = now - new Date(activeSession.lastPausedAt).getTime();
      pausedSecs += Math.floor(currentPauseMs / 1000);
    }

    const rawElapsed = Math.floor((now - startTimeMs) / 1000);
    displayElapsedSecs = Math.max(0, rawElapsed - pausedSecs);

    const limitMins = activeSession.timeLimitMinutes || 0;
    const limitSecs = limitMins * 60;
    hasLimit = limitMins > 0;

    if (hasLimit) {
      progressPercent = Math.min(100, Math.round((displayElapsedSecs / limitSecs) * 100));
      if (displayElapsedSecs >= limitSecs) {
        isExpired = true;
        overtimeSecs = displayElapsedSecs - limitSecs;
        remainingSecs = 0;
      } else {
        remainingSecs = limitSecs - displayElapsedSecs;
      }
    }

    liveTableCharge = Math.round(((displayElapsedSecs / 3600) * hourlyRate) * 100) / 100;
  }

  const formatSeconds = (totalSecs) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isOccupied = status === 'OCCUPIED';
  const isPaused = status === 'PAUSED';

  const grandTotal = Math.round((liveTableCharge + (activeSession?.ordersTotal || 0)) * 100) / 100;

  return (
    <div className={`posline-card p-5 space-y-4 relative transition-all duration-300 ${
      isExpired 
        ? 'border-red-500/80 bg-red-50 dark:bg-red-950/20 shadow-xl' 
        : isOccupied 
          ? 'border-blue-500/40 dark:border-blue-500/30 bg-white dark:bg-[#121319]' 
          : isPaused
            ? 'border-amber-400/50 bg-amber-50/50 dark:bg-amber-950/20'
            : 'border-slate-200 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/20'
    }`}>

      {/* Table Header & Edit Button (POSLINE Order # Style) */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-[#181920] border border-slate-200 dark:border-white/10 flex items-center justify-center font-black text-sm text-blue-600 dark:text-emerald-400 shadow-inner">
              #{tableNumber}
            </div>
            {isOccupied && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-blue-600 dark:bg-emerald-500 rounded-full border-2 border-white dark:border-[#090a0f] status-led-active"></span>
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">{name}</h3>
              {onEditTable && (
                <button
                  onClick={() => onEditTable(table)}
                  className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors p-1"
                  title="Edit table name and rate"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-mono font-medium">PKR {hourlyRate.toFixed(2)}/hr</span>
          </div>
        </div>

        {/* Status Badge (Ready Green Pill in POSLINE style) */}
        <div className="flex items-center space-x-1.5">
          <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wide border transition-all ${
            isExpired
              ? 'bg-red-100 text-red-700 border-red-300 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/40 animate-pulse'
              : isOccupied
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30'
                : isPaused
                  ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30'
                  : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-white/[0.05] dark:text-zinc-400 dark:border-white/10'
          }`}>
            {isExpired ? '⚠️ EXPIRED' : isOccupied ? 'Ready / Occupied' : status}
          </span>
        </div>
      </div>

      {/* ACTIVE / PAUSED SESSION VIEW */}
      {activeSession && (isOccupied || isPaused) ? (
        <div className="space-y-4">

          {/* Customer Tag & Session Mode */}
          <div className="bg-slate-50 dark:bg-[#181922]/90 rounded-2xl p-3.5 border border-slate-200 dark:border-white/[0.08] space-y-2 shadow-inner">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs text-slate-900 dark:text-white font-bold">
                <User className="w-4 h-4 text-blue-600 dark:text-emerald-400" />
                <span>{activeSession.customerName}</span>
                {onEditSession && (
                  <button
                    onClick={() => onEditSession(table)}
                    className="text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 p-0.5"
                    title="Edit session details"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                )}
              </div>
              <span className="text-[11px] font-mono font-black bg-blue-100 text-blue-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-blue-200 dark:border-emerald-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {activeSession.customerNo}
              </span>
            </div>
            
            <div className="text-[11px] text-blue-700 dark:text-emerald-300 font-bold bg-white dark:bg-[#0d0e14] px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/[0.06] flex items-center justify-between shadow-xs">
              <span className="truncate">
                {activeSession.billingMode === 'PER_GAME' 
                  ? `🎮 Per Game (${activeSession.ballType?.replace('_', ' ')} • ${activeSession.playerMode === 'DOUBLE' ? 'Double 4P' : 'Single 2P'})` 
                  : `⏱️ Per Min (PKR ${activeSession.perMinuteRate || 10}/min)`}
              </span>
              <span className="text-slate-500 dark:text-zinc-400 text-[10px] shrink-0 font-mono ml-2">Start: {activeSession.startTimeFormatted}</span>
            </div>
          </div>

          {/* EXPIRED ALERT BUBBLE */}
          {isExpired && (
            <div className="bg-red-500/15 border border-red-500/40 rounded-2xl p-3 text-xs text-red-700 dark:text-red-200 flex items-center space-x-2 animate-bounce shadow-md">
              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
              <span className="font-extrabold tracking-wide">⚠️ TIME EXPIRED! OVERTIME (+{formatSeconds(overtimeSecs)})</span>
            </div>
          )}

          {/* Digital LED Clock Display */}
          <div className="bg-slate-900 dark:bg-[#0b0c10] text-white rounded-2xl p-4 text-center border border-slate-800 dark:border-white/[0.08] relative overflow-hidden shadow-inner">
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-zinc-400 mb-1 flex items-center justify-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-400 dark:text-emerald-400" />
              <span>{isPaused ? 'SESSION PAUSED' : isExpired ? 'OVERTIME PLAYING' : 'ELAPSED SESSION TIME'}</span>
            </div>
            
            <div className={`font-digital text-3xl sm:text-4xl font-black tracking-widest ${
              isExpired ? 'text-red-400 animate-pulse' : isPaused ? 'text-amber-300' : 'text-blue-400 dark:text-emerald-400'
            }`}>
              {formatSeconds(displayElapsedSecs)}
            </div>

            {hasLimit && !isExpired && (
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-[10px] text-slate-300 dark:text-zinc-400 font-medium px-1">
                  <span>Game Progress</span>
                  <span className="text-blue-400 dark:text-emerald-400 font-bold">⏳ {formatSeconds(remainingSecs)} left</span>
                </div>
                <div className="w-full bg-slate-800 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-blue-500 dark:bg-gradient-to-r dark:from-emerald-500 dark:to-teal-400 h-full transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Snack & Drink Bar Tab */}
          <div className="bg-slate-50 dark:bg-[#181922]/90 rounded-2xl p-3.5 border border-slate-200 dark:border-white/[0.08] space-y-2.5">
            <div className="flex justify-between items-center text-xs font-bold text-slate-800 dark:text-zinc-200">
              <span className="flex items-center space-x-1.5">
                <ShoppingCart className="w-4 h-4 text-amber-500" />
                <span>Bar & Lounge Tab</span>
              </span>
              <button
                onClick={() => onAddItem(table)}
                className="text-[11px] font-extrabold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30 px-2.5 py-1 rounded-xl flex items-center space-x-1 transition-all duration-200 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Snack</span>
              </button>
            </div>

            {activeSession.orders && activeSession.orders.length > 0 ? (
              <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1 text-xs">
                {activeSession.orders.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-slate-700 dark:text-zinc-300 bg-white dark:bg-[#0d0e14] px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/[0.04] shadow-xs">
                    <span className="truncate max-w-[130px] font-medium text-slate-900 dark:text-zinc-200">{item.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-slate-500 dark:text-zinc-400">{item.quantity}x PKR {item.price.toFixed(2)}</span>
                      {onDeleteItemFromSession && (
                        <button
                          onClick={() => onDeleteItemFromSession(tableNumber, idx)}
                          className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 p-0.5 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-[11px] text-slate-400 dark:text-zinc-500 italic text-center py-1 font-medium">No snacks attached to session</div>
            )}
          </div>

          {/* Billing Total Readout */}
          <div className="bg-slate-50 dark:bg-[#0d0e14] rounded-2xl p-3.5 border border-slate-200 dark:border-white/[0.08] flex justify-between items-center">
            <span className="text-xs font-bold text-slate-600 dark:text-zinc-400">Total Running Bill:</span>
            <span className="font-mono text-lg font-black text-blue-600 dark:text-emerald-400 tracking-tight">PKR {grandTotal.toFixed(2)}</span>
          </div>

          {/* Action Buttons Toolbar (POSLINE Style Pill Buttons) */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {isOccupied ? (
              <button
                onClick={() => onPause(tableNumber)}
                className="py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-500/10 dark:hover:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30 rounded-2xl font-bold flex items-center justify-center space-x-1.5 transition-all duration-200"
              >
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </button>
            ) : (
              <button
                onClick={() => onResume(tableNumber)}
                className="py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30 rounded-2xl font-bold flex items-center justify-center space-x-1.5 transition-all duration-200"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Resume</span>
              </button>
            )}

            <button
              onClick={() => onTransfer(table)}
              className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 dark:bg-white/[0.05] dark:hover:bg-white/[0.1] dark:text-zinc-300 dark:border-white/10 rounded-2xl font-bold flex items-center justify-center space-x-1.5 transition-all duration-200"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Transfer</span>
            </button>

            {/* POSLINE "It's Done / Checkout ⚡" Action Button */}
            <button
              onClick={() => onCheckout(table)}
              className="col-span-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-2xl text-xs flex items-center justify-center space-x-2 transition-all duration-200 shadow-md shadow-blue-600/30 active:scale-98"
            >
              <span>It's Done & Checkout</span>
              <Zap className="w-4 h-4 fill-white" />
            </button>
          </div>

        </div>
      ) : (
        /* VACANT / AVAILABLE TABLE VIEW */
        <div className="py-8 space-y-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 flex items-center justify-center mx-auto text-xl shadow-xs">
            🎱
          </div>
          <div>
            <div className="text-xs font-extrabold text-slate-800 dark:text-zinc-300">Table Ready for Play</div>
            <p className="text-[11px] text-slate-500 dark:text-zinc-500 mt-0.5 font-medium">Select game mode or per-minute rate to begin</p>
          </div>
          <button
            onClick={() => onStart(table)}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-2xl text-xs flex items-center justify-center space-x-2 transition-all duration-200 shadow-md shadow-blue-600/30 active:scale-98"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Start New Session</span>
          </button>
        </div>
      )}

    </div>
  );
}
