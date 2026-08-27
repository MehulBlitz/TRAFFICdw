import React, { useState } from 'react';
import {
  BrainCircuit,
  Award,
  Sliders,
  TrendingUp,
  HelpCircle,
  BarChart2,
  CheckCircle2,
  Flame,
  Layers,
  ArrowRight,
  Info,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from 'recharts';
import { MechanicalButton } from '../skeuomorphic/MechanicalButton';
import { EnrichedTrafficFact } from '../../types/trafficDW';
import { BENCHMARK_MODELS, explainPredictionWithShap } from '../../utils/xaiEngine';
import { playSwitchToggle, playRelayChime } from '../../audio/soundEffects';

interface ModuleXAIBenchmarkProps {
  facts: EnrichedTrafficFact[];
}

export const Module_XAIBenchmark: React.FC<ModuleXAIBenchmarkProps> = ({ facts }) => {
  const [selectedScenario, setSelectedScenario] = useState<{
    Hour: number;
    Avg_Speed_KMPH: number;
    Lane_Count: number;
    Road_Type: string;
    Vehicle_Type: string;
    Distance_KM: number;
  }>({
    Hour: 18,
    Avg_Speed_KMPH: 22.5,
    Lane_Count: 4,
    Road_Type: 'Expressway',
    Vehicle_Type: 'Sedan',
    Distance_KM: 45.0,
  });

  const [activeXaiTab, setActiveXaiTab] = useState<'shap' | 'benchmark' | 'lime'>('shap');

  const explanation = explainPredictionWithShap(selectedScenario);

  const handleTune = (key: string, val: any) => {
    setSelectedScenario((prev) => ({ ...prev, [key]: val }));
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 neu-raised p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl neu-inset flex items-center justify-center text-purple-600">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800 tracking-tight">
              Feature E: Multi-Model Benchmark Arena & Explainable AI (SHAP / LIME)
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Glass-box transparency: Side-by-side model battle ground with exact Shapley value attributions
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => {
              playSwitchToggle();
              setActiveXaiTab('shap');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeXaiTab === 'shap' ? 'neu-inset text-purple-600 bg-purple-50/50' : 'neu-btn text-slate-600'
            }`}
          >
            SHAP Waterfall Explainer
          </button>
          <button
            type="button"
            onClick={() => {
              playSwitchToggle();
              setActiveXaiTab('benchmark');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeXaiTab === 'benchmark' ? 'neu-inset text-purple-600 bg-purple-50/50' : 'neu-btn text-slate-600'
            }`}
          >
            4-Model Battle Arena
          </button>
        </div>
      </div>

      {activeXaiTab === 'shap' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left Col: Interactive Scenario Tuner */}
          <div className="neu-raised-lg p-5 rounded-3xl flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Scenario Telemetry Inputs
              </h3>
              <Sliders className="w-4 h-4 text-slate-400" />
            </div>

            {/* Hour Slider */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-600">Hour of Day:</span>
                <span className="font-mono text-purple-600 font-bold">{selectedScenario.Hour}:00</span>
              </div>
              <input
                type="range"
                min={0}
                max={23}
                value={selectedScenario.Hour}
                onChange={(e) => handleTune('Hour', parseInt(e.target.value, 10))}
                className="w-full h-2 neu-inset accent-purple-600 rounded-lg"
              />
            </div>

            {/* Speed Slider */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-600">Avg Speed (km/h):</span>
                <span className="font-mono text-purple-600 font-bold">
                  {selectedScenario.Avg_Speed_KMPH.toFixed(1)} km/h
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={120}
                value={selectedScenario.Avg_Speed_KMPH}
                onChange={(e) => handleTune('Avg_Speed_KMPH', parseFloat(e.target.value))}
                className="w-full h-2 neu-inset accent-purple-600 rounded-lg"
              />
            </div>

            {/* Lane Count */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-slate-600">Corridor Lanes:</span>
              <div className="flex gap-2">
                {[2, 4, 6, 8].map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => handleTune('Lane_Count', l)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold ${
                      selectedScenario.Lane_Count === l
                        ? 'neu-inset text-purple-600 bg-purple-50/50'
                        : 'neu-btn text-slate-600'
                    }`}
                  >
                    {l} Lanes
                  </button>
                ))}
              </div>
            </div>

            {/* Vehicle Category */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-slate-600">Vehicle Type:</span>
              <div className="grid grid-cols-2 gap-2">
                {['Sedan', 'SUV', 'Heavy Truck', 'Bus'].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => handleTune('Vehicle_Type', v)}
                    className={`py-1.5 rounded-xl text-xs font-bold ${
                      selectedScenario.Vehicle_Type === v
                        ? 'neu-inset text-purple-600 bg-purple-50/50'
                        : 'neu-btn text-slate-600'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Road Type */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-slate-600">Road Type:</span>
              <div className="flex gap-2">
                {['Expressway', 'Arterial Road', 'Highway'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleTune('Road_Type', r)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-bold ${
                      selectedScenario.Road_Type === r
                        ? 'neu-inset text-purple-600 bg-purple-50/50'
                        : 'neu-btn text-slate-600'
                    }`}
                  >
                    {r.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right 2 Cols: SHAP Waterfall Visualization & Output */}
          <div className="lg:col-span-2 neu-raised-lg p-5 rounded-3xl flex flex-col gap-4">
            {/* Model Output Card */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 neu-inset rounded-2xl">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  Model Prediction Output
                </span>
                <div className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <span>Congestion Status:</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-lg text-sm ${
                      explanation.predictedClass === 'Severe'
                        ? 'bg-rose-100 text-rose-700'
                        : explanation.predictedClass === 'High'
                        ? 'bg-orange-100 text-orange-700'
                        : explanation.predictedClass === 'Moderate'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {explanation.predictedClass}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  Calculated Probability
                </span>
                <div className="text-2xl font-bold text-purple-600 font-mono">
                  {(explanation.probability * 100).toFixed(0)}%
                </div>
              </div>
            </div>

            {/* SHAP Waterfall Force Breakdown */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  SHAP (Shapley Value) Attribution Breakdown
                </h4>
                <span className="text-[10px] text-slate-500 font-mono">
                  Base Rate $E[f(x)] = {explanation.baseValue} \rightarrow f(x) = {explanation.outputValue}$
                </span>
              </div>

              <div className="neu-inset p-4 rounded-2xl flex flex-col gap-3">
                {explanation.shapValues.map((item, idx) => {
                  const isPositive = item.attribution >= 0;
                  return (
                    <div key={idx} className="flex flex-col gap-1 text-xs">
                      <div className="flex justify-between font-semibold">
                        <span className="text-slate-700">
                          {item.featureName} = <span className="font-mono text-purple-600">{item.value}</span>
                        </span>
                        <span
                          className={`font-mono font-bold ${
                            isPositive ? 'text-rose-600' : 'text-emerald-600'
                          }`}
                        >
                          {isPositive ? `+${item.attribution}` : `${item.attribution}`}
                        </span>
                      </div>

                      {/* Force bar */}
                      <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden flex">
                        {!isPositive ? (
                          <div
                            className="h-full bg-emerald-500 ml-auto rounded-full"
                            style={{ width: `${Math.min(100, Math.abs(item.attribution) * 200)}%` }}
                          />
                        ) : (
                          <div
                            className="h-full bg-rose-500 rounded-full"
                            style={{ width: `${Math.min(100, item.attribution * 200)}%` }}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Explanatory Note */}
            <div className="neu-raised-sm p-3.5 rounded-2xl text-xs text-slate-600 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <p>
                <strong className="text-slate-800">Interpretation:</strong> Red bars represent positive Shapley values that push the model towards higher congestion risk, while green bars represent features (like high velocity or 6+ lanes) that mitigate traffic bottleneck probability.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Multi-Model Benchmark Arena View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {BENCHMARK_MODELS.map((model, idx) => (
            <div
              key={idx}
              className="neu-raised-lg p-5 rounded-3xl flex flex-col justify-between gap-4 border border-white"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700">
                    {model.type}
                  </span>
                  <span className="text-xs font-bold text-slate-400">#{idx + 1}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-800">{model.name}</h3>
                <p className="text-xs text-slate-500">{model.strengths}</p>
              </div>

              {/* Metric Ratings */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Test Accuracy</span>
                  <span className="font-bold text-slate-800 font-mono">{model.accuracy}%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Macro F1 Score</span>
                  <span className="font-bold text-slate-800 font-mono">{model.f1Score}%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">ROC-AUC</span>
                  <span className="font-bold text-purple-600 font-mono">{model.rocAuc}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60">
                  <span className="text-slate-500">Inference Latency</span>
                  <span className="font-bold text-slate-800 font-mono">{model.inferenceTimeMs} ms</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Interpretability</span>
                  <span className="font-bold text-slate-700">{model.interpretability}</span>
                </div>
              </div>

              <div className="neu-inset p-2.5 rounded-xl text-[10px] text-slate-500 font-mono text-center">
                {model.paramCount}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
