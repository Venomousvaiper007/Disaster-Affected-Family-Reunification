import React, { useState } from 'react';
import { useCommand } from '../../context/CommandContext';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Users,
  ShieldCheck,
  Calendar,
  Layers
} from 'lucide-react';

export const AnalyticsDashboard = () => {
  const { cases, matches, shelters, t } = useCommand();

  // Timeline Trends (Missing vs Found vs Reunited)
  const trendData = [
    { time: '04:00', missing: 2, found: 1, reunited: 0 },
    { time: '07:00', missing: 6, found: 3, reunited: 0 },
    { time: '10:00', missing: 12, found: 8, reunited: 1 },
    { time: '13:00', missing: 18, found: 14, reunited: 2 },
    { time: '16:00', missing: 21, found: 19, reunited: 4 },
  ];

  // Status Distribution with Humanitarian Palette
  const statusData = [
    { name: 'Reported', value: cases.filter(c => c.status === 'REPORTED').length, color: '#687A7C' },
    { name: 'Under Review', value: cases.filter(c => c.status === 'UNDER_REVIEW').length, color: '#7C3AED' },
    { name: 'Potential Match', value: cases.filter(c => c.status === 'POTENTIAL_MATCH').length, color: '#155E63' },
    { name: 'Verify Queue', value: cases.filter(c => c.status === 'AWAITING_VERIFICATION').length, color: '#B7791F' },
    { name: 'Reunited', value: cases.filter(c => c.status === 'REUNIFICATION_CONFIRMED').length, color: '#24856A' },
    { name: 'Escalated', value: cases.filter(c => c.status === 'ESCALATED').length, color: '#C83D4D' },
  ];

  // Response Centre Workload Data
  const centreData = [
    { name: 'Velachery', cases: 8, capacity: 450, occupancy: 382 },
    { name: 'St. Thomas Mt', cases: 5, capacity: 600, occupancy: 510 },
    { name: 'Saidapet', cases: 6, capacity: 350, occupancy: 340 },
    { name: 'Tambaram', cases: 4, capacity: 500, occupancy: 280 },
    { name: 'Cuddalore Port', cases: 7, capacity: 800, occupancy: 690 },
  ];

  // Custom Light Tooltip for Humanitarian Theme
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-[#E1E9E7] p-3 rounded-xl shadow-soft-md text-xs space-y-1">
          <p className="font-mono font-bold text-[#1D3033] border-b border-[#E1E9E7] pb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="flex items-center gap-2" style={{ color: entry.color }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-[#687A7C]">{entry.name}:</span>
              <span className="font-mono font-bold text-[#1D3033]">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white border border-[#E1E9E7] rounded-xl p-5 shadow-soft-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#D8F3EF] border border-[#155E63]/20 text-[#155E63]">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-[#1D3033] uppercase tracking-wider font-mono">
              {t('analyticsTitle')}
            </h1>
            <p className="text-xs text-[#687A7C] font-sans">
              {t('analyticsSubtitle')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#687A7C] font-mono">
          <Calendar className="w-4 h-4 text-[#155E63]" />
          <span>Operational Window: Past 24 Hours</span>
        </div>
      </div>

      {/* KPI Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E1E9E7] rounded-xl p-5 shadow-soft-sm space-y-1">
          <div className="flex items-center justify-between text-[#687A7C] text-xs">
            <span>{t('timeToFirstReview')}</span>
            <Clock className="w-4 h-4 text-[#155E63]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#1D3033]">18.4 Mins</div>
          <div className="text-[11px] text-emerald-700 font-mono">↓ 4.2m vs yesterday's shift</div>
        </div>

        <div className="bg-white border border-[#E1E9E7] rounded-xl p-5 shadow-soft-sm space-y-1">
          <div className="flex items-center justify-between text-[#687A7C] text-xs">
            <span>{t('timeToVerify')}</span>
            <CheckCircle2 className="w-4 h-4 text-[#24856A]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#24856A]">2.1 Hours</div>
          <div className="text-[11px] text-[#687A7C] font-mono">From candidate match creation</div>
        </div>

        <div className="bg-white border border-[#E1E9E7] rounded-xl p-5 shadow-soft-sm space-y-1">
          <div className="flex items-center justify-between text-[#687A7C] text-xs">
            <span>{t('matchPrecision')}</span>
            <TrendingUp className="w-4 h-4 text-[#7C3AED]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#7C3AED]">91.8%</div>
          <div className="text-[11px] text-[#687A7C] font-mono">Post human review verification</div>
        </div>

        <div className="bg-white border border-[#E1E9E7] rounded-xl p-5 shadow-soft-sm space-y-1">
          <div className="flex items-center justify-between text-[#687A7C] text-xs">
            <span>{t('syncReliability')}</span>
            <ShieldCheck className="w-4 h-4 text-[#24856A]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#1D3033]">99.94%</div>
          <div className="text-[11px] text-emerald-700 font-mono">Zero data loss in offline mode</div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Registration & Reunification Trends Area Chart (8 Cols) */}
        <div className="lg:col-span-8 bg-white border border-[#E1E9E7] rounded-xl p-5 shadow-soft-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#E1E9E7] pb-3">
            <h3 className="text-sm font-bold text-[#1D3033] uppercase font-mono tracking-wider">
              Disaster Report Influx & Reunification Progression
            </h3>
            <span className="text-[10px] text-[#155E63] font-mono font-bold">Cumulative 24h</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMissing" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F47C65" stopOpacity={0.7}/>
                    <stop offset="95%" stopColor="#F47C65" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorFound" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#155E63" stopOpacity={0.7}/>
                    <stop offset="95%" stopColor="#155E63" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorReunited" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#24856A" stopOpacity={0.7}/>
                    <stop offset="95%" stopColor="#24856A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E1E9E7" vertical={false} />
                <XAxis dataKey="time" stroke="#687A7C" tick={{ fill: '#687A7C', fontSize: 11 }} />
                <YAxis stroke="#687A7C" tick={{ fill: '#687A7C', fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                <Area type="monotone" dataKey="missing" name="Missing Reports" stroke="#F47C65" strokeWidth={2} fillOpacity={1} fill="url(#colorMissing)" />
                <Area type="monotone" dataKey="found" name="Found Records" stroke="#155E63" strokeWidth={2} fillOpacity={1} fill="url(#colorFound)" />
                <Area type="monotone" dataKey="reunited" name="Reunifications" stroke="#24856A" strokeWidth={2} fillOpacity={1} fill="url(#colorReunited)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Case Status Distribution Donut Chart (4 Cols) */}
        <div className="lg:col-span-4 bg-white border border-[#E1E9E7] rounded-xl p-5 shadow-soft-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#E1E9E7] pb-3">
            <h3 className="text-sm font-bold text-[#1D3033] uppercase font-mono tracking-wider">
              Status Distribution
            </h3>
            <span className="text-[10px] text-[#155E63] font-mono font-bold">{cases.length} Total</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Response Centre Workload Bar Chart (12 Cols) */}
        <div className="lg:col-span-12 bg-white border border-[#E1E9E7] rounded-xl p-5 shadow-soft-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#E1E9E7] pb-3">
            <h3 className="text-sm font-bold text-[#1D3033] uppercase font-mono tracking-wider">
              Active Case Workload & Shelter Occupancy by Sector
            </h3>
            <span className="text-[10px] text-[#155E63] font-mono font-bold">Real-Time Intake</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={centreData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E1E9E7" vertical={false} />
                <XAxis dataKey="name" stroke="#687A7C" tick={{ fill: '#687A7C', fontSize: 11 }} />
                <YAxis stroke="#687A7C" tick={{ fill: '#687A7C', fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                <Bar dataKey="cases" name="Active Missing/Found Cases" fill="#155E63" radius={[4, 4, 0, 0]} />
                <Bar dataKey="occupancy" name="Shelter Occupants" fill="#80CEC3" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
