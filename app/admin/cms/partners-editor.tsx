'use client';

import React, { useState } from 'react';
import { updateCMSPartnersAction } from './actions';
import { Save, Loader2, Plus, Trash2 } from 'lucide-react';

interface Partner {
  name: string;
  role: string;
}

export const PartnersEditor = ({ initialData = [] }: { initialData: Partner[] }) => {
  const [items, setItems] = useState<Partner[]>(initialData);
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdate = (index: number, field: keyof Partner, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleAdd = () => {
    setItems([...items, { name: '', role: '' }]);
  };

  const handleRemove = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await updateCMSPartnersAction(items);
      if (res.error) throw new Error(res.error);
      alert('Partners updated successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to update Partners');
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
                <label className="text-xs font-bold text-gray-700">Partner Name</label>
                <input required value={item.name} onChange={(e) => handleUpdate(i, 'name', e.target.value)} className="w-full px-3 py-1.5 border rounded-md text-sm mt-1" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700">Role / Type</label>
                <input required value={item.role} onChange={(e) => handleUpdate(i, 'role', e.target.value)} className="w-full px-3 py-1.5 border rounded-md text-sm mt-1" />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex items-center gap-4">
        <button type="button" onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg text-sm hover:bg-gray-200">
          <Plus className="w-4 h-4" /> Add Partner
        </button>
        <button type="submit" disabled={isSaving} className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white font-bold rounded-lg text-sm hover:bg-purple-700 disabled:opacity-50">
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Partners
        </button>
      </div>
    </form>
  );
};
