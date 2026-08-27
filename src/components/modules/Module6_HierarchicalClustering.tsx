import React, { useState } from 'react';
import { runHierarchicalClustering, LinkageMethod, DistanceMetric } from '../../utils/mlHierarchical';
import { getEnrichedTrafficRecords } from '../../data/trafficData';
import { CrtScreen } from '../skeuomorphic/CrtScreen';
import { ConsoleFader } from '../skeuomorphic/ConsoleFader';
import { GitMerge, Split, Network } from 'lucide-react';

export const Module6_HierarchicalClustering: React.FC = () => {
  const [linkage, setLinkage] = useState<LinkageMethod>('average');
  const [distMetric, setDistMetric] = useState<DistanceMetric>('euclidean');
  const [cutThreshold, setCutThreshold] = useState<number>(0.45);

  const records = getEnrichedTrafficRecords();
  const result = runHierarchicalClustering(records, linkage, distMetric, cutThreshold);

  return (
    <div className="flex flex-col gap-5">
      {/* Header Deck */}
      <div className="bg-instrument-panel p-3.5 rounded-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-purple-500/20 border border-purple-500/40 text-purple-400">
            <GitMerge className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black tracking-wide text-neutral-100 uppercase">
              Experiment 08 // Hierarchical Agglomerative Clustering
            </h2>
            <p className="text-[11px] text-neutral-400">
              Bottom-up linkage synthesis (Single, Complete, Average, Ward), Proximity Matrix & Interactive Dendrogram Cut
            </p>
          </div>
        </div>
      </div>

      {/* Hardware Control Deck */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-neutral-900/90 p-4 rounded-xl border border-neutral-800">
        <div>
          <label className="text-[11px] font-bold text-neutral-400 block mb-1 uppercase">Linkage Criterion</label>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { id: 'single', label: 'Single (Min)' },
              { id: 'complete', label: 'Complete (Max)' },
              { id: 'average', label: 'Average (UPGMA)' },
              { id: 'ward', label: "Ward's (Min Var)" },
            ].map((lm) => (
              <button
                key={lm.id}
                type="button"
                onClick={() => setLinkage(lm.id as LinkageMethod)}
                className={`px-2 py-1.5 text-xs font-mono rounded border transition-all truncate ${
                  linkage === lm.id
                    ? 'bg-amber-500 text-black border-amber-400 font-bold'
                    : 'bg-neutral-800 text-neutral-300 border-neutral-700'
                }`}
              >
                {lm.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold text-neutral-400 block mb-1 uppercase">Distance Metric</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setDistMetric('euclidean')}
              className={`px-3 py-1.5 text-xs font-mono rounded border flex-1 ${
                distMetric === 'euclidean' ? 'bg-amber-500 text-black font-bold' : 'bg-neutral-800 text-neutral-300'
              }`}
            >
              Euclidean (L2)
            </button>
            <button
              type="button"
              onClick={() => setDistMetric('manhattan')}
              className={`px-3 py-1.5 text-xs font-mono rounded border flex-1 ${
                distMetric === 'manhattan' ? 'bg-amber-500 text-black font-bold' : 'bg-neutral-800 text-neutral-300'
              }`}
            >
              Manhattan (L1)
            </button>
          </div>
        </div>

        <div>
          <ConsoleFader
            id="fader-cut-threshold"
            label="Dendrogram Cut Height (Threshold)"
            min={0.1}
            max={1.0}
            step={0.02}
            value={cutThreshold}
            onChange={setCutThreshold}
            ticks={[
              { val: 0.1, label: '0.1' },
              { val: 0.5, label: '0.5' },
              { val: 1.0, label: '1.0' },
            ]}
          />
        </div>
      </div>

      {/* Dendrogram CRT Canvas */}
      <CrtScreen
        id="crt-dendrogram-view"
        title={`AGGLOMERATIVE DENDROGRAM // LINKAGE: ${linkage.toUpperCase()}`}
        badge={`${result.formedClusterCount} CLUSTERS FORMED`}
        phosphor="amber"
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs text-amber-300 font-mono">
            <span>Sampled Facts (N=12)</span>
            <span>Distance Metric: {distMetric.toUpperCase()}</span>
            <span className="text-emerald-400 font-bold">Cutting Height: {cutThreshold.toFixed(2)}</span>
          </div>

          {/* Dendrogram Tree Visualizer */}
          <div className="relative w-full h-80 bg-neutral-950 rounded-lg border border-amber-900/80 p-4 flex flex-col justify-between overflow-hidden">
            {/* Interactive Red Cutting Line */}
            <div
              className="absolute inset-x-0 border-b-2 border-red-500/80 border-dashed z-20 pointer-events-none transition-all flex justify-end pr-4"
              style={{ top: `${Math.max(10, Math.min(85, (1 - cutThreshold) * 100))}%` }}
            >
              <span className="bg-red-950 text-red-300 text-[9px] font-mono px-2 py-0.5 rounded border border-red-800">
                CUT LINE = {cutThreshold.toFixed(2)} ({result.formedClusterCount} Clusters)
              </span>
            </div>

            {/* Tree Branch SVG */}
            <svg className="w-full h-64 overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Render hierarchical branches */}
              {renderTreeLines(result.root)}
            </svg>

            {/* Leaf Labels Along Bottom */}
            <div className="flex justify-between text-[8px] font-mono text-neutral-400 border-t border-amber-900/60 pt-2">
              {result.leaves.map((leaf, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center gap-0.5 text-center truncate max-w-[70px]"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-black font-bold flex items-center justify-center text-[7px] text-black"
                    style={{
                      backgroundColor:
                        leaf.cluster === 1
                          ? '#38bdf8'
                          : leaf.cluster === 2
                          ? '#f59e0b'
                          : leaf.cluster === 3
                          ? '#22c55e'
                          : '#ec4899',
                    }}
                  >
                    {leaf.cluster}
                  </span>
                  <span className="text-amber-300 truncate">{leaf.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Formed Clusters Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 font-mono text-xs">
            {Array.from(new Set(result.leaves.map((l) => l.cluster))).map((cId) => {
              const members = result.leaves.filter((l) => l.cluster === cId);
              return (
                <div key={cId} className="bg-black/90 p-2.5 rounded border border-amber-800 space-y-1">
                  <div className="text-amber-400 font-bold">CLUSTER #{cId}</div>
                  <div className="text-neutral-300 text-[11px]">{members.length} Route Samples</div>
                  <div className="text-[9px] text-neutral-400 truncate">
                    {members.map((m) => m.label.split(' ')[0]).join(', ')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CrtScreen>
    </div>
  );
};

function renderTreeLines(node: import('../../utils/mlHierarchical').DendrogramNode): React.ReactNode[] {
  const lines: React.ReactNode[] = [];

  function traverse(curr: import('../../utils/mlHierarchical').DendrogramNode) {
    if (!curr.left || !curr.right) return;

    const x1 = curr.left.x ?? 0;
    const y1 = 100 - (curr.left.y ?? 0) * 80;
    const x2 = curr.right.x ?? 0;
    const y2 = 100 - (curr.right.y ?? 0) * 80;
    const currX = curr.x ?? (x1 + x2) / 2;
    const currY = 100 - (curr.y ?? 0) * 80;

    // Vertical line up from left child
    lines.push(
      <line
        key={`vl-${curr.id}`}
        x1={x1}
        y1={y1}
        x2={x1}
        y2={currY}
        stroke="#f59e0b"
        strokeWidth="0.8"
      />
    );
    // Vertical line up from right child
    lines.push(
      <line
        key={`vr-${curr.id}`}
        x1={x2}
        y1={y2}
        x2={x2}
        y2={currY}
        stroke="#f59e0b"
        strokeWidth="0.8"
      />
    );
    // Horizontal bridge line connecting left and right
    lines.push(
      <line
        key={`h-${curr.id}`}
        x1={x1}
        y1={currY}
        x2={x2}
        y2={currY}
        stroke="#f59e0b"
        strokeWidth="1.2"
      />
    );

    traverse(curr.left);
    traverse(curr.right);
  }

  traverse(node);
  return lines;
}
