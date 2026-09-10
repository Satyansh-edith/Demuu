"use client"

import { useEffect, useRef } from 'react';
import { ApiLogEntry } from '@/lib/api';
import { Terminal, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface LogPanelProps {
  logs: ApiLogEntry[];
}

function statusColor(code: number) {
  if (code >= 200 && code < 300) return 'text-emerald-400 font-semibold';
  if (code >= 400) return 'text-red-400 font-semibold';
  return 'text-amber-400 font-semibold';
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
    <div className="rounded-xl border border-border bg-card p-5 space-y-3 shadow-sm">
      <div className="flex items-center gap-2 pb-3 border-b border-border">
        <Terminal className="w-4 h-4 text-primary" />
        <h3 className="text-foreground font-semibold text-sm">Live Telemetry & Logs</h3>
        <Badge variant="secondary" className="ml-auto text-xs font-mono">
          {logs.length} events
        </Badge>
      </div>

      <div className="max-h-64 overflow-y-auto space-y-1 pr-1 font-mono text-xs">
        {logs.length === 0 ? (
          <p className="text-muted-foreground text-center py-6">
            Awaiting requests... Execute a query or run the mock scraper.
          </p>
        ) : (
          [...logs].reverse().map((log) => (
            <div
              key={log._id}
              className="flex items-center gap-2.5 py-1.5 px-2 rounded bg-muted/30 border border-border/50 text-[11px]"
            >
              <span className="text-muted-foreground tabular-nums">{timeStr(log.timestamp)}</span>
              <span className={`font-semibold ${log.method === 'POST' ? 'text-blue-400' : 'text-slate-400'}`}>
                {log.method}
              </span>
              <span className="text-foreground truncate flex-1">{log.endpoint}</span>
              <span className={statusColor(log.statusCode)}>{log.statusCode}</span>
              <span className="text-muted-foreground tabular-nums">{log.responseTime}ms</span>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
