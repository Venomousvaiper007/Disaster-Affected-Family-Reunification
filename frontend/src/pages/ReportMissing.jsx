import React, { useState } from 'react';
import { UserCheck, AlertCircle, CheckCircle2, ArrowLeft, Send } from 'lucide-react';
import { postMissingReport } from '../api';

export default function ReportMissing({ setCurrentTab, onSelectCase, t }) {
  const [formData, setFormData] = useState({
    name: 'Ravi Kumar',
    age: 42,
    gender: 'Male',
    height: "5'8\"",
    physical_marks: 'Scar on right hand',
    clothing: 'Blue shirt',
    hair: 'Short dark hair',
    last_known_location: 'Central Railway Station',
    last_known_time: '10:00 AM',
    circumstances: 'Separated during sudden station stampede evacuation.',
    vulnerability: 'GENERAL_ADULT',
    reporter_name: 'Priya Kumar',
    reporter_contact: '+91 98401 12345',
    reporter_relationship: 'Wife',
    photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400'
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await postMissingReport({
        ...formData,
        age: parseInt(formData.age, 10)
      });
      setResult(res);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center space-x-2">
            <span className="text-amber-400">REPORT MISSING PERSON</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Submit official missing person details to run intelligent multi-factor matching against relief shelters & hospitals.</p>
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
        <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-8 text-center space-y-4 shadow-2xl">
          <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
          <h2 className="text-2xl font-bold text-white">Missing Person Report Submitted</h2>
          <p className="text-slate-300 text-sm">
            Case ID generated: <strong className="text-amber-400 text-xl font-mono px-2 py-1 bg-slate-950 rounded border border-amber-500/30">{result.case_id}</strong>
          </p>
          {result.highest_match_score > 0 && (
            <p className="text-xs text-sky-400 bg-sky-950/60 border border-sky-800/60 p-3 rounded-xl max-w-md mx-auto">
              🔔 Smart Match Engine triggered! Highest match confidence: <strong>{result.highest_match_score}%</strong>
            </p>
          )}
          <div className="pt-4 flex justify-center space-x-3">
            <button 
              onClick={() => onSelectCase(result.case_id)}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm"
            >
              View Case Dashboard & Match Rationale →
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          {error && (
            <div className="bg-red-950/60 border border-red-800 text-red-300 p-3 rounded-xl text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 border-b border-slate-800 pb-2">1. Basic Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name *</label>
                <input 
                  type="text" required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Age *</label>
                <input 
                  type="number" required
                  value={formData.age}
                  onChange={e => setFormData({...formData, age: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Gender *</label>
                <select 
                  value={formData.gender}
                  onChange={e => setFormData({...formData, gender: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Identifying Characteristics */}
          <div className="space-y-4 pt-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 border-b border-slate-800 pb-2">2. Physical Identifying Characteristics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Physical Marks / Scars / Tattoos</label>
                <input 
                  type="text"
                  placeholder="e.g. Scar on right hand, birthmark"
                  value={formData.physical_marks}
                  onChange={e => setFormData({...formData, physical_marks: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Clothing Description</label>
                <input 
                  type="text"
                  placeholder="e.g. Blue shirt, dark trousers"
                  value={formData.clothing}
                  onChange={e => setFormData({...formData, clothing: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Disaster Location & Time */}
          <div className="space-y-4 pt-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 border-b border-slate-800 pb-2">3. Disaster Last Seen Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Last Known Location *</label>
                <input 
                  type="text" required
                  value={formData.last_known_location}
                  onChange={e => setFormData({...formData, last_known_location: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Last Known Time *</label>
                <input 
                  type="text" required
                  value={formData.last_known_time}
                  onChange={e => setFormData({...formData, last_known_time: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Vulnerability Category</label>
                <select 
                  value={formData.vulnerability}
                  onChange={e => setFormData({...formData, vulnerability: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="GENERAL_ADULT">General Adult</option>
                  <option value="CHILD">Child</option>
                  <option value="ELDERLY">Elderly</option>
                  <option value="INJURED">Injured</option>
                  <option value="DISABLED">Disabled</option>
                  <option value="PREGNANT">Pregnant</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Reporter Contact Info */}
          <div className="space-y-4 pt-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 border-b border-slate-800 pb-2">4. Reporter Contact Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Reporter Name *</label>
                <input 
                  type="text" required
                  value={formData.reporter_name}
                  onChange={e => setFormData({...formData, reporter_name: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Contact Phone Number *</label>
                <input 
                  type="text" required
                  value={formData.reporter_contact}
                  onChange={e => setFormData({...formData, reporter_contact: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Relationship</label>
                <input 
                  type="text"
                  value={formData.reporter_relationship}
                  onChange={e => setFormData({...formData, reporter_relationship: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit" disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3.5 rounded-xl shadow-lg transition flex items-center justify-center space-x-2 text-sm"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Submitting Report...' : 'SUBMIT MISSING PERSON REPORT'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
