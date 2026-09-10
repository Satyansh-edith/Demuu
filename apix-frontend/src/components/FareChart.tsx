"use client"

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
import { DailyFareData } from '@/lib/api';

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
    <div className="rounded-lg border border-border bg-card p-3 text-xs space-y-1.5 shadow-md">
      <p className="text-foreground font-semibold mb-2">{formatDate(label)}</p>
      {payload.map((entry: any) => (
        <div key={entry.dataKey} className="flex justify-between gap-4">
          <span style={{ color: entry.color }}>{entry.name}</span>
          <span className="text-foreground font-medium">{formatINR(entry.value)}</span>
        </div>
      ))}
    </div>
  );
};

export default function FareChart({ data, thirtyDayAvg }: FareChartProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4 shadow-sm">
      <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-border">
        <div>
          <h3 className="text-foreground font-semibold text-sm">30-Day Fare Index Trend</h3>
          <p className="text-muted-foreground text-xs">Historical daily observation points</p>
        </div>
        <div className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-md border border-border">
          Baseline 30D Avg: <span className="font-medium text-foreground">{formatINR(thirtyDayAvg)}</span>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="avgGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="maxGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="minGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tickFormatter={(v) => `₹${(v / 1000).toFixed(1)}k`}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={50}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
            <ReferenceLine
              y={thirtyDayAvg}
              stroke="hsl(var(--muted-foreground))"
              strokeDasharray="4 4"
              label={{ value: '30D Baseline', fill: 'hsl(var(--muted-foreground))', fontSize: 10, position: 'insideTopRight' }}
            />
            <Area
              type="monotone"
              dataKey="maximumFare"
              name="Max Fare"
              stroke="#ef4444"
              strokeWidth={1.5}
              fill="url(#maxGrad)"
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="averageFare"
              name="Avg Fare"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#avgGrad)"
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="minimumFare"
              name="Min Fare"
              stroke="#3b82f6"
              strokeWidth={1.5}
              fill="url(#minGrad)"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
