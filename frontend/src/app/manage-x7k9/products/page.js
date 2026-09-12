'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Package, Plus, Search, Edit3, Trash2, X, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { api } from '../../../lib/api';
import toast from 'react-hot-toast';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '', category: '', price: '', originalPrice: '', stock: 100, images: [], badges: ''
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.getProducts(),
        api.getCategories()
      ]);
      setProducts(prodRes.data || []);
      setCategories(catRes || []);
    } catch (err) {
      toast.error('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleImageUpload = async (e, callback) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      setLoading(true);
      const res = await api.uploadImage(formData);
      if (res.imageUrl) {
        callback(res.imageUrl);
      }
    } catch (err) {
      toast.error('Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: productForm.name,
        category: productForm.category,
        price: Number(productForm.price),
        originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : 0,
        stock: Number(productForm.stock),
        images: productForm.images,
        badges: productForm.badges.split(',').map(b => b.trim()).filter(Boolean)
      };

      if (editingProduct && editingProduct._id) {
        payload._id = editingProduct._id;
      }

      await api.saveProduct(payload);
      setEditingProduct(null);
      toast.success('Product saved successfully');
      loadData();
    } catch (err) {
      toast.error(err.message || 'Failed to save product');
    }
  };

  const handleDeleteProduct = (prodId) => {
    toast((t) => (
      <div>
        <p className="mb-2 font-semibold text-gray-900">Are you sure you want to delete this product?</p>
        <div className="flex gap-2">
          <button 
            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await api.deleteProduct(prodId);
                toast.success('Product deleted');
                loadData();
              } catch (err) {
                toast.error(err.message || 'Failed to delete product');
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

  const removeImage = (index) => {
    const newImages = [...productForm.images];
    newImages.splice(index, 1);
    setProductForm({ ...productForm, images: newImages });
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [products, searchQuery]);

  return (
    <div className="flex flex-col h-full animate-fadeIn">
      {/* Header */}
      <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 lg:px-10 shrink-0 shadow-sm -mt-4 -mx-4 md:-mt-8 md:-mx-8 mb-6">
        <h1 className="text-xl font-black text-gray-900 uppercase tracking-widest">
          {editingProduct ? (editingProduct._id ? 'Edit Product' : 'Add New Product') : 'Products Catalog'}
        </h1>
        <div className="flex items-center space-x-4">
          {!editingProduct && (
            <button
              onClick={() => {
                setEditingProduct({ name: '', category: categories[0]?.title.replace(/\n/g, ' ') || '', price: '', stock: 100, images: [] });
                setProductForm({ name: '', category: categories[0]?.title.replace(/\n/g, ' ') || '', price: '', originalPrice: '', stock: 100, images: [], badges: '' });
              }}
              className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-md text-sm flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Add Product</span>
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

      {/* Main Content */}
      <div className="max-w-6xl mx-auto w-full">
        {editingProduct ? (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-8">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-bold text-gray-700 uppercase tracking-widest text-sm">Product Details</h3>
              <button type="button" onClick={() => setEditingProduct(null)} className="text-gray-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveProduct} className="p-6 md:p-8 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
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
          <div className="space-y-6">
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
    </div>
  );
}
