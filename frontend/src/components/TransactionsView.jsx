'use client';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Receipt, Search, Printer, Trash2, RefreshCw } from 'lucide-react';
import { api } from '../lib/api';
import ThermalReceipt from './ThermalReceipt';

export default function TransactionsView() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const [resOrd, resStats] = await Promise.all([
        api.getOrders(),
        api.getDashboardStats()
      ]);
      setOrders(resOrd.data || []);
      setStats(resStats.data || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const handleDeleteOrder = (order) => {
    toast((t) => (
      <div>
        <p className="mb-2 font-semibold text-gray-900">Are you sure you want to delete sales record {order.orderNo} ({order.customerNo})? This action cannot be undone.</p>
        <div className="flex gap-2">
          <button 
            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                setDeletingId(order._id);
                const res = await api.deleteOrder(order._id);
                if (!res.success) {
                  throw new Error(res.error || 'Failed to delete order');
                }
                if (selectedOrder && selectedOrder._id === order._id) {
                  setSelectedOrder(null);
                }
                await loadTransactions();
              } catch (err) {
                toast.error(err.message || 'Failed to delete order');
              } finally {
                setDeletingId(null);
              }
            }}
          >
            Delete
          </button>
          <button 
            className="bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm hover:bg-gray-300"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: Infinity });
  };

  const filteredOrders = orders.filter(o => {
    const term = search.toLowerCase();
    return (
      o.orderNo?.toLowerCase().includes(term) ||
      o.customerNo?.toLowerCase().includes(term) ||
      o.customerName?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="posline-card p-5 bg-white dark:bg-[#121319] space-y-1">
          <div className="text-[10px] font-black text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Total Sales Revenue</div>
          <div className="text-2xl font-black font-mono text-blue-600 dark:text-blue-400">
            PKR {stats?.totalRevenue?.toFixed(2) || '0.00'}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-zinc-500 font-medium">All Completed Transactions</div>
        </div>

        <div className="posline-card p-5 bg-white dark:bg-[#121319] space-y-1">
          <div className="text-[10px] font-black text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Today's Revenue</div>
          <div className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400">
            PKR {stats?.todayRevenue?.toFixed(2) || '0.00'}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-zinc-500 font-medium">Today's Bar & Table Billing</div>
        </div>

        <div className="posline-card p-5 bg-white dark:bg-[#121319] space-y-1">
          <div className="text-[10px] font-black text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Total Orders Processed</div>
          <div className="text-2xl font-black font-mono text-cyan-600 dark:text-cyan-400">
            {stats?.totalTransactions || 0}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-zinc-500 font-medium">Automated Receipts Created</div>
        </div>

      </div>

      {/* Main Table & Filter */}
      <div className="posline-card p-6 bg-white dark:bg-[#121319] space-y-4">
        
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Sales & Receipt History</h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Searchable list of all completed table sessions and bar POS sales.</p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 dark:text-zinc-500 absolute left-3.5 top-2.5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Receipt / Customer No..."
                className="bg-slate-50 dark:bg-[#0d0e14] border border-slate-200 dark:border-white/[0.08] rounded-xl pl-10 pr-4 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 w-64 font-bold"
              />
            </div>

            <button
              onClick={loadTransactions}
              className="p-2 bg-slate-100 dark:bg-[#0d0e14] hover:bg-slate-200 dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-zinc-300 rounded-xl transition-colors"
              title="Refresh sales history"
            >
              <RefreshCw className={`w-4 h-4 text-blue-600 dark:text-blue-400 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-zinc-300">
            <thead className="bg-slate-100 dark:bg-[#0d0e14] text-slate-600 dark:text-zinc-400 uppercase text-[10px] font-black tracking-wider border-b border-slate-200 dark:border-white/[0.08]">
              <tr>
                <th className="p-3.5">Order No</th>
                <th className="p-3.5">Customer Sequence Tag</th>
                <th className="p-3.5">Type</th>
                <th className="p-3.5">Date / Time</th>
                <th className="p-3.5">Payment</th>
                <th className="p-3.5 text-right">Total Amount</th>
                <th className="p-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/[0.06]">
              {filteredOrders.length > 0 ? (
                filteredOrders.map(ord => (
                  <tr key={ord._id} className="hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors">
                    <td className="p-3.5 font-mono font-black text-slate-900 dark:text-white">{ord.orderNo}</td>
                    <td className="p-3.5">
                      <span className="font-mono font-extrabold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 px-2.5 py-1 rounded-xl">
                        {ord.customerNo}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2.5 py-1 rounded-xl font-extrabold text-[10px] uppercase ${
                        ord.type === 'TABLE_SESSION'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20'
                          : 'bg-blue-50 text-blue-800 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/20'
                      }`}>
                        {ord.type === 'TABLE_SESSION' ? `Table ${ord.tableNumber}` : 'Bar POS'}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-500 dark:text-zinc-400 font-mono text-[11px]">
                      {new Date(ord.createdAt || Date.now()).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td className="p-3.5 font-extrabold uppercase text-[10px] text-slate-700 dark:text-zinc-300">{ord.paymentMethod}</td>
                    <td className="p-3.5 text-right font-mono font-black text-blue-600 dark:text-blue-400 text-sm">
                      PKR {Number(ord.total).toFixed(2)}
                    </td>
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center space-x-1.5">
                        {/* Print Receipt Button */}
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="p-2 bg-slate-100 hover:bg-blue-600 hover:text-white dark:bg-[#0d0e14] border border-slate-200 dark:border-white/10 rounded-xl text-slate-600 dark:text-zinc-400 transition-colors shadow-xs"
                          title="View & Print Receipt"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                        {/* Delete Sales Record Button */}
                        <button
                          onClick={() => handleDeleteOrder(ord)}
                          disabled={deletingId === ord._id}
                          className="p-2 bg-slate-100 hover:bg-red-600 hover:text-white dark:bg-[#0d0e14] dark:hover:bg-red-600 border border-slate-200 dark:border-white/10 rounded-xl text-slate-400 hover:text-white dark:text-zinc-400 transition-colors shadow-xs disabled:opacity-50"
                          title="Delete sales record from history"
                        >
                          <Trash2 className={`w-4 h-4 ${deletingId === ord._id ? 'animate-spin' : ''}`} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400 dark:text-zinc-500 italic font-medium">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Receipt Viewer Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-[#121319] border border-slate-200 dark:border-white/10 rounded-3xl p-6 max-w-md w-full max-h-[90vh] my-auto flex flex-col overflow-hidden text-center text-slate-900 dark:text-white shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-white/[0.08] pb-3 shrink-0">
              <h3 className="text-base font-black">Receipt #{selectedOrder.orderNo}</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white">✕</button>
            </div>

            <div className="bg-slate-50 dark:bg-[#0d0e14] p-3 rounded-2xl border border-slate-200 dark:border-white/[0.08] flex justify-center overflow-y-auto flex-1 my-3">
              <ThermalReceipt order={selectedOrder} />
            </div>

            <div className="flex space-x-2 shrink-0 pt-1">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-2xl text-xs flex items-center justify-center space-x-2 shadow-md shadow-blue-600/30"
              >
                <Printer className="w-4 h-4" />
                <span>Print Receipt</span>
              </button>

              <button
                onClick={() => handleDeleteOrder(selectedOrder)}
                className="px-4 py-3 bg-red-50 hover:bg-red-600 hover:text-white text-red-600 dark:bg-red-500/10 dark:hover:bg-red-600 dark:text-red-300 border border-red-200 dark:border-red-500/20 rounded-2xl text-xs font-extrabold transition-colors flex items-center space-x-1"
                title="Delete this record"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>

              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-3 bg-slate-100 dark:bg-[#181922] text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 rounded-2xl text-xs font-extrabold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
