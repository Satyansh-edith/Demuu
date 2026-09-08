// src/components/SearchPanel.tsx
import { RouteInfo } from '../api/client';

const CITY_LABELS: Record<string, string> = {
  DEL: 'Delhi (DEL)',
  BOM: 'Mumbai (BOM)',
  BLR: 'Bengaluru (BLR)',
  CCU: 'Kolkata (CCU)',
  HYD: 'Hyderabad (HYD)',
  MAA: 'Chennai (MAA)',
};

interface SearchPanelProps {
  routes: RouteInfo[];
  airlines: string[];
  origin: string;
  destination: string;
  airline: string;
  onOriginChange: (v: string) => void;
  onDestinationChange: (v: string) => void;
  onAirlineChange: (v: string) => void;
  onAnalyze: () => void;
  loading: boolean;
}

export default function SearchPanel({
  airlines,
  origin,
  destination,
  airline,
  onOriginChange,
  onDestinationChange,
  onAirlineChange,
  onAnalyze,
  loading,
}: SearchPanelProps) {
  const airports = Object.keys(CITY_LABELS);

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-brand-400 text-lg">🔍</span>
        <h2 className="text-white font-semibold text-base">Search Route & Airline</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        {/* Origin */}
        <div className="space-y-1.5">
          <label className="text-slate-400 text-xs font-medium uppercase tracking-wider">Origin</label>
          <div className="relative">
            <select
              id="origin-select"
              value={origin}
              onChange={(e) => onOriginChange(e.target.value)}
              className="select-field pr-10"
            >
              <option value="">Select origin</option>
              {airports.map((code) => (
                <option key={code} value={code}>{CITY_LABELS[code]}</option>
              ))}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">▼</span>
          </div>
        </div>

        {/* Arrow */}
        <div className="hidden md:flex items-end justify-center pb-3">
          <div className="flex items-center gap-2 text-brand-400 font-bold text-xl">→</div>
        </div>

        {/* Destination — shown on mobile as second field without arrow */}
        <div className="space-y-1.5 md:hidden">
          <label className="text-slate-400 text-xs font-medium uppercase tracking-wider">Destination</label>
          <div className="relative">
            <select
              id="destination-select-mobile"
              value={destination}
              onChange={(e) => onDestinationChange(e.target.value)}
              className="select-field pr-10"
            >
              <option value="">Select destination</option>
              {airports
                .filter((c) => c !== origin)
                .map((code) => (
                  <option key={code} value={code}>{CITY_LABELS[code]}</option>
                ))}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">▼</span>
          </div>
        </div>
      </div>

      {/* Row 2 on desktop: destination + airline */}
      <div className="hidden md:grid md:grid-cols-2 gap-4 mb-5">
        <div className="space-y-1.5">
          <label className="text-slate-400 text-xs font-medium uppercase tracking-wider">Destination</label>
          <div className="relative">
            <select
              id="destination-select"
              value={destination}
              onChange={(e) => onDestinationChange(e.target.value)}
              className="select-field pr-10"
            >
              <option value="">Select destination</option>
              {airports
                .filter((c) => c !== origin)
                .map((code) => (
                  <option key={code} value={code}>{CITY_LABELS[code]}</option>
                ))}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">▼</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-slate-400 text-xs font-medium uppercase tracking-wider">Airline</label>
          <div className="relative">
            <select
              id="airline-select"
              value={airline}
              onChange={(e) => onAirlineChange(e.target.value)}
              className="select-field pr-10"
            >
              <option value="">Select airline</option>
              {airlines.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">▼</span>
          </div>
        </div>
      </div>

      {/* Mobile airline */}
      <div className="md:hidden space-y-1.5 mb-5">
        <label className="text-slate-400 text-xs font-medium uppercase tracking-wider">Airline</label>
        <div className="relative">
          <select
            id="airline-select-mobile"
            value={airline}
            onChange={(e) => onAirlineChange(e.target.value)}
            className="select-field pr-10"
          >
            <option value="">Select airline</option>
            {airlines.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">▼</span>
        </div>
      </div>

      <button
        id="analyze-fare-btn"
        onClick={onAnalyze}
        disabled={loading || !origin || !destination || !airline}
        className="btn-primary w-full"
      >
        {loading ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            Analyzing…
          </>
        ) : (
          <>
            <span>📊</span>
            Analyze Fare
          </>
        )}
      </button>
    </div>
  );
}
