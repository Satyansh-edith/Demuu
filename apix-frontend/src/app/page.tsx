"use client"

import { useState, useEffect, useCallback } from 'react';
import {
  fetchRoutes,
  fetchAirlines,
  analyzeFare,
  fetchLogs,
  runScraper,
  RouteInfo,
  FareAnalyzeResult,
  ApiLogEntry,
} from '@/lib/api';

import Header from '@/components/Header';
import SearchPanel from '@/components/SearchPanel';
import LoadingSteps from '@/components/LoadingSteps';
import KpiCards from '@/components/KpiCards';
import FareChart from '@/components/FareChart';
import AnalyticsPanel from '@/components/AnalyticsPanel';
import LogPanel from '@/components/LogPanel';

import { GlobeFlights } from '@/components/ui/cobe-globe-flights';
import { FlightCard } from '@/components/ui/flight-card';
import { FlightCard1 } from '@/components/ui/flight-card-1';

import { AlertCircle, CheckCircle, Plane } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type AnalyzeState = 'idle' | 'step1' | 'step2' | 'step3' | 'done' | 'error';

export default function Home() {
  const [routes, setRoutes] = useState<RouteInfo[]>([]);
  const [airlines, setAirlines] = useState<string[]>([]);
  const [origin, setOrigin] = useState('DEL');
  const [destination, setDestination] = useState('BOM');
  const [airline, setAirline] = useState('IndiGo');
  const [analyzeState, setAnalyzeState] = useState<AnalyzeState>('idle');
  const [result, setResult] = useState<FareAnalyzeResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [logs, setLogs] = useState<ApiLogEntry[]>([]);
  const [scraperLoading, setScraperLoading] = useState(false);
  const [scraperMsg, setScraperMsg] = useState('');

  // Load routes & airlines on mount
  useEffect(() => {
    fetchRoutes().then(setRoutes).catch(() => {});
    fetchAirlines().then(setAirlines).catch(() => {});
  }, []);

  // Poll logs every 5 seconds
  const refreshLogs = useCallback(() => {
    fetchLogs().then(setLogs).catch(() => {});
  }, []);

  useEffect(() => {
    refreshLogs();
    const interval = setInterval(refreshLogs, 5000);
    return () => clearInterval(interval);
  }, [refreshLogs]);

  // Multi-step query execution UX
  const handleAnalyze = async () => {
    if (!origin || !destination || !airline) return;
    setResult(null);
    setErrorMsg('');

    try {
      setAnalyzeState('step1');
      await sleep(500);
      setAnalyzeState('step2');
      await sleep(600);
      setAnalyzeState('step3');

      const data = await analyzeFare(origin, destination, airline);

      await sleep(400);
      setResult(data);
      setAnalyzeState('done');
      refreshLogs();
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ??
        err?.message ??
        'Failed to fetch fare data. Ensure backend is running and dataset has been scraped.';
      setErrorMsg(msg);
      setAnalyzeState('error');
    }
  };

  const handleRunScraper = async () => {
    setScraperLoading(true);
    setScraperMsg('');
    try {
      const res = await runScraper();
      setScraperMsg(`✅ Scraper complete — ${res.recordsInserted} records inserted across ${res.routesProcessed} routes.`);
      refreshLogs();
    } catch {
      setScraperMsg('❌ Scraper failed. Ensure backend is running on port 5000.');
    } finally {
      setScraperLoading(false);
    }
  };

  const isLoading = ['step1', 'step2', 'step3'].includes(analyzeState);
  const loadingStep = analyzeState === 'step1' ? 1 : analyzeState === 'step2' ? 2 : 3;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header onRunScraper={handleRunScraper} scraperLoading={scraperLoading} />

      {/* Scraper Toast Notification */}
      {scraperMsg && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 w-full">
          <div
            className={`p-3 rounded-lg border text-xs font-medium flex items-center gap-2 ${
              scraperMsg.startsWith('✅')
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-destructive/10 border-destructive/30 text-red-400'
            }`}
          >
            {scraperMsg.startsWith('✅') ? (
              <CheckCircle className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{scraperMsg}</span>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 space-y-12">
        {/* HERO SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-border pb-12">
          {/* Left Column: Heading & Controls */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-primary border-primary/30">
                  MoSPI SIH 2026
                </Badge>
                <span className="text-xs text-muted-foreground">Problem Statement SIH26056</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
                Airfare Price Index Intelligence Platform
              </h1>
              <p className="text-muted-foreground text-sm max-w-xl leading-relaxed">
                Real-time automated price observation and index calculation engine for Indian domestic aviation routes. Developed for the Ministry of Statistics and Programme Implementation.
              </p>
            </div>

            <SearchPanel
              routes={routes}
              airlines={airlines}
              origin={origin}
              destination={destination}
              airline={airline}
              onOriginChange={setOrigin}
              onDestinationChange={setDestination}
              onAirlineChange={setAirline}
              onAnalyze={handleAnalyze}
              loading={isLoading}
            />
          </div>

          {/* Right Column: 3D Globe Flights Visualizer */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <div className="w-full max-w-md aspect-square relative">
              <GlobeFlights />
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2 font-mono">
              Live Aviation Route Mesh · Interactive 3D Globe
            </p>
          </div>
        </section>

        {/* RESULTS & DASHBOARD SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar: Live Telemetry */}
          <div className="lg:col-span-4 space-y-6">
            <LogPanel logs={logs} />
          </div>

          {/* Right Area: Results / Charts / Cards */}
          <div className="lg:col-span-8 space-y-6">
            {/* Idle State */}
            {analyzeState === 'idle' && (
              <div className="rounded-xl border border-border bg-card p-10 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-primary">
                  <Plane className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-base">Select Route & Airline to Analyze</h3>
                  <p className="text-muted-foreground text-xs max-w-md mx-auto mt-1">
                    Choose an origin, destination, and carrier above, then click <strong>Analyze Fare Index</strong>.
                  </p>
                </div>
                <p className="text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-md border border-border font-mono">
                  Tip: Click "Run Mock Scraper" in the top bar to seed the MongoDB dataset first.
                </p>
              </div>
            )}

            {/* Loading */}
            {isLoading && <LoadingSteps step={loadingStep} />}

            {/* Error */}
            {analyzeState === 'error' && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 space-y-3">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-red-400 font-semibold text-sm">Analysis Execution Failed</h3>
                    <p className="text-muted-foreground text-xs leading-relaxed mt-1">{errorMsg}</p>
                    <button
                      onClick={() => setAnalyzeState('idle')}
                      className="mt-3 text-xs text-primary underline font-medium"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Done Results */}
            {analyzeState === 'done' && result && (
              <div className="space-y-6">
                {/* Executive KPIs */}
                <KpiCards data={result} />

                {/* Integrated Flight Cards */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-foreground">Flight Route & Rate Details</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {/* FlightCard (Search Result Card) */}
                    <FlightCard
                      airline={{
                        name: result.airline,
                        logo: "https://cdn.21st.dev/assets/mirror/b4/b4538c65f427b5a7c7804d8a266eac3d44a5aded5d239f71fbb750a9dfdc455d.svg",
                        flightNumber: `${result.airline.slice(0, 2).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
                      }}
                      departureTime="08:30"
                      arrivalTime="10:45"
                      duration="2h 15m"
                      stops={0}
                      price={result.currentFare}
                      currency="INR"
                      offer="MoSPI Verified Rate"
                      refundableType="Partial Refundable"
                      onBook={() => alert(`Fare index rate selected: ₹${result.currentFare}`)}
                      onFlightDetails={() => alert(`Route: ${result.route} | Carrier: ${result.airline}`)}
                    />

                    {/* FlightCard1 (Detailed Flight Card Component) */}
                    <FlightCard1
                      imageUrl="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=800&auto=format&fit=crop"
                      airline={result.airline}
                      flightCode={`${result.airline.slice(0, 2).toUpperCase()}-402`}
                      flightClass="Economy"
                      departureCode={origin}
                      departureCity={origin === 'DEL' ? 'Delhi' : origin === 'BOM' ? 'Mumbai' : 'Bengaluru'}
                      departureTime="08:30 AM"
                      arrivalCode={destination}
                      arrivalCity={destination === 'BOM' ? 'Mumbai' : destination === 'DEL' ? 'Delhi' : 'Bengaluru'}
                      arrivalTime="10:45 AM"
                      duration="2 Hours 15 Mins"
                    />
                  </div>
                </div>

                {/* 30-Day Recharts Trend Chart */}
                <FareChart
                  data={result.historicalData}
                  thirtyDayAvg={result.analytics.thirtyDayAverage}
                />

                {/* Analytics Panel */}
                <AnalyticsPanel trend={result.trend} />
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
