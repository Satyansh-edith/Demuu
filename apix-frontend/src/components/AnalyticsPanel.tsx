// src/components/AnalyticsPanel.tsx
import { FareTrend } from '../api/client';

interface AnalyticsPanelProps {
  trend: FareTrend;
}

const DIRECTION_CONFIG = {
  INCREASING: { icon: '📈', label: 'Increasing', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  DECREASING: { icon: '📉', label: 'Decreasing', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  STABLE: { icon: '📊', label: 'Stable', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
};

const VOLATILITY_CONFIG = {
  LOW: { label: 'Low', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  MODERATE: { label: 'Moderate', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  HIGH: { label: 'High', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
};

export default function AnalyticsPanel({ trend }: AnalyticsPanelProps) {
  const dir = DIRECTION_CONFIG[trend.direction];
  const vol = VOLATILITY_CONFIG[trend.volatility];

  return (
    <div className="glass-card p-5 space-y-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-center gap-2 pb-3 border-b border-surface-400/20">
        <span className="text-purple-400">🧮</span>
        <h3 className="text-white font-semibold text-sm">Simulated Analytics</h3>
        <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/25 text-purple-300 font-medium uppercase tracking-wider">
          Prototype
        </span>
      </div>

      {/* Trend & Volatility */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <p className="text-slate-500 text-xs uppercase tracking-wider">Trend Direction</p>
          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-semibold ${dir.bg} ${dir.color}`}>
            <span>{dir.icon}</span>
            <span>{dir.label}</span>
          </div>
        </div>
        <div className="space-y-1.5">
          <p className="text-slate-500 text-xs uppercase tracking-wider">Volatility</p>
          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-semibold ${vol.bg} ${vol.color}`}>
            <span>〰️</span>
            <span>{vol.label}</span>
          </div>
        </div>
      </div>

      {/* Observation note */}
      <div className="px-3 py-2.5 rounded-lg bg-surface-600/40 border border-surface-400/20">
        <p className="text-slate-300 text-xs leading-relaxed">
          <span className="text-slate-500">Price observation: </span>
          {trend.note}
        </p>
      </div>

      {/* Disclaimer */}
      <div className="px-3 py-2.5 rounded-lg bg-amber-500/5 border border-amber-500/20">
        <p className="text-amber-400/80 text-[11px] leading-relaxed">
          ⚠️ These analytics are calculated on simulated scraped data for demonstration purposes.
          The actual APIx statistical price index methodology is not implemented in this prototype.
        </p>
      </div>
    </div>
  );
}
