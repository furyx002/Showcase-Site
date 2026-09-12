'use client';

import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Settings, Package, Plus, Edit3, Trash2, RefreshCw, X, Image as ImageIcon } from 'lucide-react';

export default function EditSettingsView({ onRefreshAll }) {
  const [activeTab, setActiveTab] = useState('products'); // 'products', 'settings', 'categories'
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState({ whatsappNumber: '', heroSliderImage1: '', heroSliderImage2: '' });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  // Form states
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '', category: 'Wash Basins', price: '', stock: 100, images: []
  });
  
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    title: '', image: ''
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [resProds, resSettings, resCats] = await Promise.all([
        api.getProducts(),
        api.getSettings(),
        api.getCategories()
      ]);
      setProducts(resProds.data || []);
      setCategories(resCats || []);
      if (resSettings.data) {
        setSettings(resSettings.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showFeedback = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleImageUpload = async (e, callback) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setLoading(true);
    try {
      const res = await api.uploadImage(file);
      if (res.success && res.imageUrl) {
        callback(res.imageUrl);
        showFeedback('Image uploaded successfully');
      } else {
        throw new Error(res.error || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  // --- SETTINGS HANDLERS ---
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      await api.saveSettings(settings);
      showFeedback('Global settings saved');
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to save settings');
    }
  };

  // --- PRODUCT HANDLERS ---
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: productForm.name,
        category: productForm.category,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock) || 100,
        images: productForm.images || []
      };
      if (editingProduct && editingProduct._id) {
        payload._id = editingProduct._id;
      }
      await api.saveProduct(payload);
      setEditingProduct(null);
      showFeedback('Product saved successfully');
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to save product');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.deleteProduct(productId);
      showFeedback('Product deleted');
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to delete product');
    }
  };

  const removeImage = (index) => {
    const newImages = [...productForm.images];
    newImages.splice(index, 1);
    setProductForm({ ...productForm, images: newImages });
  };

  // --- CATEGORY HANDLERS ---
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: categoryForm.title,
        image: categoryForm.image
      };
      if (editingCategory && editingCategory._id) {
        payload._id = editingCategory._id;
      }
      await api.saveCategory(payload);
      setEditingCategory(null);
      showFeedback('Category saved successfully');
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to save category');
    }
  };

  const handleDeleteCategory = async (catId) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await api.deleteCategory(catId);
      showFeedback('Category deleted');
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to delete category');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-20">
      
      {/* Top Header & Tabs */}
      <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-black text-black tracking-tight uppercase">Admin Dashboard</h2>
            <p className="text-sm text-gray-500 font-medium mt-1 uppercase tracking-widest">Manage your store products and global settings</p>
          </div>
          <div className="flex items-center space-x-3">
            {message && (
              <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded-sm animate-fadeIn">
                ✓ {message}
              </span>
            )}
            <button
              onClick={loadData}
              className="p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-sm transition-colors"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex border-t border-gray-100">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex-1 py-4 text-sm font-bold flex items-center justify-center space-x-2 transition-colors uppercase tracking-widest ${
              activeTab === 'products' 
                ? 'border-b-2 border-black text-black bg-gray-50' 
                : 'text-gray-500 hover:bg-gray-50 border-b-2 border-transparent'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Product Catalog</span>
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex-1 py-4 text-sm font-bold flex items-center justify-center space-x-2 transition-colors uppercase tracking-widest ${
              activeTab === 'categories' 
                ? 'border-b-2 border-black text-black bg-gray-50' 
                : 'text-gray-500 hover:bg-gray-50 border-b-2 border-transparent'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Categories</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-4 text-sm font-bold flex items-center justify-center space-x-2 transition-colors uppercase tracking-widest ${
              activeTab === 'settings' 
                ? 'border-b-2 border-black text-black bg-gray-50' 
                : 'text-gray-500 hover:bg-gray-50 border-b-2 border-transparent'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Store Settings</span>
          </button>
        </div>
      </div>

      {/* --- TAB CONTENT: SETTINGS --- */}
      {activeTab === 'settings' && (
        <div className="bg-white border border-gray-200 rounded-md p-6 md:p-8 animate-fadeIn shadow-sm">
          <h3 className="text-lg font-black text-black mb-6 uppercase tracking-widest">Global Site Configuration</h3>
          <form onSubmit={handleSaveSettings} className="space-y-6 max-w-2xl">
            
            {/* WhatsApp */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">WhatsApp Contact Number</label>
              <input
                type="text"
                required
                value={settings.whatsappNumber || ''}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 focus:border-black focus:ring-0 rounded-sm px-4 py-3 text-sm text-black font-semibold"
                placeholder="+923001234567"
              />
            </div>

            {/* Sliders */}
            <div className="space-y-4">
              <div className="p-4 rounded-sm border border-gray-200 bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Hero Banner 1</label>
                  <label className="cursor-pointer text-blue-600 font-bold text-xs hover:underline flex items-center space-x-1">
                    <ImageIcon className="w-3 h-3" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, (url) => setSettings({ ...settings, heroSliderImage1: url }))}
                    />
                  </label>
                </div>
                {settings.heroSliderImage1 && (
                  <img src={settings.heroSliderImage1} alt="Hero 1" className="w-full h-32 object-cover rounded-sm mb-3 border border-gray-200" />
                )}
                <input
                  type="text"
                  value={settings.heroSliderImage1 || ''}
                  onChange={(e) => setSettings({ ...settings, heroSliderImage1: e.target.value })}
                  className="w-full bg-white border border-gray-200 rounded-sm px-3 py-2 text-xs focus:border-black"
                  placeholder="Image URL"
                />
              </div>

              <div className="p-4 rounded-sm border border-gray-200 bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Hero Banner 2</label>
                  <label className="cursor-pointer text-blue-600 font-bold text-xs hover:underline flex items-center space-x-1">
                    <ImageIcon className="w-3 h-3" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, (url) => setSettings({ ...settings, heroSliderImage2: url }))}
                    />
                  </label>
                </div>
                {settings.heroSliderImage2 && (
                  <img src={settings.heroSliderImage2} alt="Hero 2" className="w-full h-32 object-cover rounded-sm mb-3 border border-gray-200" />
                )}
                <input
                  type="text"
                  value={settings.heroSliderImage2 || ''}
                  onChange={(e) => setSettings({ ...settings, heroSliderImage2: e.target.value })}
                  className="w-full bg-white border border-gray-200 rounded-sm px-3 py-2 text-xs focus:border-black"
                  placeholder="Image URL"
                />
              </div>
            </div>

            <button type="submit" className="w-full py-4 bg-black hover:bg-gray-900 text-white font-black text-sm uppercase tracking-widest rounded-sm transition-colors">
              Save Settings
            </button>
          </form>
        </div>
      )}

      {/* --- TAB CONTENT: CATEGORIES --- */}
      {activeTab === 'categories' && (
        <div className="space-y-6 animate-fadeIn">
          {!editingCategory && (
            <button
              onClick={() => {
                setEditingCategory({ title: '', image: '' });
                setCategoryForm({ title: '', image: '' });
              }}
              className="w-full border border-dashed border-gray-300 hover:border-black rounded-md p-8 flex flex-col items-center justify-center text-gray-400 hover:text-black transition-colors bg-white hover:bg-gray-50 shadow-sm"
            >
              <Plus className="w-8 h-8 mb-3" />
              <span className="font-bold uppercase tracking-widest text-sm">Add New Category</span>
            </button>
          )}

          {editingCategory && (
            <form onSubmit={handleSaveCategory} className="bg-white border border-gray-200 rounded-md p-6 md:p-8 shadow-sm space-y-6">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <h3 className="text-lg font-black text-black uppercase tracking-widest">
                  {editingCategory._id ? 'Edit Category' : 'Add New Category'}
                </h3>
                <button type="button" onClick={() => setEditingCategory(null)} className="p-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-sm transition-colors">
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Category Name</label>
                    <input type="text" required value={categoryForm.title} onChange={(e) => setCategoryForm({ ...categoryForm, title: e.target.value })} className="w-full bg-gray-50 border border-gray-200 focus:border-black rounded-sm px-4 py-2.5 text-sm font-semibold" />
                  </div>
                </div>

                <div className="bg-gray-50 p-5 rounded-sm border border-gray-200">
                  <div className="flex justify-between items-center mb-5">
                    <div>
                      <label className="block text-xs font-bold text-black uppercase tracking-widest">Category Image</label>
                    </div>
                    <label className="cursor-pointer bg-white border border-gray-300 hover:border-black text-black px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center space-x-1 transition-colors">
                      <Plus className="w-3 h-3" />
                      <span>Upload</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, (url) => setCategoryForm({ ...categoryForm, image: url }))}
                      />
                    </label>
                  </div>
                  
                  {!categoryForm.image ? (
                    <div className="text-center py-8 text-gray-400 text-xs uppercase tracking-widest border border-dashed border-gray-300 bg-white rounded-sm">
                      No image uploaded yet.
                    </div>
                  ) : (
                    <div className="relative group rounded-sm overflow-hidden border border-gray-200 bg-white aspect-video flex items-center justify-center p-2">
                      <img src={categoryForm.image} alt="Category" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <button type="button" onClick={() => setCategoryForm({ ...categoryForm, image: '' })} className="p-2 bg-red-500 text-white rounded-sm hover:bg-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
                <button type="button" onClick={() => setEditingCategory(null)} className="px-6 py-3 text-gray-500 border border-gray-200 font-bold text-xs uppercase tracking-widest hover:bg-gray-50 rounded-sm transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-8 py-3 bg-black hover:bg-gray-900 text-white font-black text-xs uppercase tracking-widest rounded-sm transition-colors shadow-sm">
                  {editingCategory._id ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map(c => (
              <div key={c._id} className="bg-white border border-gray-200 rounded-md shadow-sm flex flex-col group overflow-hidden">
                <div className="h-40 bg-black relative flex items-center justify-center group/img">
                  {c.image ? (
                    <img src={c.image} alt={c.title} className="w-full h-full object-cover opacity-50 group-hover/img:scale-110 transition-transform duration-700 grayscale group-hover/img:grayscale-0" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold uppercase tracking-widest text-xs">No Image</div>
                  )}
                  <h3 className="absolute inset-0 flex items-center justify-center text-2xl font-black text-white text-center whitespace-pre-line p-4 drop-shadow-md pointer-events-none">
                    {c.title}
                  </h3>
                </div>
                
                <div className="p-3 bg-gray-50 flex justify-end space-x-1 border-t border-gray-100">
                  <button
                    onClick={() => {
                      setEditingCategory(c);
                      setCategoryForm({ title: c.title, image: c.image || '' });
                    }}
                    className="p-2 bg-white border border-gray-200 hover:bg-gray-100 hover:border-gray-300 text-gray-600 rounded-sm transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(c._id)}
                    className="p-2 bg-red-50 border border-red-100 hover:bg-red-100 hover:border-red-200 text-red-600 rounded-sm transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB CONTENT: PRODUCTS --- */}
      {activeTab === 'products' && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Add Product Button */}
          {!editingProduct && (
            <button
              onClick={() => {
                setEditingProduct({ name: '', category: 'Wash Basins', price: '', stock: 100, images: [] });
                setProductForm({ name: '', category: 'Wash Basins', price: '', stock: 100, images: [] });
              }}
              className="w-full border border-dashed border-gray-300 hover:border-black rounded-md p-8 flex flex-col items-center justify-center text-gray-400 hover:text-black transition-colors bg-white hover:bg-gray-50 shadow-sm"
            >
              <Plus className="w-8 h-8 mb-3" />
              <span className="font-bold uppercase tracking-widest text-sm">Add New Product</span>
            </button>
          )}

          {/* Add/Edit Form */}
          {editingProduct && (
            <form onSubmit={handleSaveProduct} className="bg-white border border-gray-200 rounded-md p-6 md:p-8 shadow-sm space-y-6">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <h3 className="text-lg font-black text-black uppercase tracking-widest">
                  {editingProduct._id ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button type="button" onClick={() => setEditingProduct(null)} className="p-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-sm transition-colors">
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Product Name</label>
                    <input type="text" required value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} className="w-full bg-gray-50 border border-gray-200 focus:border-black rounded-sm px-4 py-2.5 text-sm font-semibold" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Category</label>
                    <input 
                      list="category-options"
                      required
                      value={productForm.category} 
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} 
                      className="w-full bg-gray-50 border border-gray-200 focus:border-black rounded-sm px-4 py-2.5 text-sm font-semibold"
                      placeholder="e.g. Wash Basins"
                    />
                    <datalist id="category-options">
                      {categories.map(c => (
                        <option key={c._id} value={c.title.replace(/\n/g, ' ')} />
                      ))}
                    </datalist>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Price (PKR)</label>
                      <input type="number" required value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} className="w-full bg-gray-50 border border-gray-200 focus:border-black rounded-sm px-4 py-2.5 text-sm font-mono font-bold" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">Stock</label>
                      <input type="number" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} className="w-full bg-gray-50 border border-gray-200 focus:border-black rounded-sm px-4 py-2.5 text-sm font-mono font-bold" />
                    </div>
                  </div>
                </div>

                {/* Multiple Images Upload UI */}
                <div className="bg-gray-50 p-5 rounded-sm border border-gray-200">
                  <div className="flex justify-between items-center mb-5">
                    <div>
                      <label className="block text-xs font-bold text-black uppercase tracking-widest">Product Images</label>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">Primary (Left) | Hover (Middle) | Gallery (Right)</p>
                    </div>
                    <label className="cursor-pointer bg-white border border-gray-300 hover:border-black text-black px-3 py-1.5 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center space-x-1 transition-colors">
                      <Plus className="w-3 h-3" />
                      <span>Upload</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, (url) => setProductForm({ ...productForm, images: [...productForm.images, url] }))}
                      />
                    </label>
                  </div>
                  
                  {productForm.images.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 text-xs uppercase tracking-widest border border-dashed border-gray-300 bg-white rounded-sm">
                      No images uploaded yet.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {productForm.images.map((imgUrl, idx) => (
                        <div key={idx} className="relative group rounded-sm overflow-hidden border border-gray-200 bg-white aspect-square flex items-center justify-center p-2">
                          <img src={imgUrl} alt={`Product ${idx}`} className="w-full h-full object-contain" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <button type="button" onClick={() => removeImage(idx)} className="p-2 bg-red-500 text-white rounded-sm hover:bg-red-600 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          {idx === 0 && <span className="absolute top-1 left-1 bg-black text-white text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-wider shadow">Primary</span>}
                          {idx === 1 && <span className="absolute top-1 left-1 bg-gray-500 text-white text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-wider shadow">Hover</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
                <button type="button" onClick={() => setEditingProduct(null)} className="px-6 py-3 text-gray-500 border border-gray-200 font-bold text-xs uppercase tracking-widest hover:bg-gray-50 rounded-sm transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-8 py-3 bg-black hover:bg-gray-900 text-white font-black text-xs uppercase tracking-widest rounded-sm transition-colors shadow-sm">
                  {editingProduct._id ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          )}

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(p => (
              <div key={p._id} className="bg-white border border-gray-200 rounded-md shadow-sm flex flex-col group overflow-hidden">
                <div className="h-48 bg-gray-50 relative p-4 flex items-center justify-center border-b border-gray-100 group/img">
                  {(p.images && p.images.length > 0) ? (
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover/img:scale-110" />
                  ) : (p.image ? (
                    <img src={p.image} alt={p.name} className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover/img:scale-110" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 font-bold uppercase tracking-widest text-xs">No Image</div>
                  ))}
                  <div className="absolute top-3 left-3 bg-white border border-gray-200 text-[9px] font-black px-2.5 py-1 text-black uppercase tracking-widest shadow-sm">
                    {p.category}
                  </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <h4 className="font-bold text-sm text-black leading-snug mb-3 uppercase tracking-wide group-hover:text-blue-600 transition-colors">{p.name}</h4>
                  <div className="mt-auto flex justify-between items-end">
                    <span className="text-black font-black font-mono text-sm">Rs.{p.price.toLocaleString()}</span>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => {
                          setEditingProduct(p);
                          // Backwards compatibility for single image
                          const imagesArr = p.images && p.images.length > 0 ? p.images : (p.image ? [p.image] : []);
                          setProductForm({ name: p.name, category: p.category, price: p.price, stock: p.stock || 100, images: imagesArr });
                        }}
                        className="p-2 bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 text-gray-600 rounded-sm transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p._id)}
                        className="p-2 bg-red-50 border border-red-100 hover:bg-red-100 hover:border-red-200 text-red-600 rounded-sm transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
