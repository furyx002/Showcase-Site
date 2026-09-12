'use client';

import React, { useState, useEffect } from 'react';
import { FolderTree, Plus, Edit3, Trash2, X, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { api } from '../../../lib/api';
import toast from 'react-hot-toast';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({ title: '', image: '' });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.getCategories();
      setCategories(res || []);
    } catch (err) {
      toast.error('Failed to load categories');
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
      toast.success('Category saved successfully');
      loadData();
    } catch (err) {
      toast.error(err.message || 'Failed to save category');
    }
  };

  const handleDeleteCategory = (catId) => {
    toast((t) => (
      <div>
        <p className="mb-2 font-semibold text-gray-900">Are you sure you want to delete this category?</p>
        <div className="flex gap-2">
          <button 
            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await api.deleteCategory(catId);
                toast.success('Category deleted');
                loadData();
              } catch (err) {
                toast.error(err.message || 'Failed to delete category');
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

  return (
    <div className="flex flex-col h-full animate-fadeIn">
      {/* Header */}
      <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 lg:px-10 shrink-0 shadow-sm -mt-4 -mx-4 md:-mt-8 md:-mx-8 mb-6">
        <h1 className="text-xl font-black text-gray-900 uppercase tracking-widest">
          {editingCategory ? (editingCategory._id ? 'Edit Category' : 'Add New Category') : 'Category Management'}
        </h1>
        <div className="flex items-center space-x-4">
          {!editingCategory && (
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

      {/* Main Content */}
      <div className="max-w-6xl mx-auto w-full">
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
    </div>
  );
}
