'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../lib/api';
import { Settings, Package, FolderTree, Plus, Edit3, Trash2, RefreshCw, X, Image as ImageIcon, Search, LogOut, LayoutDashboard, Menu } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function EditSettingsView({ onLogout }) {
  const [activeTab, setActiveTab] = useState('products'); // 'dashboard', 'products', 'categories', 'settings'
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState({ whatsappNumber: '', heroSliders: [] });
  
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '', category: 'Wash Basins', price: '', originalPrice: '', stock: 100, images: [], badges: ''
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
    toast.success(msg);
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
      toast.error(err.message || 'Failed to upload image');
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
      toast.error(err.message || 'Failed to save settings');
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
        originalPrice: parseFloat(productForm.originalPrice) || 0,
        stock: parseInt(productForm.stock) || 100,
        images: productForm.images || [],
        badges: productForm.badges ? productForm.badges.split(',').map(b => b.trim()).filter(b => b) : []
      };
      if (editingProduct && editingProduct._id) {
        payload._id = editingProduct._id;
      }
      await api.saveProduct(payload);
      setEditingProduct(null);
      showFeedback('Product saved successfully');
      loadData();
    } catch (err) {
      toast.error(err.message || 'Failed to save product');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.deleteProduct(productId);
      showFeedback('Product deleted');
      loadData();
    } catch (err) {
      toast.error(err.message || 'Failed to delete product');
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
      toast.error(err.message || 'Failed to save category');
    }
  };

  const handleDeleteCategory = async (catId) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await api.deleteCategory(catId);
      showFeedback('Category deleted');
      loadData();
    } catch (err) {
      toast.error(err.message || 'Failed to delete category');
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [products, searchQuery]);


  // --- SUB-COMPONENTS ---
  const NavItem = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => { setActiveTab(id); setIsMobileMenuOpen(false); setEditingProduct(null); setEditingCategory(null); }}
      className={`w-full flex items-center px-4 py-3 text-sm font-bold rounded-lg transition-colors tracking-wide ${
        activeTab === id 
          ? 'bg-yellow-500 text-slate-900' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <Icon className="w-5 h-5 mr-3" />
      {label}
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans selection:bg-yellow-200">
      
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-20 flex items-center justify-between px-6 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-500 text-slate-900 flex items-center justify-center font-black text-lg rounded-sm">
              SS
            </div>
            <span className="font-black tracking-widest text-sm uppercase">Admin Panel</span>
          </div>
          <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
          <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem id="products" icon={Package} label="Products" />
          <NavItem id="categories" icon={FolderTree} label="Categories" />
          <NavItem id="settings" icon={Settings} label="Settings" />
        </nav>

        <div className="p-4 bg-slate-950 border-t border-slate-800">
          <button onClick={onLogout} className="flex items-center w-full px-4 py-3 text-sm font-bold hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-slate-400">
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 lg:px-10 shrink-0 shadow-sm z-10">
          <div className="flex items-center">
            <button className="lg:hidden mr-4 text-gray-500 hover:text-black" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-black text-gray-900 uppercase tracking-widest">
              {activeTab === 'dashboard' && 'Dashboard Overview'}
              {activeTab === 'products' && (editingProduct ? (editingProduct._id ? 'Edit Product' : 'Add New Product') : 'Products Catalog')}
              {activeTab === 'categories' && (editingCategory ? (editingCategory._id ? 'Edit Category' : 'Add New Category') : 'Category Management')}
              {activeTab === 'settings' && 'Global Settings'}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {message && (
              <span className="hidden sm:flex text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full animate-fadeIn items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span> {message}
              </span>
            )}
            
            {(activeTab === 'products' && !editingProduct) && (
              <button
                onClick={() => {
                  setEditingProduct({ name: '', category: categories[0]?.title || 'Wash Basins', price: '', stock: 100, images: [] });
                  setProductForm({ name: '', category: categories[0]?.title || 'Wash Basins', price: '', originalPrice: '', stock: 100, images: [], badges: '' });
                }}
                className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-md text-sm flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Add Product</span>
              </button>
            )}

            {(activeTab === 'categories' && !editingCategory) && (
              <button
                onClick={() => {
                  setEditingCategory({ title: '', image: '' });
                  setCategoryForm({ title: '', image: '' });
                }}
                className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-md text-sm flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Add Category</span>
              </button>
            )}

            <button
              onClick={loadData}
              className="p-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 rounded-md transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin text-yellow-600' : ''}`} />
            </button>
          </div>
        </header>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-auto p-6 lg:p-10">
          
          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                    <Package className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Total Products</p>
                    <h3 className="text-3xl font-black text-gray-900">{products.length}</h3>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
                  <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center">
                    <FolderTree className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Categories</p>
                    <h3 className="text-3xl font-black text-gray-900">{categories.length}</h3>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center space-x-4">
                  <div className="w-14 h-14 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                    <LayoutDashboard className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">System Status</p>
                    <h3 className="text-xl font-black text-gray-900">Online</h3>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PRODUCTS TAB */}
          {activeTab === 'products' && (
            <div className="max-w-6xl mx-auto animate-fadeIn">
              {editingProduct ? (
                // PRODUCT FORM
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-bold text-gray-700 uppercase tracking-widest text-sm">Product Details</h3>
                    <button type="button" onClick={() => setEditingProduct(null)} className="text-gray-400 hover:text-black">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <form onSubmit={handleSaveProduct} className="p-6 md:p-8 space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                      
                      {/* Left: Text Info */}
                      <div className="space-y-6">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Product Name</label>
                          <input type="text" required value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-black rounded-lg px-4 py-3 text-sm font-semibold outline-none transition-colors" placeholder="e.g. Modern Brass Faucet" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Category</label>
                          <select 
                            required
                            value={productForm.category} 
                            onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} 
                            className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-black rounded-lg px-4 py-3 text-sm font-semibold outline-none transition-colors appearance-none cursor-pointer"
                          >
                            <option value="" disabled>Select a category</option>
                            {categories.map(c => (
                              <option key={c._id} value={c.title.replace(/\n/g, ' ')}>{c.title.replace(/\n/g, ' ')}</option>
                            ))}
                          </select>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Price (PKR)</label>
                            <input type="number" min="0" required value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-black rounded-lg px-4 py-3 text-sm font-mono font-bold outline-none transition-colors" placeholder="0.00" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Original Price</label>
                            <input type="number" min="0" value={productForm.originalPrice} onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })} className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-black rounded-lg px-4 py-3 text-sm font-mono font-bold outline-none transition-colors" placeholder="e.g. 15000" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Stock Level</label>
                            <input type="number" min="0" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-black rounded-lg px-4 py-3 text-sm font-mono font-bold outline-none transition-colors" placeholder="100" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Badges (comma sep)</label>
                            <input type="text" value={productForm.badges} onChange={(e) => setProductForm({ ...productForm, badges: e.target.value })} className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-black rounded-lg px-4 py-3 text-sm font-semibold outline-none transition-colors" placeholder="e.g. SALE, BUNDLE" />
                          </div>
                        </div>
                      </div>

                      {/* Right: Images */}
                      <div>
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <label className="block text-xs font-bold text-black uppercase tracking-widest">Product Images</label>
                            <p className="text-[10px] text-gray-500 mt-1">Upload up to 3 images (Primary, Hover, Gallery)</p>
                          </div>
                          <label className="cursor-pointer bg-white border border-gray-200 hover:border-black text-black px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-colors">
                            <ImageIcon className="w-4 h-4" />
                            <span>Upload Image</span>
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => setProductForm({ ...productForm, images: [...productForm.images, url] }))} />
                          </label>
                        </div>
                        
                        {productForm.images.length === 0 ? (
                          <div className="w-full h-48 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-gray-400">
                            <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                            <span className="text-xs uppercase tracking-widest font-semibold">No images uploaded</span>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-4">
                            {productForm.images.map((imgUrl, idx) => (
                              <div key={idx} className="relative group rounded-xl overflow-hidden border border-gray-200 bg-white aspect-square flex items-center justify-center">
                                <img src={imgUrl} alt={`Product ${idx}`} className="w-full h-full object-contain p-2" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                  <button type="button" onClick={() => removeImage(idx)} className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-transform hover:scale-110 shadow-lg">
                                    <Trash2 className="w-5 h-5" />
                                  </button>
                                </div>
                                <span className="absolute top-2 left-2 bg-black/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow">
                                  {idx === 0 ? 'Primary' : idx === 1 ? 'Hover' : 'Gallery'}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-8 border-t border-gray-100 mt-8">
                      <button type="button" onClick={() => setEditingProduct(null)} className="px-6 py-3 text-gray-600 font-bold text-xs uppercase tracking-widest hover:bg-gray-100 rounded-lg transition-colors">
                        Cancel
                      </button>
                      <button type="submit" className="px-8 py-3 bg-black hover:bg-slate-800 text-white font-black text-xs uppercase tracking-widest rounded-lg transition-colors shadow-md">
                        {editingProduct._id ? 'Save Changes' : 'Publish Product'}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                // PRODUCT LIST (DATA TABLE)
                <div className="space-y-6">
                  {/* Search Bar */}
                  <div className="relative max-w-md">
                    <input 
                      type="text" 
                      placeholder="Search products by name or category..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 focus:border-black focus:ring-0 rounded-lg text-sm shadow-sm outline-none transition-colors"
                    />
                    <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-widest text-gray-500 font-bold">
                          <tr>
                            <th className="px-6 py-4">Product</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Price</th>
                            <th className="px-6 py-4">Stock</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {filteredProducts.length === 0 ? (
                            <tr>
                              <td colSpan="5" className="px-6 py-12 text-center text-gray-400 font-medium">No products found.</td>
                            </tr>
                          ) : (
                            filteredProducts.map(p => (
                              <tr key={p._id} className="hover:bg-gray-50 transition-colors group">
                                <td className="px-6 py-4 flex items-center space-x-4">
                                  <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                                    {(p.images && p.images.length > 0) ? (
                                      <img src={p.images[0]} alt="" className="w-10 h-10 object-contain mix-blend-multiply" />
                                    ) : (p.image ? (
                                      <img src={p.image} alt="" className="w-10 h-10 object-contain mix-blend-multiply" />
                                    ) : (
                                      <ImageIcon className="w-5 h-5 text-gray-300" />
                                    ))}
                                  </div>
                                  <span className="font-bold text-gray-900">{p.name}</span>
                                </td>
                                <td className="px-6 py-4 text-gray-600 font-medium">
                                  <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider">{p.category}</span>
                                </td>
                                <td className="px-6 py-4 font-mono font-bold text-gray-900">
                                  Rs.{p.price.toLocaleString()}
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`font-mono font-bold ${p.stock > 10 ? 'text-green-600' : 'text-red-600'}`}>{p.stock || 100}</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                      onClick={() => {
                                        setEditingProduct(p);
                                        const imagesArr = p.images && p.images.length > 0 ? p.images : (p.image ? [p.image] : []);
                                        setProductForm({ name: p.name, category: p.category, price: p.price, originalPrice: p.originalPrice || '', stock: p.stock || 100, images: imagesArr, badges: (p.badges || []).join(', ') });
                                      }}
                                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                      title="Edit Product"
                                    >
                                      <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteProduct(p._id)}
                                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                      title="Delete Product"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CATEGORIES TAB */}
          {activeTab === 'categories' && (
            <div className="max-w-6xl mx-auto animate-fadeIn">
              {editingCategory ? (
                 <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-8">
                 <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                   <h3 className="font-bold text-gray-700 uppercase tracking-widest text-sm">Category Details</h3>
                   <button type="button" onClick={() => setEditingCategory(null)} className="text-gray-400 hover:text-black">
                     <X className="w-5 h-5" />
                   </button>
                 </div>
                 <form onSubmit={handleSaveCategory} className="p-6 md:p-8 space-y-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     <div className="space-y-6">
                       <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Category Name (Supports Line Breaks)</label>
                         <textarea required value={categoryForm.title} onChange={(e) => setCategoryForm({ ...categoryForm, title: e.target.value })} className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-black rounded-lg px-4 py-3 text-sm font-semibold outline-none transition-colors" rows="3" placeholder="e.g. FAUCETS & \nMIXERS"></textarea>
                       </div>
                     </div>
 
                     <div>
                       <div className="flex justify-between items-center mb-4">
                         <label className="block text-xs font-bold text-black uppercase tracking-widest">Category Banner Image</label>
                         <label className="cursor-pointer bg-white border border-gray-200 hover:border-black text-black px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-colors">
                           <ImageIcon className="w-4 h-4" />
                           <span>Upload</span>
                           <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => setCategoryForm({ ...categoryForm, image: url }))} />
                         </label>
                       </div>
                       
                       {!categoryForm.image ? (
                         <div className="w-full h-40 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-gray-400">
                           <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                           <span className="text-xs uppercase tracking-widest font-semibold">No image uploaded</span>
                         </div>
                       ) : (
                         <div className="relative group rounded-xl overflow-hidden border border-gray-200 bg-white aspect-video flex items-center justify-center p-1">
                           <img src={categoryForm.image} alt="Category" className="w-full h-full object-cover rounded-lg" />
                           <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg m-1">
                             <button type="button" onClick={() => setCategoryForm({ ...categoryForm, image: '' })} className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-transform hover:scale-110 shadow-lg">
                               <Trash2 className="w-5 h-5" />
                             </button>
                           </div>
                         </div>
                       )}
                     </div>
                   </div>
 
                   <div className="flex justify-end space-x-4 pt-8 border-t border-gray-100 mt-8">
                     <button type="button" onClick={() => setEditingCategory(null)} className="px-6 py-3 text-gray-600 font-bold text-xs uppercase tracking-widest hover:bg-gray-100 rounded-lg transition-colors">
                       Cancel
                     </button>
                     <button type="submit" className="px-8 py-3 bg-black hover:bg-slate-800 text-white font-black text-xs uppercase tracking-widest rounded-lg transition-colors shadow-md">
                       {editingCategory._id ? 'Save Changes' : 'Create Category'}
                     </button>
                   </div>
                 </form>
               </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {categories.map(c => (
                    <div key={c._id} className="bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col group overflow-hidden">
                      <div className="h-40 bg-slate-900 relative flex items-center justify-center group/img overflow-hidden">
                        {c.image ? (
                          <img src={c.image} alt="" className="w-full h-full object-cover opacity-50 group-hover/img:scale-110 transition-transform duration-700 grayscale group-hover/img:grayscale-0" />
                        ) : (
                          <FolderTree className="w-12 h-12 text-slate-700" />
                        )}
                        <h3 className="absolute inset-0 flex items-center justify-center text-xl font-black text-white text-center whitespace-pre-line p-4 drop-shadow-md pointer-events-none">
                          {c.title}
                        </h3>
                      </div>
                      
                      <div className="p-4 bg-white flex justify-end space-x-2">
                        <button
                          onClick={() => {
                            setEditingCategory(c);
                            setCategoryForm({ title: c.title, image: c.image || '' });
                          }}
                          className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 text-gray-700 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(c._id)}
                          className="px-4 py-2 bg-red-50 border border-red-100 hover:bg-red-100 hover:border-red-200 text-red-600 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-xl p-8 shadow-sm animate-fadeIn">
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

                <div className="pt-4">
                  <button type="submit" className="w-full py-4 bg-black hover:bg-slate-800 text-white font-black text-sm uppercase tracking-widest rounded-lg transition-colors shadow-md">
                    Save Global Settings
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
