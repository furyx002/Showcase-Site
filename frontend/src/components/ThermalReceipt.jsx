import React from 'react';

export default function ThermalReceipt({ order, session }) {
  if (!order && !session) return null;

  const isSession = !!session;
  const customerNo = order?.customerNo || session?.customerNo || 'CUST-AUTO';
  const customerName = order?.customerName || session?.customerName || 'Walk-in Customer';
  const orderNo = order?.orderNo || `REC-${Date.now().toString().slice(-6)}`;
  const tableNumber = order?.tableNumber || session?.tableNumber;
  const items = order?.items || session?.orders || [];
  const paymentMethod = order?.paymentMethod || session?.paymentMethod || 'CASH';
  const subtotal = order?.subtotal ?? (session ? session.tableCharge + session.ordersTotal : 0);
  const discount = order?.discount ?? session?.discount ?? 0;
  const total = order?.total ?? session?.grandTotal ?? 0;

  const dateFormatted = new Date().toLocaleString([], {
    dateStyle: 'short',
    timeStyle: 'medium'
  });

  return (
    <div id="printable-receipt" className="p-4 bg-white text-black font-mono text-xs max-w-[300px] mx-auto border border-gray-300 rounded shadow-sm">
      {/* Club Header from Poster */}
      <div className="text-center pb-2 border-b border-dashed border-gray-400">
        <h1 className="text-lg font-bold tracking-wider uppercase">RF SNOOKER CLUB</h1>
        <p className="text-[10px] text-gray-600">& GAMING ZONE</p>
        <p className="text-[10px] text-gray-500">Official Thermal POS Receipt</p>
      </div>

      {/* Ticket / Order Metadata */}
      <div className="py-2 border-b border-dashed border-gray-400 text-[11px] space-y-1">
        <div className="flex justify-between">
          <span className="font-semibold">CUSTOMER NO:</span>
          <span className="font-bold border border-black px-1">{customerNo}</span>
        </div>
        <div className="flex justify-between">
          <span>Customer:</span>
          <span>{customerName}</span>
        </div>
        <div className="flex justify-between">
          <span>Receipt No:</span>
          <span>{orderNo}</span>
        </div>
        {tableNumber && (
          <div className="flex justify-between font-bold">
            <span>Table:</span>
            <span>Table #{tableNumber}</span>
          </div>
        )}
        <div className="flex justify-between text-gray-600 text-[10px]">
          <span>Date/Time:</span>
          <span>{dateFormatted}</span>
        </div>
      </div>

      {/* Session Time Details if applicable */}
      {isSession && (
        <div className="py-2 border-b border-dashed border-gray-400 text-[10px] space-y-0.5 bg-gray-50 p-1.5 rounded">
          <div className="flex justify-between">
            <span>Billing Choice:</span>
            <span className="font-bold">{session.billingMode === 'PER_GAME' ? `Per Game (${session.ballType} - ${session.playerMode === 'DOUBLE' ? 'Double (4P)' : 'Single (2P)'})` : `Per Minute (PKR ${session.perMinuteRate || 10}/min)`}</span>
          </div>

          <div className="flex justify-between">
            <span>Start Time:</span>
            <span>{session.startTimeFormatted || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span>Duration Played:</span>
            <span className="font-bold">{Math.floor((session.netElapsedSecs || 0) / 60)} mins</span>
          </div>
        </div>
      )}

      {/* Items Breakdown Table */}
      <div className="py-2 border-b border-dashed border-gray-400">
        <div className="flex justify-between font-bold pb-1 text-[11px] border-b border-gray-200">
          <span>ITEM</span>
          <span>QTY x PRICE</span>
          <span>AMT</span>
        </div>
        <div className="space-y-1 pt-1">
          {items.map((item, idx) => (
            <div key={idx} className="flex justify-between text-[10px]">
              <span className="truncate max-w-[130px]">{item.name}</span>
              <span>{item.quantity} x PKR {Number(item.price).toFixed(2)}</span>
              <span className="font-semibold">PKR {(item.quantity * Number(item.price)).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Totals & Payment */}
      <div className="py-2 space-y-1 text-[11px]">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>PKR {Number(subtotal).toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-red-600">
            <span>Discount:</span>
            <span>-PKR {Number(discount).toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-sm pt-1 border-t border-black">
          <span>GRAND TOTAL:</span>
          <span>PKR {Number(total).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-[10px] pt-1 text-gray-600">
          <span>Payment Method:</span>
          <span className="font-bold uppercase">{paymentMethod}</span>
        </div>
      </div>

      {/* Footer / Barcode */}
      <div className="text-center pt-3 border-t border-dashed border-gray-400 space-y-1">
        <p className="text-[10px] font-semibold">Thank you for visiting RF SNOOKER CLUB!</p>
        <div className="pt-2 font-barcode text-center text-xs tracking-widest font-mono select-none">
          ||||| ||| ||||||| |||| ||||| ||||
        </div>
        <p className="text-[8px] text-gray-400">{customerNo}</p>
      </div>
    </div>
  );
}
