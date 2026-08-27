import React, { useState } from 'react';
import { getEnrichedTrafficRecords } from '../../data/trafficData';
import { MechanicalButton } from '../skeuomorphic/MechanicalButton';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { LayoutDashboard, PieChart as PieIcon, BarChart2, TrendingUp, Filter, Download } from 'lucide-react';

const COLORS = ['#38bdf8', '#f59e0b', '#ec4899', '#22c55e', '#a855f7', '#ef4444'];

export const Module9_PowerBITableau: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [selectedRoad, setSelectedRoad] = useState<string>('All');
  const [biTheme, setBiTheme] = useState<'powerbi' | 'tableau'>('powerbi');

  const records = getEnrichedTrafficRecords();

  const filteredRecords = records.filter((r) => {
    if (selectedCity !== 'All' && r.City !== selectedCity) return false;
    if (selectedRoad !== 'All' && r.Road_Type !== selectedRoad) return false;
    return true;
  });

  // Aggregated data for visuals
  // 1. Avg speed by Route
  const routeSpeedData: Record<string, { totalSpeed: number; count: number }> = {};
  filteredRecords.forEach((r) => {
    const route = r.Route_Name.split(' ')[0];
    if (!routeSpeedData[route]) routeSpeedData[route] = { totalSpeed: 0, count: 0 };
    routeSpeedData[route].totalSpeed += r.Avg_Speed_KMPH;
    routeSpeedData[route].count++;
  });
  const barData = Object.entries(routeSpeedData).map(([route, d]) => ({
    name: route,
    avgSpeed: Number((d.totalSpeed / d.count).toFixed(1)),
  }));

  // 2. Congestion distribution
  const congDataMap: Record<string, number> = {};
  filteredRecords.forEach((r) => {
    congDataMap[r.Congestion_Level] = (congDataMap[r.Congestion_Level] || 0) + 1;
  });
  const pieData = Object.entries(congDataMap).map(([level, count]) => ({
    name: level,
    value: count,
  }));

  // 3. Hourly Travel Time curve
  const timeData = filteredRecords.map((r, idx) => ({
    time: `${r.Hour}:00`,
    travelTime: r.Travel_Time_Min,
    speed: r.Avg_Speed_KMPH,
    key: idx,
  })).slice(0, 10);

  // Overall KPIs
  const totalVolume = filteredRecords.length;
  const overallAvgSpeed = (
    filteredRecords.reduce((sum, r) => sum + r.Avg_Speed_KMPH, 0) / (totalVolume || 1)
  ).toFixed(1);
  const overallAvgTime = (
    filteredRecords.reduce((sum, r) => sum + r.Travel_Time_Min, 0) / (totalVolume || 1)
  ).toFixed(1);

  return (
    <div className="flex flex-col gap-5">
      {/* Header Deck */}
      <div className="bg-instrument-panel p-3.5 rounded-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-yellow-500/20 border border-yellow-500/40 text-yellow-400">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black tracking-wide text-neutral-100 uppercase">
              Experiment 10 // BI Visualizer Studio (PowerBI / Tableau)
            </h2>
            <p className="text-[11px] text-neutral-400">
              Interactive drag-and-drop dashboard canvas, cross-filtering slicers, velocity charts, and KPI cards
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-neutral-950 p-1 rounded-lg border border-neutral-800">
          <MechanicalButton
            id="btn-skin-powerbi"
            label="POWER BI DESKTOP"
            size="sm"
            active={biTheme === 'powerbi'}
            variant={biTheme === 'powerbi' ? 'amber' : 'neutral'}
            onClick={() => setBiTheme('powerbi')}
          />
          <MechanicalButton
            id="btn-skin-tableau"
            label="TABLEAU PUBLIC"
            size="sm"
            active={biTheme === 'tableau'}
            variant={biTheme === 'tableau' ? 'amber' : 'neutral'}
            onClick={() => setBiTheme('tableau')}
          />
        </div>
      </div>

      {/* Slicers & Filters Ribbon */}
      <div className="bg-neutral-900/90 p-3 rounded-xl border border-neutral-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-neutral-300 uppercase">Cross-Filtering Slicers:</span>
          
          {/* City Slicer */}
          <div className="flex items-center gap-1">
            {['All', 'Mumbai', 'Thane', 'Pune', 'Delhi'].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedCity(c)}
                className={`px-2.5 py-1 text-xs font-mono rounded border transition-all ${
                  selectedCity === c
                    ? 'bg-amber-500 text-black border-amber-400 font-bold'
                    : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Road Slicer */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-neutral-400 font-mono">Road:</span>
          <select
            value={selectedRoad}
            onChange={(e) => setSelectedRoad(e.target.value)}
            className="bg-neutral-950 border border-neutral-700 text-neutral-200 text-xs rounded p-1.5 font-mono"
          >
            <option value="All">All Roads</option>
            <option value="Expressway">Expressway</option>
            <option value="Highway">Highway</option>
            <option value="Arterial Road">Arterial Road</option>
            <option value="Collector Road">Collector Road</option>
          </select>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 p-4 rounded-xl border border-neutral-800 shadow-md">
          <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
            Corridor Telemetry Records
          </span>
          <span className="text-2xl font-black text-neutral-100 mt-1 block font-mono">
            {totalVolume} Facts
          </span>
          <span className="text-[10px] text-emerald-400 font-semibold">100% Ingest Health</span>
        </div>

        <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 p-4 rounded-xl border border-neutral-800 shadow-md">
          <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
            Average Network Velocity
          </span>
          <span className="text-2xl font-black text-amber-400 mt-1 block font-mono">
            {overallAvgSpeed} km/h
          </span>
          <span className="text-[10px] text-neutral-400">Target: 60.0 km/h</span>
        </div>

        <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 p-4 rounded-xl border border-neutral-800 shadow-md">
          <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
            Mean Corridor Transit Time
          </span>
          <span className="text-2xl font-black text-sky-400 mt-1 block font-mono">
            {overallAvgTime} min
          </span>
          <span className="text-[10px] text-neutral-400">Standard deviation: ±18.4m</span>
        </div>
      </div>

      {/* Interactive Visuals Grid (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Visual 1: Bar Chart */}
        <div className="bg-neutral-900/90 p-4 rounded-xl border border-neutral-800 shadow-inner">
          <div className="text-xs font-bold text-neutral-300 uppercase mb-3 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-amber-400" />
              Average Speed by Highway Corridor (km/h)
            </span>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" stroke="#737373" fontSize={11} />
                <YAxis stroke="#737373" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#171717', borderColor: '#404040', color: '#fff' }} />
                <Bar dataKey="avgSpeed" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Visual 2: Pie / Donut Chart */}
        <div className="bg-neutral-900/90 p-4 rounded-xl border border-neutral-800 shadow-inner">
          <div className="text-xs font-bold text-neutral-300 uppercase mb-3 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-sky-400" />
              Congestion Distribution Proportion
            </span>
          </div>
          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#171717', borderColor: '#404040', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Visual 3: Area Chart for Travel Time vs Speed */}
        <div className="lg:col-span-2 bg-neutral-900/90 p-4 rounded-xl border border-neutral-800 shadow-inner">
          <div className="text-xs font-bold text-neutral-300 uppercase mb-3 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Temporal Travel Duration & Velocity Trend
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeData}>
                <XAxis dataKey="time" stroke="#737373" fontSize={11} />
                <YAxis stroke="#737373" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#171717', borderColor: '#404040', color: '#fff' }} />
                <Area type="monotone" dataKey="travelTime" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.2} name="Travel Time (min)" />
                <Area type="monotone" dataKey="speed" stroke="#22c55e" fill="#22c55e" fillOpacity={0.2} name="Avg Speed (km/h)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
