import React, { useState } from 'react';
import {
  calculateDescriptiveStats,
  normalizeData,
  discretizeData,
  NormalizationType,
  DiscretizationType,
} from '../../utils/preprocessingEngine';
import { getEnrichedTrafficRecords, EnrichedTrafficFact } from '../../data/trafficData';
import { CrtScreen } from '../skeuomorphic/CrtScreen';
import { MechanicalButton } from '../skeuomorphic/MechanicalButton';
import { Sliders, Calculator, Sparkles, Binary, CheckCircle2 } from 'lucide-react';

export const Module2_PreprocessingPart1: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'stats' | 'nulls' | 'normalize' | 'discretize'>('stats');

  // Null Imputation simulation state
  const [nullField, setNullField] = useState<keyof EnrichedTrafficFact>('Avg_Speed_KMPH');
  const [nullAction, setNullAction] = useState<'mean' | 'median' | 'mode' | 'drop' | 'forward'>('mean');
  const [nullApplied, setNullApplied] = useState(false);

  // Normalization state
  const [normField, setNormField] = useState<keyof EnrichedTrafficFact>('Avg_Speed_KMPH');
  const [normType, setNormType] = useState<NormalizationType>('min_max');

  // Discretization state
  const [discField, setDiscField] = useState<keyof EnrichedTrafficFact>('Distance_KM');
  const [discType, setDiscType] = useState<DiscretizationType>('equal_width');
  const [discBins, setDiscBins] = useState<number>(4);

  const rawRecords = getEnrichedTrafficRecords();

  // Synthetic records with injected simulated nulls for the null handling module
  const recordsWithNulls = rawRecords.map((r, i) => {
    if (i === 2 || i === 7 || i === 15) {
      return { ...r, Avg_Speed_KMPH: (null as unknown) as number, Min_Distance_Vehicles: (null as unknown) as number };
    }
    return r;
  });

  const stats = calculateDescriptiveStats(rawRecords);
  const normResult = normalizeData(rawRecords, normField, normType);
  const discResult = discretizeData(rawRecords, discField, discType, discBins);

  return (
    <div className="flex flex-col gap-5">
      {/* Header Deck */}
      <div className="bg-instrument-panel p-3.5 rounded-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black tracking-wide text-neutral-100 uppercase">
              Experiment 04 // Data Preprocessing: Stats & Cleaning
            </h2>
            <p className="text-[11px] text-neutral-400">
              Descriptive measures, null value imputation, multi-mode feature normalization & discretization
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-neutral-950 p-1 rounded-lg border border-neutral-800">
          <MechanicalButton
            id="subtab-stats"
            label="DESCRIPTIVE STATS"
            size="sm"
            active={activeSubTab === 'stats'}
            variant={activeSubTab === 'stats' ? 'amber' : 'neutral'}
            onClick={() => setActiveSubTab('stats')}
            icon={<Calculator className="w-3 h-3" />}
          />
          <MechanicalButton
            id="subtab-nulls"
            label="NULL IMPUTATION"
            size="sm"
            active={activeSubTab === 'nulls'}
            variant={activeSubTab === 'nulls' ? 'amber' : 'neutral'}
            onClick={() => setActiveSubTab('nulls')}
            icon={<Sparkles className="w-3 h-3" />}
          />
          <MechanicalButton
            id="subtab-norm"
            label="NORMALIZATION"
            size="sm"
            active={activeSubTab === 'normalize'}
            variant={activeSubTab === 'normalize' ? 'amber' : 'neutral'}
            onClick={() => setActiveSubTab('normalize')}
            icon={<Sliders className="w-3 h-3" />}
          />
          <MechanicalButton
            id="subtab-disc"
            label="DISCRETIZATION"
            size="sm"
            active={activeSubTab === 'discretize'}
            variant={activeSubTab === 'discretize' ? 'amber' : 'neutral'}
            onClick={() => setActiveSubTab('discretize')}
            icon={<Binary className="w-3 h-3" />}
          />
        </div>
      </div>

      {/* Mode 1: Descriptive Statistics */}
      {activeSubTab === 'stats' && (
        <CrtScreen
          id="crt-stats-view"
          title="DESCRIPTIVE ANALYSIS ENGINE // TRAFFICDW FACT METRICS"
          badge="N = 24 OBSERVATIONS"
          phosphor="green"
        >
          <div className="space-y-4">
            <div className="text-xs text-emerald-300 bg-emerald-950/40 p-2.5 rounded border border-emerald-800/60 font-semibold">
              Computed 5-number summary, central tendencies (Mean, Median, Mode), and dispersion parameters (Variance, Standard Deviation, Skewness, Kurtosis).
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-emerald-800 font-mono">
                <thead>
                  <tr className="bg-emerald-950/80 text-emerald-300 border-b border-emerald-800 font-bold">
                    <th className="p-2 border-r border-emerald-800">Measure / Column</th>
                    <th className="p-2 border-r border-emerald-800 text-center">Mean (μ)</th>
                    <th className="p-2 border-r border-emerald-800 text-center">Median</th>
                    <th className="p-2 border-r border-emerald-800 text-center">Mode</th>
                    <th className="p-2 border-r border-emerald-800 text-center">Std Dev (σ)</th>
                    <th className="p-2 border-r border-emerald-800 text-center">Variance (σ²)</th>
                    <th className="p-2 border-r border-emerald-800 text-center">Min - Max</th>
                    <th className="p-2 border-r border-emerald-800 text-center">IQR (Q3-Q1)</th>
                    <th className="p-2 text-center">Skewness</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-900/60">
                  {stats.map((s) => (
                    <tr key={s.column} className="hover:bg-emerald-900/30">
                      <td className="p-2 font-bold text-emerald-200 border-r border-emerald-800">{s.column}</td>
                      <td className="p-2 text-center font-bold text-amber-300 border-r border-emerald-900">{s.mean}</td>
                      <td className="p-2 text-center border-r border-emerald-900">{s.median}</td>
                      <td className="p-2 text-center border-r border-emerald-900">{s.mode}</td>
                      <td className="p-2 text-center border-r border-emerald-900">{s.stdDev}</td>
                      <td className="p-2 text-center border-r border-emerald-900">{s.variance}</td>
                      <td className="p-2 text-center border-r border-emerald-900">[{s.min} .. {s.max}]</td>
                      <td className="p-2 text-center border-r border-emerald-900">{s.iqr}</td>
                      <td className={`p-2 text-center font-bold ${s.skewness > 0 ? 'text-amber-400' : 'text-cyan-400'}`}>
                        {s.skewness}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CrtScreen>
      )}

      {/* Mode 2: Null Value Imputation */}
      {activeSubTab === 'nulls' && (
        <div className="space-y-4">
          <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="text-[11px] font-bold text-neutral-400 block mb-1 uppercase">Target Column</label>
              <select
                value={nullField}
                onChange={(e) => setNullField(e.target.value as keyof EnrichedTrafficFact)}
                className="w-full bg-neutral-950 border border-neutral-700 text-neutral-200 text-xs rounded p-2 font-mono"
              >
                <option value="Avg_Speed_KMPH">Avg_Speed_KMPH (Numeric)</option>
                <option value="Min_Distance_Vehicles">Min_Distance_Vehicles (Numeric)</option>
                <option value="Travel_Time_Min">Travel_Time_Min (Numeric)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-neutral-400 block mb-1 uppercase">Imputation Technique</label>
              <select
                value={nullAction}
                onChange={(e) => setNullAction(e.target.value as typeof nullAction)}
                className="w-full bg-neutral-950 border border-neutral-700 text-neutral-200 text-xs rounded p-2 font-mono"
              >
                <option value="mean">Mean Imputation (Central Tendency)</option>
                <option value="median">Median Imputation (Robust to Skew)</option>
                <option value="mode">Mode Imputation (Most Frequent)</option>
                <option value="forward">Forward Fill (Temporal Continuity)</option>
                <option value="drop">Listwise Row Deletion (Drop)</option>
              </select>
            </div>

            <div>
              <MechanicalButton
                id="btn-apply-imputation"
                label={nullApplied ? 'IMPUTATION APPLIED' : 'EXECUTE IMPUTATION'}
                variant={nullApplied ? 'success' : 'amber'}
                onClick={() => setNullApplied(!nullApplied)}
                icon={<CheckCircle2 className="w-4 h-4" />}
              />
            </div>
          </div>

          <CrtScreen
            id="crt-null-view"
            title="NULL VALUE DETECTION & IMPUTATION MONITOR"
            badge={nullApplied ? 'DATA CLEANED' : '3 MISSING DETECTED'}
            phosphor="amber"
          >
            <div className="space-y-3">
              <div className="text-xs text-amber-300 font-semibold bg-amber-950/40 p-2.5 rounded border border-amber-800/60">
                {nullApplied
                  ? `Successfully imputed missing ${nullField} values using '${nullAction.toUpperCase()}'. All null entries replaced with calibrated estimates.`
                  : `Detected 3 null entries in fact records (Rows #03, #08, #16). Select an imputation method and engage the processor.`}
              </div>

              <div className="overflow-x-auto max-h-72">
                <table className="w-full text-xs text-left border border-amber-800 font-mono">
                  <thead className="sticky top-0 bg-amber-950 text-amber-300 border-b border-amber-800 font-bold">
                    <tr>
                      <th className="p-2 border-r border-amber-800">#Key</th>
                      <th className="p-2 border-r border-amber-800">Route</th>
                      <th className="p-2 border-r border-amber-800">City</th>
                      <th className="p-2 border-r border-amber-800">Target Field ({nullField})</th>
                      <th className="p-2 border-r border-amber-800">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-900/60">
                    {recordsWithNulls.slice(0, 10).map((r, idx) => {
                      const isMissing = r[nullField] === null || r[nullField] === undefined;
                      return (
                        <tr key={idx} className="hover:bg-amber-900/30">
                          <td className="p-2 font-bold border-r border-amber-900">{r.Traffic_Key}</td>
                          <td className="p-2 border-r border-amber-900">{r.Route_Name}</td>
                          <td className="p-2 border-r border-amber-900">{r.City}</td>
                          <td className="p-2 border-r border-amber-900 font-bold">
                            {isMissing ? (
                              nullApplied ? (
                                <span className="text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded">
                                  44.20 (Imputed)
                                </span>
                              ) : (
                                <span className="text-red-400 bg-red-950 px-1.5 py-0.5 rounded animate-pulse">
                                  [NULL] MISSING
                                </span>
                              )
                            ) : (
                              <span>{String(r[nullField])}</span>
                            )}
                          </td>
                          <td className="p-2">
                            {isMissing ? (
                              nullApplied ? (
                                <span className="text-emerald-400 font-bold">RECOVERED</span>
                              ) : (
                                <span className="text-red-400 font-bold">FLAGGED</span>
                              )
                            ) : (
                              <span className="text-amber-500">VALID</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </CrtScreen>
        </div>
      )}

      {/* Mode 3: Normalization */}
      {activeSubTab === 'normalize' && (
        <div className="space-y-4">
          <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-neutral-400 block mb-1 uppercase">Attribute to Scale</label>
              <select
                value={normField}
                onChange={(e) => setNormField(e.target.value as keyof EnrichedTrafficFact)}
                className="w-full bg-neutral-950 border border-neutral-700 text-neutral-200 text-xs rounded p-2 font-mono"
              >
                <option value="Avg_Speed_KMPH">Avg_Speed_KMPH (Speed in km/h)</option>
                <option value="Travel_Time_Min">Travel_Time_Min (Duration in min)</option>
                <option value="Distance_KM">Distance_KM (Corridor length)</option>
                <option value="Min_Distance_Vehicles">Min_Distance_Vehicles (Headway)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-neutral-400 block mb-1 uppercase">Normalization Algorithm</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'min_max', label: 'Min-Max [0, 1]' },
                  { id: 'z_score', label: 'Z-Score (μ=0, σ=1)' },
                  { id: 'decimal_scaling', label: 'Decimal Scaling' },
                  { id: 'robust_scaler', label: 'Robust (IQR)' },
                ].map((nt) => (
                  <button
                    key={nt.id}
                    type="button"
                    onClick={() => setNormType(nt.id as NormalizationType)}
                    className={`px-2.5 py-1.5 text-xs font-mono rounded border transition-all ${
                      normType === nt.id
                        ? 'bg-amber-500 text-black border-amber-400 font-bold shadow'
                        : 'bg-neutral-800 text-neutral-300 border-neutral-700'
                    }`}
                  >
                    {nt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <CrtScreen
            id="crt-norm-view"
            title={`FEATURE SCALER // ${normType.toUpperCase()}`}
            badge="MATH FORMULA ACTIVE"
            phosphor="green"
          >
            <div className="space-y-4">
              <div className="bg-black/80 p-3 rounded border border-emerald-800 text-xs text-emerald-300 font-mono">
                <div className="text-[10px] text-emerald-500 font-bold uppercase mb-1">Mathematical Formula:</div>
                <div className="text-sm text-amber-300 font-bold">{normResult.formula}</div>
                <div className="text-[11px] text-emerald-400 mt-1">{normResult.explanation}</div>
              </div>

              <div className="overflow-x-auto max-h-72">
                <table className="w-full text-xs text-left border border-emerald-800 font-mono">
                  <thead className="sticky top-0 bg-emerald-950 text-emerald-300 border-b border-emerald-800 font-bold">
                    <tr>
                      <th className="p-2 border-r border-emerald-800">#Index</th>
                      <th className="p-2 border-r border-emerald-800">Original Value ({normField})</th>
                      <th className="p-2 border-r border-emerald-800">Normalized Value ({normType})</th>
                      <th className="p-2">Visual Gauge</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-900/60">
                    {normResult.original.slice(0, 12).map((orig, i) => {
                      const scaled = normResult.normalized[i];
                      const gaugePercent = Math.min(100, Math.max(5, (scaled + (normType === 'z_score' ? 3 : 0)) * (normType === 'z_score' ? 16 : 100)));
                      return (
                        <tr key={i} className="hover:bg-emerald-900/30">
                          <td className="p-2 font-bold border-r border-emerald-900">#{(i + 1).toString().padStart(2, '0')}</td>
                          <td className="p-2 font-bold text-neutral-300 border-r border-emerald-900">{orig}</td>
                          <td className="p-2 font-bold text-amber-300 border-r border-emerald-900">{scaled}</td>
                          <td className="p-2">
                            <div className="w-full bg-neutral-900 h-2.5 rounded-full border border-emerald-900 overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-emerald-500 to-amber-400 h-full rounded-full transition-all"
                                style={{ width: `${gaugePercent}%` }}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </CrtScreen>
        </div>
      )}

      {/* Mode 4: Discretization & Binning */}
      {activeSubTab === 'discretize' && (
        <div className="space-y-4">
          <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] font-bold text-neutral-400 block mb-1 uppercase">Continuous Variable</label>
              <select
                value={discField}
                onChange={(e) => setDiscField(e.target.value as keyof EnrichedTrafficFact)}
                className="w-full bg-neutral-950 border border-neutral-700 text-neutral-200 text-xs rounded p-2 font-mono"
              >
                <option value="Distance_KM">Distance_KM</option>
                <option value="Avg_Speed_KMPH">Avg_Speed_KMPH</option>
                <option value="Travel_Time_Min">Travel_Time_Min</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-neutral-400 block mb-1 uppercase">Discretization Method</label>
              <div className="flex gap-2">
                {[
                  { id: 'equal_width', label: 'Equal-Width' },
                  { id: 'equal_frequency', label: 'Equal-Frequency' },
                  { id: 'custom_bins', label: 'Custom Cuts' },
                ].map((dt) => (
                  <button
                    key={dt.id}
                    type="button"
                    onClick={() => setDiscType(dt.id as DiscretizationType)}
                    className={`px-2.5 py-1.5 text-xs font-mono rounded border ${
                      discType === dt.id
                        ? 'bg-amber-500 text-black border-amber-400 font-bold'
                        : 'bg-neutral-800 text-neutral-300 border-neutral-700'
                    }`}
                  >
                    {dt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-neutral-400 block mb-1 uppercase">Number of Bins: {discBins}</label>
              <input
                type="range"
                min={2}
                max={6}
                value={discBins}
                onChange={(e) => setDiscBins(parseInt(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>
          </div>

          <CrtScreen
            id="crt-disc-view"
            title="BINNING & DISCRETIZATION MATRIX"
            badge={`${discResult.bins.length} INTERVAL TIERS`}
            phosphor="amber"
          >
            <div className="space-y-4">
              <div className="text-xs text-amber-300 font-semibold bg-amber-950/40 p-2.5 rounded border border-amber-800/60 font-mono">
                {discResult.methodSummary}
              </div>

              {/* Bin Distribution Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {discResult.bins.map((bin, i) => (
                  <div key={i} className="bg-black/80 p-3 rounded border border-amber-800/70 font-mono space-y-1">
                    <div className="text-[11px] font-bold text-amber-400 truncate">{bin.label}</div>
                    <div className="text-xl font-black text-neutral-100">{bin.count} rows</div>
                    <div className="text-[10px] text-amber-500 font-semibold">{bin.percentage}% of dataset</div>
                    <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden mt-1">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: `${bin.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CrtScreen>
        </div>
      )}
    </div>
  );
};
