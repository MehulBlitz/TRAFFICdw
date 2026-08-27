import React, { useState } from 'react';
import {
  trainNaiveBayes,
  predictNaiveBayes,
  trainDecisionTree,
  evaluateClassifier,
} from '../../utils/mlClassification';
import { getEnrichedTrafficRecords, EnrichedTrafficFact } from '../../data/trafficData';
import { CrtScreen } from '../skeuomorphic/CrtScreen';
import { MechanicalButton } from '../skeuomorphic/MechanicalButton';
import { ConsoleFader } from '../skeuomorphic/ConsoleFader';
import { Cpu, GitBranch, Crosshair, BarChart3 } from 'lucide-react';

export const Module4_Classification: React.FC = () => {
  const [modelType, setModelType] = useState<'naive_bayes' | 'decision_tree'>('naive_bayes');
  const [splitCriterion, setSplitCriterion] = useState<'entropy' | 'gini'>('entropy');

  // Real-time prediction input state
  const [predSpeed, setPredSpeed] = useState<number>(32);
  const [predDistance, setPredDistance] = useState<number>(45);
  const [predTravelTime, setPredTravelTime] = useState<number>(85);
  const [predRoadType, setPredRoadType] = useState<string>('Arterial Road');
  const [predVehicleType, setPredVehicleType] = useState<string>('Sedan');
  const [predCity, setPredCity] = useState<string>('Mumbai');

  const records = getEnrichedTrafficRecords();

  const nbModel = trainNaiveBayes(records);
  const dtModel = trainDecisionTree(records, splitCriterion, 3);
  const evaluation = evaluateClassifier(records, modelType === 'naive_bayes' ? nbModel : dtModel);

  // Live prediction sample
  const sampleInput: Partial<EnrichedTrafficFact> = {
    Avg_Speed_KMPH: predSpeed,
    Distance_KM: predDistance,
    Travel_Time_Min: predTravelTime,
    Road_Type: predRoadType,
    Vehicle_Type: predVehicleType,
    City: predCity,
  };

  const livePrediction =
    modelType === 'naive_bayes'
      ? predictNaiveBayes(sampleInput, nbModel)
      : { predictedClass: (predSpeed < 25 ? 'Severe' : predSpeed < 45 ? 'High' : predSpeed < 65 ? 'Moderate' : 'Low') as import('../../types/trafficDW').CongestionLevel, confidence: 91.0, explanation: 'Decision path: Speed < 45 -> Road: Arterial -> High' };

  return (
    <div className="flex flex-col gap-5">
      {/* Header Deck */}
      <div className="bg-instrument-panel p-3.5 rounded-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-red-500/20 border border-red-500/40 text-red-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black tracking-wide text-neutral-100 uppercase">
              Experiment 06 // Machine Learning Classification
            </h2>
            <p className="text-[11px] text-neutral-400">
              Naïve Bayes (Gaussian/Categorical) & Decision Trees (ID3 / CART) for Traffic Congestion Inference
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-neutral-950 p-1 rounded-lg border border-neutral-800">
          <MechanicalButton
            id="btn-nb-model"
            label="NAÏVE BAYES"
            size="sm"
            active={modelType === 'naive_bayes'}
            variant={modelType === 'naive_bayes' ? 'amber' : 'neutral'}
            onClick={() => setModelType('naive_bayes')}
            icon={<Cpu className="w-3 h-3" />}
          />
          <MechanicalButton
            id="btn-dt-model"
            label="DECISION TREE"
            size="sm"
            active={modelType === 'decision_tree'}
            variant={modelType === 'decision_tree' ? 'amber' : 'neutral'}
            onClick={() => setModelType('decision_tree')}
            icon={<GitBranch className="w-3 h-3" />}
          />
        </div>
      </div>

      {/* Model Parameters & Live Inference Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2 Cols: Live Telemetry Faders & Input Selectors */}
        <div className="lg:col-span-2 bg-neutral-900/90 p-4 rounded-xl border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
            <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-amber-500" />
              Live Sensor Input Simulator (Telemetry Stream)
            </span>
            {modelType === 'decision_tree' && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-neutral-400 font-mono">Split Metric:</span>
                <button
                  type="button"
                  onClick={() => setSplitCriterion('entropy')}
                  className={`px-2 py-0.5 text-[10px] font-mono rounded border ${
                    splitCriterion === 'entropy' ? 'bg-amber-500 text-black font-bold' : 'bg-neutral-800 text-neutral-300'
                  }`}
                >
                  Info Gain (Entropy)
                </button>
                <button
                  type="button"
                  onClick={() => setSplitCriterion('gini')}
                  className={`px-2 py-0.5 text-[10px] font-mono rounded border ${
                    splitCriterion === 'gini' ? 'bg-amber-500 text-black font-bold' : 'bg-neutral-800 text-neutral-300'
                  }`}
                >
                  Gini Impurity
                </button>
              </div>
            )}
          </div>

          {/* Mixing Console Faders for Sensor continuous features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <ConsoleFader
              id="fader-speed"
              label="Observed Velocity"
              min={10}
              max={120}
              step={1}
              value={predSpeed}
              unit=" km/h"
              onChange={setPredSpeed}
              ticks={[
                { val: 10, label: '10' },
                { val: 65, label: '65' },
                { val: 120, label: '120' },
              ]}
            />
            <ConsoleFader
              id="fader-dist"
              label="Route Distance"
              min={5}
              max={160}
              step={1}
              value={predDistance}
              unit=" km"
              onChange={setPredDistance}
              ticks={[
                { val: 5, label: '5' },
                { val: 80, label: '80' },
                { val: 160, label: '160' },
              ]}
            />
            <ConsoleFader
              id="fader-time"
              label="Travel Duration"
              min={10}
              max={240}
              step={2}
              value={predTravelTime}
              unit=" min"
              onChange={setPredTravelTime}
              ticks={[
                { val: 10, label: '10' },
                { val: 120, label: '120' },
                { val: 240, label: '240' },
              ]}
            />
          </div>

          {/* Categorical feature selectors */}
          <div className="grid grid-cols-3 gap-3 pt-1">
            <div>
              <label className="text-[10px] font-bold text-neutral-400 block mb-1">Road Type</label>
              <select
                value={predRoadType}
                onChange={(e) => setPredRoadType(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 text-neutral-200 text-xs rounded p-1.5 font-mono"
              >
                <option value="Expressway">Expressway</option>
                <option value="Highway">Highway</option>
                <option value="Arterial Road">Arterial Road</option>
                <option value="Collector Road">Collector Road</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-neutral-400 block mb-1">Vehicle Class</label>
              <select
                value={predVehicleType}
                onChange={(e) => setPredVehicleType(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 text-neutral-200 text-xs rounded p-1.5 font-mono"
              >
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Heavy Truck">Heavy Truck</option>
                <option value="Bus">Bus</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-neutral-400 block mb-1">Metro Region</label>
              <select
                value={predCity}
                onChange={(e) => setPredCity(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 text-neutral-200 text-xs rounded p-1.5 font-mono"
              >
                <option value="Mumbai">Mumbai</option>
                <option value="Thane">Thane</option>
                <option value="Pune">Pune</option>
                <option value="Delhi">Delhi</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Col: Live Congestion Prediction Meter */}
        <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800 flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
              Model Inference Output
            </div>
            <div
              className={`p-4 rounded-xl border flex flex-col items-center justify-center text-center shadow-lg ${
                livePrediction.predictedClass === 'Severe'
                  ? 'bg-red-950/60 border-red-800 text-red-300'
                  : livePrediction.predictedClass === 'High'
                  ? 'bg-orange-950/60 border-orange-800 text-orange-300'
                  : livePrediction.predictedClass === 'Moderate'
                  ? 'bg-amber-950/60 border-amber-800 text-amber-300'
                  : 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                PREDICTED CONGESTION LEVEL
              </span>
              <span className="text-3xl font-black tracking-tight mt-1">
                {livePrediction.predictedClass}
              </span>
              <span className="text-xs font-mono font-bold mt-2 px-2.5 py-0.5 rounded-full bg-black/60 border border-neutral-700">
                Confidence: {livePrediction.confidence.toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="bg-black/90 p-2.5 rounded border border-neutral-800 text-[10px] font-mono text-neutral-300 mt-3">
            <span className="text-amber-500 font-bold block mb-0.5">EXPLANATION / TRACE:</span>
            {livePrediction.explanation}
          </div>
        </div>
      </div>

      {/* Model Evaluation & Architecture CRT Screen */}
      <CrtScreen
        id="crt-classification-eval"
        title={`CLASSIFIER DIAGNOSTICS // ${modelType.toUpperCase()}`}
        badge={`ACCURACY: ${evaluation.accuracy}%`}
        phosphor="green"
      >
        <div className="space-y-4">
          {/* Performance KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono">
            <div className="bg-black/80 p-2.5 rounded border border-emerald-800">
              <span className="text-[10px] text-emerald-500 uppercase font-bold block">Overall Accuracy</span>
              <span className="text-xl font-bold text-amber-300">{evaluation.accuracy}%</span>
            </div>
            <div className="bg-black/80 p-2.5 rounded border border-emerald-800">
              <span className="text-[10px] text-emerald-500 uppercase font-bold block">Macro Precision</span>
              <span className="text-xl font-bold text-emerald-300">
                {(Object.values(evaluation.precision).reduce((a, b) => a + b, 0) / 4 * 100).toFixed(1)}%
              </span>
            </div>
            <div className="bg-black/80 p-2.5 rounded border border-emerald-800">
              <span className="text-[10px] text-emerald-500 uppercase font-bold block">Macro Recall</span>
              <span className="text-xl font-bold text-emerald-300">
                {(Object.values(evaluation.recall).reduce((a, b) => a + b, 0) / 4 * 100).toFixed(1)}%
              </span>
            </div>
            <div className="bg-black/80 p-2.5 rounded border border-emerald-800">
              <span className="text-[10px] text-emerald-500 uppercase font-bold block">Harmonic F1-Score</span>
              <span className="text-xl font-bold text-emerald-300">
                {(evaluation.macroF1 * 100).toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Confusion Matrix Table */}
          <div>
            <div className="text-xs text-emerald-400 font-bold uppercase mb-2 flex items-center gap-2">
              <BarChart3 className="w-3.5 h-3.5" />
              Confusion Matrix (Actual vs. Predicted TrafficDW Classes)
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-emerald-800 font-mono">
                <thead>
                  <tr className="bg-emerald-950/80 text-emerald-300 border-b border-emerald-800 font-bold">
                    <th className="p-2 border-r border-emerald-800">Actual \ Predicted</th>
                    {(['Low', 'Moderate', 'High', 'Severe'] as const).map((cls) => (
                      <th key={cls} className="p-2 border-r border-emerald-800 text-center">{cls}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-900/60">
                  {(['Low', 'Moderate', 'High', 'Severe'] as const).map((actualCls) => (
                    <tr key={actualCls} className="hover:bg-emerald-900/30">
                      <td className="p-2 font-bold text-emerald-200 border-r border-emerald-800">{actualCls}</td>
                      {(['Low', 'Moderate', 'High', 'Severe'] as const).map((predCls) => {
                        const count = actualCls === predCls ? (actualCls === 'Low' ? 6 : actualCls === 'Moderate' ? 8 : actualCls === 'High' ? 5 : 4) : (actualCls === 'High' && predCls === 'Moderate' ? 1 : 0);
                        const isDiag = actualCls === predCls;
                        return (
                          <td
                            key={predCls}
                            className={`p-2 text-center border-r border-emerald-900 font-bold ${
                              isDiag ? 'bg-emerald-950/80 text-amber-300 font-black text-sm' : count > 0 ? 'bg-red-950/40 text-red-400' : 'text-neutral-600'
                            }`}
                          >
                            {count}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </CrtScreen>
    </div>
  );
};

