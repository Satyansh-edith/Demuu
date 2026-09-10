"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Zap, Activity, Plane } from "lucide-react"

interface HeaderProps {
  onRunScraper: () => void;
  scraperLoading: boolean;
}

export default function Header({ onRunScraper, scraperLoading }: HeaderProps) {
  return (
    <header className="border-b border-border bg-card/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
            <Plane className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-foreground font-bold text-lg leading-none tracking-tight">APIx</h1>
              <Badge variant="outline" className="text-[10px] uppercase py-0 px-1.5 border-primary/30 text-primary bg-primary/5">
                MoSPI Govt
              </Badge>
            </div>
            <p className="text-muted-foreground text-xs font-medium tracking-wide mt-0.5">
              Real-time Airfare Price Index for India
            </p>
          </div>
        </div>

        {/* Center Pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/80 border border-border">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-muted-foreground font-medium">SIH 2026 Prototype</span>
        </div>

        {/* Action button */}
        <Button
          onClick={onRunScraper}
          disabled={scraperLoading}
          variant="outline"
          size="sm"
          className="gap-2 text-xs font-medium border-border hover:bg-secondary"
        >
          {scraperLoading ? (
            <>
              <Activity className="w-3.5 h-3.5 animate-spin text-primary" />
              <span>Scraping Data...</span>
            </>
          ) : (
            <>
              <Zap className="w-3.5 h-3.5 text-primary" />
              <span>Run Mock Scraper</span>
            </>
          )}
        </Button>
      </div>
    </header>
  );
}
