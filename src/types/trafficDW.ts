/**
 * TrafficDW Studio - Core Types & Star Schema Definitions
 */

export interface LocationDim {
  Location_Key: number;
  Location_Name: string;
  City: string;
  State: string;
}

export interface RouteDim {
  Route_Key: number;
  Route_Name: string;
  Source_Location: string;
  Destination_Location: string;
}

export interface VehicleDim {
  Vehicle_Key: number;
  Vehicle_Type: string;
  Vehicle_Category: string;
}

export interface RoadDim {
  Road_Key: number;
  Road_Name: string;
  Road_Type: string;
  Lane_Count: number;
}

export interface TimeDim {
  Time_Key: number;
  Date: string;
  Hour: number;
  Day: string;
  Month: string;
  Quarter: number;
  Year: number;
}

export type CongestionLevel = 'Low' | 'Moderate' | 'High' | 'Severe';

export interface RouteTrafficFact {
  Traffic_Key: number;
  Route_Key: number;
  Location_Key: number;
  Road_Key: number;
  Vehicle_Key: number;
  Time_Key: number;
  Congestion_Level: CongestionLevel;
  Distance_KM: number;
  Travel_Time_Min: number;
  Min_Distance_Vehicles: number;
  Avg_Speed_KMPH: number;
}

// Denormalized joined record for fast in-browser OLAP, ML, and visualization
export interface EnrichedTrafficFact extends RouteTrafficFact {
  Location_Name: string;
  City: string;
  State: string;
  Route_Name: string;
  Source_Location: string;
  Destination_Location: string;
  Vehicle_Type: string;
  Vehicle_Category: string;
  Road_Name: string;
  Road_Type: string;
  Lane_Count: number;
  Date: string;
  Hour: number;
  Day: string;
  Month: string;
  Quarter: number;
  Year: number;
}

// Module identifiers
export type ModuleId =
  | 'olap'
  | 'olap_timelapse'
  | 'spatial_gis'
  | 'anomaly_detection'
  | 'xai_benchmark'
  | 'visual_sql_planner'
  | 'preprocess_1'
  | 'preprocess_2'
  | 'classification'
  | 'clustering_kmeans'
  | 'clustering_hierarchical'
  | 'association_apriori'
  | 'data_mining_tools'
  | 'bi_visualizer'
  | 'web_scraper'
  | 'schema_workbench';

export interface ModuleMeta {
  id: ModuleId;
  index: number;
  code: string;
  title: string;
  category: 'OLAP' | 'GIS & Spatial' | 'Preprocessing' | 'Machine Learning' | 'Data Mining' | 'BI & ETL' | 'Database Engine';
  description: string;
  icon: string;
  badge: string;
}

// Indian Road Corridor GIS Meta
export interface IndianCorridorMeta {
  id: string;
  name: string;
  code: string;
  state: string;
  region: string;
  totalLengthKm: number;
  laneCount: number;
  tollPlazas: string[];
  coordinates: [number, number]; // Center Lat, Lng
  zoomLevel: number;
  speedLimitKmph: number;
  avgDailyVehicles: number;
  keySensors: {
    id: string;
    name: string;
    kmMark: number;
    lat: number;
    lng: number;
    currentSpeedKmph: number;
    vehicleCountPerMin: number;
    status: 'Optimal' | 'Degraded' | 'Faulty' | 'Congested';
  }[];
}

// Anomaly & Fraud Record
export interface AnomalyRecord {
  id: string;
  timestamp: string;
  sensorId: string;
  corridor: string;
  location: string;
  type: 'SENSOR_DEADLOCK' | 'PHANTOM_JAM' | 'FASTAG_FRAUD' | 'TELEPORTATION_VIOLATION' | 'VOLTAGE_SPIKE';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  observedValue: string;
  expectedRange: string;
  isolationScore: number; // 0 to 1
  description: string;
  remediation: string;
  status: 'Flagged' | 'Cleansed' | 'Ignored';
}

// Explainable AI & SHAP attribution
export interface ShapFeatureAttribution {
  featureName: string;
  value: string | number;
  attribution: number; // Positive increases congestion risk, negative reduces
  direction: 'increases_congestion' | 'reduces_congestion';
}

// SQL Execution Plan Node
export interface ExecutionPlanNode {
  id: string;
  nodeType: string;
  relationName?: string;
  indexName?: string;
  startupCost: number;
  totalCost: number;
  planRows: number;
  planWidth: number;
  actualStartupTimeMs?: number;
  actualTotalTimeMs?: number;
  actualRows?: number;
  filter?: string;
  joinCondition?: string;
  subNodes?: ExecutionPlanNode[];
}

// CRT & Display Themes
export type DisplayTheme = 'crt-green' | 'crt-amber' | 'blueprint' | 'ledger' | 'brushed-metal';

// Audio feedback state
export interface AudioSettings {
  soundEnabled: boolean;
  volume: number;
}
