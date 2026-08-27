import React, { useState } from 'react';
import {
  transformData,
  detectOutliers,
  calculateCorrelationMatrix,
  TransformationType,
  OutlierMethod,
} from '../../utils/preprocessingEngine';
import { getEnrichedTrafficRecords, EnrichedTrafficFact } from '../../data/trafficData';
import { CrtScreen } from '../skeuomorphic/CrtScreen';
import { MechanicalButton } from '../skeuomorphic/MechanicalButton';
import { Flame, Activity, Sparkles, Grid } from 'lucide-react';

export const Module3_PreprocessingPart2: React.FC = () => {
  const [subTab, setSubTab] = useState<'transform' | 'outliers' | 'correlation'>('transform');

  // Transformation state
  const [transField, setTransField] = useState<keyof EnrichedTrafficFact>('Travel_Time_Min');
  const [transType, setTransType] = useState<TransformationType>('log_e');
  const [boxCoxLambda, setBoxCoxLambda] = useState<number>(0.5);

  // Outlier state
  const [outlierField, setOutlierField] = useState<keyof EnrichedTrafficFact>('Avg_Speed_KMPH');
  const [outlierMethod, setOutlierMethod] = useState<OutlierMethod>('tukey_iqr');
  const [outlierThreshold, setOutlierThreshold] = useState<number>(1.5);

  const rawRecords = getEnrichedTrafficRecords();
  const transResult = transformData(rawRecords, transField, transType, boxCoxLambda);
  const outlierResult = detectOutliers(rawRecords, outlierField, outlierMethod, outlierThreshold);
  const corrMatrix = calculateCorrelationMatrix(rawRecords);

  return (
    <div className="flex flex-col gap-5">
      {/* Header Bar */}
      <div className="bg-instrument-panel p-3.5 rounded-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-orange-500/20 border border-orange-500/40 text-orange-400">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black tracking-wide text-neutral-100 uppercase">
              Experiment 05 // Transformations, Outliers & EDA
            </h2>
            <p className="text-[11px] text-neutral-400">
              Box-Cox & log transformations, Tukey IQR/Z-score anomaly detection, and bivariate correlation heatmap
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-neutral-950 p-1 rounded-lg border border-neutral-800">
          <MechanicalButton
            id="subtab-transform"
            label="TRANSFORMATIONS"
            size="sm"
            active={subTab === 'transform'}
            variant={subTab === 'transform' ? 'amber' : 'neutral'}
            onClick={() => setSubTab('transform')}
            icon={<Sparkles className="w-3 h-3" />}
          />
          <MechanicalButton
            id="subtab-outliers"
            label="OUTLIER ANALYSIS"
            size="sm"
            active={subTab === 'outliers'}
            variant={subTab === 'outliers' ? 'amber' : 'neutral'}
            onClick={() => setSubTab('outliers')}
            icon={<Flame className="w-3 h-3" />}
          />
          <MechanicalButton
            id="subtab-correlation"
            label="CORRELATION HEATMAP"
            size="sm"
            active={subTab === 'correlation'}
            variant={subTab === 'correlation' ? 'amber' : 'neutral'}
            onClick={() => setSubTab('correlation')}
            icon={<Grid className="w-3 h-3" />}
          />
        </div>
      </div>

      {/* Subtab 1: Transformations */}
      {subTab === 'transform' && (
        <div className="space-y-4">
          <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] font-bold text-neutral-400 block mb-1 uppercase">Target Attribute</label>
              <select
                value={transField}
                onChange={(e) => setTransField(e.target.value as keyof EnrichedTrafficFact)}
                className="w-full bg-neutral-950 border border-neutral-700 text-neutral-200 text-xs rounded p-2 font-mono"
              >
                <option value="Travel_Time_Min">Travel_Time_Min (Right-Skewed)</option>
                <option value="Avg_Speed_KMPH">Avg_Speed_KMPH</option>
                <option value="Distance_KM">Distance_KM</option>
                <option value="Road_Type">Road_Type (Categorical)</option>
                <option value="Vehicle_Type">Vehicle_Type (Categorical)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-neutral-400 block mb-1 uppercase">Transform Method</label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'log_e', label: 'Natural Log ln(x+1)' },
                  { id: 'log_10', label: 'Log10(x)' },
                  { id: 'sqrt', label: 'Square Root √x' },
                  { id: 'box_cox', label: 'Box-Cox (λ)' },
                  { id: 'one_hot', label: 'One-Hot Binarize' },
                  { id: 'label_encode', label: 'Ordinal Encode' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTransType(t.id as TransformationType)}
                    className={`px-2 py-1 text-[11px] font-mono rounded border transition-all truncate ${
                      transType === t.id
                        ? 'bg-amber-500 text-black border-amber-400 font-bold'
                        : 'bg-neutral-800 text-neutral-300 border-neutral-700'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {transType === 'box_cox' && (
              <div>
                <label className="text-[11px] font-bold text-neutral-400 block mb-1 uppercase">
                  Box-Cox Parameter (λ = {boxCoxLambda})
                </label>
                <input
                  type="range"
                  min={-1}
                  max={2}
                  step={0.1}
                  value={boxCoxLambda}
                  onChange={(e) => setBoxCoxLambda(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 mt-2"
                />
              </div>
            )}
          </div>

          <CrtScreen
            id="crt-transform-view"
            title={`DATA TRANSFORMATION // ${transType.toUpperCase()}`}
            badge="POWER TRANSFORM"
            phosphor="amber"
          >
            <div className="space-y-4">
              <div className="bg-black/80 p-3 rounded border border-amber-800 font-mono text-xs">
                <div className="text-[10px] text-amber-500 font-bold uppercase mb-1">Mathematical Function:</div>
                <div className="text-sm font-bold text-amber-300">{transResult.formula}</div>
                <div className="text-[11px] text-amber-400 mt-1">{transResult.interpretation}</div>
              </div>

              <div className="overflow-x-auto max-h-72">
                <table className="w-full text-xs text-left border border-amber-800 font-mono">
                  <thead className="sticky top-0 bg-amber-950 text-amber-300 border-b border-amber-800 font-bold">
                    <tr>
                      <th className="p-2 border-r border-amber-800">#Key</th>
                      <th className="p-2 border-r border-amber-800">Original ({transField})</th>
                      <th className="p-2">Transformed Representation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-900/60">
                    {rawRecords.slice(0, 10).map((r, i) => (
                      <tr key={i} className="hover:bg-amber-900/30">
                        <td className="p-2 font-bold border-r border-amber-900">{r.Traffic_Key}</td>
                        <td className="p-2 border-r border-amber-900 font-bold text-neutral-300">
                          {String(r[transField])}
                        </td>
                        <td className="p-2 font-bold text-amber-300">{String(transResult.transformed[i])}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CrtScreen>
        </div>
      )}

      {/* Subtab 2: Outlier Analysis */}
      {subTab === 'outliers' && (
        <div className="space-y-4">
          <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] font-bold text-neutral-400 block mb-1 uppercase">Numeric Attribute</label>
              <select
                value={outlierField}
                onChange={(e) => setOutlierField(e.target.value as keyof EnrichedTrafficFact)}
                className="w-full bg-neutral-950 border border-neutral-700 text-neutral-200 text-xs rounded p-2 font-mono"
              >
                <option value="Avg_Speed_KMPH">Avg_Speed_KMPH</option>
                <option value="Travel_Time_Min">Travel_Time_Min</option>
                <option value="Distance_KM">Distance_KM</option>
                <option value="Min_Distance_Vehicles">Min_Distance_Vehicles</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-neutral-400 block mb-1 uppercase">Detection Method</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setOutlierMethod('tukey_iqr');
                    setOutlierThreshold(1.5);
                  }}
                  className={`px-3 py-1.5 text-xs font-mono rounded border ${
                    outlierMethod === 'tukey_iqr'
                      ? 'bg-amber-500 text-black border-amber-400 font-bold'
                      : 'bg-neutral-800 text-neutral-300 border-neutral-700'
                  }`}
                >
                  Tukey 1.5×IQR
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOutlierMethod('z_score');
                    setOutlierThreshold(2.5);
                  }}
                  className={`px-3 py-1.5 text-xs font-mono rounded border ${
                    outlierMethod === 'z_score'
                      ? 'bg-amber-500 text-black border-amber-400 font-bold'
                      : 'bg-neutral-800 text-neutral-300 border-neutral-700'
                  }`}
                >
                  Z-Score (±3σ)
                </button>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-neutral-400 block mb-1 uppercase">
                Threshold Factor: {outlierThreshold}
              </label>
              <input
                type="range"
                min={1.0}
                max={3.5}
                step={0.1}
                value={outlierThreshold}
                onChange={(e) => setOutlierThreshold(parseFloat(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>
          </div>

          <CrtScreen
            id="crt-outlier-view"
            title="ANOMALY & OUTLIER DETECTION BENCH"
            badge={`${outlierResult.outlierCount} OUTLIERS FLAGGED`}
            phosphor="green"
          >
            <div className="space-y-4">
              <div className="text-xs text-emerald-300 font-semibold bg-emerald-950/40 p-2.5 rounded border border-emerald-800/60 font-mono">
                {outlierResult.summary}
              </div>

              {/* Visual Boxplot Band */}
              <div className="bg-black/90 p-4 rounded border border-emerald-800 font-mono text-xs">
                <div className="flex justify-between text-[11px] text-emerald-500 mb-2 font-bold">
                  <span>Lower Fence: {outlierResult.lowerBound}</span>
                  <span>Normal Operating Range</span>
                  <span>Upper Fence: {outlierResult.upperBound}</span>
                </div>
                <div className="relative w-full h-8 bg-neutral-900 rounded border border-emerald-900 flex items-center px-4">
                  {/* Normal Band */}
                  <div className="absolute inset-y-1 left-1/4 right-1/4 bg-emerald-950/70 border border-emerald-600 rounded" />
                  {/* Outlier markers */}
                  {outlierResult.points.map((pt, i) => (
                    <div
                      key={i}
                      className={`absolute w-3 h-3 rounded-full border transform -translate-x-1/2 ${
                        pt.isOutlier
                          ? 'bg-red-500 border-red-200 shadow-md shadow-red-500 animate-pulse z-20'
                          : 'bg-emerald-500/80 border-emerald-300 z-10'
                      }`}
                      style={{ left: `${Math.min(95, Math.max(5, (pt.value / 180) * 100))}%` }}
                      title={`Row #${pt.index + 1}: ${pt.value}`}
                    />
                  ))}
                </div>
              </div>

              {/* Table of points */}
              <div className="overflow-x-auto max-h-56">
                <table className="w-full text-xs text-left border border-emerald-800 font-mono">
                  <thead className="sticky top-0 bg-emerald-950 text-emerald-300 border-b border-emerald-800 font-bold">
                    <tr>
                      <th className="p-2 border-r border-emerald-800">#Index</th>
                      <th className="p-2 border-r border-emerald-800">Value ({outlierField})</th>
                      <th className="p-2 border-r border-emerald-800">Status</th>
                      <th className="p-2">Anomaly Diagnostic</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-900/60">
                    {outlierResult.points.slice(0, 10).map((pt) => (
                      <tr key={pt.index} className="hover:bg-emerald-900/30">
                        <td className="p-2 font-bold border-r border-emerald-900">#{(pt.index + 1).toString().padStart(2, '0')}</td>
                        <td className="p-2 font-bold text-neutral-200 border-r border-emerald-900">{pt.value}</td>
                        <td className="p-2 border-r border-emerald-900 font-bold">
                          {pt.isOutlier ? (
                            <span className="text-red-400 bg-red-950/80 px-2 py-0.5 rounded">OUTLIER</span>
                          ) : (
                            <span className="text-emerald-400">NORMAL</span>
                          )}
                        </td>
                        <td className="p-2 text-neutral-400">
                          {pt.isOutlier
                            ? `Exceeds fence by ${pt.distance?.toFixed(2)} units`
                            : 'Within statistical bounds'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CrtScreen>
        </div>
      )}

      {/* Subtab 3: Correlation Matrix */}
      {subTab === 'correlation' && (
        <CrtScreen
          id="crt-corr-view"
          title="BIVARIATE CORRELATION MATRIX // PEARSON COEFFICIENTS"
          badge="6x6 MATRIX"
          phosphor="green"
        >
          <div className="space-y-4">
            <div className="text-xs text-emerald-300 font-semibold bg-emerald-950/40 p-2.5 rounded border border-emerald-800/60 font-mono">
              Pearson correlation coefficients $r \in [-1, +1]$. High inverse correlation observed between Speed and Travel Time ($r = -0.84$).
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-emerald-800 font-mono">
                <thead>
                  <tr className="bg-emerald-950/80 text-emerald-300 border-b border-emerald-800 font-bold">
                    <th className="p-2 border-r border-emerald-800">Variables</th>
                    {corrMatrix.fields.map((f) => (
                      <th key={f} className="p-2 border-r border-emerald-800 text-center">{f.replace(/_/g, ' ')}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-900/60">
                  {corrMatrix.fields.map((rowF, i) => (
                    <tr key={rowF} className="hover:bg-emerald-900/30">
                      <td className="p-2 font-bold text-emerald-200 border-r border-emerald-800">{rowF}</td>
                      {corrMatrix.matrix[i].map((val, j) => {
                        const isPos = val > 0.4;
                        const isNeg = val < -0.4;
                        return (
                          <td
                            key={j}
                            className={`p-2 text-center border-r border-emerald-900 font-bold ${
                              i === j
                                ? 'bg-emerald-950 text-neutral-400'
                                : isNeg
                                ? 'bg-red-950/60 text-red-300'
                                : isPos
                                ? 'bg-emerald-900/60 text-amber-300'
                                : 'text-emerald-400'
                            }`}
                          >
                            {val.toFixed(2)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CrtScreen>
      )}
    </div>
  );
};
