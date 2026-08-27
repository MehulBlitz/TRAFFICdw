import React, { useState } from 'react';
import { runApriori } from '../../utils/mlApriori';
import { getEnrichedTrafficRecords } from '../../data/trafficData';
import { CrtScreen } from '../skeuomorphic/CrtScreen';
import { ConsoleFader } from '../skeuomorphic/ConsoleFader';
import { Link2, Sparkles, Filter, Activity } from 'lucide-react';

export const Module7_AprioriRules: React.FC = () => {
  const [minSupport, setMinSupport] = useState<number>(0.25);
  const [minConfidence, setMinConfidence] = useState<number>(0.6);
  const [minLift, setMinLift] = useState<number>(1.0);

  const records = getEnrichedTrafficRecords();
  const result = runApriori(records, minSupport, minConfidence, minLift);

  return (
    <div className="flex flex-col gap-5">
      {/* Header Deck */}
      <div className="bg-instrument-panel p-3.5 rounded-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-amber-500/20 border border-amber-500/40 text-amber-400">
            <Link2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black tracking-wide text-neutral-100 uppercase">
              Experiment 09 // Association Rule Mining (Apriori Algorithm)
            </h2>
            <p className="text-[11px] text-neutral-400">
              Discover co-occurrence patterns between traffic volume, highway topology, vehicle classes, and congestion
            </p>
          </div>
        </div>
      </div>

      {/* Threshold Console Faders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-neutral-900/90 p-4 rounded-xl border border-neutral-800">
        <ConsoleFader
          id="fader-min-support"
          label="Minimum Support Threshold (minSup)"
          min={0.1}
          max={0.6}
          step={0.05}
          value={minSupport}
          unit="%"
          onChange={setMinSupport}
          ticks={[
            { val: 0.1, label: '10%' },
            { val: 0.3, label: '30%' },
            { val: 0.6, label: '60%' },
          ]}
        />
        <ConsoleFader
          id="fader-min-conf"
          label="Minimum Confidence Threshold (minConf)"
          min={0.4}
          max={0.95}
          step={0.05}
          value={minConfidence}
          unit="%"
          onChange={setMinConfidence}
          ticks={[
            { val: 0.4, label: '40%' },
            { val: 0.7, label: '70%' },
            { val: 0.95, label: '95%' },
          ]}
        />
        <ConsoleFader
          id="fader-min-lift"
          label="Minimum Lift Threshold (minLift)"
          min={0.5}
          max={3.0}
          step={0.1}
          value={minLift}
          unit="x"
          onChange={setMinLift}
          ticks={[
            { val: 0.5, label: '0.5x' },
            { val: 1.5, label: '1.5x' },
            { val: 3.0, label: '3.0x' },
          ]}
        />
      </div>

      {/* Apriori Mining Results CRT Screen */}
      <CrtScreen
        id="crt-apriori-view"
        title="APRIORI MINING ENGINE // CANDIDATES & ASSOCIATION RULES"
        badge={`${result.rules.length} STRONG RULES MINED`}
        phosphor="green"
      >
        <div className="space-y-4 font-mono">
          <div className="text-xs text-emerald-300 font-semibold bg-emerald-950/40 p-2.5 rounded border border-emerald-800/60">
            {result.summary}
          </div>

          {/* Mined Association Rules Table */}
          <div>
            <div className="text-xs text-emerald-400 font-bold uppercase mb-2 flex items-center justify-between">
              <span>Mined Association Rules (Sorted by Lift Descending)</span>
              <span className="text-amber-400 text-[10px]">P(B|A) ≥ {(minConfidence * 100).toFixed(0)}%</span>
            </div>

            <div className="overflow-x-auto max-h-72">
              <table className="w-full text-xs text-left border border-emerald-800">
                <thead className="sticky top-0 bg-emerald-950 text-emerald-300 border-b border-emerald-800 font-bold">
                  <tr>
                    <th className="p-2 border-r border-emerald-800">#Rule</th>
                    <th className="p-2 border-r border-emerald-800">Antecedent (IF)</th>
                    <th className="p-2 border-r border-emerald-800">Consequent (THEN)</th>
                    <th className="p-2 border-r border-emerald-800 text-center">Support</th>
                    <th className="p-2 border-r border-emerald-800 text-center">Confidence</th>
                    <th className="p-2 border-r border-emerald-800 text-center">Lift Ratio</th>
                    <th className="p-2">Natural Language Interpretation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-900/60">
                  {result.rules.map((rule, idx) => (
                    <tr key={rule.id} className="hover:bg-emerald-900/30">
                      <td className="p-2 font-bold text-emerald-400 border-r border-emerald-900">
                        R{(idx + 1).toString().padStart(2, '0')}
                      </td>
                      <td className="p-2 font-bold text-amber-300 border-r border-emerald-900">
                        {'{' + rule.antecedent.join(', ') + '}'}
                      </td>
                      <td className="p-2 font-bold text-emerald-300 border-r border-emerald-900">
                        {'{' + rule.consequent.join(', ') + '}'}
                      </td>
                      <td className="p-2 text-center border-r border-emerald-900 font-mono">
                        {(rule.support * 100).toFixed(1)}%
                      </td>
                      <td className="p-2 text-center border-r border-emerald-900 font-bold text-emerald-300 font-mono">
                        {(rule.confidence * 100).toFixed(1)}%
                      </td>
                      <td className="p-2 text-center border-r border-emerald-900 font-black text-amber-400 font-mono">
                        {rule.lift.toFixed(2)}x
                      </td>
                      <td className="p-2 text-[11px] text-neutral-300">{rule.interpretation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Frequent Itemsets Summary */}
          <div>
            <div className="text-xs text-emerald-400 font-bold uppercase mb-2">
              Frequent Itemsets L_k Distribution
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {result.itemsetFrequencyDistribution.map((dist) => (
                <div key={dist.length} className="bg-black/80 p-2.5 rounded border border-emerald-800">
                  <span className="text-[10px] text-emerald-500 font-bold uppercase block">
                    L_{dist.length} Frequent {dist.length}-Itemsets
                  </span>
                  <span className="text-xl font-bold text-amber-300">{dist.count} Itemsets</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CrtScreen>
    </div>
  );
};
