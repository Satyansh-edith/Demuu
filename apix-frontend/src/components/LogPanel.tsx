// src/components/LogPanel.tsx
import { useEffect, useRef } from 'react';
import { ApiLogEntry } from '../api/client';

interface LogPanelProps {
  logs: ApiLogEntry[];
}

function statusColor(code: number) {
  if (code >= 200 && code < 300) return 'text-emerald-400';
  if (code >= 400) return 'text-red-400';
  return 'text-amber-400';
}

function timeStr(timestamp: string) {
  return new Date(timestamp).toLocaleTimeString('en-IN', { hour12: false });
}

export default function LogPanel({ logs }: LogPanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="glass-card p-5 space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2 pb-3 border-b border-surface-400/20">
        <span className="status-dot bg-emerald-400 animate-pulse-slow" />
        <h3 className="text-white font-semibold text-sm">Live API Activity</h3>
        <span className="ml-auto text-slate-500 text-xs font-mono">{logs.length} entries</span>
      </div>

      {/* Log list */}
      <div className="max-h-72 overflow-y-auto space-y-0.5 pr-1">
        {logs.length === 0 ? (
          <p className="text-slate-600 text-xs text-center py-6">
            No activity yet. Run the scraper or analyze a fare.
          </p>
        ) : (
          [...logs].reverse().map((log) => (
            <div key={log._id} className="log-row">
              <span className="text-slate-600 tabular-nums w-18 shrink-0">{timeStr(log.timestamp)}</span>
              <span className={`font-semibold shrink-0 w-8 ${log.method === 'POST' ? 'text-blue-400' : 'text-slate-400'}`}>
                {log.method}
              </span>
              <span className="text-slate-300 flex-1 truncate">{log.endpoint}</span>
              <span className={`tabular-nums shrink-0 ${statusColor(log.statusCode)}`}>{log.statusCode}</span>
              <span className="text-slate-500 tabular-nums shrink-0 w-14 text-right">{log.responseTime}ms</span>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Data source footer */}
      <div className="pt-3 border-t border-surface-400/20">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-600/30 border border-surface-400/15">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">Data Source</span>
          <span className="ml-auto text-[10px] text-amber-400/80 font-semibold uppercase tracking-wider">
            Simulated Scraped Data
          </span>
        </div>
        <p className="text-slate-600 text-[10px] text-center mt-1.5">For demonstration purposes only</p>
      </div>
    </div>
  );
}
