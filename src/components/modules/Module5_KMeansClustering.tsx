import React, { useState } from 'react';
import { runClustering } from '../../utils/mlClustering';
import { getEnrichedTrafficRecords, EnrichedTrafficFact } from '../../data/trafficData';
import { CrtScreen } from '../skeuomorphic/CrtScreen';
import { MechanicalButton } from '../skeuomorphic/MechanicalButton';
import { VuMeter } from '../skeuomorphic/VuMeter';
import { Network, Activity, Target } from 'lucide-react';

const CLUSTER_COLORS = ['#38bdf8', '#f59e0b', '#ec4899', '#22c55e', '#a855f7', '#ef4444'];

export const Module5_KMeansClustering: React.FC = () => {
  const [algorithm, setAlgorithm] = useState<'kmeans' | 'kmedoids'>('kmeans');
  const [k, setK] = useState<number>(3);
  const [xAxis, setXAxis] = useState<keyof EnrichedTrafficFact>('Distance_KM');
  const [yAxis, setYAxis] = useState<keyof EnrichedTrafficFact>('Travel_Time_Min');

  const records = getEnrichedTrafficRecords();
  const result = runClustering(records, algorithm, k, xAxis, yAxis);

  return (
    <div className="flex flex-col gap-5">
      {/* Header Deck */}
      <div className="bg-instrument-panel p-3.5 rounded-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-sky-500/20 border border-sky-500/40 text-sky-400">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black tracking-wide text-neutral-100 uppercase">
              Experiment 07 // Cluster Analysis (K-Means & K-Medoids PAM)
            </h2>
            <p className="text-[11px] text-neutral-400">
              Iterative centroid relocation, PAM medoid selection, Elbow SSE curve, and Silhouette cohesion metrics
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-neutral-950 p-1 rounded-lg border border-neutral-800">
          <MechanicalButton
            id="btn-kmeans"
            label="K-MEANS (LLOYD)"
            size="sm"
            active={algorithm === 'kmeans'}
            variant={algorithm === 'kmeans' ? 'amber' : 'neutral'}
            onClick={() => setAlgorithm('kmeans')}
          />
          <MechanicalButton
            id="btn-kmedoids"
            label="K-MEDOIDS (PAM)"
            size="sm"
            active={algorithm === 'kmedoids'}
            variant={algorithm === 'kmedoids' ? 'amber' : 'neutral'}
            onClick={() => setAlgorithm('kmedoids')}
          />
        </div>
      </div>

      {/* Cluster Controls & Telemetry Readouts */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-neutral-900/90 p-4 rounded-xl border border-neutral-800">
        <div>
          <label className="text-[11px] font-bold text-neutral-400 block mb-1 uppercase">
            Cluster Count (K = {k})
          </label>
          <div className="flex gap-1.5">
            {[2, 3, 4, 5, 6].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setK(num)}
                className={`w-9 h-8 text-xs font-mono font-bold rounded border transition-all ${
                  k === num
                    ? 'bg-amber-500 text-black border-amber-400 shadow-md'
                    : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:border-neutral-500'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold text-neutral-400 block mb-1 uppercase">X-Axis Projection</label>
          <select
            value={xAxis}
            onChange={(e) => setXAxis(e.target.value as keyof EnrichedTrafficFact)}
            className="w-full bg-neutral-950 border border-neutral-700 text-neutral-200 text-xs rounded p-2 font-mono"
          >
            <option value="Distance_KM">Distance_KM</option>
            <option value="Avg_Speed_KMPH">Avg_Speed_KMPH</option>
            <option value="Travel_Time_Min">Travel_Time_Min</option>
            <option value="Min_Distance_Vehicles">Min_Distance_Vehicles</option>
          </select>
        </div>

        <div>
          <label className="text-[11px] font-bold text-neutral-400 block mb-1 uppercase">Y-Axis Projection</label>
          <select
            value={yAxis}
            onChange={(e) => setYAxis(e.target.value as keyof EnrichedTrafficFact)}
            className="w-full bg-neutral-950 border border-neutral-700 text-neutral-200 text-xs rounded p-2 font-mono"
          >
            <option value="Travel_Time_Min">Travel_Time_Min</option>
            <option value="Avg_Speed_KMPH">Avg_Speed_KMPH</option>
            <option value="Distance_KM">Distance_KM</option>
            <option value="Min_Distance_Vehicles">Min_Distance_Vehicles</option>
          </select>
        </div>

        <div className="flex items-center justify-center">
          <VuMeter
            id="meter-silhouette"
            label="Silhouette Cohesion"
            value={Math.max(0, result.averageSilhouette * 100)}
            unit="%"
            subLabel={`Total SSE: ${result.totalSSE.toFixed(2)}`}
          />
        </div>
      </div>

      {/* 2D Interactive Cluster Scatterplot Canvas & Centroids */}
      <CrtScreen
        id="crt-cluster-view"
        title={`2D CLUSTER PROJECTION // ${algorithm.toUpperCase()} (K=${k})`}
        badge={`CONVERGED IN ${result.iterationsTaken} ITERATIONS`}
        phosphor="green"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-emerald-300 font-mono">
            <span>X: {xAxis} (Horizontal)</span>
            <span>Y: {yAxis} (Vertical)</span>
            <span className="text-amber-400 font-bold">Total Intra-Cluster SSE: {result.totalSSE}</span>
          </div>

          {/* SVG 2D Scatterplot */}
          <div className="relative w-full h-80 bg-neutral-950 rounded-lg border border-emerald-900/80 p-4 flex items-center justify-center overflow-hidden">
            {/* Coordinate Grid Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
              <line x1="10%" y1="0" x2="10%" y2="100%" stroke="#33ff66" strokeWidth="1" />
              <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#33ff66" strokeWidth="1" />
              <line x1="90%" y1="0" x2="90%" y2="100%" stroke="#33ff66" strokeWidth="1" />
              <line x1="0" y1="20%" x2="100%" y2="20%" stroke="#33ff66" strokeWidth="1" />
              <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#33ff66" strokeWidth="1" />
              <line x1="0" y1="80%" x2="100%" y2="80%" stroke="#33ff66" strokeWidth="1" />
            </svg>

            {/* Rendered Cluster Points */}
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Lines from point to assigned centroid */}
              {result.points.map((p) => {
                const cent = result.centroids[p.cluster];
                if (!cent) return null;
                const col = CLUSTER_COLORS[p.cluster % CLUSTER_COLORS.length];
                return (
                  <line
                    key={`line-${p.id}`}
                    x1={p.x * 90 + 5}
                    y1={95 - p.y * 90}
                    x2={cent.x * 90 + 5}
                    y2={95 - cent.y * 90}
                    stroke={col}
                    strokeWidth="0.3"
                    strokeDasharray="1 1"
                    opacity="0.4"
                  />
                );
              })}

              {/* Data Points */}
              {result.points.map((p) => {
                const col = CLUSTER_COLORS[p.cluster % CLUSTER_COLORS.length];
                return (
                  <g key={`point-${p.id}`} className="group cursor-pointer">
                    <circle
                      cx={p.x * 90 + 5}
                      cy={95 - p.y * 90}
                      r="2"
                      fill={col}
                      stroke="#000"
                      strokeWidth="0.5"
                    />
                    {p.isMedoid && (
                      <circle
                        cx={p.x * 90 + 5}
                        cy={95 - p.y * 90}
                        r="3.5"
                        fill="none"
                        stroke="#fff"
                        strokeWidth="0.8"
                        strokeDasharray="1 1"
                      />
                    )}
                  </g>
                );
              })}

              {/* Centroids */}
              {result.centroids.map((c, idx) => {
                const col = CLUSTER_COLORS[idx % CLUSTER_COLORS.length];
                return (
                  <g key={`cent-${idx}`}>
                    <circle
                      cx={c.x * 90 + 5}
                      cy={95 - c.y * 90}
                      r="4"
                      fill={col}
                      stroke="#ffffff"
                      strokeWidth="1.2"
                    />
                    <text
                      x={c.x * 90 + 5}
                      y={95 - c.y * 90 + 1.2}
                      fontSize="3"
                      fontWeight="bold"
                      fill="#000000"
                      textAnchor="middle"
                    >
                      {idx + 1}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Cluster Summary Profiles Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono">
            {result.centroids.map((c, i) => (
              <div
                key={i}
                className="bg-black/90 p-3 rounded border font-mono space-y-1 text-xs"
                style={{ borderColor: CLUSTER_COLORS[i % CLUSTER_COLORS.length] }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-black" style={{ color: CLUSTER_COLORS[i % CLUSTER_COLORS.length] }}>
                    CLUSTER #{c.cluster} ({algorithm === 'kmedoids' ? 'PAM MEDOID' : 'CENTROID'})
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-300">
                    {c.pointCount} points
                  </span>
                </div>
                <div className="text-[11px] text-neutral-300">
                  Center ({xAxis}): <span className="text-amber-300 font-bold">{c.rawX}</span>
                </div>
                <div className="text-[11px] text-neutral-300">
                  Center ({yAxis}): <span className="text-amber-300 font-bold">{c.rawY}</span>
                </div>
                <div className="text-[11px] text-neutral-300">
                  Dominant Congestion: <span className="text-emerald-400 font-bold">{c.dominantCongestion}</span>
                </div>
                <div className="text-[11px] text-neutral-300">
                  Dominant Road: <span className="text-emerald-400 font-bold">{c.dominantRoad}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Elbow Curve SSE Table */}
          <div className="bg-black/80 p-3 rounded border border-emerald-800 font-mono text-xs">
            <div className="text-[11px] text-emerald-400 font-bold uppercase mb-2 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5" />
              Elbow Criterion (Sum of Squared Errors vs. K)
            </div>
            <div className="flex gap-3 overflow-x-auto">
              {result.elbowCurve.map((eb) => (
                <div
                  key={eb.k}
                  className={`p-2 rounded border flex-1 text-center ${
                    eb.k === k ? 'bg-amber-950/60 border-amber-500 text-amber-300 font-bold' : 'bg-neutral-900 border-neutral-800 text-neutral-300'
                  }`}
                >
                  <div className="text-[10px] text-neutral-400">K = {eb.k}</div>
                  <div className="text-sm font-black">SSE: {eb.sse}</div>
                  <div className="text-[9px] text-neutral-400">Sil: {eb.silhouette}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CrtScreen>
    </div>
  );
};
