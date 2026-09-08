// src/components/Header.tsx
interface HeaderProps {
  onRunScraper: () => void;
  scraperLoading: boolean;
}

export default function Header({ onRunScraper, scraperLoading }: HeaderProps) {
  return (
    <header className="border-b border-surface-400/20 bg-surface-800/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/30">
            <span className="text-white font-bold text-sm">Ax</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-none tracking-tight">APIx</h1>
            <p className="text-slate-400 text-[10px] font-medium tracking-wider uppercase leading-none mt-0.5">
              Airfare Price Index
            </p>
          </div>
        </div>

        {/* Center badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25">
          <span className="status-dot bg-amber-400 animate-pulse"></span>
          <span className="text-amber-300 text-xs font-medium">SIH 2026 — Prototype Demo</span>
        </div>

        {/* Demo control */}
        <button
          onClick={onRunScraper}
          disabled={scraperLoading}
          className="btn-secondary text-xs"
          id="run-scraper-btn"
        >
          {scraperLoading ? (
            <>
              <span className="inline-block w-3 h-3 border-2 border-slate-400/30 border-t-slate-300 rounded-full animate-spin"></span>
              Scraping…
            </>
          ) : (
            <>
              <span className="text-brand-400">⚡</span>
              Run Mock Scraper
            </>
          )}
        </button>
      </div>
    </header>
  );
}
