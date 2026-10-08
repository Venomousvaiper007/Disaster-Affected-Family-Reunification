import React, { useState } from 'react';
import { UserCheck, CheckCircle2, ArrowLeft, Send } from 'lucide-react';
import { postFoundReport } from '../api';

export default function ReportFound({ setCurrentTab, onSelectCase, t }) {
  const [formData, setFormData] = useState({
    name_if_known: 'Unknown Male',
    age_approx: 42,
    gender: 'Male',
    height_approx: "5'8\"",
    physical_marks: 'Scar on right hand',
    clothing: 'Blue shirt, dark trousers',
    hair: 'Short dark hair',
    current_location: 'St. John Relief Center (Shelter A)',
    time_found: '11:20 AM',
    condition: 'Stable & Oriented',
    shelter_or_hospital: 'St. John Relief Center',
    reporter_name: 'Shelter Coordinator',
    reporter_contact: '+91 98400 99887',
    reporter_relationship: 'Shelter Staff',
    photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400'
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await postFoundReport({
        ...formData,
        age_approx: formData.age_approx ? parseInt(formData.age_approx, 10) : None
      });
      setResult(res);
    } catch (err) {
      alert("Error submitting found report: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center space-x-2">
            <span className="text-sky-400">REPORT FOUND PERSON</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Register an unidentified or rescued individual located at a shelter, hospital, or evacuation center.</p>
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
        <div className="bg-slate-900 border border-sky-500/40 rounded-2xl p-8 text-center space-y-4 shadow-2xl">
          <CheckCircle2 className="w-16 h-16 text-sky-400 mx-auto" />
          <h2 className="text-2xl font-bold text-white">Found Person Registered</h2>
          <p className="text-slate-300 text-sm">
            Case ID generated: <strong className="text-sky-400 text-xl font-mono px-2 py-1 bg-slate-950 rounded border border-sky-500/30">{result.case_id}</strong>
          </p>
          <p className="text-xs text-slate-400">Status: <span className="text-amber-400 font-bold">Unverified Found Person</span> (Pending Responder Review)</p>
          <div className="pt-4">
            <button 
              onClick={() => onSelectCase(result.case_id)}
              className="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl text-sm"
            >
              View Case Record →
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-sky-400 border-b border-slate-800 pb-2">1. Person Information (As Known or Approximate)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Name (If Known or Unknown #)</label>
                <input 
                  type="text"
                  value={formData.name_if_known}
                  onChange={e => setFormData({...formData, name_if_known: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Approximate Age</label>
                <input 
                  type="number"
                  value={formData.age_approx}
                  onChange={e => setFormData({...formData, age_approx: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Gender</label>
                <select 
                  value={formData.gender}
                  onChange={e => setFormData({...formData, gender: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other / Unknown</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-sky-400 border-b border-slate-800 pb-2">2. Physical Descriptors & Clothing</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Physical Marks / Scars / Identification</label>
                <input 
                  type="text"
                  value={formData.physical_marks}
                  onChange={e => setFormData({...formData, physical_marks: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Clothing Description</label>
                <input 
                  type="text"
                  value={formData.clothing}
                  onChange={e => setFormData({...formData, clothing: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-sky-400 border-b border-slate-800 pb-2">3. Current Location & Facility</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Current Facility / Shelter / Hospital *</label>
                <input 
                  type="text" required
                  value={formData.shelter_or_hospital}
                  onChange={e => setFormData({...formData, shelter_or_hospital: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Current Specific Location *</label>
                <input 
                  type="text" required
                  value={formData.current_location}
                  onChange={e => setFormData({...formData, current_location: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Time Found / Admitted *</label>
                <input 
                  type="text" required
                  value={formData.time_found}
                  onChange={e => setFormData({...formData, time_found: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit" disabled={loading}
              className="w-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-black py-3.5 rounded-xl shadow-lg transition flex items-center justify-center space-x-2 text-sm"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Registering...' : 'REGISTER FOUND PERSON'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
