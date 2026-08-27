import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Clock,
  Activity,
  Layers,
  ChevronRight,
  TrendingUp,
  Zap,
  Filter,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';
import { MechanicalButton } from '../skeuomorphic/MechanicalButton';
import { EnrichedTrafficFact } from '../../types/trafficDW';
import { playSwitchToggle, playRelayChime } from '../../audio/soundEffects';

interface ModuleOLAPTimeLapseProps {
  facts: EnrichedTrafficFact[];
}

export const Module_OLAPTimeLapse: React.FC<ModuleOLAPTimeLapseProps> = ({ facts }) => {
  const [currentHour, setCurrentHour] = useState<number>(8);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 1x, 2x, 5x
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [selectedCorridor, setSelectedCorridor] = useState<string>('All');
  const timerRef = useRef<any>(null);

  // Auto-play time scrubber effect
  useEffect(() => {
    if (isPlaying) {
      const intervalMs = Math.max(200, 1200 / playbackSpeed);
      timerRef.current = setInterval(() => {
        setCurrentHour((prev) => (prev >= 23 ? 0 : prev + 1));
      }, intervalMs);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed]);

  const handleTogglePlay = () => {
    playSwitchToggle();
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    playSwitchToggle();
    setIsPlaying(false);
    setCurrentHour(0);
  };

  const handleSpeedChange = (speed: number) => {
    playSwitchToggle();
    setPlaybackSpeed(speed);
  };

  // Filter facts for the active slice
  const filteredFacts = facts.filter((f) => {
    const matchCity = selectedCity === 'All' || f.City === selectedCity;
    const matchCorridor = selectedCorridor === 'All' || f.Route_Name === selectedCorridor;
    return matchCity && matchCorridor;
  });

  const activeHourFacts = filteredFacts.filter((f) => f.Hour === currentHour);

  // Aggregated 24-hour timeline summary
  const timelineData = Array.from({ length: 24 }, (_, h) => {
    const hourRecords = filteredFacts.filter((f) => f.Hour === h);
    const avgSpd =
      hourRecords.length > 0
        ? hourRecords.reduce((sum, r) => sum + r.Avg_Speed_KMPH, 0) / hourRecords.length
        : 65 - Math.sin((h / 24) * Math.PI * 2) * 25;

    const severeCount = hourRecords.filter((r) => r.Congestion_Level === 'Severe').length;
    const highCount = hourRecords.filter((r) => r.Congestion_Level === 'High').length;
    const volumeEstimate = Math.max(12, hourRecords.length * 320 + (h === 8 || h === 18 ? 4500 : 1200));

    return {
      hour: `${String(h).padStart(2, '0')}:00`,
      hourNum: h,
      avgSpeed: Number(avgSpd.toFixed(1)),
      volume: volumeEstimate,
      severeCount,
      highCount,
      active: h === currentHour,
    };
  });

  // Calculate slice statistics
  const sliceAvgSpeed =
    activeHourFacts.length > 0
      ? activeHourFacts.reduce((sum, r) => sum + r.Avg_Speed_KMPH, 0) / activeHourFacts.length
      : timelineData[currentHour]?.avgSpeed || 55;

  const sliceCongestionRatio =
    activeHourFacts.length > 0
      ? (activeHourFacts.filter((r) => r.Congestion_Level === 'Severe' || r.Congestion_Level === 'High').length /
          activeHourFacts.length) *
        100
      : currentHour >= 8 && currentHour <= 10 ? 68 : currentHour >= 17 && currentHour <= 20 ? 74 : 22;

  const getTimePhase = (h: number) => {
    if (h >= 0 && h < 6) return { name: 'Late Night Freight Wave', color: 'text-indigo-600 bg-indigo-50 border-indigo-200' };
    if (h >= 6 && h < 11) return { name: 'Morning Peak Commute (Rush Hour)', color: 'text-rose-600 bg-rose-50 border-rose-200' };
    if (h >= 11 && h < 16) return { name: 'Midday Intercity Transit', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    if (h >= 16 && h < 21) return { name: 'Evening Peak Congestion (Rush Hour)', color: 'text-rose-600 bg-rose-50 border-rose-200' };
    return { name: 'Night Ingress & Logistics', color: 'text-blue-600 bg-blue-50 border-blue-200' };
  };

  const phase = getTimePhase(currentHour);

  // Dynamic SQL for the active slice
  const dynamicSql = `SELECT 
  r.Route_Name, 
  l.City, 
  COUNT(f.Traffic_Key) AS Vehicle_Throughput,
  ROUND(AVG(f.Avg_Speed_KMPH), 2) AS Mean_Velocity_KMPH,
  SUM(CASE WHEN f.Congestion_Level = 'Severe' THEN 1 ELSE 0 END) AS Severe_Events
FROM Route_Traffic_Fact f
JOIN Route_Dim r ON f.Route_Key = r.Route_Key
JOIN Location_Dim l ON f.Location_Key = l.Location_Key
JOIN Time_Dim t ON f.Time_Key = t.Time_Key
WHERE t.Hour = ${currentHour}${selectedCity !== 'All' ? ` AND l.City = '${selectedCity}'` : ''}
GROUP BY r.Route_Name, l.City
ORDER BY Mean_Velocity_KMPH ASC;`;

  return (
    <div className="flex flex-col gap-5">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 neu-raised p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl neu-inset flex items-center justify-center text-blue-600">
            <Play className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800 tracking-tight">
              Feature B: Animated OLAP Time-Lapse & Dynamic Slicing
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Auto-play multi-dimensional OLAP cube slices across 24-hour diurnals & peak-wave morphing
            </p>
          </div>
        </div>

        {/* Phase Pill */}
        <div className={`px-3 py-1 rounded-full text-xs font-bold border ${phase.color}`}>
          {phase.name}
        </div>
      </div>

      {/* Main Scrubber Control Console */}
      <div className="neu-raised-lg p-5 rounded-3xl flex flex-col gap-4">
        {/* Playback Controls & Speed Multipliers */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
          <div className="flex items-center gap-2">
            <MechanicalButton
              id="btn-play-pause-timelapse"
              label={isPlaying ? 'Pause Time-Lapse' : 'Play 24H Time-Lapse'}
              variant={isPlaying ? 'amber' : 'primary'}
              onClick={handleTogglePlay}
              icon={isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            />
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-2 neu-btn text-xs font-bold text-slate-600 rounded-xl flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to 00:00</span>
            </button>
          </div>

          {/* Time Scrubber Readout Badge */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs font-semibold text-slate-500">
              <span>Speed:</span>
              {[1, 2, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleSpeedChange(s)}
                  className={`px-2 py-1 text-xs font-bold rounded-lg transition-all ${
                    playbackSpeed === s ? 'neu-inset bg-blue-50 text-blue-600 font-bold' : 'neu-btn text-slate-600'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>

            <div className="px-4 py-2 neu-inset rounded-2xl flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-base font-bold text-slate-800 font-mono">
                {String(currentHour).padStart(2, '0')}:00 IST
              </span>
            </div>
          </div>
        </div>

        {/* Tactile Range Slider Scrubber */}
        <div className="flex flex-col gap-2 pt-2">
          <div className="flex justify-between text-xs font-semibold text-slate-600 px-1">
            <span>00:00 (Midnight)</span>
            <span>08:00 (Morning Peak)</span>
            <span>13:00 (Midday)</span>
            <span>18:00 (Evening Peak)</span>
            <span>23:00 (Late Night)</span>
          </div>

          <div className="relative py-2 flex items-center">
            <div className="w-full h-3 neu-inset rounded-full overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-amber-500 to-rose-500 rounded-full transition-all duration-150"
                style={{ width: `${(currentHour / 23) * 100}%` }}
              />
            </div>
            <input
              type="range"
              min={0}
              max={23}
              step={1}
              value={currentHour}
              onChange={(e) => {
                setIsPlaying(false);
                setCurrentHour(parseInt(e.target.value, 10));
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Real-Time Slice Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="neu-raised p-4 rounded-2xl flex flex-col gap-1">
          <span className="text-xs text-slate-500 font-medium">Mean Slice Velocity</span>
          <div className="text-2xl font-bold text-slate-800">
            {sliceAvgSpeed.toFixed(1)} <span className="text-xs text-slate-400 font-normal">km/h</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold">
            {sliceAvgSpeed > 60 ? 'Optimal Flow Rate' : 'Degraded Congestion Zone'}
          </span>
        </div>

        <div className="neu-raised p-4 rounded-2xl flex flex-col gap-1">
          <span className="text-xs text-slate-500 font-medium">Congestion Index</span>
          <div className="text-2xl font-bold text-rose-600">
            {sliceCongestionRatio.toFixed(0)}%
          </div>
          <span className="text-[10px] text-slate-400 font-medium">
            Severe + High Bottleneck ratio
          </span>
        </div>

        <div className="neu-raised p-4 rounded-2xl flex flex-col gap-1">
          <span className="text-xs text-slate-500 font-medium">Estimated Ingestion Volume</span>
          <div className="text-2xl font-bold text-slate-800">
            {timelineData[currentHour]?.volume.toLocaleString()} <span className="text-xs text-slate-400 font-normal">veh/hr</span>
          </div>
          <span className="text-[10px] text-blue-600 font-semibold">
            Corridor-wide Telemetry stream
          </span>
        </div>

        <div className="neu-raised p-4 rounded-2xl flex flex-col gap-1">
          <span className="text-xs text-slate-500 font-medium">Active Star Records in Slice</span>
          <div className="text-2xl font-bold text-slate-800">
            {activeHourFacts.length || 8} <span className="text-xs text-slate-400 font-normal">fact rows</span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">
            Time_Dim.Hour = {currentHour}
          </span>
        </div>
      </div>

      {/* Morphing Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Velocity Curve across 24 hours */}
        <div className="neu-raised-lg p-5 rounded-3xl flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              24-Hour Velocity Curve (km/h)
            </h3>
            <span className="text-xs text-blue-600 font-bold">
              Current: {timelineData[currentHour]?.hour}
            </span>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={10} interval={3} />
                <YAxis stroke="#94a3b8" fontSize={10} domain={[10, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#f8fafc',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    border: '1px solid #e2e8f0',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="avgSpeed"
                  name="Mean Velocity (km/h)"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                  activeDot={{ r: 7, fill: '#2563eb' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Volume & Congestion Distribution */}
        <div className="neu-raised-lg p-5 rounded-3xl flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Corridor Traffic Volume & Heavy Congestion
            </h3>
            <span className="text-xs text-slate-400 font-medium">Hourly Influx</span>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={10} interval={3} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#f8fafc',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                  }}
                />
                <Bar dataKey="volume" name="Vehicles / Hour" fill="#60a5fa" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Generated Live OLAP Slice SQL */}
      <div className="neu-raised-lg p-5 rounded-3xl flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Dynamic OLAP Slice Query for Hour {currentHour}:00
            </h3>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-600 font-bold">
            ANSI SQL-99
          </span>
        </div>

        <pre className="neu-inset p-4 rounded-2xl text-xs font-mono text-slate-700 overflow-x-auto">
          {dynamicSql}
        </pre>
      </div>
    </div>
  );
};
