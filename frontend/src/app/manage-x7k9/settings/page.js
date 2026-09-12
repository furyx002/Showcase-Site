'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Image as ImageIcon, Trash2 } from 'lucide-react';
import { api } from '../../../lib/api';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.getSettings();
      setSettings(res || {});
    } catch (err) {
      toast.error('Failed to load settings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleImageUpload = async (e, callback) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setLoading(true);
    try {
      const res = await api.uploadImage(file);
      if (res.success && res.imageUrl) {
        callback(res.imageUrl);
        toast.success('Image uploaded successfully');
      } else {
        throw new Error(res.error || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      await api.saveSettings(settings);
      toast.success('Global settings saved');
      loadData();
    } catch (err) {
      toast.error(err.message || 'Failed to save settings');
    }
  };

  return (
    <div className="flex flex-col h-full animate-fadeIn">
      {/* Header */}
      <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 lg:px-10 shrink-0 shadow-sm -mt-4 -mx-4 md:-mt-8 md:-mx-8 mb-6">
        <h1 className="text-xl font-black text-gray-900 uppercase tracking-widest">
          Global Settings
        </h1>
      </header>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto w-full bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
        <form onSubmit={handleSaveSettings} className="space-y-8">
          
          {/* Contact Info */}
          <section>
            <h3 className="text-sm font-black text-black mb-4 uppercase tracking-widest border-b border-gray-100 pb-2">Contact Information</h3>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">WhatsApp Ordering Number</label>
              <input
                type="text"
                required
                value={settings.whatsappNumber || ''}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-black rounded-lg px-4 py-3 text-sm text-black font-semibold outline-none transition-colors"
                placeholder="e.g. +923001234567"
              />
              <p className="text-[11px] text-gray-400 mt-2">This number is used for all "Buy on WhatsApp" buttons.</p>
            </div>
          </section>

          {/* Marquee Info */}
          <section>
            <h3 className="text-sm font-black text-black mb-4 uppercase tracking-widest border-b border-gray-100 pb-2">Marquee Banner</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Enable Marquee</label>
                <select
                  value={settings.marqueeEnabled === false ? 'false' : 'true'}
                  onChange={(e) => setSettings({ ...settings, marqueeEnabled: e.target.value === 'true' })}
                  className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-black rounded-lg px-4 py-3 text-sm text-black font-semibold outline-none transition-colors"
                >
                  <option value="true">Enabled</option>
                  <option value="false">Disabled</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Marquee Text</label>
                <input
                  type="text"
                  value={settings.marqueeText || ''}
                  onChange={(e) => setSettings({ ...settings, marqueeText: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-black rounded-lg px-4 py-3 text-sm text-black font-semibold outline-none transition-colors"
                  placeholder="e.g. LIMITED TIME OFFER..."
                />
              </div>
            </div>
          </section>

          {/* Sliders */}
          <section>
            <div className="flex justify-between items-end mb-4 border-b border-gray-100 pb-2">
              <h3 className="text-sm font-black text-black uppercase tracking-widest">Homepage Sliders</h3>
              <button 
                type="button" 
                onClick={() => setSettings(s => ({ ...s, heroSliders: [...(s.heroSliders || []), ''] }))}
                className="bg-black hover:bg-gray-800 text-white font-bold py-1.5 px-3 rounded-md text-xs flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3 h-3" /> Add Banner
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(settings.heroSliders || []).map((sliderUrl, idx) => (
                <div key={idx} className="p-5 rounded-xl border border-gray-200 bg-gray-50 relative group">
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-widest">Banner {idx + 1}</label>
                    <div className="flex space-x-3">
                      <label className="cursor-pointer text-blue-600 font-bold text-xs hover:underline flex items-center space-x-1">
                        <ImageIcon className="w-3 h-3" />
                        <span>Upload</span>
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*" 
                          onChange={(e) => handleImageUpload(e, (url) => {
                            const newSliders = [...(settings.heroSliders || [])];
                            newSliders[idx] = url;
                            setSettings({ ...settings, heroSliders: newSliders });
                          })} 
                        />
                      </label>
                      <button 
                        type="button"
                        onClick={() => {
                          const newSliders = [...(settings.heroSliders || [])];
                          newSliders.splice(idx, 1);
                          setSettings({ ...settings, heroSliders: newSliders });
                        }}
                        className="text-red-500 hover:text-red-700 font-bold text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  {sliderUrl ? (
                    <img src={sliderUrl} alt={`Hero ${idx + 1}`} className="w-full h-32 object-cover rounded-lg mb-3 border border-gray-200 bg-white" />
                  ) : (
                    <div className="w-full h-32 bg-gray-200 rounded-lg mb-3 flex flex-col items-center justify-center text-gray-400">
                      <ImageIcon className="w-6 h-6 mb-1 opacity-50" />
                      <span className="text-[10px] uppercase font-bold tracking-widest">Empty</span>
                    </div>
                  )}
                  <input 
                    type="text" 
                    value={sliderUrl || ''} 
                    onChange={(e) => {
                      const newSliders = [...(settings.heroSliders || [])];
                      newSliders[idx] = e.target.value;
                      setSettings({ ...settings, heroSliders: newSliders });
                    }} 
                    className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-xs focus:border-black outline-none" 
                    placeholder="Or enter Image URL" 
                  />
                </div>
              ))}
              
              {(!settings.heroSliders || settings.heroSliders.length === 0) && (
                <div className="col-span-1 md:col-span-2 text-center py-8 text-gray-400 text-xs uppercase tracking-widest border border-dashed border-gray-300 bg-white rounded-xl">
                  No banners configured. Add a banner above.
                </div>
              )}
            </div>
          </section>

          {/* FAQs */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-black text-black uppercase tracking-widest">Frequently Asked Questions</h3>
              <button 
                type="button" 
                onClick={() => setSettings(s => ({ ...s, faqs: [...(s.faqs || []), { question: '', answer: '' }] }))}
                className="bg-black hover:bg-gray-800 text-white font-bold py-1.5 px-3 rounded-md text-xs flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3 h-3" /> Add FAQ
              </button>
            </div>
            
            <div className="space-y-4">
              {(settings.faqs || []).map((faq, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-gray-200 bg-gray-50 relative group">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-widest">FAQ {idx + 1}</label>
                    <button 
                      type="button"
                      onClick={() => {
                        const newFaqs = [...(settings.faqs || [])];
                        newFaqs.splice(idx, 1);
                        setSettings({ ...settings, faqs: newFaqs });
                      }}
                      className="text-red-500 hover:text-red-700 font-bold text-xs"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="space-y-3">
                    <input 
                      type="text" 
                      value={faq.question || ''} 
                      onChange={(e) => {
                        const newFaqs = [...(settings.faqs || [])];
                        newFaqs[idx].question = e.target.value;
                        setSettings({ ...settings, faqs: newFaqs });
                      }} 
                      className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-sm focus:border-black outline-none font-bold" 
                      placeholder="Question" 
                    />
                    <textarea 
                      value={faq.answer || ''} 
                      onChange={(e) => {
                        const newFaqs = [...(settings.faqs || [])];
                        newFaqs[idx].answer = e.target.value;
                        setSettings({ ...settings, faqs: newFaqs });
                      }} 
                      className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-sm focus:border-black outline-none min-h-[80px]" 
                      placeholder="Answer" 
                    />
                  </div>
                </div>
              ))}
              
              {(!settings.faqs || settings.faqs.length === 0) && (
                <div className="text-center py-8 text-gray-400 text-xs uppercase tracking-widest border border-dashed border-gray-300 bg-white rounded-xl">
                  No FAQs configured. Add an FAQ above.
                </div>
              )}
            </div>
          </div>

          <div className="pt-4">
            <button type="submit" className="w-full py-4 bg-black hover:bg-slate-800 text-white font-black text-sm uppercase tracking-widest rounded-lg transition-colors shadow-md">
              Save Global Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
