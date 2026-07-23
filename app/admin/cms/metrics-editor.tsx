'use client';

import React, { useState } from 'react';
import { updateCMSMetricsAction } from './actions';
import { Save, Loader2, Plus, Trash2 } from 'lucide-react';

interface Metric {
  value: string;
  label: string;
  subtext: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export const MetricsEditor = ({ initialData = [] }: { initialData: Metric[] }) => {
  const [metrics, setMetrics] = useState<Metric[]>(initialData);
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdate = (index: number, field: keyof Metric, value: string) => {
    const newMetrics = [...metrics];
    newMetrics[index] = { ...newMetrics[index], [field]: value };
    setMetrics(newMetrics);
  };

  const handleAdd = () => {
    setMetrics([...metrics, {
      value: '', label: '', subtext: '', icon: 'Activity', color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200'
    }]);
  };

  const handleRemove = (index: number) => {
    setMetrics(metrics.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await updateCMSMetricsAction(metrics);
      if (res.error) throw new Error(res.error);
      alert('Metrics updated successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to update Metrics');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {metrics.map((metric, i) => (
          <div key={i} className="p-4 border border-gray-200 rounded-lg space-y-3 bg-gray-50 relative">
            <button type="button" onClick={() => handleRemove(i)} className="absolute top-4 right-4 text-rose-500 hover:text-rose-700">
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="grid grid-cols-2 gap-4 pr-8">
              <div>
                <label className="text-xs font-bold text-gray-700">Value (e.g. 12,400+)</label>
                <input required value={metric.value} onChange={(e) => handleUpdate(i, 'value', e.target.value)} className="w-full px-3 py-1.5 border rounded-md text-sm mt-1" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700">Label (e.g. Verified Outlets)</label>
                <input required value={metric.label} onChange={(e) => handleUpdate(i, 'label', e.target.value)} className="w-full px-3 py-1.5 border rounded-md text-sm mt-1" />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-bold text-gray-700">Subtext</label>
                <input required value={metric.subtext} onChange={(e) => handleUpdate(i, 'subtext', e.target.value)} className="w-full px-3 py-1.5 border rounded-md text-sm mt-1" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700">Icon (Lucide Name)</label>
                <input required value={metric.icon} onChange={(e) => handleUpdate(i, 'icon', e.target.value)} className="w-full px-3 py-1.5 border rounded-md text-sm mt-1" />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex items-center gap-4">
        <button type="button" onClick={handleAdd} className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg text-sm hover:bg-gray-200">
          <Plus className="w-4 h-4" /> Add Metric
        </button>
        <button type="submit" disabled={isSaving} className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white font-bold rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Metrics
        </button>
      </div>
    </form>
  );
};
