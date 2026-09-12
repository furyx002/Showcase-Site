'use client';
import React, { useState } from 'react';
import { X, Printer, Zap, CreditCard, Banknote, Smartphone, CheckCircle, Receipt } from 'lucide-react';
import ThermalReceipt from './ThermalReceipt';
import confetti from 'canvas-confetti';

export default function CheckoutModal({ table, isOpen, onClose, onConfirm }) {
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [loading, setLoading] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  if (!isOpen || !table || !table.activeSession) return null;

  const session = table.activeSession;
  const tableCharge = session.tableCharge || 0;
  const ordersTotal = session.ordersTotal || 0;
  const subtotal = Math.round((tableCharge + ordersTotal) * 100) / 100;
  const discAmount = Number(discount) || 0;
  const grandTotal = Math.max(0, Math.round((subtotal - discAmount) * 100) / 100);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await onConfirm(table.tableNumber, {
        discount: discAmount,
        paymentMethod
      });
      
      setReceiptData({
        order: res.order,
        session: res.session
      });

      // Trigger confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}

    } catch (err) {
      alert(err.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-[#121319] border border-slate-200 dark:border-white/10 rounded-3xl w-full max-w-xl max-h-[90vh] my-auto flex flex-col overflow-hidden shadow-2xl text-slate-900 dark:text-white">
        
        {/* Sticky Header */}
        <div className="p-5 border-b border-slate-100 dark:border-white/[0.08] flex justify-between items-center bg-slate-50/80 dark:bg-[#181922]/90 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-extrabold">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Checkout & Receipt</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Table #{table.tableNumber} - {session.customerName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-white/[0.08]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {receiptData ? (
          /* COMPLETED CHECKOUT & RECEIPT VIEW */
          <div className="p-6 space-y-6 text-center overflow-y-auto flex-1">
            <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center mx-auto text-blue-600 dark:text-blue-400">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">Payment Received!</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                Customer No: <strong className="text-blue-600 dark:text-blue-400 font-mono">{session.customerNo}</strong>
              </p>
            </div>

            {/* Thermal Receipt Preview */}
            <div className="bg-slate-50 dark:bg-[#0d0e14] p-4 rounded-2xl border border-slate-200 dark:border-white/[0.08] flex justify-center">
              <ThermalReceipt order={receiptData.order} session={receiptData.session} />
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={handlePrint}
                className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3.5 px-4 rounded-2xl text-sm transition-all shadow-md shadow-blue-600/30"
              >
                <Printer className="w-4 h-4" />
                <span>Print Thermal Receipt</span>
              </button>

              <button
                onClick={onClose}
                className="px-6 py-3.5 bg-slate-100 dark:bg-[#181922] hover:bg-slate-200 text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-extrabold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          /* BILL REVIEW & CHECKOUT FORM */
          <div className="p-6 space-y-5 overflow-y-auto flex-1">

            {/* Automated Customer Badge */}
            <div className="bg-slate-50 dark:bg-[#0d0e14] p-4 rounded-2xl border border-slate-200 dark:border-white/[0.08] flex justify-between items-center text-xs">
              <span className="text-slate-600 dark:text-zinc-400 font-bold">Customer Sequence Tag:</span>
              <span className="font-mono font-black text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 px-3 py-1 rounded-xl">
                Customer No: {session.customerNo}
              </span>
            </div>

            {/* Itemized Calculation Summary */}
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-zinc-400">Bill Breakdown</h4>
              
              <div className="bg-slate-50 dark:bg-[#0d0e14] rounded-2xl p-4 border border-slate-200 dark:border-white/[0.08] space-y-2 text-xs">
                
                {/* Table Play Time */}
                <div className="flex justify-between items-center py-1 border-b border-slate-200 dark:border-white/[0.06]">
                  <div>
                    <div className="font-extrabold text-slate-900 dark:text-white">Table {table.tableNumber} Play Time</div>
                    <div className="text-[11px] text-slate-500 dark:text-zinc-400">
                      {session.startTimeFormatted} → Duration: {Math.floor((session.netElapsedSecs || 0) / 60)} mins (@ PKR {session.hourlyRate}/hr)
                    </div>
                  </div>
                  <span className="font-mono font-black text-slate-900 dark:text-white">PKR {tableCharge.toFixed(2)}</span>
                </div>

                {/* Attached Snacks List */}
                {session.orders && session.orders.length > 0 && (
                  <div className="py-1 border-b border-slate-200 dark:border-white/[0.06] space-y-1">
                    <div className="font-extrabold text-slate-500 dark:text-zinc-400 text-[11px]">Bar Items:</div>
                    {session.orders.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-slate-700 dark:text-zinc-300 font-bold">
                        <span>{item.name} (x{item.quantity})</span>
                        <span className="font-mono font-bold">PKR {(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Subtotal */}
                <div className="flex justify-between text-slate-900 dark:text-white font-black pt-1">
                  <span>Subtotal:</span>
                  <span className="font-mono">PKR {subtotal.toFixed(2)}</span>
                </div>

              </div>
            </div>

            {/* Discount Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-700 dark:text-zinc-300">Discount Amount (PKR):</label>
              <input
                type="number"
                min="0"
                step="5"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#0d0e14] border border-slate-200 dark:border-white/[0.08] rounded-2xl px-4 py-3 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-bold"
                placeholder="0.00"
              />
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-700 dark:text-zinc-300">Payment Method:</label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('CASH')}
                  className={`p-3 rounded-2xl border font-extrabold flex flex-col items-center justify-center space-y-1.5 transition-all ${
                    paymentMethod === 'CASH'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/30'
                      : 'bg-white dark:bg-[#181922] border-slate-200 dark:border-white/10 text-slate-800 dark:text-zinc-200 hover:border-blue-500'
                  }`}
                >
                  <Banknote className="w-5 h-5" />
                  <span>CASH</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('CARD')}
                  className={`p-3 rounded-2xl border font-extrabold flex flex-col items-center justify-center space-y-1.5 transition-all ${
                    paymentMethod === 'CARD'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/30'
                      : 'bg-white dark:bg-[#181922] border-slate-200 dark:border-white/10 text-slate-800 dark:text-zinc-200 hover:border-blue-500'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span>CARD</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('ONLINE')}
                  className={`p-3 rounded-2xl border font-extrabold flex flex-col items-center justify-center space-y-1.5 transition-all ${
                    paymentMethod === 'ONLINE'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/30'
                      : 'bg-white dark:bg-[#181922] border-slate-200 dark:border-white/10 text-slate-800 dark:text-zinc-200 hover:border-blue-500'
                  }`}
                >
                  <Smartphone className="w-5 h-5" />
                  <span>DIGITAL / QR</span>
                </button>
              </div>
            </div>

            {/* Grand Total Display & Submit */}
            <div className="pt-2 border-t border-slate-100 dark:border-white/[0.08] space-y-3">
              <div className="flex justify-between items-center bg-slate-50 dark:bg-[#0d0e14] p-4 rounded-2xl border border-slate-200 dark:border-white/[0.08]">
                <span className="text-sm font-extrabold text-slate-900 dark:text-white">Final Payable Amount:</span>
                <span className="font-mono text-2xl font-black text-blue-600 dark:text-blue-400">PKR {grandTotal.toFixed(2)}</span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-4 px-4 rounded-2xl text-sm shadow-md shadow-blue-600/30 transition-all active:scale-98 disabled:opacity-50"
              >
                <Zap className="w-5 h-5 fill-white" />
                <span>{loading ? 'Processing Checkout...' : 'Confirm Payment & Print Receipt'}</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
