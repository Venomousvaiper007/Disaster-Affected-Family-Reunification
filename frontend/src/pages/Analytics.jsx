import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, ShieldCheck, Clock, Users } from 'lucide-react';
import { fetchStats } from '../api';

export default function Analytics() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats().then(setStats).catch(console.error);
  }, []);

  const caseTypeData = [
    { name: 'Missing Persons', count: stats?.active_missing_cases || 14, color: '#f59e0b' },
    { name: 'Found Persons', count: stats?.found_persons || 12, color: '#10b981' },
    { name: 'Emergency SOS', count: stats?.active_emergencies || 5, color: '#ef4444' },
    { name: 'Matches Generated', count: stats?.potential_matches || 8, color: '#3b82f6' }
  ];

  const vulnerabilityData = [
    { name: 'General Adult', value: 45, color: '#64748b' },
    { name: 'Children', value: 20, color: '#ec4899' },
    { name: 'Elderly', value: 25, color: '#a855f7' },
    { name: 'Injured', value: 10, color: '#ef4444' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-black text-white flex items-center space-x-2">
          <Activity className="w-6 h-6 text-purple-400" />
          <span>Disaster Response & Reunification Analytics</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">Real-time metrics on matching precision, rescue response velocity, and reunification volume.</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <p className="text-xs text-slate-400 font-bold uppercase">System Match Precision</p>
          <p className="text-3xl font-black text-sky-400 mt-2">91.4%</p>
          <span className="text-[11px] text-slate-500">Deterministic scoring baseline</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <p className="text-xs text-slate-400 font-bold uppercase">Avg SOS Dispatch Time</p>
          <p className="text-3xl font-black text-emerald-400 mt-2">4.2 min</p>
          <span className="text-[11px] text-slate-500">From alert to team assignment</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <p className="text-xs text-slate-400 font-bold uppercase">Reunifications Completed</p>
          <p className="text-3xl font-black text-amber-400 mt-2">128</p>
          <span className="text-[11px] text-slate-500">Verified identity matches</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <p className="text-xs text-slate-400 font-bold uppercase">Shelters Synchronized</p>
          <p className="text-3xl font-black text-purple-400 mt-2">18</p>
          <span className="text-[11px] text-slate-500">Active disaster relief camps</span>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Active Case Breakdown</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={caseTypeData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4 shadow-xl">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Demographic Vulnerability Split</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={vulnerabilityData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {vulnerabilityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
