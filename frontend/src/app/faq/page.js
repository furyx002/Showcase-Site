'use client';

import React, { useState } from 'react';
import { ChevronDown, MessageCircle } from 'lucide-react';
import Link from 'next/link';

import { api } from '../../lib/api';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(0);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await api.getSettings();
        if (res.data && res.data.faqs) {
          setFaqs(res.data.faqs);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

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
        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
          </div>
        ) : (
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
          {faqs.length === 0 && (
            <div className="p-8 text-center text-gray-500">No FAQs available at the moment.</div>
          )}
        </div>
        )}

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
