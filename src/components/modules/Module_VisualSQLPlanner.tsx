import React, { useState } from 'react';
import {
  GitPullRequest,
  Database,
  Code,
  Play,
  Copy,
  Check,
  Zap,
  Sliders,
  ChevronDown,
  ChevronRight,
  TrendingDown,
  Layers,
  Sparkles,
} from 'lucide-react';
import { MechanicalButton } from '../skeuomorphic/MechanicalButton';
import { EnrichedTrafficFact, ExecutionPlanNode } from '../../types/trafficDW';
import {
  VisualQueryState,
  generateAnsiSql,
  generateExecutionPlan,
} from '../../utils/sqlPlannerEngine';
import { playSwitchToggle, playRelayChime } from '../../audio/soundEffects';

interface ModuleVisualSQLPlannerProps {
  facts: EnrichedTrafficFact[];
}

export const Module_VisualSQLPlanner: React.FC<ModuleVisualSQLPlannerProps> = ({ facts }) => {
  const [queryState, setQueryState] = useState<VisualQueryState>({
    dimensions: ['Route_Name', 'City'],
    measures: [
      { column: 'Avg_Speed_KMPH', agg: 'AVG', alias: 'Mean_Speed' },
      { column: 'Traffic_Key', agg: 'COUNT', alias: 'Total_Vehicles' },
    ],
    filters: [{ column: 't.Hour', operator: 'BETWEEN', value: '8 AND 20' }],
    groupByType: 'ROLLUP',
    orderByColumn: 'Mean_Speed',
    orderDirection: 'ASC',
    limit: 50,
  });

  const [copied, setCopied] = useState<boolean>(false);
  const [activePlanTab, setActivePlanTab] = useState<'tree' | 'sql' | 'advice'>('tree');

  const generatedSql = generateAnsiSql(queryState);
  const executionPlan = generateExecutionPlan(queryState);

  const availableDims = [
    'Route_Name',
    'City',
    'State',
    'Vehicle_Type',
    'Road_Type',
    'Hour',
    'Day',
    'Month',
    'Quarter',
    'Congestion_Level',
  ];

  const handleToggleDim = (dim: string) => {
    playSwitchToggle();
    setQueryState((prev) => {
      const exists = prev.dimensions.includes(dim);
      return {
        ...prev,
        dimensions: exists ? prev.dimensions.filter((d) => d !== dim) : [...prev.dimensions, dim],
      };
    });
  };

  const handleCopySql = () => {
    playRelayChime();
    navigator.clipboard.writeText(generatedSql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Render Plan Tree Recursively
  const renderPlanNode = (node: ExecutionPlanNode, depth: number = 0) => {
    return (
      <div key={node.id} className="flex flex-col gap-2">
        <div
          className={`neu-raised-sm p-3 rounded-2xl flex flex-wrap items-center justify-between gap-2 border border-slate-200/60 transition-all ${
            depth === 0 ? 'bg-blue-50/40' : ''
          }`}
          style={{ marginLeft: `${depth * 18}px` }}
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800">{node.nodeType}</span>
                {node.relationName && (
                  <span className="text-[11px] font-mono text-blue-600">
                    on {node.relationName}
                  </span>
                )}
                {node.indexName && (
                  <span className="text-[11px] font-mono text-emerald-600">
                    using {node.indexName}
                  </span>
                )}
              </div>
              {node.filter && (
                <div className="text-[10px] text-slate-500 font-mono">
                  Filter: {node.filter}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-slate-600">
            <span className="text-[10px] text-slate-400">
              cost={node.startupCost}..{node.totalCost}
            </span>
            <span className="text-[10px] font-bold text-slate-700">
              rows={node.planRows}
            </span>
            {node.actualTotalTimeMs && (
              <span className="text-[10px] text-emerald-600 font-bold">
                {node.actualTotalTimeMs} ms
              </span>
            )}
          </div>
        </div>

        {node.subNodes && node.subNodes.map((sub) => renderPlanNode(sub, depth + 1))}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 neu-raised p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl neu-inset flex items-center justify-center text-emerald-600">
            <GitPullRequest className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800 tracking-tight">
              Feature F: Visual SQL Builder & Relational Execution Planner
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Drag-and-drop Star Schema composer, ANSI SQL generator, and Cost-based Query Execution Tree
            </p>
          </div>
        </div>

        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => {
              playSwitchToggle();
              setActivePlanTab('tree');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activePlanTab === 'tree' ? 'neu-inset text-emerald-600 bg-emerald-50/50' : 'neu-btn text-slate-600'
            }`}
          >
            Execution Plan Tree
          </button>
          <button
            type="button"
            onClick={() => {
              playSwitchToggle();
              setActivePlanTab('sql');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activePlanTab === 'sql' ? 'neu-inset text-emerald-600 bg-emerald-50/50' : 'neu-btn text-slate-600'
            }`}
          >
            Raw ANSI SQL
          </button>
          <button
            type="button"
            onClick={() => {
              playSwitchToggle();
              setActivePlanTab('advice');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activePlanTab === 'advice' ? 'neu-inset text-emerald-600 bg-emerald-50/50' : 'neu-btn text-slate-600'
            }`}
          >
            Optimizer Advice
          </button>
        </div>
      </div>

      {/* Visual Dimension & Measure Builder */}
      <div className="neu-raised-lg p-5 rounded-3xl flex flex-col gap-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Star Schema Query Composer
          </h3>
          <span className="text-xs text-slate-400 font-medium">
            Toggle Dimensions & Grouping mode
          </span>
        </div>

        {/* Dimension Chips */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-bold text-slate-600">Select GROUP BY Dimensions:</span>
          <div className="flex flex-wrap gap-2">
            {availableDims.map((dim) => {
              const isSelected = queryState.dimensions.includes(dim);
              return (
                <button
                  key={dim}
                  type="button"
                  onClick={() => handleToggleDim(dim)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'neu-inset bg-emerald-50/60 text-emerald-700 border border-emerald-300'
                      : 'neu-btn text-slate-600'
                  }`}
                >
                  {dim}
                </button>
              );
            })}
          </div>
        </div>

        {/* OLAP Aggregation Mode */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">OLAP Mode:</span>
            {(['STANDARD', 'ROLLUP', 'CUBE', 'GROUPING_SETS'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => {
                  playSwitchToggle();
                  setQueryState((prev) => ({ ...prev, groupByType: mode }));
                }}
                className={`px-3 py-1 text-xs font-bold rounded-lg ${
                  queryState.groupByType === mode
                    ? 'neu-inset text-emerald-600 bg-emerald-50/50'
                    : 'neu-btn text-slate-600'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleCopySql}
            className="flex items-center gap-1.5 px-3 py-1.5 neu-btn text-xs font-bold text-slate-700 rounded-xl"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied SQL!' : 'Copy SQL'}</span>
          </button>
        </div>
      </div>

      {/* Main Display: Tree / SQL / Optimizer Advice */}
      {activePlanTab === 'tree' && (
        <div className="neu-raised-lg p-5 rounded-3xl flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200/80">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Relational Query Execution Plan Tree (PostgreSQL / Relational Engine)
            </h3>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-slate-500">Total Estimated Cost: <strong className="text-slate-800">{executionPlan.totalCost}</strong></span>
              <span className="text-slate-500">Est. Latency: <strong className="text-emerald-600">1.45 ms</strong></span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {renderPlanNode(executionPlan)}
          </div>
        </div>
      )}

      {activePlanTab === 'sql' && (
        <div className="neu-raised-lg p-5 rounded-3xl flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Generated ANSI SQL-99 Statement
            </h3>
            <button
              type="button"
              onClick={handleCopySql}
              className="px-3 py-1 neu-btn text-xs font-bold text-emerald-600 rounded-lg flex items-center gap-1"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied!' : 'Copy Query'}</span>
            </button>
          </div>

          <pre className="neu-inset p-4 rounded-2xl text-xs font-mono text-slate-800 overflow-x-auto whitespace-pre">
            {generatedSql}
          </pre>
        </div>
      )}

      {activePlanTab === 'advice' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="neu-raised-lg p-5 rounded-3xl flex flex-col gap-3">
            <div className="flex items-center gap-2 text-emerald-600">
              <Sparkles className="w-5 h-5" />
              <h3 className="text-sm font-bold text-slate-800">Index Recommendation</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Create a composite B-Tree index on <code className="text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded font-mono font-bold">Route_Traffic_Fact(Route_Key, Time_Key, Avg_Speed_KMPH)</code>.
            </p>
            <div className="neu-inset p-3 rounded-xl text-xs font-mono text-slate-700">
              CREATE INDEX idx_perf_composite ON Route_Traffic_Fact(Route_Key, Time_Key) INCLUDE (Avg_Speed_KMPH);
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold">
              Expected speedup: <strong>8.4x reduction in Bitmap Heap Scan cost</strong>
            </span>
          </div>

          <div className="neu-raised-lg p-5 rounded-3xl flex flex-col gap-3">
            <div className="flex items-center gap-2 text-blue-600">
              <Layers className="w-5 h-5" />
              <h3 className="text-sm font-bold text-slate-800">Materialized Rollup Cube</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Since <strong>ROLLUP</strong> queries aggregate multi-level hierarchies frequently, consider creating a materialized view refreshed on hourly ETL batches.
            </p>
            <div className="neu-inset p-3 rounded-xl text-xs font-mono text-slate-700">
              CREATE MATERIALIZED VIEW mv_hourly_rollup AS ... WITH DATA;
            </div>
            <span className="text-[11px] text-blue-600 font-semibold">
              Eliminates HashAggregate CPU cost entirely on dashboard load.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
