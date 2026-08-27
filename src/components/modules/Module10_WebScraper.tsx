import React, { useState } from 'react';
import { runLiveScrapeSimulation, SAMPLE_HIGHWAY_HTML } from '../../utils/scraperSimulator';
import { CrtScreen } from '../skeuomorphic/CrtScreen';
import { MechanicalButton } from '../skeuomorphic/MechanicalButton';
import { Globe, Play, Download, CheckCircle2, Code2, Database } from 'lucide-react';

export const Module10_WebScraper: React.FC = () => {
  const [cssSelector, setCssSelector] = useState<string>('.toll-card');
  const [xpathExpr, setXpathExpr] = useState<string>('//article[@class="toll-card"]');
  const [codeType, setCodeType] = useState<'bs4' | 'scrapy'>('bs4');
  const [isScraping, setIsScraping] = useState<boolean>(false);
  const [ingested, setIngested] = useState<boolean>(false);

  const scrapeResult = runLiveScrapeSimulation(SAMPLE_HIGHWAY_HTML, cssSelector, xpathExpr);

  const handleTriggerScrape = () => {
    setIsScraping(true);
    setTimeout(() => {
      setIsScraping(false);
      setIngested(true);
    }, 500);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header Deck */}
      <div className="bg-instrument-panel p-3.5 rounded-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-teal-500/20 border border-teal-500/40 text-teal-400">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black tracking-wide text-neutral-100 uppercase">
              Experiment 11 // Web Scraping & Ingestion Studio (Scrapy & BS4)
            </h2>
            <p className="text-[11px] text-neutral-400">
              Crawl live highway toll telemetry feeds, extract metrics via CSS/XPath selectors, and stage into Route_Traffic_Fact
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-neutral-950 p-1 rounded-lg border border-neutral-800">
          <MechanicalButton
            id="btn-switch-bs4"
            label="BEAUTIFULSOUP 4"
            size="sm"
            active={codeType === 'bs4'}
            variant={codeType === 'bs4' ? 'amber' : 'neutral'}
            onClick={() => setCodeType('bs4')}
          />
          <MechanicalButton
            id="btn-switch-scrapy"
            label="SCRAPY SPIDER"
            size="sm"
            active={codeType === 'scrapy'}
            variant={codeType === 'scrapy' ? 'amber' : 'neutral'}
            onClick={() => setCodeType('scrapy')}
          />
        </div>
      </div>

      {/* Selector Tester & Execution Bar */}
      <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <label className="text-[11px] font-bold text-neutral-400 block mb-1 uppercase">
            CSS Selector Path
          </label>
          <input
            type="text"
            value={cssSelector}
            onChange={(e) => setCssSelector(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-700 text-teal-300 font-mono text-xs rounded p-2 focus:ring-1 focus:ring-teal-500"
          />
        </div>

        <div>
          <label className="text-[11px] font-bold text-neutral-400 block mb-1 uppercase">
            XPath Expression
          </label>
          <input
            type="text"
            value={xpathExpr}
            onChange={(e) => setXpathExpr(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-700 text-teal-300 font-mono text-xs rounded p-2 focus:ring-1 focus:ring-teal-500"
          />
        </div>

        <div className="flex gap-2">
          <MechanicalButton
            id="btn-execute-scrape"
            label={isScraping ? 'CRAWLING...' : 'EXECUTE CRAWL & INGEST'}
            variant="amber"
            onClick={handleTriggerScrape}
            icon={<Play className="w-3.5 h-3.5" />}
          />
        </div>
      </div>

      {/* Scraped Items & Ingestion Stage CRT Monitor */}
      <CrtScreen
        id="crt-scraper-view"
        title="LIVE WEB SCRAPING & TELEMETRY PARSER"
        badge={ingested ? '4 FACTS LOADED TO DW' : 'READY TO HARVEST'}
        phosphor="green"
      >
        <div className="space-y-4 font-mono text-xs">
          {/* Execution Log */}
          <div className="bg-black/90 p-3 rounded border border-emerald-800 space-y-1">
            <span className="text-emerald-500 font-bold uppercase block mb-1">
              === TELEMETRY SPIDER CONSOLE OUTPUT ===
            </span>
            {scrapeResult.log.map((line, idx) => (
              <div key={idx} className="text-emerald-300 text-[11px] leading-tight">
                {line}
              </div>
            ))}
          </div>

          {/* Extracted Record Items */}
          <div>
            <div className="text-emerald-400 font-bold uppercase mb-2 flex items-center justify-between">
              <span>Parsed Highway Plaza Items ({scrapeResult.items.length} Nodes Found)</span>
              <span className="text-amber-400 text-[10px]">PARSED VIA DOM TREE</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-emerald-800">
                <thead>
                  <tr className="bg-emerald-950/80 text-emerald-300 border-b border-emerald-800 font-bold">
                    <th className="p-2 border-r border-emerald-800">Toll Plaza Point</th>
                    <th className="p-2 border-r border-emerald-800">Highway Corridor</th>
                    <th className="p-2 border-r border-emerald-800">Vehicle</th>
                    <th className="p-2 border-r border-emerald-800 text-center">Speed</th>
                    <th className="p-2 border-r border-emerald-800 text-center">Time</th>
                    <th className="p-2 border-r border-emerald-800 text-center">Distance</th>
                    <th className="p-2">Density</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-900/60">
                  {scrapeResult.items.map((it, idx) => (
                    <tr key={idx} className="hover:bg-emerald-900/30">
                      <td className="p-2 font-bold text-emerald-200 border-r border-emerald-800">{it.tollPlaza}</td>
                      <td className="p-2 border-r border-emerald-800">{it.highway}</td>
                      <td className="p-2 border-r border-emerald-800 text-amber-300">{it.vehicleType}</td>
                      <td className="p-2 text-center border-r border-emerald-800 font-bold">{it.avgSpeedKmph} km/h</td>
                      <td className="p-2 text-center border-r border-emerald-800">{it.travelTimeMin} min</td>
                      <td className="p-2 text-center border-r border-emerald-800">{it.distanceKm} km</td>
                      <td className="p-2 font-bold text-amber-400">{it.congestion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Python Production Code Generator */}
          <div className="bg-black/90 p-3 rounded border border-emerald-800">
            <span className="text-emerald-500 font-bold uppercase block mb-1">
              Production Python Script ({codeType.toUpperCase()} Pipeline):
            </span>
            <pre className="text-emerald-300 text-[11px] overflow-x-auto whitespace-pre leading-relaxed">
              {codeType === 'bs4' ? scrapeResult.bs4Code : scrapeResult.scrapyCode}
            </pre>
          </div>
        </div>
      </CrtScreen>
    </div>
  );
};
