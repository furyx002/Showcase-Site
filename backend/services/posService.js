const Table = require('../models/Table');
const Session = require('../models/Session');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Counter = require('../models/Counter');
const Category = require('../models/Category');
const { getIsConnected } = require('../config/db');

// --- Rate List Matrix based on MM Snooker Club Poster ---
const RATE_MATRIX = {
  // Table 1: Table 6x12 & Gaming Zone
  1: {
    name: 'Table 1 - 6×12 Championship',
    tableType: '6x12',
    rates: {
      '15_BALL': { SINGLE: 200, DOUBLE: 400 },
      '10_BALL': { SINGLE: 120, DOUBLE: 240 },
      '06_BALL': { SINGLE: 100, DOUBLE: 200 }
    },
    perMinuteRate: 10,
    hourlyRate: 600
  },
  // Table 2: Table 5x10
  2: {
    name: 'Table 2 - 5×10 Green Table',
    tableType: '5x10',
    rates: {
      '15_BALL': { SINGLE: 130, DOUBLE: 260 },
      '10_BALL': { SINGLE: 80, DOUBLE: 160 },
      '06_BALL': { SINGLE: 70, DOUBLE: 140 }
    },
    perMinuteRate: 10,
    hourlyRate: 500
  },
  // Table 3: Private Room & Billiard Zone
  3: {
    name: 'Table 3 - Private Room / Billiard',
    tableType: 'PRIVATE_BILLIARD',
    rates: {
      'BILLIARD': { SINGLE: 50, DOUBLE: 100 },
      '15_BALL': { SINGLE: 200, DOUBLE: 400 },
      '10_BALL': { SINGLE: 120, DOUBLE: 240 },
      '06_BALL': { SINGLE: 100, DOUBLE: 200 }
    },
    perMinuteRate: 15, // Non-AC Rs 15/min, AC Rs 18/min
    hourlyRate: 1200   // Private room Rs 1200/hr
  }
};

let memoryCounter = 1000;
let memoryOrderCounter = 1000;

let memoryTables = [
  { _id: 't1', tableNumber: 1, name: 'Table 1 - 6×12 Championship', hourlyRate: 600, perMinuteRate: 10, status: 'AVAILABLE', currentSessionId: null },
  { _id: 't2', tableNumber: 2, name: 'Table 2 - 5×10 Green Table', hourlyRate: 500, perMinuteRate: 10, status: 'AVAILABLE', currentSessionId: null },
  { _id: 't3', tableNumber: 3, name: 'Table 3 - Private Room / Billiard', hourlyRate: 1200, perMinuteRate: 15, status: 'AVAILABLE', currentSessionId: null }
];

let memorySessions = [];
let memoryOrders = [];

let memoryProducts = [
  { _id: 'p1', name: 'Premium Ceramic Wash Basin', category: 'Wash Basins', price: 15000, stock: 20, isAvailable: true, images: ['/demo_basin.png', '/demo_basin_alt.png'] },
  { _id: 'p2', name: 'Pedestal Wash Basin', category: 'Wash Basins', price: 12000, stock: 15, isAvailable: true, images: ['/demo_pedestal.png', '/demo_pedestal_alt.png'] },
  { _id: 'p3', name: 'One-Piece Commode (White)', category: 'Toilets', price: 35000, stock: 10, isAvailable: true, images: ['/demo_commode.png', '/demo_commode_alt.png'] },
  { _id: 'p4', name: 'Wall-Hung Commode', category: 'Toilets', price: 42000, stock: 8, isAvailable: true, images: ['/demo_wall_commode.png'] },
  { _id: 'p5', name: 'Shower Panel System', category: 'Showers', price: 25000, stock: 12, isAvailable: true, images: ['/demo_shower.png', '/demo_shower_alt.png'] },
  { _id: 'p6', name: 'Chrome Faucet Mixer', category: 'Faucets', price: 5000, stock: 50, isAvailable: true, images: ['/demo_faucet.png', '/demo_faucet_alt.png'] },
  { _id: 'p7', name: 'Stainless Steel Kitchen Sink', category: 'Kitchen Sinks', price: 8500, stock: 30, isAvailable: true, images: ['/demo_sink.png'] },
  { _id: 'p8', name: 'Bathroom Mirror Cabinet', category: 'Accessories', price: 9000, stock: 25, isAvailable: true, images: ['/demo_mirror.png'] }
];

let memoryCategories = [
  { _id: 'c1', title: 'FAUCETS & MIXERS', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=1000', span: 'col-span-1 lg:col-span-2 row-span-2' },
  { _id: 'c2', title: 'MUSLIM SHOWER\n& HOSES', image: 'https://images.unsplash.com/photo-1585058178306-03c00cb571d8?auto=format&fit=crop&q=80&w=600', span: 'col-span-1 row-span-1' },
  { _id: 'c3', title: 'RAIN SHOWERS', image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&q=80&w=600', span: 'col-span-1 row-span-1' },
  { _id: 'c4', title: 'PLUMBING\nESSENTIALS', image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=600', span: 'col-span-1 lg:col-span-2 row-span-1' },
  { _id: 'c5', title: 'BATHROOM\nACCESSORIES', image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&q=80&w=600', span: 'col-span-1 row-span-1' },
  { _id: 'c6', title: 'KITCHEN\nSINKS', image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=600', span: 'col-span-1 row-span-1' }
];

// Helper: Seed initial products & tables if MongoDB is connected
async function initDatabase() {
  if (!getIsConnected()) return;
  try {
    const tableCount = await Table.countDocuments();
    if (tableCount === 0) {
      await Table.insertMany([
        { tableNumber: 1, name: 'Table 1 - 6×12 Championship', hourlyRate: 600, status: 'AVAILABLE' },
        { tableNumber: 2, name: 'Table 2 - 5×10 Green Table', hourlyRate: 500, status: 'AVAILABLE' },
        { tableNumber: 3, name: 'Table 3 - Private Room / Billiard', hourlyRate: 1200, status: 'AVAILABLE' }
      ]);
      console.log('[DB Init] Inserted 3 Tables');
    }

    const prodCount = await Product.countDocuments();
    if (prodCount === 0) {
      await Product.insertMany(memoryProducts.map(p => ({
        name: p.name, category: p.category, price: p.price, stock: p.stock, isAvailable: p.isAvailable, images: p.images || []
      })));
      console.log('[DB Init] Inserted default Sanitary Products');
    }

    const catCount = await Category.countDocuments();
    if (catCount === 0) {
      await Category.insertMany(memoryCategories.map(c => ({
        title: c.title, image: c.image, span: c.span
      })));
      console.log('[DB Init] Inserted default Categories');
    }
  } catch (err) {
    console.error('[DB Init Error]', err.message);
  }
}

// 1. Automated Customer Number Sequence Generator
async function generateCustomerNo() {
  if (getIsConnected()) {
    try {
      const counter = await Counter.findOneAndUpdate(
        { id: 'customerNo' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      return `CUST-${counter.seq}`;
    } catch (e) {
      console.warn('Fallback sequence due to DB error');
    }
  }
  memoryCounter += 1;
  return `CUST-${memoryCounter}`;
}

// Automated Order Number Generator
async function generateOrderNo() {
  if (getIsConnected()) {
    try {
      const counter = await Counter.findOneAndUpdate(
        { id: 'orderNo' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      return `ORD-${counter.seq}`;
    } catch (e) {}
  }
  memoryOrderCounter += 1;
  return `ORD-${memoryOrderCounter}`;
}

// 2. Real-Time Session Billing & Expiration Calculator
function calculateSessionMetrics(session) {
  if (!session) return null;

  const now = Date.now();
  const startTimeMs = new Date(session.startTime).getTime();
  let pausedSecs = session.pausedTotalSeconds || 0;

  if (session.status === 'PAUSED' && session.lastPausedAt) {
    const currentPauseDuration = Math.floor((now - new Date(session.lastPausedAt).getTime()) / 1000);
    pausedSecs += Math.max(0, currentPauseDuration);
  }

  let rawElapsedSecs = Math.floor((now - startTimeMs) / 1000);
  if (session.status === 'COMPLETED' && session.endTime) {
    rawElapsedSecs = Math.floor((new Date(session.endTime).getTime() - startTimeMs) / 1000);
  }

  const netElapsedSecs = Math.max(0, rawElapsedSecs - pausedSecs);
  
  const limitMins = session.timeLimitMinutes || 0;
  const limitSecs = limitMins * 60;
  const hasLimit = limitMins > 0;
  
  let isExpired = false;
  let remainingSecs = 0;
  let overtimeSecs = 0;

  if (hasLimit) {
    if (netElapsedSecs >= limitSecs && session.status !== 'COMPLETED') {
      isExpired = true;
      overtimeSecs = netElapsedSecs - limitSecs;
      remainingSecs = 0;
    } else {
      remainingSecs = limitSecs - netElapsedSecs;
    }
  }

  // --- BILLING CALCULATIONS FOR TWO CHOICES ---
  // Choice 1: PER_GAME (Ball-based fixed fee for Single / Double)
  // Choice 2: PER_MINUTE (Per minute fee or per hour rate)
  let tableCharge = 0;
  const billingMode = session.billingMode || 'PER_MINUTE';
  const playerMode = session.playerMode || 'SINGLE';
  const ballType = session.ballType || '15_BALL';

  if (billingMode === 'PER_GAME') {
    // If fixed rate explicit, use it, else lookup matrix
    if (session.fixedGameRate && session.fixedGameRate > 0) {
      tableCharge = session.fixedGameRate;
    } else {
      const tblConfig = RATE_MATRIX[session.tableNumber] || RATE_MATRIX[1];
      const ballRates = tblConfig.rates[ballType] || tblConfig.rates['15_BALL'];
      tableCharge = ballRates ? (ballRates[playerMode] || 150) : 150;
    }
  } else {
    // PER_MINUTE mode calculation: (netElapsedSecs / 60) * perMinuteRate
    const minRate = session.perMinuteRate || 10; // Rs 10/min default
    const netMins = netElapsedSecs / 60;
    tableCharge = Math.round(netMins * minRate * 100) / 100;
  }

  const ordersList = session.orders || [];
  const ordersTotal = ordersList.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const grandTotal = Math.round((tableCharge + ordersTotal) * 100) / 100;

  const startTimeFormatted = new Date(session.startTime).toLocaleTimeString([], {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
  });

  return {
    ...session.toObject ? session.toObject() : session,
    startTimeFormatted,
    netElapsedSecs,
    pausedTotalSeconds: pausedSecs,
    timeLimitMinutes: limitMins,
    timeLimitSeconds: limitSecs,
    hasLimit,
    isExpired,
    remainingSecs,
    overtimeSecs,
    billingMode,
    playerMode,
    ballType,
    tableCharge,
    ordersTotal,
    grandTotal
  };
}


// Service API Actions
const posService = {
  initDatabase,
  generateCustomerNo,
  generateOrderNo,

  // Get status of all 3 tables with active session calculations
  async getTables() {
    let tablesList = [];
    if (getIsConnected()) {
      try {
        tablesList = await Table.find().sort({ tableNumber: 1 }).lean();
      } catch (err) {
        tablesList = memoryTables;
      }
    } else {
      tablesList = memoryTables;
    }

    // Attach active session calculation for each table
    const result = await Promise.all(tablesList.map(async (tbl) => {
      let activeSession = null;
      if (tbl.currentSessionId) {
        if (getIsConnected()) {
          try {
            const sess = await Session.findById(tbl.currentSessionId);
            if (sess && (sess.status === 'ACTIVE' || sess.status === 'PAUSED')) {
              activeSession = calculateSessionMetrics(sess);
            }
          } catch (e) {}
        }
        if (!activeSession) {
          const sess = memorySessions.find(s => s._id.toString() === tbl.currentSessionId.toString() && (s.status === 'ACTIVE' || s.status === 'PAUSED'));
          if (sess) activeSession = calculateSessionMetrics(sess);
        }
      }

      return {
        ...tbl,
        activeSession
      };
    }));

    return result;
  },

  // Start a new game session on tableNumber (1, 2, or 3)
  async startSession({ tableNumber, customerName, timeLimitMinutes, billingMode, playerMode, ballType, fixedGameRate, perMinuteRate, hourlyRate }) {
    const custNo = await generateCustomerNo();
    tableNumber = Number(tableNumber);

    let sessionObj = {
      tableNumber,
      customerNo: custNo,
      customerName: customerName || `Customer (${custNo})`,
      startTime: new Date(),
      timeLimitMinutes: Number(timeLimitMinutes) || 0,
      pausedTotalSeconds: 0,
      lastPausedAt: null,
      status: 'ACTIVE',
      billingMode: billingMode || 'PER_MINUTE',
      playerMode: playerMode || 'SINGLE',
      ballType: ballType || '15_BALL',
      fixedGameRate: Number(fixedGameRate) || 0,
      perMinuteRate: Number(perMinuteRate) || 10,
      hourlyRate: Number(hourlyRate) || 600,
      orders: []
    };

    let newSession = null;

    if (getIsConnected()) {
      try {
        const created = await Session.create(sessionObj);
        newSession = created;
        await Table.findOneAndUpdate(
          { tableNumber },
          { status: 'OCCUPIED', currentSessionId: created._id }
        );
      } catch (err) {
        console.warn('Fallback to memory for startSession');
      }
    }

    if (!newSession) {
      sessionObj._id = `sess_${Date.now()}`;
      memorySessions.push(sessionObj);
      newSession = sessionObj;

      const memTbl = memoryTables.find(t => t.tableNumber === tableNumber);
      if (memTbl) {
        memTbl.status = 'OCCUPIED';
        memTbl.currentSessionId = sessionObj._id;
      }
    }

    return calculateSessionMetrics(newSession);
  },


  // Pause session
  async pauseSession(tableNumber) {
    const now = new Date();
    let updatedSession = null;

    if (getIsConnected()) {
      try {
        const tbl = await Table.findOne({ tableNumber: Number(tableNumber) });
        if (tbl && tbl.currentSessionId) {
          const sess = await Session.findById(tbl.currentSessionId);
          if (sess && sess.status === 'ACTIVE') {
            sess.status = 'PAUSED';
            sess.lastPausedAt = now;
            await sess.save();
            tbl.status = 'PAUSED';
            await tbl.save();
            updatedSession = sess;
          }
        }
      } catch (e) {}
    }

    if (!updatedSession) {
      const memTbl = memoryTables.find(t => t.tableNumber === Number(tableNumber));
      if (memTbl && memTbl.currentSessionId) {
        const sess = memorySessions.find(s => s._id === memTbl.currentSessionId);
        if (sess && sess.status === 'ACTIVE') {
          sess.status = 'PAUSED';
          sess.lastPausedAt = now;
          memTbl.status = 'PAUSED';
          updatedSession = sess;
        }
      }
    }

    return calculateSessionMetrics(updatedSession);
  },

  // Resume session
  async resumeSession(tableNumber) {
    const now = new Date();
    let updatedSession = null;

    if (getIsConnected()) {
      try {
        const tbl = await Table.findOne({ tableNumber: Number(tableNumber) });
        if (tbl && tbl.currentSessionId) {
          const sess = await Session.findById(tbl.currentSessionId);
          if (sess && sess.status === 'PAUSED') {
            const pauseSecs = sess.lastPausedAt ? Math.floor((now.getTime() - new Date(sess.lastPausedAt).getTime()) / 1000) : 0;
            sess.pausedTotalSeconds = (sess.pausedTotalSeconds || 0) + Math.max(0, pauseSecs);
            sess.lastPausedAt = null;
            sess.status = 'ACTIVE';
            await sess.save();

            tbl.status = 'OCCUPIED';
            await tbl.save();
            updatedSession = sess;
          }
        }
      } catch (e) {}
    }

    if (!updatedSession) {
      const memTbl = memoryTables.find(t => t.tableNumber === Number(tableNumber));
      if (memTbl && memTbl.currentSessionId) {
        const sess = memorySessions.find(s => s._id === memTbl.currentSessionId);
        if (sess && sess.status === 'PAUSED') {
          const pauseSecs = sess.lastPausedAt ? Math.floor((now.getTime() - new Date(sess.lastPausedAt).getTime()) / 1000) : 0;
          sess.pausedTotalSeconds = (sess.pausedTotalSeconds || 0) + Math.max(0, pauseSecs);
          sess.lastPausedAt = null;
          sess.status = 'ACTIVE';
          memTbl.status = 'OCCUPIED';
          updatedSession = sess;
        }
      }
    }

    return calculateSessionMetrics(updatedSession);
  },

  // Update session time limit dynamically
  async updateTimeLimit(tableNumber, newLimitMinutes) {
    let updatedSession = null;
    if (getIsConnected()) {
      try {
        const tbl = await Table.findOne({ tableNumber: Number(tableNumber) });
        if (tbl && tbl.currentSessionId) {
          const sess = await Session.findById(tbl.currentSessionId);
          if (sess) {
            sess.timeLimitMinutes = Number(newLimitMinutes) || 0;
            await sess.save();
            updatedSession = sess;
          }
        }
      } catch (e) {}
    }

    if (!updatedSession) {
      const memTbl = memoryTables.find(t => t.tableNumber === Number(tableNumber));
      if (memTbl && memTbl.currentSessionId) {
        const sess = memorySessions.find(s => s._id === memTbl.currentSessionId);
        if (sess) {
          sess.timeLimitMinutes = Number(newLimitMinutes) || 0;
          updatedSession = sess;
        }
      }
    }

    return calculateSessionMetrics(updatedSession);
  },

  // Add Item / Snack to Table Session
  async addItemToSession(tableNumber, item) {
    let updatedSession = null;
    const orderItem = {
      productId: item.productId || item._id,
      name: item.name,
      price: Number(item.price),
      quantity: Number(item.quantity) || 1,
      addedAt: new Date()
    };

    if (getIsConnected()) {
      try {
        const tbl = await Table.findOne({ tableNumber: Number(tableNumber) });
        if (tbl && tbl.currentSessionId) {
          const sess = await Session.findById(tbl.currentSessionId);
          if (sess) {
            // Check if item already exists in orders list
            const existingIdx = sess.orders.findIndex(o => o.name === item.name);
            if (existingIdx >= 0) {
              sess.orders[existingIdx].quantity += orderItem.quantity;
            } else {
              sess.orders.push(orderItem);
            }
            await sess.save();
            updatedSession = sess;
          }
        }
      } catch (e) {}
    }

    if (!updatedSession) {
      const memTbl = memoryTables.find(t => t.tableNumber === Number(tableNumber));
      if (memTbl && memTbl.currentSessionId) {
        const sess = memorySessions.find(s => s._id === memTbl.currentSessionId);
        if (sess) {
          const existingIdx = sess.orders.findIndex(o => o.name === item.name);
          if (existingIdx >= 0) {
            sess.orders[existingIdx].quantity += orderItem.quantity;
          } else {
            sess.orders.push(orderItem);
          }
          updatedSession = sess;
        }
      }
    }

    return calculateSessionMetrics(updatedSession);
  },

  // Transfer Active Session from one table to another (e.g., Table 1 -> Table 2)
  async transferSession(fromTableNumber, toTableNumber) {
    fromTableNumber = Number(fromTableNumber);
    toTableNumber = Number(toTableNumber);

    if (fromTableNumber === toTableNumber) {
      throw new Error('Source and target tables must be different');
    }

    let sessionToMove = null;

    if (getIsConnected()) {
      try {
        const targetTbl = await Table.findOne({ tableNumber: toTableNumber });
        if (targetTbl.status !== 'AVAILABLE') {
          throw new Error(`Target Table ${toTableNumber} is currently occupied.`);
        }

        const sourceTbl = await Table.findOne({ tableNumber: fromTableNumber });
        if (!sourceTbl || !sourceTbl.currentSessionId) {
          throw new Error(`Source Table ${fromTableNumber} has no active session.`);
        }

        const sess = await Session.findById(sourceTbl.currentSessionId);
        sess.tableNumber = toTableNumber;
        await sess.save();

        targetTbl.status = sourceTbl.status;
        targetTbl.currentSessionId = sess._id;
        await targetTbl.save();

        sourceTbl.status = 'AVAILABLE';
        sourceTbl.currentSessionId = null;
        await sourceTbl.save();

        sessionToMove = sess;
      } catch (e) {
        if (e.message.includes('occupied') || e.message.includes('active session')) throw e;
      }
    }

    if (!sessionToMove) {
      const targetTbl = memoryTables.find(t => t.tableNumber === toTableNumber);
      if (targetTbl.status !== 'AVAILABLE') {
        throw new Error(`Target Table ${toTableNumber} is currently occupied.`);
      }

      const sourceTbl = memoryTables.find(t => t.tableNumber === fromTableNumber);
      if (!sourceTbl || !sourceTbl.currentSessionId) {
        throw new Error(`Source Table ${fromTableNumber} has no active session.`);
      }

      const sess = memorySessions.find(s => s._id === sourceTbl.currentSessionId);
      sess.tableNumber = toTableNumber;

      targetTbl.status = sourceTbl.status;
      targetTbl.currentSessionId = sess._id;

      sourceTbl.status = 'AVAILABLE';
      sourceTbl.currentSessionId = null;

      sessionToMove = sess;
    }

    return calculateSessionMetrics(sessionToMove);
  },

  // Checkout / End Session & Generate Final Bill & Order Receipt
  async checkoutSession(tableNumber, { discount = 0, paymentMethod = 'CASH' }) {
    tableNumber = Number(tableNumber);
    let session = null;
    let completedOrder = null;

    // Get current session object
    let rawSession = null;
    let tblObj = null;

    if (getIsConnected()) {
      try {
        tblObj = await Table.findOne({ tableNumber });
        if (tblObj && tblObj.currentSessionId) {
          rawSession = await Session.findById(tblObj.currentSessionId);
        }
      } catch (e) {}
    }

    if (!rawSession) {
      tblObj = memoryTables.find(t => t.tableNumber === tableNumber);
      if (tblObj && tblObj.currentSessionId) {
        rawSession = memorySessions.find(s => s._id === tblObj.currentSessionId);
      }
    }

    if (!rawSession) {
      throw new Error(`No active session found for Table ${tableNumber}`);
    }

    // Calculate final time & amounts
    const metrics = calculateSessionMetrics(rawSession);
    const endTime = new Date();
    const finalTableCharge = metrics.tableCharge;
    const finalOrdersTotal = metrics.ordersTotal;
    const subtotal = Math.round((finalTableCharge + finalOrdersTotal) * 100) / 100;
    const discAmount = Number(discount) || 0;
    const finalGrandTotal = Math.max(0, Math.round((subtotal - discAmount) * 100) / 100);

    const orderNo = await generateOrderNo();

    // Create Order items representation (Table play time + Bar items)
    const items = [
      {
        productId: 'table_time',
        name: `Snooker Table ${tableNumber} Time (${Math.floor(metrics.netElapsedSecs / 60)} mins @ $${metrics.hourlyRate}/hr)`,
        price: finalTableCharge,
        quantity: 1
      },
      ...metrics.orders.map(o => ({
        productId: o.productId,
        name: o.name,
        price: o.price,
        quantity: o.quantity
      }))
    ];

    const orderPayload = {
      orderNo,
      customerNo: metrics.customerNo,
      customerName: metrics.customerName,
      type: 'TABLE_SESSION',
      tableNumber,
      sessionId: metrics._id,
      items,
      subtotal,
      discount: discAmount,
      total: finalGrandTotal,
      paymentMethod,
      status: 'PAID'
    };

    if (getIsConnected()) {
      try {
        // Update session
        rawSession.endTime = endTime;
        rawSession.status = 'COMPLETED';
        rawSession.tableCharge = finalTableCharge;
        rawSession.ordersTotal = finalOrdersTotal;
        rawSession.discount = discAmount;
        rawSession.grandTotal = finalGrandTotal;
        rawSession.paymentMethod = paymentMethod;
        await rawSession.save();

        // Release Table
        tblObj.status = 'AVAILABLE';
        tblObj.currentSessionId = null;
        await tblObj.save();

        // Save order
        completedOrder = await Order.create(orderPayload);
      } catch (e) {
        console.warn('DB error during checkout, relying on fallback');
      }
    }

    if (!completedOrder) {
      rawSession.endTime = endTime;
      rawSession.status = 'COMPLETED';
      rawSession.tableCharge = finalTableCharge;
      rawSession.ordersTotal = finalOrdersTotal;
      rawSession.discount = discAmount;
      rawSession.grandTotal = finalGrandTotal;
      rawSession.paymentMethod = paymentMethod;

      tblObj.status = 'AVAILABLE';
      tblObj.currentSessionId = null;

      orderPayload._id = `ord_${Date.now()}`;
      memoryOrders.push(orderPayload);
      completedOrder = orderPayload;
    }

    return {
      session: calculateSessionMetrics(rawSession),
      order: completedOrder
    };
  },

  // Direct Bar POS Quick Sale
  async createDirectOrder({ items, customerName, discount = 0, paymentMethod = 'CASH' }) {
    const custNo = await generateCustomerNo();
    const orderNo = await generateOrderNo();

    const subtotal = items.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)), 0);
    const disc = Number(discount) || 0;
    const total = Math.max(0, Math.round((subtotal - disc) * 100) / 100);

    const orderPayload = {
      orderNo,
      customerNo: custNo,
      customerName: customerName || `Walk-in (${custNo})`,
      type: 'DIRECT_POS',
      items: items.map(i => ({
        productId: i.productId || i._id,
        name: i.name,
        price: Number(i.price),
        quantity: Number(i.quantity)
      })),
      subtotal,
      discount: disc,
      total,
      paymentMethod,
      status: 'PAID'
    };

    let newOrder = null;
    if (getIsConnected()) {
      try {
        newOrder = await Order.create(orderPayload);
      } catch (e) {}
    }

    if (!newOrder) {
      orderPayload._id = `ord_${Date.now()}`;
      memoryOrders.push(orderPayload);
      newOrder = orderPayload;
    }

    return newOrder;
  },

  // Edit Table Configuration (Name, Hourly Rate, Per Minute Rate, and Ball/Player Rates)
  async updateTableConfig(tableNumber, { name, hourlyRate, perMinuteRate, rates }) {
    tableNumber = Number(tableNumber);

    const updatePayload = {};
    if (name) updatePayload.name = name;
    if (hourlyRate !== undefined) updatePayload.hourlyRate = Number(hourlyRate);
    if (perMinuteRate !== undefined) updatePayload.perMinuteRate = Number(perMinuteRate);
    if (rates) updatePayload.rates = rates;

    let updated = null;
    if (getIsConnected()) {
      try {
        updated = await Table.findOneAndUpdate(
          { tableNumber },
          updatePayload,
          { new: true }
        );
      } catch (e) {}
    }

    if (!updated) {
      const memTbl = memoryTables.find(t => t.tableNumber === tableNumber);
      if (memTbl) {
        if (name) memTbl.name = name;
        if (hourlyRate !== undefined) memTbl.hourlyRate = Number(hourlyRate);
        if (perMinuteRate !== undefined) memTbl.perMinuteRate = Number(perMinuteRate);
        if (rates) memTbl.rates = { ...(memTbl.rates || {}), ...rates };
        updated = memTbl;
      }
    }

    return updated;
  },


  // Edit Active Session details (Customer Name, Start Time, Time Limit)
  async updateSessionDetails(tableNumber, { customerName, startTime, timeLimitMinutes }) {
    tableNumber = Number(tableNumber);
    let updatedSession = null;

    if (getIsConnected()) {
      try {
        const tbl = await Table.findOne({ tableNumber });
        if (tbl && tbl.currentSessionId) {
          const sess = await Session.findById(tbl.currentSessionId);
          if (sess) {
            if (customerName !== undefined) sess.customerName = customerName;
            if (startTime) sess.startTime = new Date(startTime);
            if (timeLimitMinutes !== undefined) sess.timeLimitMinutes = Number(timeLimitMinutes);
            await sess.save();
            updatedSession = sess;
          }
        }
      } catch (e) {}
    }

    if (!updatedSession) {
      const memTbl = memoryTables.find(t => t.tableNumber === tableNumber);
      if (memTbl && memTbl.currentSessionId) {
        const sess = memorySessions.find(s => s._id === memTbl.currentSessionId);
        if (sess) {
          if (customerName !== undefined) sess.customerName = customerName;
          if (startTime) sess.startTime = new Date(startTime);
          if (timeLimitMinutes !== undefined) sess.timeLimitMinutes = Number(timeLimitMinutes);
          updatedSession = sess;
        }
      }
    }

    return calculateSessionMetrics(updatedSession);
  },

  // Edit or Delete an item attached to active table session tab
  async updateSessionOrderItem(tableNumber, itemIndex, { quantity }) {
    tableNumber = Number(tableNumber);
    itemIndex = Number(itemIndex);
    let updatedSession = null;

    if (getIsConnected()) {
      try {
        const tbl = await Table.findOne({ tableNumber });
        if (tbl && tbl.currentSessionId) {
          const sess = await Session.findById(tbl.currentSessionId);
          if (sess && sess.orders[itemIndex]) {
            if (quantity <= 0) {
              sess.orders.splice(itemIndex, 1);
            } else {
              sess.orders[itemIndex].quantity = Number(quantity);
            }
            await sess.save();
            updatedSession = sess;
          }
        }
      } catch (e) {}
    }

    if (!updatedSession) {
      const memTbl = memoryTables.find(t => t.tableNumber === tableNumber);
      if (memTbl && memTbl.currentSessionId) {
        const sess = memorySessions.find(s => s._id === memTbl.currentSessionId);
        if (sess && sess.orders[itemIndex]) {
          if (quantity <= 0) {
            sess.orders.splice(itemIndex, 1);
          } else {
            sess.orders[itemIndex].quantity = Number(quantity);
          }
          updatedSession = sess;
        }
      }
    }

    return calculateSessionMetrics(updatedSession);
  },

  // Delete product from catalog
  async deleteProduct(productId) {
    if (getIsConnected()) {
      try {
        await Product.findByIdAndDelete(productId);
      } catch (e) {}
    }
    memoryProducts = memoryProducts.filter(p => p._id !== productId && p.id !== productId);
    return { success: true };
  },

  // Get Products Catalog
  async getProducts() {
    if (getIsConnected()) {
      try {
        const prods = await Product.find({ isAvailable: true }).lean();
        if (prods.length > 0) return prods;
      } catch (e) {}
    }
    return memoryProducts;
  },

  // Create or update Product
  async saveProduct(productData) {
    if (getIsConnected()) {
      try {
        if (productData._id) {
          return await Product.findByIdAndUpdate(productData._id, productData, { new: true });
        } else {
          return await Product.create(productData);
        }
      } catch (e) {}
    }
    if (productData._id) {
      const idx = memoryProducts.findIndex(p => p._id === productData._id);
      if (idx >= 0) {
        memoryProducts[idx] = { ...memoryProducts[idx], ...productData };
        return memoryProducts[idx];
      }
    }
    const newProd = { _id: `p_${Date.now()}`, ...productData };
    memoryProducts.push(newProd);
    return newProd;
  },

  // Get Transaction / Orders History
  async getOrders() {
    if (getIsConnected()) {
      try {
        const orders = await Order.find().sort({ createdAt: -1 }).lean();
        return orders;
      } catch (e) {}
    }
    return [...memoryOrders].reverse();
  },

  // Delete transaction from sales history
  async deleteOrder(orderId) {
    if (getIsConnected()) {
      try {
        await Order.findByIdAndDelete(orderId);
      } catch (e) {}
    }
    memoryOrders = memoryOrders.filter(o => o._id !== orderId && o.id !== orderId);
    return { success: true };
  },

  // Get Dashboard Analytics Summary
  async getDashboardStats() {
    const tables = await this.getTables();
    const orders = await this.getOrders();

    const activeTablesCount = tables.filter(t => t.status === 'OCCUPIED' || t.status === 'PAUSED').length;
    const availableTablesCount = 3 - activeTablesCount;

    const totalRevenue = orders.reduce((sum, ord) => sum + (ord.total || 0), 0);
    const totalTransactions = orders.length;

    // Daily revenue calculation
    const todayStr = new Date().toISOString().split('T')[0];
    const todayOrders = orders.filter(o => {
      const d = o.createdAt ? new Date(o.createdAt).toISOString().split('T')[0] : todayStr;
      return d === todayStr;
    });
    const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.total || 0), 0);

    return {
      activeTablesCount,
      availableTablesCount,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      todayRevenue: Math.round(todayRevenue * 100) / 100,
      totalTransactions,
      recentOrders: orders.slice(0, 10)
    };
  },

  // --- CATEGORIES ---
  async getCategories() {
    if (getIsConnected()) {
      try {
        return await Category.find();
      } catch (e) {}
    }
    return memoryCategories;
  },

  async addCategory(catData) {
    if (getIsConnected()) {
      try {
        const newCat = new Category(catData);
        await newCat.save();
        return newCat;
      } catch (e) {}
    }
    const newCat = { ...catData, _id: 'cat_' + Date.now().toString() };
    memoryCategories.push(newCat);
    return newCat;
  },

  async deleteCategory(catId) {
    if (getIsConnected()) {
      try {
        await Category.findByIdAndDelete(catId);
      } catch (e) {}
    }
    memoryCategories = memoryCategories.filter(c => c._id !== catId);
    return { success: true };
  }
};

module.exports = posService;

