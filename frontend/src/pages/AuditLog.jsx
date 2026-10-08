import React, { useEffect, useState } from 'react';
import { FileText, Shield, Search } from 'lucide-react';
import { fetchAuditLogs } from '../api';

export default function AuditLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchAuditLogs().then(data => {
      setLogs(data);
      setLoading(false);
    }).catch(console.error);
  }, []);

  const filteredLogs = logs.filter(l => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      (l.case_id && l.case_id.toLowerCase().includes(s)) ||
      (l.actor && l.actor.toLowerCase().includes(s)) ||
      (l.action && l.action.toLowerCase().includes(s)) ||
      (l.details && l.details.toLowerCase().includes(s))
    );
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center space-x-2">
            <FileText className="w-6 h-6 text-slate-400" />
            <span>Platform Audit & Accountability Logs</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Immutable record of system matching actions, responder verifications, emergency dispatches, and user reports.</p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input 
            type="text"
            placeholder="Search audit trail..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white outline-none w-64 focus:border-slate-700"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400 text-xs animate-pulse">Loading platform audit logs...</div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Timestamp</th>
                  <th className="p-3.5">Case ID</th>
                  <th className="p-3.5">Actor / User</th>
                  <th className="p-3.5">Action Code</th>
                  <th className="p-3.5">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {filteredLogs.map(l => (
                  <tr key={l.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3.5 text-slate-400">{l.timestamp}</td>
                    <td className="p-3.5 text-amber-400 font-bold">{l.case_id || 'SYSTEM'}</td>
                    <td className="p-3.5 text-slate-200">{l.actor}</td>
                    <td className="p-3.5">
                      <span className="bg-slate-950 text-sky-400 px-2 py-0.5 rounded border border-slate-800 text-[10px]">
                        {l.action}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-300 max-w-xs truncate">{l.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
