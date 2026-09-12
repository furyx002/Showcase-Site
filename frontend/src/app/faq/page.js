'use client';

import React, { useState } from 'react';
import { ChevronDown, MessageCircle } from 'lucide-react';
import Link from 'next/link';

const faqs = [
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
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 selection:bg-yellow-200">
      
      {/* Page Header */}
      <div className="bg-white py-16 text-center border-b border-gray-200">
        <div className="max-w-[800px] mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-widest uppercase mb-4">Frequently Asked Questions</h1>
          <p className="text-gray-500 text-lg font-light">Got a question? We're here to help. Find answers to common queries below.</p>
        </div>
      </div>

      <section className="max-w-[800px] mx-auto px-4 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`border-b border-gray-100 last:border-b-0 ${openIndex === index ? 'bg-gray-50/50' : 'bg-white'}`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none group"
              >
                <span className="font-bold text-gray-900 group-hover:text-yellow-600 transition-colors pr-4">
                  {faq.question}
                </span>
                <ChevronDown 
                  className={`w-5 h-5 text-gray-400 transition-transform duration-300 flex-shrink-0 ${openIndex === index ? 'rotate-180 text-yellow-600' : ''}`} 
                />
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-5 pt-0 text-gray-600 leading-relaxed font-light text-sm">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 mb-6 font-medium">Still have questions? We're just a message away.</p>
          <a 
            href={`https://wa.me/923006255511`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
          >
            <MessageCircle className="w-5 h-5" />
            Chat with us on WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
