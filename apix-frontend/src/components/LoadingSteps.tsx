// src/components/LoadingSteps.tsx
interface LoadingStepsProps {
  step: number; // 1=fetching, 2=querying, 3=processing
}

const STEPS = [
  { id: 1, icon: '📡', label: 'Fetching fare data…' },
  { id: 2, icon: '🗄️', label: 'Querying database…' },
  { id: 3, icon: '⚙️', label: 'Processing analytics…' },
];

export default function LoadingSteps({ step }: LoadingStepsProps) {
  return (
    <div className="glass-card p-8 flex flex-col items-center gap-6 animate-fade-in">
      <div className="w-12 h-12 rounded-full border-2 border-brand-500/30 border-t-brand-400 animate-spin" />
      <div className="flex flex-col gap-3 w-full max-w-xs">
        {STEPS.map((s) => {
          const isActive = s.id === step;
          const isDone = s.id < step;
          return (
            <div
              key={s.id}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-300 ${
                isActive
                  ? 'bg-brand-500/15 border border-brand-500/30'
                  : isDone
                  ? 'bg-surface-600/30 border border-surface-400/20'
                  : 'opacity-30 border border-transparent'
              }`}
            >
              <span className="text-base">{isDone ? '✅' : s.icon}</span>
              <span
                className={`text-sm font-medium ${
                  isActive ? 'text-brand-300' : isDone ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                {s.label}
              </span>
              {isActive && (
                <span className="ml-auto">
                  <span className="inline-block w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
