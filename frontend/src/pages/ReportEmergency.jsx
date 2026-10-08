import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, ArrowLeft, Send } from 'lucide-react';
import { postEmergencyReport } from '../api';

export default function ReportEmergency({ setCurrentTab, onSelectCase, t }) {
  const [formData, setFormData] = useState({
    emergency_type: 'PERSON_TRAPPED',
    location: 'XYZ Road, Near Railway Overbridge',
    num_people: 3,
    condition: '1 person severely injured, 2 trapped in second floor debris.',
    description: 'Structural collapse due to flash flooding. Heavy rescue tools required.',
    fatality_unverified: false,
    reporter_name: 'Karthik M',
    reporter_contact: '+91 97900 11223'
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleTypeChange = (type) => {
    const isFatality = type === 'POSSIBLE_FATALITY';
    setFormData({
      ...formData,
      emergency_type: type,
      fatality_unverified: isFatality
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await postEmergencyReport({
        ...formData,
        num_people: parseInt(formData.num_people, 10)
      });
      setResult(res);
    } catch (err) {
      alert("Emergency SOS failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between border-b border-red-900/60 pb-4">
        <div>
          <h1 className="text-3xl font-black text-red-500 flex items-center space-x-2">
            <ShieldAlert className="w-8 h-8 animate-pulse" />
            <span>REPORT EMERGENCY (SOS)</span>
          </h1>
          <p className="text-xs text-slate-300 mt-1">High-priority emergency dispatch signal for trapped individuals, critical injuries, and urgent rescue.</p>
        </div>
        <button 
          onClick={() => setCurrentTab('home')}
          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-semibold flex items-center space-x-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      {result ? (
        <div className="bg-slate-900 border border-red-500/60 rounded-2xl p-8 text-center space-y-4 shadow-2xl">
          <CheckCircle2 className="w-16 h-16 text-red-500 mx-auto animate-bounce" />
          <h2 className="text-2xl font-bold text-white">Emergency SOS Dispatched to Command Center</h2>
          <p className="text-slate-300 text-sm">
            Emergency Case ID: <strong className="text-red-400 text-xl font-mono px-2 py-1 bg-slate-950 rounded border border-red-500/40">{result.case_id}</strong>
          </p>
          <p className="text-xs text-red-400 font-bold bg-red-950/80 p-3 rounded-xl border border-red-800 max-w-md mx-auto">
            Priority Automatically Calculated: <span className="uppercase tracking-widest">{result.priority}</span> — Rescue teams notified!
          </p>
          <div className="pt-4 flex justify-center space-x-3">
            <button 
              onClick={() => setCurrentTab('command')}
              className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl text-sm shadow-xl"
            >
              Open Rescue Command Center →
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-red-900/40 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
          {/* Emergency Type Selector */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-red-400">Emergency Situation Type *</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { id: 'PERSON_IN_DANGER', label: 'Person in immediate danger', icon: '⚠️' },
                { id: 'PERSON_TRAPPED', label: 'Person trapped in structure', icon: '🏗️' },
                { id: 'INJURED_PERSON', label: 'Injured person needing rescue', icon: '🚑' },
                { id: 'MULTIPLE_PEOPLE', label: 'Multiple people trapped', icon: '👥' },
                { id: 'STRUCTURAL_DANGER', label: 'Structural collapse risk', icon: '🏚️' },
                { id: 'POSSIBLE_FATALITY', label: 'Possible Fatality (Unverified)', icon: '⚠️' },
              ].map(item => (
                <button
                  type="button" key={item.id}
                  onClick={() => handleTypeChange(item.id)}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center space-x-2 transition ${formData.emergency_type === item.id ? 'bg-red-950 border-red-500 text-white shadow-lg' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'}`}
                >
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* UNVERIFIED FATALITY MANDATORY WARNING BOX */}
          {formData.emergency_type === 'POSSIBLE_FATALITY' && (
            <div className="bg-amber-950/80 border-2 border-amber-500 p-4 rounded-xl text-amber-200 text-xs space-y-2">
              <div className="flex items-center space-x-2 font-bold text-amber-300 text-sm">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <span>UNVERIFIED REPORT PROTOCOL NOTICE</span>
              </div>
              <p>
                This report will be marked as <strong className="text-white">Possible Fatality — Unverified</strong>. Civilians cannot officially confirm a fatality. Only authorized emergency response authorities and medical personnel can confirm identity and state.
              </p>
            </div>
          )}

          {/* Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Exact Location / Pin Coordinates *</label>
              <input 
                type="text" required
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Estimated Number of Affected People *</label>
              <input 
                type="number" required min="1"
                value={formData.num_people}
                onChange={e => setFormData({...formData, num_people: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Detailed Situation Description *</label>
            <textarea 
              required rows="3"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Reporter Name *</label>
              <input 
                type="text" required
                value={formData.reporter_name}
                onChange={e => setFormData({...formData, reporter_name: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Contact Phone Number *</label>
              <input 
                type="text" required
                value={formData.reporter_contact}
                onChange={e => setFormData({...formData, reporter_contact: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black py-4 rounded-xl shadow-2xl transition flex items-center justify-center space-x-2 text-base tracking-wide border border-red-400/40"
            >
              <ShieldAlert className="w-5 h-5 animate-pulse" />
              <span>{loading ? 'DISPATCHING SOS...' : 'SEND EMERGENCY SOS DISPATCH SIGNAL'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
