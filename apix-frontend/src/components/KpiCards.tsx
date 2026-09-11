"use client"

import { FareAnalyzeResult } from "@/lib/api"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"

interface KpiCardsProps {
  data: FareAnalyzeResult;
}

function formatINR(v: number) {
  return `₹${v.toLocaleString('en-IN')}`;
}

function ChangeBadge({ value, label }: { value: number; label: string }) {
  const isUp = value >= 0;
  return (
    <div className="flex items-center gap-1.5 text-xs">
      <Badge
        variant="outline"
        className={`gap-1 font-semibold ${
          isUp
            ? "border-destructive/40 text-red-400 bg-destructive/10"
            : "border-primary/40 text-emerald-400 bg-primary/10"
        }`}
      >
        {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {isUp ? "+" : ""}{value}%
      </Badge>
      <span className="text-muted-foreground text-xs">{label}</span>
    </div>
  );
}

export default function KpiCards({ data }: KpiCardsProps) {
  const { analytics, currentFare, route, airline } = data;

  return (
    <div className="space-y-4">
      {/* Route header badges */}
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="secondary" className="font-semibold text-xs py-1 px-3">
          Route: {route}
        </Badge>
        <Badge variant="outline" className="text-xs py-1 px-3">
          Airline: {airline}
        </Badge>
      </div>

      {/* Hero Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Hero Current Fare */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
            Current Average Fare
          </p>
          <div className="flex items-baseline justify-between flex-wrap gap-2">
            <span className="text-4xl font-extrabold text-foreground tracking-tight">
              {formatINR(currentFare)}
            </span>
            <div className="flex flex-col gap-2">
              <ChangeBadge value={analytics.changeVs7Days} label="vs 7D Avg" />
              <ChangeBadge value={analytics.changeVs30Days} label="vs 30D Avg" />
            </div>
          </div>
        </div>

        {/* Hero APIx Index */}
        <div className="rounded-xl border border-primary/20 bg-card p-6 shadow-sm bg-gradient-to-br from-primary/5 to-transparent">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-xs font-medium text-primary uppercase tracking-wider">
              APIx Price Index
            </p>
            <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-semibold">Base: 100</span>
          </div>
          <div className="flex items-baseline justify-between flex-wrap gap-2 mt-1">
            <span className="text-4xl font-extrabold text-foreground tracking-tight">
              {analytics.currentApixIndex}
            </span>
            <div className="flex flex-col gap-1.5 text-right">
              <div className="text-xs text-muted-foreground">7D Index: <span className="font-semibold text-foreground">{analytics.sevenDayApixIndex}</span></div>
              <div className="text-xs text-muted-foreground">30D Index: <span className="font-semibold text-foreground">{analytics.thirtyDayApixIndex}</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">7-Day Avg</p>
          <p className="text-xl font-bold text-foreground">{formatINR(analytics.sevenDayAverage)}</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">30-Day Avg</p>
          <p className="text-xl font-bold text-foreground">{formatINR(analytics.thirtyDayAverage)}</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Minimum Fare</p>
          <p className="text-xl font-bold text-emerald-400">{formatINR(analytics.minimumFare)}</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Maximum Fare</p>
          <p className="text-xl font-bold text-red-400">{formatINR(analytics.maximumFare)}</p>
        </div>
      </div>
    </div>
  );
}
