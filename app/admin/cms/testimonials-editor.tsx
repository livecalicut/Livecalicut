'use client';

import React, { useState } from 'react';
import { updateCMSTestimonialsAction } from './actions';
import { Save, Loader2, Plus, Trash2 } from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  text: string;
  rating: number;
}

export const TestimonialsEditor = ({ initialData = [] }: { initialData: Testimonial[] }) => {
  const [items, setItems] = useState<Testimonial[]>(initialData);
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdate = (index: number, field: keyof Testimonial, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleAdd = () => {
    setItems([...items, { name: '', role: '', text: '', rating: 5 }]);
  };

  const handleRemove = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await updateCMSTestimonialsAction(items);
      if (res.error) throw new Error(res.error);
      alert('Testimonials updated successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to update Testimonials');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="p-4 border border-gray-200 rounded-lg space-y-3 bg-gray-50 relative">
            <button type="button" onClick={() => handleRemove(i)} className="absolute top-4 right-4 text-rose-500 hover:text-rose-700">
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="grid grid-cols-2 gap-4 pr-8">
              <div>
                <label className="text-xs font-bold text-gray-700">Name</label>
                <input required value={item.name} onChange={(e) => handleUpdate(i, 'name', e.target.value)} className="w-full px-3 py-1.5 border rounded-md text-sm mt-1" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700">Role & Company</label>
                <input required value={item.role} onChange={(e) => handleUpdate(i, 'role', e.target.value)} className="w-full px-3 py-1.5 border rounded-md text-sm mt-1" />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-bold text-gray-700">Testimonial Text</label>
                <textarea required value={item.text} onChange={(e) => handleUpdate(i, 'text', e.target.value)} rows={2} className="w-full px-3 py-1.5 border rounded-md text-sm mt-1" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700">Star Rating (1-5)</label>
                <input required type="number" min="1" max="5" value={item.rating} onChange={(e) => handleUpdate(i, 'rating', Number(e.target.value))} className="w-full px-3 py-1.5 border rounded-md text-sm mt-1" />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex items-center gap-4">
        <button type="button" onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg text-sm hover:bg-gray-200">
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
        <button type="submit" disabled={isSaving} className="flex items-center gap-2 px-6 py-2 bg-amber-600 text-white font-bold rounded-lg text-sm hover:bg-amber-700 disabled:opacity-50">
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Testimonials
        </button>
      </div>
    </form>
  );
};
