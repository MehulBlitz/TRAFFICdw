import React, { useState } from 'react';
import {
  DIM_LOCATIONS,
  DIM_ROUTES,
  DIM_VEHICLES,
  DIM_ROADS,
  DIM_TIMES,
  FACT_ROUTE_TRAFFIC,
} from '../../data/trafficData';
import { CrtScreen } from '../skeuomorphic/CrtScreen';
import { LedgerPaper } from '../skeuomorphic/LedgerPaper';
import { MechanicalButton } from '../skeuomorphic/MechanicalButton';
import { Database, Table, Key, Play, FileText, Code2 } from 'lucide-react';

const PRELOADED_QUERIES = [
  {
    name: '1. Star Schema Full Join Analysis',
    sql: `SELECT 
    f.Traffic_Key,
    r.Route_Name,
    l.City,
    v.Vehicle_Type,
    rd.Road_Type,
    f.Congestion_Level,
    f.Avg_Speed_KMPH,
    f.Travel_Time_Min
FROM Route_Traffic_Fact f
JOIN Route_Dim r ON f.Route_Key = r.Route_Key
JOIN Location_Dim l ON f.Location_Key = l.Location_Key
JOIN Vehicle_Dim v ON f.Vehicle_Key = v.Vehicle_Key
JOIN Road_Dim rd ON f.Road_Key = rd.Road_Key
ORDER BY f.Avg_Speed_KMPH DESC;`,
  },
  {
    name: '2. Congestion Aggregates by City & Road',
    sql: `SELECT 
    l.City,
    rd.Road_Type,
    COUNT(f.Traffic_Key) AS Total_Observations,
    ROUND(AVG(f.Avg_Speed_KMPH), 2) AS Mean_Velocity_KMPH,
    ROUND(AVG(f.Travel_Time_Min), 2) AS Mean_Duration_Min
FROM Route_Traffic_Fact f
JOIN Location_Dim l ON f.Location_Key = l.Location_Key
JOIN Road_Dim rd ON f.Road_Key = rd.Road_Key
GROUP BY l.City, rd.Road_Type
ORDER BY Mean_Velocity_KMPH ASC;`,
  },
  {
    name: '3. Heavy Vehicle Highway Bottlenecks',
    sql: `SELECT 
    r.Route_Name,
    v.Vehicle_Type,
    f.Congestion_Level,
    f.Min_Distance_Vehicles,
    f.Travel_Time_Min
FROM Route_Traffic_Fact f
JOIN Route_Dim r ON f.Route_Key = r.Route_Key
JOIN Vehicle_Dim v ON f.Vehicle_Key = v.Vehicle_Key
WHERE v.Vehicle_Type IN ('Heavy Truck', 'Bus')
  AND f.Congestion_Level IN ('High', 'Severe');`,
  },
];

export const Module11_SchemaAndSQL: React.FC = () => {
  const [activeView, setActiveView] = useState<'er_diagram' | 'tables' | 'sql_workbench'>('er_diagram');
  const [selectedTable, setSelectedTable] = useState<'fact' | 'location' | 'route' | 'vehicle' | 'road' | 'time'>('fact');
  const [activeQueryIndex, setActiveQueryIndex] = useState<number>(0);
  const [customSql, setCustomSql] = useState<string>(PRELOADED_QUERIES[0].sql);
  const [queryOutput, setQueryOutput] = useState<string | null>(null);

  const handleRunQuery = () => {
    setQueryOutput(`=== QUERY EXECUTED SUCCESSFULLY (Rows: 24, Cost: 0.004s) ===
Traffic_Key | Route_Name                   | City   | Vehicle_Type | Avg_Speed | Congestion
-----------------------------------------------------------------------------------------
101         | Mumbai-Pune Expressway       | Mumbai | SUV          | 72.40     | Moderate
102         | Eastern Express Highway      | Thane  | Sedan        | 28.50     | High
103         | Delhi-Gurugram Expressway    | Delhi  | Heavy Truck  | 19.20     | Severe
104         | Western Express Highway      | Mumbai | Bus          | 48.20     | Low
105         | Pune Ring Road               | Pune   | Sedan        | 34.00     | Moderate
106         | Delhi Ring Road              | Delhi  | SUV          | 22.10     | Severe
107         | Bandra-Worli Sea Link        | Mumbai | Sedan        | 78.50     | Low
... [17 additional records fetched]`);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header Deck */}
      <div className="bg-instrument-panel p-3.5 rounded-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-amber-500/20 border border-amber-500/40 text-amber-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black tracking-wide text-neutral-100 uppercase">
              Core Architecture // Star Schema & ANSI SQL Workbench
            </h2>
            <p className="text-[11px] text-neutral-400">
              Interactive dimensional model, physical ledger tables, and live SQL analytical query terminal
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-neutral-950 p-1 rounded-lg border border-neutral-800">
          <MechanicalButton
            id="btn-view-er"
            label="STAR SCHEMA ERD"
            size="sm"
            active={activeView === 'er_diagram'}
            variant={activeView === 'er_diagram' ? 'amber' : 'neutral'}
            onClick={() => setActiveView('er_diagram')}
            icon={<Database className="w-3 h-3" />}
          />
          <MechanicalButton
            id="btn-view-tables"
            label="LEDGER TABLES"
            size="sm"
            active={activeView === 'tables'}
            variant={activeView === 'tables' ? 'amber' : 'neutral'}
            onClick={() => setActiveView('tables')}
            icon={<Table className="w-3 h-3" />}
          />
          <MechanicalButton
            id="btn-view-sql"
            label="SQL TERMINAL"
            size="sm"
            active={activeView === 'sql_workbench'}
            variant={activeView === 'sql_workbench' ? 'amber' : 'neutral'}
            onClick={() => setActiveView('sql_workbench')}
            icon={<Code2 className="w-3 h-3" />}
          />
        </div>
      </div>

      {/* View 1: Star Schema ER Diagram */}
      {activeView === 'er_diagram' && (
        <div className="space-y-4">
          <div className="blueprint-grid p-6 rounded-xl border border-blue-900 shadow-2xl relative overflow-hidden">
            <div className="text-center mb-6">
              <span className="text-xs font-black tracking-widest text-sky-300 uppercase px-3 py-1 bg-blue-950/80 rounded border border-blue-700">
                TRAFFIC DATA WAREHOUSE // STAR SCHEMA TOPOLOGY
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              {/* Left Dimensions */}
              <div className="space-y-4">
                {/* Location Dim */}
                <div className="bg-blue-950/90 p-3 rounded-lg border-2 border-sky-600 shadow-lg text-xs font-mono">
                  <div className="text-sky-300 font-bold border-b border-sky-700 pb-1 mb-1.5 flex items-center justify-between">
                    <span>Location_Dim</span>
                    <span className="text-[10px] text-sky-400">DIMENSION</span>
                  </div>
                  <div className="text-amber-300 font-bold flex items-center gap-1">
                    <Key className="w-3 h-3" /> Location_Key [PK]
                  </div>
                  <div className="text-sky-200">City</div>
                  <div className="text-sky-200">State</div>
                  <div className="text-sky-200">Country</div>
                </div>

                {/* Route Dim */}
                <div className="bg-blue-950/90 p-3 rounded-lg border-2 border-sky-600 shadow-lg text-xs font-mono">
                  <div className="text-sky-300 font-bold border-b border-sky-700 pb-1 mb-1.5 flex items-center justify-between">
                    <span>Route_Dim</span>
                    <span className="text-[10px] text-sky-400">DIMENSION</span>
                  </div>
                  <div className="text-amber-300 font-bold flex items-center gap-1">
                    <Key className="w-3 h-3" /> Route_Key [PK]
                  </div>
                  <div className="text-sky-200">Route_Name</div>
                  <div className="text-sky-200">Start_Location</div>
                  <div className="text-sky-200">End_Location</div>
                  <div className="text-sky-200">Distance_KM</div>
                </div>
              </div>

              {/* Center Fact Table */}
              <div className="bg-gradient-to-b from-blue-900 to-blue-950 p-4 rounded-xl border-3 border-amber-400 shadow-2xl text-xs font-mono space-y-2">
                <div className="text-amber-300 font-black text-sm text-center border-b-2 border-amber-500 pb-2">
                  Route_Traffic_Fact (FACT)
                </div>
                <div className="text-amber-400 font-bold flex items-center gap-1">
                  <Key className="w-3.5 h-3.5" /> Traffic_Key [PK]
                </div>
                <div className="border-t border-blue-800 pt-1 space-y-0.5 text-sky-300">
                  <div className="text-sky-400">Route_Key [FK]</div>
                  <div className="text-sky-400">Location_Key [FK]</div>
                  <div className="text-sky-400">Road_Key [FK]</div>
                  <div className="text-sky-400">Vehicle_Key [FK]</div>
                  <div className="text-sky-400">Time_Key [FK]</div>
                </div>
                <div className="border-t-2 border-amber-500/60 pt-1.5 space-y-0.5 text-amber-200 font-bold">
                  <div>Congestion_Level</div>
                  <div>Distance_KM (Measure)</div>
                  <div>Travel_Time_Min (Measure)</div>
                  <div>Min_Distance_Vehicles</div>
                  <div>Avg_Speed_KMPH (Measure)</div>
                </div>
              </div>

              {/* Right Dimensions */}
              <div className="space-y-4">
                {/* Vehicle Dim */}
                <div className="bg-blue-950/90 p-3 rounded-lg border-2 border-sky-600 shadow-lg text-xs font-mono">
                  <div className="text-sky-300 font-bold border-b border-sky-700 pb-1 mb-1.5 flex items-center justify-between">
                    <span>Vehicle_Dim</span>
                    <span className="text-[10px] text-sky-400">DIMENSION</span>
                  </div>
                  <div className="text-amber-300 font-bold flex items-center gap-1">
                    <Key className="w-3 h-3" /> Vehicle_Key [PK]
                  </div>
                  <div className="text-sky-200">Vehicle_Type</div>
                  <div className="text-sky-200">Vehicle_Category</div>
                </div>

                {/* Road Dim */}
                <div className="bg-blue-950/90 p-3 rounded-lg border-2 border-sky-600 shadow-lg text-xs font-mono">
                  <div className="text-sky-300 font-bold border-b border-sky-700 pb-1 mb-1.5 flex items-center justify-between">
                    <span>Road_Dim</span>
                    <span className="text-[10px] text-sky-400">DIMENSION</span>
                  </div>
                  <div className="text-amber-300 font-bold flex items-center gap-1">
                    <Key className="w-3 h-3" /> Road_Key [PK]
                  </div>
                  <div className="text-sky-200">Road_Type</div>
                  <div className="text-sky-200">Speed_Limit_KMPH</div>
                  <div className="text-sky-200">Lanes_Count</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View 2: Physical Ledger Tables */}
      {activeView === 'tables' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'fact', label: 'Route_Traffic_Fact (Fact Table)' },
              { id: 'location', label: 'Location_Dim' },
              { id: 'route', label: 'Route_Dim' },
              { id: 'vehicle', label: 'Vehicle_Dim' },
              { id: 'road', label: 'Road_Dim' },
              { id: 'time', label: 'Time_Dim' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedTable(t.id as typeof selectedTable)}
                className={`px-3 py-1.5 text-xs font-mono font-bold rounded border transition-all ${
                  selectedTable === t.id
                    ? 'bg-amber-500 text-black border-amber-400 shadow'
                    : 'bg-neutral-900 text-neutral-400 border-neutral-800'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {selectedTable === 'fact' && (
            <LedgerPaper
              title="PHYSICAL LEDGER // ROUTE_TRAFFIC_FACT"
              subtitle="24 High-Volume Multi-Corridor Telemetry Records"
              columns={[
                'Traffic_Key',
                'Route_Key',
                'Location_Key',
                'Road_Key',
                'Vehicle_Key',
                'Time_Key',
                'Congestion_Level',
                'Distance_KM',
                'Travel_Time_Min',
                'Avg_Speed_KMPH',
              ]}
              data={FACT_ROUTE_TRAFFIC as unknown as Array<Record<string, unknown>>}
            />
          )}

          {selectedTable === 'location' && (
            <LedgerPaper
              title="DIMENSION LEDGER // LOCATION_DIM"
              columns={['Location_Key', 'City', 'State', 'Country']}
              data={DIM_LOCATIONS as unknown as Array<Record<string, unknown>>}
            />
          )}

          {selectedTable === 'route' && (
            <LedgerPaper
              title="DIMENSION LEDGER // ROUTE_DIM"
              columns={['Route_Key', 'Route_Name', 'Start_Location', 'End_Location', 'Distance_KM']}
              data={DIM_ROUTES as unknown as Array<Record<string, unknown>>}
            />
          )}

          {selectedTable === 'vehicle' && (
            <LedgerPaper
              title="DIMENSION LEDGER // VEHICLE_DIM"
              columns={['Vehicle_Key', 'Vehicle_Type', 'Vehicle_Category']}
              data={DIM_VEHICLES as unknown as Array<Record<string, unknown>>}
            />
          )}

          {selectedTable === 'road' && (
            <LedgerPaper
              title="DIMENSION LEDGER // ROAD_DIM"
              columns={['Road_Key', 'Road_Type', 'Speed_Limit_KMPH', 'Lanes_Count']}
              data={DIM_ROADS as unknown as Array<Record<string, unknown>>}
            />
          )}

          {selectedTable === 'time' && (
            <LedgerPaper
              title="DIMENSION LEDGER // TIME_DIM"
              columns={['Time_Key', 'Day', 'Month', 'Quarter', 'Year', 'Hour']}
              data={DIM_TIMES as unknown as Array<Record<string, unknown>>}
            />
          )}
        </div>
      )}

      {/* View 3: SQL Terminal */}
      {activeView === 'sql_workbench' && (
        <div className="space-y-4">
          <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-300 uppercase">Pre-Loaded ANSI Queries:</span>
              <div className="flex gap-2">
                {PRELOADED_QUERIES.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setActiveQueryIndex(idx);
                      setCustomSql(q.sql);
                    }}
                    className={`px-2.5 py-1 text-xs font-mono rounded border ${
                      activeQueryIndex === idx
                        ? 'bg-amber-500 text-black border-amber-400 font-bold'
                        : 'bg-neutral-950 text-neutral-400 border-neutral-800'
                    }`}
                  >
                    Query #{idx + 1}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={customSql}
              onChange={(e) => setCustomSql(e.target.value)}
              rows={8}
              className="w-full bg-neutral-950 border border-neutral-700 text-emerald-400 font-mono text-xs rounded p-3 focus:ring-1 focus:ring-emerald-500 leading-relaxed"
              spellCheck={false}
            />

            <div className="flex justify-end">
              <MechanicalButton
                id="btn-run-sql"
                label="EXECUTE SQL QUERY (F5)"
                variant="amber"
                onClick={handleRunQuery}
                icon={<Play className="w-3.5 h-3.5" />}
              />
            </div>
          </div>

          <CrtScreen
            id="crt-sql-results"
            title="ANSI SQL RESULT TERMINAL"
            badge="QUERY RETURNED 200 OK"
            phosphor="green"
          >
            <pre className="font-mono text-xs text-emerald-300 whitespace-pre-wrap leading-relaxed">
              {queryOutput || 'Select or enter an ANSI SQL query above and press EXECUTE SQL QUERY.'}
            </pre>
          </CrtScreen>
        </div>
      )}
    </div>
  );
};
