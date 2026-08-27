import React, { useState } from 'react';
import {
  MapPin,
  Compass,
  Layers,
  Radio,
  AlertTriangle,
  Upload,
  Zap,
  Activity,
  Sliders,
  CheckCircle2,
  Maximize2,
  Navigation,
} from 'lucide-react';
import { MechanicalButton } from '../skeuomorphic/MechanicalButton';
import { INDIAN_ROAD_CORRIDORS } from '../../data/trafficData';
import { IndianCorridorMeta, EnrichedTrafficFact } from '../../types/trafficDW';
import { playSwitchToggle, playRelayChime } from '../../audio/soundEffects';

interface ModuleSpatialGISProps {
  facts: EnrichedTrafficFact[];
  onOpenUploadModal: () => void;
}

export const Module_SpatialGIS: React.FC<ModuleSpatialGISProps> = ({
  facts,
  onOpenUploadModal,
}) => {
  const [selectedCorridorId, setSelectedCorridorId] = useState<string>('mumbai-pune');
  const [mapViewMode, setMapViewMode] = useState<'vector' | 'osm'>('vector');
  const [is3DIsometric, setIs3DIsometric] = useState<boolean>(false);
  const [activeSensorId, setActiveSensorId] = useState<string | null>('SEN-MH-02');
  const [simulatedIncident, setSimulatedIncident] = useState<string | null>(null);

  const activeCorridor: IndianCorridorMeta =
    INDIAN_ROAD_CORRIDORS.find((c) => c.id === selectedCorridorId) || INDIAN_ROAD_CORRIDORS[0];

  const handleCorridorSelect = (id: string) => {
    playSwitchToggle();
    setSelectedCorridorId(id);
    const corr = INDIAN_ROAD_CORRIDORS.find((c) => c.id === id);
    if (corr && corr.keySensors.length > 0) {
      setActiveSensorId(corr.keySensors[0].id);
    }
    setSimulatedIncident(null);
  };

  const handleInjectIncident = () => {
    playRelayChime();
    setSimulatedIncident(
      `INCIDENT INJECTED: Sudden 2-lane blockage at KM ${activeCorridor.keySensors[1]?.kmMark || 14} due to cargo spill. Upstream speed reduced by 60%.`
    );
  };

  const activeSensor = activeCorridor.keySensors.find((s) => s.id === activeSensorId);

  return (
    <div className="flex flex-col gap-5">
      {/* Header Banner & Upload Trigger */}
      <div className="flex flex-wrap items-center justify-between gap-3 neu-raised p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl neu-inset flex items-center justify-center text-blue-600">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800 tracking-tight">
              Feature C: Real-Time Spatial GIS & Indian Road Networks
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Interactive corridor telemetry across 7 Indian highways with 3D perspective & OpenStreetMap layers
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenUploadModal}
            className="flex items-center gap-1.5 px-4 py-2 neu-raised text-xs font-bold text-blue-600 rounded-xl hover:bg-blue-50 transition-all"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Custom Dataset</span>
          </button>
        </div>
      </div>

      {/* Corridor Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {INDIAN_ROAD_CORRIDORS.map((corr) => (
          <button
            key={corr.id}
            type="button"
            onClick={() => handleCorridorSelect(corr.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              selectedCorridorId === corr.id
                ? 'neu-inset bg-blue-50/60 text-blue-600 border border-blue-200'
                : 'neu-btn text-slate-600'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>{corr.name}</span>
          </button>
        ))}
      </div>

      {/* Main Interactive Map & Canvas Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: GIS Spatial Map Canvas */}
        <div className="lg:col-span-2 neu-raised-lg p-5 rounded-3xl flex flex-col gap-4">
          {/* Map Controls Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Map Layer:</span>
              <button
                type="button"
                onClick={() => setMapViewMode('vector')}
                className={`px-3 py-1 text-xs font-bold rounded-lg ${
                  mapViewMode === 'vector' ? 'neu-inset text-blue-600' : 'neu-btn text-slate-600'
                }`}
              >
                Vector Telemetry
              </button>
              <button
                type="button"
                onClick={() => setMapViewMode('osm')}
                className={`px-3 py-1 text-xs font-bold rounded-lg ${
                  mapViewMode === 'osm' ? 'neu-inset text-blue-600' : 'neu-btn text-slate-600'
                }`}
              >
                OpenStreetMap Free Tile
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIs3DIsometric(!is3DIsometric)}
                className={`px-3 py-1 text-xs font-bold rounded-lg flex items-center gap-1 ${
                  is3DIsometric ? 'neu-inset text-blue-600' : 'neu-btn text-slate-600'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>{is3DIsometric ? '3D Tilt Active' : '2D Plan'}</span>
              </button>

              <button
                type="button"
                onClick={handleInjectIncident}
                className="px-3 py-1 neu-btn text-xs font-bold text-rose-600 rounded-lg flex items-center gap-1"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Simulate Incident</span>
              </button>
            </div>
          </div>

          {/* Incident Alert if Active */}
          {simulatedIncident && (
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{simulatedIncident}</span>
            </div>
          )}

          {/* Map Rendering Container */}
          <div
            className={`w-full h-80 rounded-2xl overflow-hidden relative neu-inset flex items-center justify-center transition-all ${
              is3DIsometric ? 'perspective-[800px]' : ''
            }`}
          >
            {mapViewMode === 'osm' ? (
              /* Free OpenStreetMap raster background (Zero cost, no API keys) */
              <div className="w-full h-full relative overflow-hidden bg-slate-200">
                <img
                  src={`https://tile.openstreetmap.org/11/${Math.floor(((activeCorridor.coordinates[1] + 180) / 360) * Math.pow(2, 11))}/${Math.floor(((1 - Math.log(Math.tan((activeCorridor.coordinates[0] * Math.PI) / 180) + 1 / Math.cos((activeCorridor.coordinates[0] * Math.PI) / 180)) / Math.PI) / 2) * Math.pow(2, 11))}.png`}
                  alt="OpenStreetMap Tile"
                  className="w-full h-full object-cover filter contrast-90 brightness-95 opacity-80"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Fallback to stylized canvas if tile fails
                    (e.target as any).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-blue-900/10 backdrop-contrast-125" />
              </div>
            ) : (
              /* Stylized Vector Topo Grid */
              <div className="w-full h-full bg-[#e6edf5] relative overflow-hidden flex items-center justify-center">
                <svg className="w-full h-full opacity-20 absolute inset-0">
                  <defs>
                    <pattern id="gis-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#64748b" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#gis-grid)" />
                </svg>
              </div>
            )}

            {/* Vector Highway Ribbon & Sensor Nodes */}
            <div
              className={`absolute inset-0 flex items-center justify-around px-8 transition-transform duration-500 ${
                is3DIsometric ? 'rotateX-[25deg] scale-95 shadow-xl' : ''
              }`}
            >
              {/* Highway Ribbon Path */}
              <div className="absolute left-6 right-6 h-10 bg-slate-800 rounded-xl shadow-lg border-2 border-slate-600 flex items-center px-4">
                <div className="w-full border-t border-dashed border-amber-400" />
              </div>

              {/* Sensor Nodes along the Corridor */}
              {activeCorridor.keySensors.map((sensor, idx) => {
                const isSelected = sensor.id === activeSensorId;
                const statusColor =
                  sensor.status === 'Optimal'
                    ? 'bg-emerald-500 text-emerald-50'
                    : sensor.status === 'Congested'
                    ? 'bg-amber-500 text-amber-50'
                    : sensor.status === 'Degraded'
                    ? 'bg-orange-500 text-orange-50'
                    : 'bg-rose-500 text-rose-50';

                return (
                  <div
                    key={sensor.id}
                    onClick={() => {
                      playSwitchToggle();
                      setActiveSensorId(sensor.id);
                    }}
                    className={`relative z-10 cursor-pointer flex flex-col items-center gap-1 transition-transform ${
                      isSelected ? 'scale-110' : 'hover:scale-105'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs shadow-md border-2 border-white ${statusColor}`}
                    >
                      {sensor.currentSpeedKmph}
                    </div>

                    <div className="px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs text-[9px] font-bold text-slate-800 shadow-xs whitespace-nowrap">
                      {sensor.name.split(' ')[0]}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Corridor Metadata Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="neu-inset p-2.5 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Length</span>
              <p className="text-sm font-bold text-slate-700">{activeCorridor.totalLengthKm} KM</p>
            </div>
            <div className="neu-inset p-2.5 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Lanes</span>
              <p className="text-sm font-bold text-slate-700">{activeCorridor.laneCount} Lanes</p>
            </div>
            <div className="neu-inset p-2.5 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Speed Limit</span>
              <p className="text-sm font-bold text-slate-700">{activeCorridor.speedLimitKmph} km/h</p>
            </div>
            <div className="neu-inset p-2.5 rounded-xl">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Avg Traffic</span>
              <p className="text-sm font-bold text-slate-700">
                {(activeCorridor.avgDailyVehicles / 1000).toFixed(0)}k veh/day
              </p>
            </div>
          </div>
        </div>

        {/* Right Col: Active Sensor Node Telemetry & Star Schema Drilldown */}
        <div className="neu-raised-lg p-5 rounded-3xl flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Sensor Telemetry
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
              Live Feed
            </span>
          </div>

          {activeSensor ? (
            <div className="flex flex-col gap-4">
              <div>
                <h4 className="text-sm font-bold text-slate-800">{activeSensor.name}</h4>
                <p className="text-xs text-slate-500">
                  Node ID: <span className="font-mono text-blue-600">{activeSensor.id}</span> · KM Mark: {activeSensor.kmMark}
                </p>
              </div>

              {/* Speed & Volume readouts */}
              <div className="grid grid-cols-2 gap-3">
                <div className="neu-raised p-3 rounded-2xl flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Current Velocity</span>
                  <div className="text-2xl font-bold text-blue-600">
                    {activeSensor.currentSpeedKmph} <span className="text-xs text-slate-400 font-normal">km/h</span>
                  </div>
                </div>

                <div className="neu-raised p-3 rounded-2xl flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Passing Rate</span>
                  <div className="text-2xl font-bold text-slate-800">
                    {activeSensor.vehicleCountPerMin} <span className="text-xs text-slate-400 font-normal">v/min</span>
                  </div>
                </div>
              </div>

              {/* Toll Plazas along Corridor */}
              <div className="flex flex-col gap-1.5 pt-1">
                <span className="text-xs font-bold text-slate-700">Toll Plazas & FASTag Points:</span>
                <div className="flex flex-col gap-1">
                  {activeCorridor.tollPlazas.map((toll, i) => (
                    <div
                      key={i}
                      className="p-2 neu-inset rounded-xl text-xs font-medium text-slate-600 flex items-center justify-between"
                    >
                      <span>{toll}</span>
                      <span className="text-[10px] text-emerald-600 font-bold">100% FASTag OK</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Connected Star Schema Fact Link */}
              <div className="neu-raised-sm p-3 rounded-2xl text-xs text-slate-600 flex flex-col gap-1">
                <span className="font-bold text-slate-800">Star Schema Dimension Context:</span>
                <p className="text-[11px] text-slate-500 font-mono">
                  Route_Dim.Route_Name: {activeCorridor.name}<br />
                  Location_Dim.State: {activeCorridor.state}<br />
                  Road_Dim.Lane_Count: {activeCorridor.laneCount}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-400 py-8 text-center">
              Select a sensor node along the corridor ribbon
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
