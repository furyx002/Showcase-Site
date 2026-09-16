const express = require('express');
const router = express.Router();
const Setting = require('../models/Setting');

// Default settings if not found in DB
const DEFAULT_SETTINGS = {
  whatsappNumber: '+923006255511',
  heroSliders: ['/slider1.jpg', '/slider2.jpg'],
  faqs: [
    {
      question: "What material are your faucets and showers made of?",
      answer: "Our premium sanitary products are primarily crafted from 100% authentic Grade 304 Stainless Steel and high-quality brass. This ensures they are rust-proof, highly durable, and maintain their elegant finish for years to come."
    },
    {
      question: "Do you offer a warranty on your products?",
      answer: "Yes! We stand behind the quality of our products. Most of our faucets and shower sets come with a comprehensive 10-Year Rust-Free Warranty. Please check individual product details or contact us on WhatsApp for specific warranty terms."
    },
    {
      question: "How long does shipping take?",
      answer: "We offer fast and reliable shipping across Pakistan. Orders within major cities typically arrive within 2-3 business days. For other regions, please allow 3-5 business days. You will receive a tracking link once your order is dispatched."
    },
    {
      question: "How do I place an order?",
      answer: "Placing an order is simple and direct! Browse our products, and click on 'ORDER ON WHATSAPP'. This will open a chat with our sales representative, pre-filled with the product details. You can finalize your order and payment method securely via chat."
    },
    {
      question: "Do you provide installation services?",
      answer: "Currently, we do not provide in-house installation services. However, our products use standard plumbing fittings and come with all necessary mounting hardware. Any qualified local plumber can easily install them."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 7-day hassle-free return policy if the product you receive is damaged, defective, or not as described. The item must be unused and in its original packaging. Please contact our support team via WhatsApp to initiate a return."
    }
  ]
};

// GET /api/settings - Fetch all global settings
router.get('/', async (req, res) => {
  try {
    const settingsList = await Setting.find({});
    
    // Convert array to object { key: value }
    const settings = { ...DEFAULT_SETTINGS };
    settingsList.forEach(setting => {
      settings[setting.key] = setting.value;
    });

    res.json({ success: true, data: settings });
  } catch (err) {
    // Return default settings if DB fails
    res.json({ success: true, data: DEFAULT_SETTINGS, warning: err.message });
  }
});

// POST /api/settings - Update settings (expects key-value pairs)
router.post('/', async (req, res) => {
  try {
    const updates = req.body;
    const keys = Object.keys(updates);
    
    for (const key of keys) {
      await Setting.findOneAndUpdate(
        { key },
        { value: updates[key] },
        { upsert: true, new: true }
      );
    }

    res.json({ success: true, message: 'Settings updated successfully' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;
