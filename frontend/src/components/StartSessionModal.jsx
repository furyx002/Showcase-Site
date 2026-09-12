'use client';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { X, Play, Clock, Sparkles, User, Award } from 'lucide-react';
import { api } from '../lib/api';

// Poster Rate List Matrix for RF Snooker Club
const POSTER_RATES = {
  1: { // Table 6x12
    name: 'Table 6×12 Main Hall',
    '15_BALL': { SINGLE: 200, DOUBLE: 400 },
    '10_BALL': { SINGLE: 120, DOUBLE: 240 },
    '06_BALL': { SINGLE: 100, DOUBLE: 200 },
    perMinuteDefault: 10
  },
  2: { // Table 5x10
    name: 'Table 5×10 Green Table',
    '15_BALL': { SINGLE: 130, DOUBLE: 260 },
    '10_BALL': { SINGLE: 80, DOUBLE: 160 },
    '06_BALL': { SINGLE: 70, DOUBLE: 140 },
    perMinuteDefault: 10
  },
  3: { // Private Room / Billiard
    name: 'Private Room & Billiard Zone',
    'BILLIARD': { SINGLE: 50, DOUBLE: 100 },
    '15_BALL': { SINGLE: 200, DOUBLE: 400 },
    '10_BALL': { SINGLE: 120, DOUBLE: 240 },
    '06_BALL': { SINGLE: 100, DOUBLE: 200 },
    perMinuteDefault: 15
  }
};

export default function StartSessionModal({ table, isOpen, onClose, onConfirm }) {
  const [billingMode, setBillingMode] = useState('PER_GAME'); // 'PER_GAME' or 'PER_MINUTE'
  const [playerMode, setPlayerMode] = useState('SINGLE');     // 'SINGLE' (2P) or 'DOUBLE' (4P)
  const [ballType, setBallType] = useState('15_BALL');         // '15_BALL', '10_BALL', '06_BALL', 'BILLIARD'
  const [perMinuteRate, setPerMinuteRate] = useState(10);     // PKR 10/min, 15/min, 18/min
  const [customerName, setCustomerName] = useState('');
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(0); // 0 = Unlimited
  const [autoCustNo, setAutoCustNo] = useState('Loading...');
  const [loading, setLoading] = useState(false);

  const tblId = table?.tableNumber || 1;
  const ratesConfig = POSTER_RATES[tblId] || POSTER_RATES[1];

  useEffect(() => {
    if (isOpen) {
      api.getNextCustomerNo()
        .then(res => {
          if (res.customerNo) {
            setAutoCustNo(res.customerNo);
            setCustomerName(`Walk-in (${res.customerNo})`);
          }
        })
        .catch(() => setAutoCustNo('CUST-1001'));
      
      if (tblId === 3) {
        setBallType('BILLIARD');
        setPerMinuteRate(15);
      } else {
        setBallType('15_BALL');
        setPerMinuteRate(ratesConfig.perMinuteDefault || 10);
      }
    }
  }, [isOpen, tblId]);

  if (!isOpen || !table) return null;

  const ballRates = ratesConfig[ballType] || ratesConfig['15_BALL'] || { SINGLE: 150, DOUBLE: 300 };
  const currentFixedPrice = ballRates[playerMode] || 150;

  const handleStart = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onConfirm({
        tableNumber: table.tableNumber,
        customerName,
        timeLimitMinutes: Number(timeLimitMinutes) || 0,
        billingMode,
        playerMode,
        ballType,
        fixedGameRate: billingMode === 'PER_GAME' ? currentFixedPrice : 0,
        perMinuteRate: Number(perMinuteRate) || 10,
        hourlyRate: table.hourlyRate
      });
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to start session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-[#121319] border border-slate-200 dark:border-white/10 rounded-3xl w-full max-w-md max-h-[90vh] my-auto flex flex-col overflow-hidden shadow-2xl relative z-10 text-slate-900 dark:text-white">
        
        {/* Sticky Header */}
        <div className="p-5 border-b border-slate-100 dark:border-white/[0.08] flex justify-between items-center bg-slate-50/80 dark:bg-[#181922]/90 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-black text-base shadow-inner">
              #{table.tableNumber}
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight">Start Table Session</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">{ratesConfig.name}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-white/[0.08] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleStart} className="p-5 space-y-4 overflow-y-auto flex-1">

          {/* Automated Customer Tag Banner */}
          <div className="bg-slate-50 dark:bg-[#0d0e14] p-3.5 rounded-2xl border border-slate-200 dark:border-white/[0.08] flex justify-between items-center text-xs shadow-inner">
            <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 font-extrabold">
              <Sparkles className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400" style={{ animationDuration: '8s' }} />
              <span>Customer ID Tag:</span>
            </div>
            <span className="font-mono font-black text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 px-3 py-1 rounded-xl text-xs">
              {autoCustNo}
            </span>
          </div>

          {/* Customer Name / Alias */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-800 dark:text-zinc-200 flex items-center space-x-1.5">
              <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Customer Name / Alias</span>
            </label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Player 1"
              className="w-full bg-slate-50 dark:bg-[#0d0e14] border border-slate-200 dark:border-white/[0.08] focus:border-blue-500 rounded-2xl px-4 py-3 text-xs text-slate-900 dark:text-white font-bold focus:outline-none transition-all duration-200"
            />
          </div>

          {/* TWO MAIN BILLING CHOICES FROM POSTER MATRIX */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-white/[0.08]">
            <label className="text-xs font-black text-slate-900 dark:text-white flex items-center justify-between">
              <span>Select Billing Mode:</span>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-extrabold uppercase tracking-wider">Poster Rates</span>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setBillingMode('PER_GAME')}
                className={`p-3 rounded-2xl border text-xs font-extrabold transition-all text-left space-y-1 ${
                  billingMode === 'PER_GAME'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/30'
                    : 'bg-white dark:bg-[#181922] border-slate-200 dark:border-white/10 text-slate-800 dark:text-zinc-200 hover:border-blue-500'
                }`}
              >
                <div className="flex items-center space-x-1.5">
                  <Award className="w-3.5 h-3.5" />
                  <span>Choice 1: Per Game</span>
                </div>
                <div className={`text-[10px] font-medium ${billingMode === 'PER_GAME' ? 'text-blue-100' : 'text-slate-500 dark:text-zinc-400'}`}>Fixed Ball & Player Rates</div>
              </button>

              <button
                type="button"
                onClick={() => setBillingMode('PER_MINUTE')}
                className={`p-3 rounded-2xl border text-xs font-extrabold transition-all text-left space-y-1 ${
                  billingMode === 'PER_MINUTE'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/30'
                    : 'bg-white dark:bg-[#181922] border-slate-200 dark:border-white/10 text-slate-800 dark:text-zinc-200 hover:border-blue-500'
                }`}
              >
                <div className="flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Choice 2: Per Minute</span>
                </div>
                <div className={`text-[10px] font-medium ${billingMode === 'PER_MINUTE' ? 'text-blue-100' : 'text-slate-500 dark:text-zinc-400'}`}>Timer-based Billing</div>
              </button>
            </div>
          </div>

          {/* CHOICE 1: PER_GAME OPTIONS */}
          {billingMode === 'PER_GAME' && (
            <div className="bg-slate-50 dark:bg-[#0d0e14] p-4 rounded-2xl border border-slate-200 dark:border-white/[0.08] space-y-4 shadow-inner">
              
              {/* Ball Selection */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-500 dark:text-zinc-400 tracking-wider">Select Ball Type:</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {tblId === 3 && (
                    <button
                      type="button"
                      onClick={() => setBallType('BILLIARD')}
                      className={`py-2.5 px-3 rounded-xl font-extrabold border transition-all ${
                        ballType === 'BILLIARD' 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                          : 'bg-white dark:bg-[#181922] border-slate-200 dark:border-white/10 text-slate-800 dark:text-zinc-200 hover:border-blue-500'
                      }`}
                    >
                      Billiard (PKR 50/100)
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setBallType('15_BALL')}
                    className={`py-2.5 px-3 rounded-xl font-extrabold border transition-all ${
                      ballType === '15_BALL' 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                        : 'bg-white dark:bg-[#181922] border-slate-200 dark:border-white/10 text-slate-800 dark:text-zinc-200 hover:border-blue-500'
                    }`}
                  >
                    15 Ball
                  </button>
                  <button
                    type="button"
                    onClick={() => setBallType('10_BALL')}
                    className={`py-2.5 px-3 rounded-xl font-extrabold border transition-all ${
                      ballType === '10_BALL' 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                        : 'bg-white dark:bg-[#181922] border-slate-200 dark:border-white/10 text-slate-800 dark:text-zinc-200 hover:border-blue-500'
                    }`}
                  >
                    10 Ball
                  </button>
                  <button
                    type="button"
                    onClick={() => setBallType('06_BALL')}
                    className={`py-2.5 px-3 rounded-xl font-extrabold border transition-all ${
                      ballType === '06_BALL' 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                        : 'bg-white dark:bg-[#181922] border-slate-200 dark:border-white/10 text-slate-800 dark:text-zinc-200 hover:border-blue-500'
                    }`}
                  >
                    06 Ball
                  </button>
                </div>
              </div>

              {/* Player Mode: Single (2 Players) vs Double (4 Players) */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-500 dark:text-zinc-400 tracking-wider">Select Player Count:</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPlayerMode('SINGLE')}
                    className={`py-2.5 px-3 rounded-xl font-extrabold border text-center transition-all ${
                      playerMode === 'SINGLE'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                        : 'bg-white dark:bg-[#181922] border-slate-200 dark:border-white/10 text-slate-800 dark:text-zinc-200 hover:border-blue-500'
                    }`}
                  >
                    Single (2 Players)
                  </button>

                  <button
                    type="button"
                    onClick={() => setPlayerMode('DOUBLE')}
                    className={`py-2.5 px-3 rounded-xl font-extrabold border text-center transition-all ${
                      playerMode === 'DOUBLE'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                        : 'bg-white dark:bg-[#181922] border-slate-200 dark:border-white/10 text-slate-800 dark:text-zinc-200 hover:border-blue-500'
                    }`}
                  >
                    Double (4 Players)
                  </button>
                </div>
              </div>

              {/* Display Calculated Fixed Price */}
              <div className="flex justify-between items-center pt-2.5 border-t border-slate-200 dark:border-white/[0.08] text-xs">
                <span className="text-slate-600 dark:text-zinc-400 font-bold">Calculated Poster Game Rate:</span>
                <span className="font-mono text-base font-black text-blue-600 dark:text-blue-400">PKR {currentFixedPrice}</span>
              </div>

            </div>
          )}

          {/* CHOICE 2: PER_MINUTE OPTIONS */}
          {billingMode === 'PER_MINUTE' && (
            <div className="bg-slate-50 dark:bg-[#0d0e14] p-4 rounded-2xl border border-slate-200 dark:border-white/[0.08] space-y-2 text-xs shadow-inner">
              <label className="text-[10px] font-black uppercase text-slate-500 dark:text-zinc-400 tracking-wider">Select Minute Rate Tier:</label>
              
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setPerMinuteRate(10)}
                  className={`w-full py-2.5 px-3 rounded-xl border font-bold text-left flex justify-between items-center transition-all ${
                    perMinuteRate === 10 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-white dark:bg-[#181922] border-slate-200 dark:border-white/10 text-slate-800 dark:text-zinc-200 hover:border-blue-500'
                  }`}
                >
                  <span>Standard (Century + Fifty)</span>
                  <span className={`font-mono font-black ${perMinuteRate === 10 ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`}>PKR 10 / min</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPerMinuteRate(15)}
                  className={`w-full py-2.5 px-3 rounded-xl border font-bold text-left flex justify-between items-center transition-all ${
                    perMinuteRate === 15 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-white dark:bg-[#181922] border-slate-200 dark:border-white/10 text-slate-800 dark:text-zinc-200 hover:border-blue-500'
                  }`}
                >
                  <span>Private Room (Non-AC)</span>
                  <span className={`font-mono font-black ${perMinuteRate === 15 ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`}>PKR 15 / min</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPerMinuteRate(18)}
                  className={`w-full py-2.5 px-3 rounded-xl border font-bold text-left flex justify-between items-center transition-all ${
                    perMinuteRate === 18 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-white dark:bg-[#181922] border-slate-200 dark:border-white/10 text-slate-800 dark:text-zinc-200 hover:border-blue-500'
                  }`}
                >
                  <span>Private Room (AC Fee)</span>
                  <span className={`font-mono font-black ${perMinuteRate === 18 ? 'text-white' : 'text-blue-600 dark:text-blue-400'}`}>PKR 18 / min</span>
                </button>
              </div>
            </div>
          )}

          {/* Time Limit Target */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-800 dark:text-zinc-200">Session Time Limit Target (Audio Alarm):</label>
            <select
              value={timeLimitMinutes}
              onChange={(e) => setTimeLimitMinutes(Number(e.target.value))}
              className="w-full bg-slate-50 dark:bg-[#0d0e14] border border-slate-200 dark:border-white/[0.08] rounded-2xl px-4 py-3 text-xs text-slate-900 dark:text-white focus:outline-none font-bold"
            >
              <option value={0} className="bg-white dark:bg-[#121319]">Unlimited / Open Session</option>
              <option value={30} className="bg-white dark:bg-[#121319]">30 Minutes</option>
              <option value={45} className="bg-white dark:bg-[#121319]">45 Minutes</option>
              <option value={60} className="bg-white dark:bg-[#121319]">1 Hour (60m)</option>
              <option value={90} className="bg-white dark:bg-[#121319]">1.5 Hours (90m)</option>
              <option value={120} className="bg-white dark:bg-[#121319]">2 Hours (120m)</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 px-4 rounded-2xl text-xs transition-all duration-200 shadow-md shadow-blue-600/30 disabled:opacity-50 active:scale-98 shrink-0 mt-2"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{loading ? 'Launching Session...' : 'Start Game & Timer'}</span>
          </button>

        </form>
      </div>
    </div>
  );
}
