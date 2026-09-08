// src/components/KpiCards.tsx
import { FareAnalyzeResult } from '../api/client';

interface KpiCardsProps {
  data: FareAnalyzeResult;
}

function formatINR(v: number) {
  return `₹${v.toLocaleString('en-IN')}`;
}

function ChangeChip({ value }: { value: number }) {
  const positive = value >= 0;
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
        positive ? 'bg-red-500/15 text-red-400' : 'bg-emerald-500/15 text-emerald-400'
      }`}
    >
      {positive ? '↑' : '↓'} {Math.abs(value)}%
    </span>
  );
}

export default function KpiCards({ data }: KpiCardsProps) {
  const { analytics, currentFare, route, airline } = data;

  return (
    <div className="space-y-4 animate-slide-up">
      {/* Route tag */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/15 border border-brand-500/30">
          <span className="text-brand-300 font-bold text-sm">{route}</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-600/60 border border-surface-400/30">
          <span className="text-slate-300 text-sm">{airline}</span>
        </div>
      </div>

      {/* Current fare — hero card */}
      <div className="glass-card p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-transparent pointer-events-none" />
        <div className="relative">
          <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mb-2">Current Fare</p>
          <p className="text-5xl font-extrabold text-white tracking-tight mb-3">
            {formatINR(currentFare)}
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <ChangeChip value={analytics.changeVs7Days} />
              <span className="text-slate-500 text-xs">vs 7-day avg</span>
            </div>
            <div className="flex items-center gap-2">
              <ChangeChip value={analytics.changeVs30Days} />
              <span className="text-slate-500 text-xs">vs 30-day avg</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of KPIs */}
      <div className="grid grid-cols-2 gap-3">
        <div className="kpi-card">
          <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">7-Day Avg</p>
          <p className="text-2xl font-bold text-white">{formatINR(analytics.sevenDayAverage)}</p>
        </div>
        <div className="kpi-card">
          <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">30-Day Avg</p>
          <p className="text-2xl font-bold text-white">{formatINR(analytics.thirtyDayAverage)}</p>
        </div>
        <div className="kpi-card">
          <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Minimum</p>
          <p className="text-2xl font-bold text-emerald-400">{formatINR(analytics.minimumFare)}</p>
        </div>
        <div className="kpi-card">
          <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Maximum</p>
          <p className="text-2xl font-bold text-red-400">{formatINR(analytics.maximumFare)}</p>
        </div>
      </div>
    </div>
  );
}
