import React, { useState } from 'react';
import {
  executeSlice,
  executeDice,
  executeRollupDrilldown,
  executePivot,
  SliceConfig,
  DiceConfig,
  PivotConfig,
  OlapOperation,
  OlapResult,
} from '../../utils/olapEngine';
import { CrtScreen } from '../skeuomorphic/CrtScreen';
import { MechanicalButton } from '../skeuomorphic/MechanicalButton';
import { Layers, RotateCcw, Filter, Split, Database, Code2 } from 'lucide-react';

export const Module1_OLAP: React.FC = () => {
  const [activeTab, setActiveTab] = useState<OlapOperation>('slice');

  // Slice state
  const [sliceDim, setSliceDim] = useState<SliceConfig['dimension']>('City');
  const [sliceVal, setSliceVal] = useState<string>('Mumbai');

  // Dice state
  const [diceCities, setDiceCities] = useState<string[]>(['Mumbai', 'Pune']);
  const [diceVehicles, setDiceVehicles] = useState<string[]>(['Sedan', 'SUV']);
  const [diceCongestion, setDiceCongestion] = useState<string[]>(['High', 'Severe']);
  const [diceRoads, setDiceRoads] = useState<string[]>(['Expressway', 'Highway']);

  // Rollup / Drilldown state
  const [hierarchy, setHierarchy] = useState<'geographic' | 'temporal' | 'transport'>('geographic');
  const [hierarchyLevel, setHierarchyLevel] = useState<number>(1);

  // Pivot state
  const [pivotRow, setPivotRow] = useState<PivotConfig['rowDimension']>('Route_Name');
  const [pivotCol, setPivotCol] = useState<PivotConfig['colDimension']>('Congestion_Level');
  const [pivotMetric, setPivotMetric] = useState<PivotConfig['metric']>('Avg_Speed_KMPH');
  const [pivotAgg, setPivotAgg] = useState<PivotConfig['aggregation']>('AVG');

  // Execute current operation
  let result: OlapResult;
  if (activeTab === 'slice') {
    result = executeSlice({ dimension: sliceDim, value: sliceVal });
  } else if (activeTab === 'dice') {
    result = executeDice({
      cities: diceCities,
      vehicleTypes: diceVehicles,
      congestionLevels: diceCongestion,
      roadTypes: diceRoads,
    });
  } else if (activeTab === 'rollup' || activeTab === 'drilldown') {
    result = executeRollupDrilldown(activeTab === 'rollup', hierarchy, hierarchyLevel);
  } else {
    result = executePivot({
      rowDimension: pivotRow,
      colDimension: pivotCol,
      metric: pivotMetric,
      aggregation: pivotAgg,
    });
  }

  const toggleArrayItem = (arr: string[], item: string, setter: (val: string[]) => void) => {
    if (arr.includes(item)) {
      if (arr.length > 1) setter(arr.filter((i) => i !== item));
    } else {
      setter([...arr, item]);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Module Title & Operation Mode Selector */}
      <div className="bg-instrument-panel p-3.5 rounded-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-amber-500/20 border border-amber-500/40 text-amber-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black tracking-wide text-neutral-100 uppercase">
              Experiment 01 // Multi-Dimensional OLAP Engine
            </h2>
            <p className="text-[11px] text-neutral-400">
              Direct manipulation of the TrafficDW hypercube: Slice, Dice, Rollup, Drilldown & Pivot
            </p>
          </div>
        </div>

        {/* Tactical Sub-Operation Selectors */}
        <div className="flex items-center gap-1.5 bg-neutral-950 p-1 rounded-lg border border-neutral-800">
          <MechanicalButton
            id="btn-op-slice"
            label="SLICE"
            size="sm"
            active={activeTab === 'slice'}
            variant={activeTab === 'slice' ? 'amber' : 'neutral'}
            onClick={() => setActiveTab('slice')}
            icon={<Filter className="w-3 h-3" />}
          />
          <MechanicalButton
            id="btn-op-dice"
            label="DICE"
            size="sm"
            active={activeTab === 'dice'}
            variant={activeTab === 'dice' ? 'amber' : 'neutral'}
            onClick={() => setActiveTab('dice')}
            icon={<Split className="w-3 h-3" />}
          />
          <MechanicalButton
            id="btn-op-rollup"
            label="ROLLUP"
            size="sm"
            active={activeTab === 'rollup'}
            variant={activeTab === 'rollup' ? 'amber' : 'neutral'}
            onClick={() => {
              setActiveTab('rollup');
              setHierarchyLevel(0);
            }}
            icon={<RotateCcw className="w-3 h-3" />}
          />
          <MechanicalButton
            id="btn-op-drilldown"
            label="DRILLDOWN"
            size="sm"
            active={activeTab === 'drilldown'}
            variant={activeTab === 'drilldown' ? 'amber' : 'neutral'}
            onClick={() => {
              setActiveTab('drilldown');
              setHierarchyLevel(2);
            }}
            icon={<Database className="w-3 h-3" />}
          />
          <MechanicalButton
            id="btn-op-pivot"
            label="PIVOT"
            size="sm"
            active={activeTab === 'pivot'}
            variant={activeTab === 'pivot' ? 'amber' : 'neutral'}
            onClick={() => setActiveTab('pivot')}
            icon={<Layers className="w-3 h-3" />}
          />
        </div>
      </div>

      {/* Interactive Controls Deck for Current OLAP Mode */}
      <div className="bg-neutral-900/90 p-4 rounded-xl border border-neutral-800 shadow-inner">
        {activeTab === 'slice' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-neutral-400 block mb-1.5 uppercase">
                Slice Dimension
              </label>
              <select
                id="select-slice-dim"
                value={sliceDim}
                onChange={(e) => {
                  const val = e.target.value as SliceConfig['dimension'];
                  setSliceDim(val);
                  setSliceVal(
                    val === 'City' ? 'Mumbai' : val === 'Vehicle_Type' ? 'Sedan' : val === 'Road_Type' ? 'Expressway' : 'Moderate'
                  );
                }}
                className="w-full bg-neutral-950 border border-neutral-700 text-neutral-200 text-xs rounded p-2 focus:ring-1 focus:ring-amber-500 font-mono"
              >
                <option value="City">City (Location_Dim)</option>
                <option value="Vehicle_Type">Vehicle_Type (Vehicle_Dim)</option>
                <option value="Road_Type">Road_Type (Road_Dim)</option>
                <option value="Congestion_Level">Congestion_Level (Fact)</option>
                <option value="Day">Day (Time_Dim)</option>
                <option value="Month">Month (Time_Dim)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-neutral-400 block mb-1.5 uppercase">
                Filter Value (Isolated Plane)
              </label>
              <div className="flex flex-wrap gap-2">
                {(sliceDim === 'City'
                  ? ['Mumbai', 'Thane', 'Pune', 'Delhi']
                  : sliceDim === 'Vehicle_Type'
                  ? ['Sedan', 'SUV', 'Heavy Truck', 'Bus']
                  : sliceDim === 'Road_Type'
                  ? ['Expressway', 'Arterial Road', 'Highway', 'Collector Road']
                  : sliceDim === 'Congestion_Level'
                  ? ['Low', 'Moderate', 'High', 'Severe']
                  : sliceDim === 'Day'
                  ? ['Saturday', 'Sunday', 'Friday']
                  : ['January', 'February', 'March', 'April']
                ).map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setSliceVal(val)}
                    className={`px-3 py-1.5 text-xs font-mono font-semibold rounded border transition-all ${
                      sliceVal === val
                        ? 'bg-amber-500 text-black border-amber-400 shadow-md font-bold'
                        : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:border-neutral-500'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'dice' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <span className="text-[11px] font-bold text-neutral-400 block mb-1">Cities</span>
              <div className="flex flex-col gap-1">
                {['Mumbai', 'Thane', 'Pune', 'Delhi'].map((c) => (
                  <label key={c} className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={diceCities.includes(c)}
                      onChange={() => toggleArrayItem(diceCities, c, setDiceCities)}
                      className="rounded border-neutral-700 text-amber-500 focus:ring-0 bg-neutral-950"
                    />
                    {c}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold text-neutral-400 block mb-1">Vehicle Types</span>
              <div className="flex flex-col gap-1">
                {['Sedan', 'SUV', 'Heavy Truck', 'Bus'].map((v) => (
                  <label key={v} className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={diceVehicles.includes(v)}
                      onChange={() => toggleArrayItem(diceVehicles, v, setDiceVehicles)}
                      className="rounded border-neutral-700 text-amber-500 focus:ring-0 bg-neutral-950"
                    />
                    {v}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold text-neutral-400 block mb-1">Congestion</span>
              <div className="flex flex-col gap-1">
                {['Low', 'Moderate', 'High', 'Severe'].map((cg) => (
                  <label key={cg} className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={diceCongestion.includes(cg)}
                      onChange={() => toggleArrayItem(diceCongestion, cg, setDiceCongestion)}
                      className="rounded border-neutral-700 text-amber-500 focus:ring-0 bg-neutral-950"
                    />
                    {cg}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold text-neutral-400 block mb-1">Road Types</span>
              <div className="flex flex-col gap-1">
                {['Expressway', 'Arterial Road', 'Highway', 'Collector Road'].map((rd) => (
                  <label key={rd} className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={diceRoads.includes(rd)}
                      onChange={() => toggleArrayItem(diceRoads, rd, setDiceRoads)}
                      className="rounded border-neutral-700 text-amber-500 focus:ring-0 bg-neutral-950"
                    />
                    {rd}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {(activeTab === 'rollup' || activeTab === 'drilldown') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-neutral-400 block mb-1.5 uppercase">
                Concept Hierarchy
              </label>
              <div className="flex gap-2">
                {(['geographic', 'temporal', 'transport'] as const).map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => {
                      setHierarchy(h);
                      setHierarchyLevel(activeTab === 'rollup' ? 0 : 1);
                    }}
                    className={`px-3 py-1.5 text-xs font-mono rounded border capitalize ${
                      hierarchy === h
                        ? 'bg-amber-500 text-black border-amber-400 font-bold'
                        : 'bg-neutral-800 text-neutral-300 border-neutral-700'
                    }`}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-neutral-400 block mb-1.5 uppercase">
                Target Aggregation Level ({activeTab === 'rollup' ? 'Rollup ↑' : 'Drilldown ↓'})
              </label>
              <div className="flex gap-2">
                {(hierarchy === 'geographic'
                  ? ['State (High)', 'City (Mid)', 'Location (Low)']
                  : hierarchy === 'temporal'
                  ? ['Year (High)', 'Quarter', 'Month', 'Day', 'Hour (Low)']
                  : ['Category (High)', 'Type (Low)']
                ).map((lvl, idx) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setHierarchyLevel(idx)}
                    className={`px-2.5 py-1 text-xs font-mono rounded border ${
                      hierarchyLevel === idx
                        ? 'bg-emerald-500 text-black border-emerald-400 font-bold'
                        : 'bg-neutral-800 text-neutral-300 border-neutral-700'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pivot' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="text-[10px] font-bold text-neutral-400 block mb-1 uppercase">Row Dimension</label>
              <select
                value={pivotRow}
                onChange={(e) => setPivotRow(e.target.value as PivotConfig['rowDimension'])}
                className="w-full bg-neutral-950 border border-neutral-700 text-neutral-200 text-xs rounded p-1.5 font-mono"
              >
                <option value="Route_Name">Route_Name</option>
                <option value="City">City</option>
                <option value="Vehicle_Type">Vehicle_Type</option>
                <option value="Road_Type">Road_Type</option>
                <option value="Month">Month</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-neutral-400 block mb-1 uppercase">Column Dimension</label>
              <select
                value={pivotCol}
                onChange={(e) => setPivotCol(e.target.value as PivotConfig['colDimension'])}
                className="w-full bg-neutral-950 border border-neutral-700 text-neutral-200 text-xs rounded p-1.5 font-mono"
              >
                <option value="Congestion_Level">Congestion_Level</option>
                <option value="Vehicle_Category">Vehicle_Category</option>
                <option value="Day">Day</option>
                <option value="Road_Type">Road_Type</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-neutral-400 block mb-1 uppercase">Metric (Fact Measure)</label>
              <select
                value={pivotMetric}
                onChange={(e) => setPivotMetric(e.target.value as PivotConfig['metric'])}
                className="w-full bg-neutral-950 border border-neutral-700 text-neutral-200 text-xs rounded p-1.5 font-mono"
              >
                <option value="Avg_Speed_KMPH">Avg_Speed_KMPH</option>
                <option value="Travel_Time_Min">Travel_Time_Min</option>
                <option value="Distance_KM">Distance_KM</option>
                <option value="Min_Distance_Vehicles">Min_Distance_Vehicles</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-neutral-400 block mb-1 uppercase">Aggregation</label>
              <select
                value={pivotAgg}
                onChange={(e) => setPivotAgg(e.target.value as PivotConfig['aggregation'])}
                className="w-full bg-neutral-950 border border-neutral-700 text-neutral-200 text-xs rounded p-1.5 font-mono"
              >
                <option value="AVG">AVG (Average)</option>
                <option value="SUM">SUM (Total)</option>
                <option value="COUNT">COUNT (Frequency)</option>
                <option value="MIN">MIN</option>
                <option value="MAX">MAX</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Main Output Display: CRT Screen with Data Table or Pivot Matrix */}
      <CrtScreen
        id="crt-olap-view"
        title={result.title}
        badge={`ROWS: ${result.aggregatedData ? result.aggregatedData.length : result.records.length}`}
        phosphor="green"
        headerRight={
          <div className="flex items-center gap-2 text-[10px] text-emerald-400">
            <Code2 className="w-3.5 h-3.5" />
            <span>ANSI SQL 99 COMPLIANT</span>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="text-xs text-emerald-300 font-semibold bg-emerald-950/40 p-2 rounded border border-emerald-800/60">
            {result.summary}
          </div>

          {/* Pivot Table Matrix View */}
          {result.pivotGrid ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse border border-emerald-800">
                <thead>
                  <tr className="bg-emerald-950/80 text-emerald-300 border-b border-emerald-800 font-bold">
                    <th className="p-2 border-r border-emerald-800">{pivotRow} \ {pivotCol}</th>
                    {result.pivotGrid.cols.map((col) => (
                      <th key={col} className="p-2 border-r border-emerald-800 text-center">{col}</th>
                    ))}
                    <th className="p-2 text-center bg-emerald-900/60 text-amber-300">TOTAL ({pivotAgg})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-900/60">
                  {result.pivotGrid.rows.map((row) => (
                    <tr key={row} className="hover:bg-emerald-900/30">
                      <td className="p-2 font-bold text-emerald-200 border-r border-emerald-800">{row}</td>
                      {result.pivotGrid!.cols.map((col) => {
                        const val = result.pivotGrid!.values[row][col];
                        return (
                          <td key={col} className="p-2 text-center border-r border-emerald-900 font-mono">
                            {val !== null ? val : <span className="opacity-30">-</span>}
                          </td>
                        );
                      })}
                      <td className="p-2 text-center font-bold text-amber-300 bg-emerald-950/40">
                        {result.pivotGrid!.rowTotals[row]}
                      </td>
                    </tr>
                  ))}
                  {/* Column Totals */}
                  <tr className="bg-emerald-950/90 font-bold text-amber-300 border-t-2 border-emerald-700">
                    <td className="p-2 border-r border-emerald-800">SUMMARY TOTAL</td>
                    {result.pivotGrid.cols.map((col) => (
                      <td key={col} className="p-2 text-center border-r border-emerald-800 font-mono">
                        {result.pivotGrid!.colTotals[col]}
                      </td>
                    ))}
                    <td className="p-2 text-center font-black text-amber-400 bg-emerald-900/80">
                      {result.pivotGrid.grandTotal}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : result.aggregatedData ? (
            /* Rollup / Drilldown Summary Grid */
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-emerald-800">
                <thead>
                  <tr className="bg-emerald-950/80 text-emerald-300 border-b border-emerald-800 font-bold">
                    {Object.keys(result.aggregatedData[0] || {}).map((col) => (
                      <th key={col} className="p-2 border-r border-emerald-800">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-900/60">
                  {result.aggregatedData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-emerald-900/30">
                      {Object.values(row).map((val, cIdx) => (
                        <td key={cIdx} className="p-2 border-r border-emerald-900 font-mono">
                          {String(val ?? 'ALL')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Slice / Dice Fact Records */
            <div className="overflow-x-auto max-h-72">
              <table className="w-full text-xs text-left border border-emerald-800">
                <thead className="sticky top-0 bg-emerald-950 text-emerald-300 border-b border-emerald-800 font-bold">
                  <tr>
                    <th className="p-2 border-r border-emerald-800">#Key</th>
                    <th className="p-2 border-r border-emerald-800">Route</th>
                    <th className="p-2 border-r border-emerald-800">City</th>
                    <th className="p-2 border-r border-emerald-800">Vehicle</th>
                    <th className="p-2 border-r border-emerald-800">Congestion</th>
                    <th className="p-2 border-r border-emerald-800">Distance</th>
                    <th className="p-2 border-r border-emerald-800">Time(m)</th>
                    <th className="p-2">Speed(km/h)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-900/60">
                  {result.records.map((r) => (
                    <tr key={r.Traffic_Key} className="hover:bg-emerald-900/30">
                      <td className="p-2 font-mono font-bold text-emerald-400 border-r border-emerald-900">{r.Traffic_Key}</td>
                      <td className="p-2 border-r border-emerald-900">{r.Route_Name}</td>
                      <td className="p-2 border-r border-emerald-900">{r.City}</td>
                      <td className="p-2 border-r border-emerald-900">{r.Vehicle_Type}</td>
                      <td className="p-2 border-r border-emerald-900 font-bold text-amber-300">{r.Congestion_Level}</td>
                      <td className="p-2 border-r border-emerald-900 font-mono">{r.Distance_KM} km</td>
                      <td className="p-2 border-r border-emerald-900 font-mono">{r.Travel_Time_Min} min</td>
                      <td className="p-2 font-mono font-bold text-emerald-300">{r.Avg_Speed_KMPH}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Raw Generated SQL Query Console */}
          <div className="bg-black/90 p-3 rounded border border-emerald-900 font-mono text-[11px] text-emerald-400 shadow-inner">
            <div className="text-[10px] text-emerald-600 font-bold uppercase mb-1 flex items-center justify-between">
              <span>GENERATED ANSI SQL QUERY (TrafficDW Schema)</span>
              <span>EXECUTED IN 1.2ms</span>
            </div>
            <pre className="overflow-x-auto whitespace-pre leading-relaxed">{result.sqlQuery}</pre>
          </div>
        </div>
      </CrtScreen>
    </div>
  );
};
