// src/components/FareChart.tsx
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { DailyFareData } from '../api/client';

interface FareChartProps {
  data: DailyFareData[];
  thirtyDayAvg: number;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}

function formatINR(value: number) {
  return `₹${value.toLocaleString('en-IN')}`;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card-dark p-3 text-xs space-y-1.5 min-w-[160px]">
      <p className="text-slate-300 font-semibold mb-2">{formatDate(label)}</p>
      {payload.map((entry: any) => (
        <div key={entry.dataKey} className="flex justify-between gap-4">
          <span style={{ color: entry.color }}>{entry.name}</span>
          <span className="text-white font-medium">{formatINR(entry.value)}</span>
        </div>
      ))}
    </div>
  );
};

export default function FareChart({ data, thirtyDayAvg }: FareChartProps) {
  return (
    <div className="glass-card p-5 space-y-4 animate-slide-up">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-white font-semibold text-sm">30-Day Fare Trend</h3>
          <p className="text-slate-500 text-xs mt-0.5">Historical daily fare observations</p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-600/50 border border-surface-400/20">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
          <span className="text-slate-400 text-xs">Avg {formatINR(thirtyDayAvg)}</span>
        </div>
      </div>

      <div className="h-64 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="avgGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22a265" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22a265" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="maxGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f87171" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="minGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34d399" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fill: '#6b7280', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tickFormatter={(v) => `₹${(v / 1000).toFixed(1)}k`}
              tick={{ fill: '#6b7280', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={55}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '12px', color: '#9ca3af', paddingTop: '12px' }}
            />
            <ReferenceLine
              y={thirtyDayAvg}
              stroke="#6b7280"
              strokeDasharray="4 4"
              label={{ value: '30D Avg', fill: '#6b7280', fontSize: 10, position: 'insideTopRight' }}
            />
            <Area
              type="monotone"
              dataKey="maximumFare"
              name="Max Fare"
              stroke="#f87171"
              strokeWidth={1.5}
              fill="url(#maxGrad)"
              dot={false}
              activeDot={{ r: 4, fill: '#f87171' }}
            />
            <Area
              type="monotone"
              dataKey="averageFare"
              name="Avg Fare"
              stroke="#22a265"
              strokeWidth={2.5}
              fill="url(#avgGrad)"
              dot={false}
              activeDot={{ r: 5, fill: '#22a265' }}
            />
            <Area
              type="monotone"
              dataKey="minimumFare"
              name="Min Fare"
              stroke="#34d399"
              strokeWidth={1.5}
              fill="url(#minGrad)"
              dot={false}
              activeDot={{ r: 4, fill: '#34d399' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
