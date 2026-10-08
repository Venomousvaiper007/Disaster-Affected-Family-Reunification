import React, { useState } from 'react';
import { Search, ShieldCheck, Clock, CheckCircle2, HeartHandshake, AlertCircle } from 'lucide-react';
import { trackFamily } from '../api';

export default function FamilyTrack({ t }) {
  const [query, setQuery] = useState('MP-1024');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await trackFamily(query);
      setResult(data);
    } catch (err) {
      setError(err.message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 bg-sky-950 border border-sky-800 px-3 py-1 rounded-full text-xs font-bold text-sky-400">
          <HeartHandshake className="w-4 h-4" />
          <span>PRIVACY-PRESERVING FAMILY TRACKING PORTAL</span>
        </div>

        <h1 className="text-3xl font-black text-white">Track Your Loved One's Status</h1>
        <p className="text-xs text-slate-300 max-w-xl mx-auto">
          Enter your official Case ID (e.g., MP-1024) or registered phone number to receive real-time updates from relief shelters and disaster rescue command.
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
          <input 
            type="text" required
            placeholder="Enter Case ID (MP-1024) or Phone Number (+91 98401 12345)..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-sky-500"
          />
        </div>

        <button 
          type="submit" disabled={loading}
          className="px-6 py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black rounded-xl text-sm shadow-lg transition whitespace-nowrap"
        >
          {loading ? 'Searching...' : 'Track Status'}
        </button>
      </form>

      {error && (
        <div className="bg-red-950/60 border border-red-800 p-4 rounded-xl text-xs text-red-300 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {result && (
        <div className="bg-slate-900 border border-sky-500/40 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-mono font-bold text-sky-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">{result.case_id}</span>
              <h2 className="text-2xl font-black text-white mt-2">{result.person_name}</h2>
              <p className="text-xs text-slate-400 mt-1">Last System Update: {result.last_updated}</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Official Case Status</span>
              <span className="text-sm font-black text-amber-400 mt-1 block">{result.public_status}</span>
            </div>
          </div>

          <div className="bg-sky-950/40 border border-sky-800/60 p-4 rounded-xl text-xs text-sky-200 leading-relaxed">
            💬 <strong>Status Message:</strong> {result.message}
          </div>

          {/* Public Timeline */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Clock className="w-4 h-4 text-sky-400" />
              <span>Public Relief Timeline Updates</span>
            </h3>

            <div className="space-y-3">
              {result.public_timeline?.map((ev, idx) => (
                <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-amber-400">{ev.timestamp} — {ev.location}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{ev.status}</span>
                  </div>
                  <p className="text-xs text-slate-300">{ev.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
