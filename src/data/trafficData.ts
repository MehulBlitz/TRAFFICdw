/**
 * TrafficDW Studio - Exact Database Context & Initial Data
 * All schema, dimensions, facts, and keys map 1:1 to TrafficDW specifications.
 */

import {
  LocationDim,
  RouteDim,
  VehicleDim,
  RoadDim,
  TimeDim,
  RouteTrafficFact,
  EnrichedTrafficFact,
  ModuleMeta,
  IndianCorridorMeta,
  AnomalyRecord,
} from '../types/trafficDW';

export type {
  LocationDim,
  RouteDim,
  VehicleDim,
  RoadDim,
  TimeDim,
  RouteTrafficFact,
  EnrichedTrafficFact,
  CongestionLevel,
  ModuleMeta,
} from '../types/trafficDW';

export const EXACT_LOCATION_DIM: LocationDim[] = [
  { Location_Key: 1, Location_Name: 'Dadar Junction', City: 'Mumbai', State: 'Maharashtra' },
  { Location_Key: 2, Location_Name: 'Thane Station Area', City: 'Thane', State: 'Maharashtra' },
  { Location_Key: 3, Location_Name: 'Swargate Square', City: 'Pune', State: 'Maharashtra' },
  { Location_Key: 4, Location_Name: 'Connaught Place', City: 'Delhi', State: 'Delhi' },
];

export const EXACT_ROUTE_DIM: RouteDim[] = [
  { Route_Key: 1, Route_Name: 'Mumbai-Pune Expressway', Source_Location: 'Mumbai', Destination_Location: 'Pune' },
  { Route_Key: 2, Route_Name: 'Eastern Express Highway', Source_Location: 'Thane', Destination_Location: 'Mumbai' },
  { Route_Key: 3, Route_Name: 'Delhi-Gurugram Expressway', Source_Location: 'Delhi', Destination_Location: 'Gurugram' },
  { Route_Key: 4, Route_Name: 'Western Express Highway', Source_Location: 'Bandra', Destination_Location: 'Dahisar' },
];

export const EXACT_VEHICLE_DIM: VehicleDim[] = [
  { Vehicle_Key: 1, Vehicle_Type: 'Sedan', Vehicle_Category: 'Light Motor Vehicle' },
  { Vehicle_Key: 2, Vehicle_Type: 'SUV', Vehicle_Category: 'Light Motor Vehicle' },
  { Vehicle_Key: 3, Vehicle_Type: 'Heavy Truck', Vehicle_Category: 'Commercial Vehicle' },
  { Vehicle_Key: 4, Vehicle_Type: 'Bus', Vehicle_Category: 'Public Transit' },
];

export const EXACT_ROAD_DIM: RoadDim[] = [
  { Road_Key: 1, Road_Name: 'Expressway-01', Road_Type: 'Expressway', Lane_Count: 6 },
  { Road_Key: 2, Road_Name: 'Arterial-A2', Road_Type: 'Arterial Road', Lane_Count: 4 },
  { Road_Key: 3, Road_Name: 'National Highway 48', Road_Type: 'Highway', Lane_Count: 6 },
  { Road_Key: 4, Road_Name: 'Local Linking Road', Road_Type: 'Collector Road', Lane_Count: 2 },
];

export const EXACT_TIME_DIM: TimeDim[] = [
  { Time_Key: 1, Date: '2026-01-10', Hour: 8, Day: 'Saturday', Month: 'January', Quarter: 1, Year: 2026 },
  { Time_Key: 2, Date: '2026-02-15', Hour: 18, Day: 'Sunday', Month: 'February', Quarter: 1, Year: 2026 },
  { Time_Key: 3, Date: '2026-03-20', Hour: 9, Day: 'Friday', Month: 'March', Quarter: 1, Year: 2026 },
  { Time_Key: 4, Date: '2026-04-25', Hour: 14, Day: 'Saturday', Month: 'April', Quarter: 2, Year: 2026 },
];

export const EXACT_ROUTE_TRAFFIC_FACT: RouteTrafficFact[] = [
  {
    Traffic_Key: 1,
    Route_Key: 1,
    Location_Key: 1,
    Road_Key: 1,
    Vehicle_Key: 1,
    Time_Key: 1,
    Congestion_Level: 'Moderate',
    Distance_KM: 148.0,
    Travel_Time_Min: 120.0,
    Min_Distance_Vehicles: 15,
    Avg_Speed_KMPH: 74.0,
  },
  {
    Traffic_Key: 2,
    Route_Key: 2,
    Location_Key: 2,
    Road_Key: 2,
    Vehicle_Key: 2,
    Time_Key: 2,
    Congestion_Level: 'High',
    Distance_KM: 25.5,
    Travel_Time_Min: 65.0,
    Min_Distance_Vehicles: 5,
    Avg_Speed_KMPH: 23.54,
  },
  {
    Traffic_Key: 3,
    Route_Key: 3,
    Location_Key: 4,
    Road_Key: 3,
    Vehicle_Key: 3,
    Time_Key: 3,
    Congestion_Level: 'Severe',
    Distance_KM: 32.0,
    Travel_Time_Min: 90.0,
    Min_Distance_Vehicles: 3,
    Avg_Speed_KMPH: 21.33,
  },
  {
    Traffic_Key: 4,
    Route_Key: 4,
    Location_Key: 3,
    Road_Key: 4,
    Vehicle_Key: 4,
    Time_Key: 4,
    Congestion_Level: 'Low',
    Distance_KM: 18.2,
    Travel_Time_Min: 25.0,
    Min_Distance_Vehicles: 25,
    Avg_Speed_KMPH: 43.68,
  },
];

// Expanded realistic dataset built upon the exact same schema & keys
// This ensures rich statistical distributions, clustering clouds, and OLAP cubes.
export const EXTENDED_TRAFFIC_FACTS: RouteTrafficFact[] = [
  ...EXACT_ROUTE_TRAFFIC_FACT,
  { Traffic_Key: 5, Route_Key: 1, Location_Key: 1, Road_Key: 1, Vehicle_Key: 2, Time_Key: 1, Congestion_Level: 'Moderate', Distance_KM: 148.0, Travel_Time_Min: 115.0, Min_Distance_Vehicles: 18, Avg_Speed_KMPH: 77.22 },
  { Traffic_Key: 6, Route_Key: 1, Location_Key: 3, Road_Key: 1, Vehicle_Key: 3, Time_Key: 3, Congestion_Level: 'High', Distance_KM: 148.0, Travel_Time_Min: 180.0, Min_Distance_Vehicles: 8, Avg_Speed_KMPH: 49.33 },
  { Traffic_Key: 7, Route_Key: 1, Location_Key: 1, Road_Key: 1, Vehicle_Key: 4, Time_Key: 2, Congestion_Level: 'High', Distance_KM: 148.0, Travel_Time_Min: 170.0, Min_Distance_Vehicles: 9, Avg_Speed_KMPH: 52.24 },
  { Traffic_Key: 8, Route_Key: 2, Location_Key: 2, Road_Key: 2, Vehicle_Key: 1, Time_Key: 1, Congestion_Level: 'Moderate', Distance_KM: 25.5, Travel_Time_Min: 45.0, Min_Distance_Vehicles: 12, Avg_Speed_KMPH: 34.0 },
  { Traffic_Key: 9, Route_Key: 2, Location_Key: 2, Road_Key: 2, Vehicle_Key: 3, Time_Key: 2, Congestion_Level: 'Severe', Distance_KM: 25.5, Travel_Time_Min: 85.0, Min_Distance_Vehicles: 4, Avg_Speed_KMPH: 18.0 },
  { Traffic_Key: 10, Route_Key: 2, Location_Key: 1, Road_Key: 2, Vehicle_Key: 4, Time_Key: 4, Congestion_Level: 'Low', Distance_KM: 25.5, Travel_Time_Min: 32.0, Min_Distance_Vehicles: 20, Avg_Speed_KMPH: 47.81 },
  { Traffic_Key: 11, Route_Key: 3, Location_Key: 4, Road_Key: 3, Vehicle_Key: 1, Time_Key: 1, Congestion_Level: 'Moderate', Distance_KM: 32.0, Travel_Time_Min: 48.0, Min_Distance_Vehicles: 14, Avg_Speed_KMPH: 40.0 },
  { Traffic_Key: 12, Route_Key: 3, Location_Key: 4, Road_Key: 3, Vehicle_Key: 2, Time_Key: 2, Congestion_Level: 'Severe', Distance_KM: 32.0, Travel_Time_Min: 110.0, Min_Distance_Vehicles: 2, Avg_Speed_KMPH: 17.45 },
  { Traffic_Key: 13, Route_Key: 3, Location_Key: 4, Road_Key: 3, Vehicle_Key: 4, Time_Key: 3, Congestion_Level: 'High', Distance_KM: 32.0, Travel_Time_Min: 75.0, Min_Distance_Vehicles: 6, Avg_Speed_KMPH: 25.6 },
  { Traffic_Key: 14, Route_Key: 4, Location_Key: 1, Road_Key: 4, Vehicle_Key: 1, Time_Key: 2, Congestion_Level: 'Moderate', Distance_KM: 18.2, Travel_Time_Min: 38.0, Min_Distance_Vehicles: 11, Avg_Speed_KMPH: 28.74 },
  { Traffic_Key: 15, Route_Key: 4, Location_Key: 1, Road_Key: 4, Vehicle_Key: 2, Time_Key: 3, Congestion_Level: 'Severe', Distance_KM: 18.2, Travel_Time_Min: 60.0, Min_Distance_Vehicles: 3, Avg_Speed_KMPH: 18.2 },
  { Traffic_Key: 16, Route_Key: 4, Location_Key: 3, Road_Key: 4, Vehicle_Key: 3, Time_Key: 4, Congestion_Level: 'Low', Distance_KM: 18.2, Travel_Time_Min: 22.0, Min_Distance_Vehicles: 28, Avg_Speed_KMPH: 49.64 },
  { Traffic_Key: 17, Route_Key: 1, Location_Key: 3, Road_Key: 1, Vehicle_Key: 1, Time_Key: 4, Congestion_Level: 'Low', Distance_KM: 148.0, Travel_Time_Min: 98.0, Min_Distance_Vehicles: 30, Avg_Speed_KMPH: 90.61 },
  { Traffic_Key: 18, Route_Key: 2, Location_Key: 2, Road_Key: 2, Vehicle_Key: 2, Time_Key: 3, Congestion_Level: 'High', Distance_KM: 25.5, Travel_Time_Min: 58.0, Min_Distance_Vehicles: 7, Avg_Speed_KMPH: 26.38 },
  { Traffic_Key: 19, Route_Key: 3, Location_Key: 4, Road_Key: 3, Vehicle_Key: 3, Time_Key: 4, Congestion_Level: 'Moderate', Distance_KM: 32.0, Travel_Time_Min: 50.0, Min_Distance_Vehicles: 16, Avg_Speed_KMPH: 38.4 },
  { Traffic_Key: 20, Route_Key: 4, Location_Key: 2, Road_Key: 4, Vehicle_Key: 4, Time_Key: 1, Congestion_Level: 'Moderate', Distance_KM: 18.2, Travel_Time_Min: 35.0, Min_Distance_Vehicles: 13, Avg_Speed_KMPH: 31.2 },
  { Traffic_Key: 21, Route_Key: 1, Location_Key: 1, Road_Key: 1, Vehicle_Key: 2, Time_Key: 2, Congestion_Level: 'High', Distance_KM: 148.0, Travel_Time_Min: 160.0, Min_Distance_Vehicles: 6, Avg_Speed_KMPH: 55.5 },
  { Traffic_Key: 22, Route_Key: 2, Location_Key: 1, Road_Key: 2, Vehicle_Key: 1, Time_Key: 4, Congestion_Level: 'Low', Distance_KM: 25.5, Travel_Time_Min: 28.0, Min_Distance_Vehicles: 24, Avg_Speed_KMPH: 54.64 },
  { Traffic_Key: 23, Route_Key: 3, Location_Key: 4, Road_Key: 3, Vehicle_Key: 1, Time_Key: 3, Congestion_Level: 'Severe', Distance_KM: 32.0, Travel_Time_Min: 95.0, Min_Distance_Vehicles: 3, Avg_Speed_KMPH: 20.21 },
  { Traffic_Key: 24, Route_Key: 4, Location_Key: 3, Road_Key: 4, Vehicle_Key: 2, Time_Key: 4, Congestion_Level: 'Low', Distance_KM: 18.2, Travel_Time_Min: 20.0, Min_Distance_Vehicles: 32, Avg_Speed_KMPH: 54.6 },
];

// Helper to get fully enriched and joined traffic records
export function getEnrichedTrafficRecords(facts: RouteTrafficFact[] = EXTENDED_TRAFFIC_FACTS): EnrichedTrafficFact[] {
  const locMap = new Map(EXACT_LOCATION_DIM.map((l) => [l.Location_Key, l]));
  const routeMap = new Map(EXACT_ROUTE_DIM.map((r) => [r.Route_Key, r]));
  const vehMap = new Map(EXACT_VEHICLE_DIM.map((v) => [v.Vehicle_Key, v]));
  const roadMap = new Map(EXACT_ROAD_DIM.map((rd) => [rd.Road_Key, rd]));
  const timeMap = new Map(EXACT_TIME_DIM.map((t) => [t.Time_Key, t]));

  return facts.map((fact) => {
    const loc = locMap.get(fact.Location_Key)!;
    const route = routeMap.get(fact.Route_Key)!;
    const veh = vehMap.get(fact.Vehicle_Key)!;
    const road = roadMap.get(fact.Road_Key)!;
    const time = timeMap.get(fact.Time_Key)!;

    return {
      ...fact,
      Location_Name: loc.Location_Name,
      City: loc.City,
      State: loc.State,
      Route_Name: route.Route_Name,
      Source_Location: route.Source_Location,
      Destination_Location: route.Destination_Location,
      Vehicle_Type: veh.Vehicle_Type,
      Vehicle_Category: veh.Vehicle_Category,
      Road_Name: road.Road_Name,
      Road_Type: road.Road_Type,
      Lane_Count: road.Lane_Count,
      Date: time.Date,
      Hour: time.Hour,
      Day: time.Day,
      Month: time.Month,
      Quarter: time.Quarter,
      Year: time.Year,
    };
  });
}

// 7 Major Indian High-Density Highway & Urban Corridors
export const INDIAN_ROAD_CORRIDORS: IndianCorridorMeta[] = [
  {
    id: 'mumbai-pune',
    name: 'Mumbai–Pune Expressway & Coastal Road',
    code: 'MPEW-MH',
    state: 'Maharashtra',
    region: 'Western Corridor',
    totalLengthKm: 94.5,
    laneCount: 6,
    tollPlazas: ['Khalapur Toll Plaza', 'Urse Toll Plaza', 'Talegaon Interchange'],
    coordinates: [18.7557, 73.4091],
    zoomLevel: 11,
    speedLimitKmph: 100,
    avgDailyVehicles: 72000,
    keySensors: [
      { id: 'SEN-MH-01', name: 'Kalamboli Ingress Loop', kmMark: 0.0, lat: 19.0330, lng: 73.1028, currentSpeedKmph: 78, vehicleCountPerMin: 54, status: 'Optimal' },
      { id: 'SEN-MH-02', name: 'Khandala Ghat Gradient Sensor', kmMark: 45.2, lat: 18.7610, lng: 73.3762, currentSpeedKmph: 36, vehicleCountPerMin: 68, status: 'Congested' },
      { id: 'SEN-MH-03', name: 'Lonavala Exit Camera Radar', kmMark: 55.8, lat: 18.7547, lng: 73.4072, currentSpeedKmph: 82, vehicleCountPerMin: 49, status: 'Optimal' },
      { id: 'SEN-MH-04', name: 'Urse Toll Plaza FASTag Loop', kmMark: 82.0, lat: 18.7180, lng: 73.6840, currentSpeedKmph: 24, vehicleCountPerMin: 85, status: 'Degraded' },
      { id: 'SEN-MH-05', name: 'Ravet Terminal Pune Node', kmMark: 94.5, lat: 18.6470, lng: 73.7420, currentSpeedKmph: 65, vehicleCountPerMin: 52, status: 'Optimal' },
    ],
  },
  {
    id: 'delhi-gurugram',
    name: 'Delhi–Gurugram Expressway (NH-48)',
    code: 'NH48-NCR',
    state: 'Delhi / Haryana',
    region: 'Northern Corridor',
    totalLengthKm: 27.7,
    laneCount: 8,
    tollPlazas: ['Sirhaul Border Point', 'Kherki Daula Toll Plaza'],
    coordinates: [28.4900, 77.0800],
    zoomLevel: 12,
    speedLimitKmph: 80,
    avgDailyVehicles: 180000,
    keySensors: [
      { id: 'SEN-DL-01', name: 'Dhaula Kuan Ingress Loop', kmMark: 2.0, lat: 28.5921, lng: 77.1610, currentSpeedKmph: 28, vehicleCountPerMin: 92, status: 'Congested' },
      { id: 'SEN-DL-02', name: 'Cyber Hub Flyover Gantry', kmMark: 14.5, lat: 28.4986, lng: 77.0890, currentSpeedKmph: 42, vehicleCountPerMin: 78, status: 'Optimal' },
      { id: 'SEN-DL-03', name: 'IFFCO Chowk Intersection Radar', kmMark: 19.0, lat: 28.4720, lng: 77.0650, currentSpeedKmph: 31, vehicleCountPerMin: 84, status: 'Congested' },
      { id: 'SEN-DL-04', name: 'Kherki Daula FASTag Plaza', kmMark: 27.7, lat: 28.4100, lng: 76.9950, currentSpeedKmph: 15, vehicleCountPerMin: 110, status: 'Faulty' },
    ],
  },
  {
    id: 'bengaluru-orr',
    name: 'Bengaluru Outer Ring Road & Silk Board',
    code: 'ORR-BLR',
    state: 'Karnataka',
    region: 'Southern Corridor',
    totalLengthKm: 62.0,
    laneCount: 6,
    tollPlazas: ['Electronic City Elevated Toll', 'Hosur Road Gantry'],
    coordinates: [12.9260, 77.6762],
    zoomLevel: 12,
    speedLimitKmph: 60,
    avgDailyVehicles: 145000,
    keySensors: [
      { id: 'SEN-KA-01', name: 'Central Silk Board Junction', kmMark: 0.0, lat: 12.9176, lng: 77.6233, currentSpeedKmph: 9, vehicleCountPerMin: 125, status: 'Congested' },
      { id: 'SEN-KA-02', name: 'HSR Layout Sector 2 Loop', kmMark: 3.5, lat: 12.9110, lng: 77.6388, currentSpeedKmph: 32, vehicleCountPerMin: 76, status: 'Optimal' },
      { id: 'SEN-KA-03', name: 'Bellandur EcoSpace IT Corridor', kmMark: 8.8, lat: 12.9260, lng: 77.6762, currentSpeedKmph: 18, vehicleCountPerMin: 98, status: 'Congested' },
      { id: 'SEN-KA-04', name: 'Marathahalli Multiplex Underpass', kmMark: 14.2, lat: 12.9560, lng: 77.7010, currentSpeedKmph: 24, vehicleCountPerMin: 88, status: 'Degraded' },
    ],
  },
  {
    id: 'hyderabad-orr',
    name: 'Hyderabad Outer Ring Road (ORR)',
    code: 'ORR-HYD',
    state: 'Telangana',
    region: 'South-Central Corridor',
    totalLengthKm: 158.0,
    laneCount: 8,
    tollPlazas: ['Gachibowli Toll Plaza', 'Shamshabad Airport Plaza', 'Nanakramguda Junction'],
    coordinates: [17.4399, 78.3489],
    zoomLevel: 11,
    speedLimitKmph: 120,
    avgDailyVehicles: 95000,
    keySensors: [
      { id: 'SEN-TS-01', name: 'Gachibowli Junction Telemetry', kmMark: 12.0, lat: 17.4400, lng: 78.3480, currentSpeedKmph: 85, vehicleCountPerMin: 62, status: 'Optimal' },
      { id: 'SEN-TS-02', name: 'Financial District Loop 4', kmMark: 18.5, lat: 17.4190, lng: 78.3420, currentSpeedKmph: 92, vehicleCountPerMin: 48, status: 'Optimal' },
      { id: 'SEN-TS-03', name: 'Shamshabad Airport Gantry', kmMark: 45.0, lat: 17.2403, lng: 78.4294, currentSpeedKmph: 104, vehicleCountPerMin: 55, status: 'Optimal' },
    ],
  },
  {
    id: 'chennai-omr',
    name: 'Chennai Old Mahabalipuram Road (OMR)',
    code: 'OMR-CHN',
    state: 'Tamil Nadu',
    region: 'Southeastern Corridor',
    totalLengthKm: 45.0,
    laneCount: 6,
    tollPlazas: ['Perungudi Toll Gate', 'Navalur Toll Plaza'],
    coordinates: [12.9010, 80.2279],
    zoomLevel: 12,
    speedLimitKmph: 70,
    avgDailyVehicles: 88000,
    keySensors: [
      { id: 'SEN-TN-01', name: 'Madhya Kailash Ingress', kmMark: 1.0, lat: 13.0067, lng: 80.2425, currentSpeedKmph: 22, vehicleCountPerMin: 90, status: 'Congested' },
      { id: 'SEN-TN-02', name: 'TIDEL Park IT Gantry', kmMark: 4.5, lat: 12.9890, lng: 80.2480, currentSpeedKmph: 45, vehicleCountPerMin: 64, status: 'Optimal' },
      { id: 'SEN-TN-03', name: 'Sholinganallur Junction Radar', kmMark: 14.0, lat: 12.9010, lng: 80.2279, currentSpeedKmph: 28, vehicleCountPerMin: 85, status: 'Degraded' },
    ],
  },
  {
    id: 'kolkata-em-bypass',
    name: 'Kolkata Eastern Metropolitan Bypass',
    code: 'EMB-KOL',
    state: 'West Bengal',
    region: 'Eastern Corridor',
    totalLengthKm: 32.0,
    laneCount: 6,
    tollPlazas: ['Ruby General Point', 'Science City Junction'],
    coordinates: [22.5392, 88.3968],
    zoomLevel: 12,
    speedLimitKmph: 60,
    avgDailyVehicles: 110000,
    keySensors: [
      { id: 'SEN-WB-01', name: 'Ultadanga North Hub', kmMark: 2.0, lat: 22.5971, lng: 88.3970, currentSpeedKmph: 35, vehicleCountPerMin: 72, status: 'Optimal' },
      { id: 'SEN-WB-02', name: 'Science City Maa Flyover Loop', kmMark: 10.5, lat: 22.5392, lng: 88.3968, currentSpeedKmph: 48, vehicleCountPerMin: 65, status: 'Optimal' },
      { id: 'SEN-WB-03', name: 'Ruby Hospital Crossing', kmMark: 16.0, lat: 22.5130, lng: 88.4010, currentSpeedKmph: 19, vehicleCountPerMin: 89, status: 'Congested' },
    ],
  },
  {
    id: 'samruddhi-mahamarg',
    name: 'Samruddhi Mahamarg (Mumbai–Nagpur Super Expressway)',
    code: 'SMEW-MH',
    state: 'Maharashtra',
    region: 'Central Super Expressway',
    totalLengthKm: 701.0,
    laneCount: 6,
    tollPlazas: ['Igatpuri Plaza', 'Shirdi Interchange', 'Nagpur Ring Interchange'],
    coordinates: [19.8762, 75.3433],
    zoomLevel: 9,
    speedLimitKmph: 120,
    avgDailyVehicles: 45000,
    keySensors: [
      { id: 'SEN-SM-01', name: 'Igatpuri Tunnel Ingress', kmMark: 15.0, lat: 19.6950, lng: 73.5600, currentSpeedKmph: 98, vehicleCountPerMin: 32, status: 'Optimal' },
      { id: 'SEN-SM-02', name: 'Shirdi Interchange Loop', kmMark: 160.0, lat: 19.7645, lng: 74.4762, currentSpeedKmph: 112, vehicleCountPerMin: 28, status: 'Optimal' },
      { id: 'SEN-SM-03', name: 'Aurangabad East Gantry', kmMark: 310.0, lat: 19.8762, lng: 75.3433, currentSpeedKmph: 115, vehicleCountPerMin: 30, status: 'Optimal' },
    ],
  },
];

// Initial Anomaly & Fraud Records
export const INITIAL_ANOMALIES: AnomalyRecord[] = [
  {
    id: 'ANOM-2026-001',
    timestamp: '2026-08-27 09:14:22',
    sensorId: 'SEN-DL-04',
    corridor: 'Delhi–Gurugram Expressway',
    location: 'Kherki Daula FASTag Plaza',
    type: 'SENSOR_DEADLOCK',
    severity: 'Critical',
    observedValue: '0.00 km/h for 42 consecutive minutes (Vehicle count: 110/min)',
    expectedRange: '15 - 65 km/h',
    isolationScore: 0.94,
    description: 'Magnetic induction loop detector stuck in low voltage state; velocity report pinned at zero despite heavy passing flux.',
    remediation: 'Apply median velocity imputation (32.4 km/h) & issue remote reset signal to IoT node SEN-DL-04.',
    status: 'Flagged',
  },
  {
    id: 'ANOM-2026-002',
    timestamp: '2026-08-27 09:18:05',
    sensorId: 'SEN-MH-04',
    corridor: 'Mumbai–Pune Expressway',
    location: 'Urse Toll Plaza FASTag Loop',
    type: 'FASTAG_FRAUD',
    severity: 'High',
    observedValue: 'Vehicle Class 4 (Multi-Axle Truck) charged as Class 1 (Car/Sedan)',
    expectedRange: 'Class 4 (INR 580 Tariff)',
    isolationScore: 0.88,
    description: 'Axle counter infrared beam reported 4 axles; RFID tag transponder broadcast Car classification code.',
    remediation: 'Auto-correct vehicle dimension in Star Schema fact table & log audit discrepancy for FASTag NPCI reconciliation.',
    status: 'Flagged',
  },
  {
    id: 'ANOM-2026-003',
    timestamp: '2026-08-27 09:22:40',
    sensorId: 'SEN-KA-01',
    corridor: 'Bengaluru Outer Ring Road',
    location: 'Central Silk Board Junction',
    type: 'PHANTOM_JAM',
    severity: 'Medium',
    observedValue: 'Velocity drop from 64 km/h to 8 km/h in 4 seconds with zero physical accidents',
    expectedRange: 'Gradual deceleration curve (< 12 km/h per 10 sec)',
    isolationScore: 0.82,
    description: 'Shockwave oscillation propagation detected across upstream segment 0 to 2.4 km due to abrupt braking ripple.',
    remediation: 'Flag as dynamic phantom jam event in OLAP congestion index & trigger variable speed limit warning.',
    status: 'Flagged',
  },
  {
    id: 'ANOM-2026-004',
    timestamp: '2026-08-27 09:25:11',
    sensorId: 'SEN-SM-02',
    corridor: 'Samruddhi Mahamarg',
    location: 'Shirdi Interchange Loop',
    type: 'TELEPORTATION_VIOLATION',
    severity: 'Critical',
    observedValue: 'Vehicle Plate MH-12-XX-9912 logged at Igatpuri (KM 15) and Shirdi (KM 160) within 12 minutes (725 km/h)',
    expectedRange: 'Maximum physical speed 120 km/h (min transit time 72.5 min)',
    isolationScore: 0.99,
    description: 'Cloned FASTag transponder detected or OCR license plate duplicate match across distant toll plazas.',
    remediation: 'Quarantine fact record Traffic_Key 9142 and alert highway surveillance dispatch.',
    status: 'Flagged',
  },
];

// Master Modules metadata registry
export const MODULE_REGISTRY: ModuleMeta[] = [
  {
    id: 'olap_timelapse',
    index: 1,
    code: 'EXP-01B',
    title: 'OLAP Time-Lapse & Dynamic Slicing',
    category: 'OLAP',
    description: 'Interactive animated 24-hour time scrubber, multi-dimensional cube slicing, morphing heatmaps, and velocity trends.',
    icon: 'PlayCircle',
    badge: 'Feature B',
  },
  {
    id: 'spatial_gis',
    index: 2,
    code: 'GIS-01C',
    title: 'Indian Road Networks & Spatial GIS 3D',
    category: 'GIS & Spatial',
    description: 'Interactive GIS corridor map for Indian networks, live sensor telemetry, OpenStreetMap tiles, 3D tilt, and custom dataset upload.',
    icon: 'MapPin',
    badge: 'Feature C',
  },
  {
    id: 'anomaly_detection',
    index: 3,
    code: 'ANOM-01D',
    title: 'Telemetry Anomaly & Fraud Engine',
    category: 'Data Mining',
    description: 'Isolation Forest, Mahalanobis distance, FASTag fraud detection, and phantom jam shockwave audit workbench.',
    icon: 'ShieldAlert',
    badge: 'Feature D',
  },
  {
    id: 'xai_benchmark',
    index: 4,
    code: 'XAI-01E',
    title: 'Model Benchmark & Explainable AI (SHAP)',
    category: 'Machine Learning',
    description: 'Side-by-side battle ground comparing Naïve Bayes, Decision Tree, Random Forest & MLP with SHAP waterfall & LIME explanations.',
    icon: 'BrainCircuit',
    badge: 'Feature E',
  },
  {
    id: 'visual_sql_planner',
    index: 5,
    code: 'SQL-01F',
    title: 'Visual SQL Builder & Execution Planner',
    category: 'Database Engine',
    description: 'Drag-and-drop Star Schema SQL composer, ANSI query generator, and visual relational query execution plan tree.',
    icon: 'GitPullRequest',
    badge: 'Feature F',
  },
  {
    id: 'olap',
    index: 6,
    code: 'EXP-01',
    title: 'Classic OLAP Operations Studio',
    category: 'OLAP',
    description: 'Interactive Slice, Dice, Rollup, Drilldown, and Pivot multi-dimensional cube analysis with real-time SQL execution.',
    icon: 'Layers',
    badge: 'SQL Cube',
  },
  {
    id: 'preprocess_1',
    index: 7,
    code: 'EXP-04',
    title: 'Data Preprocessing: Stats & Cleaning',
    category: 'Preprocessing',
    description: 'Descriptive statistical analysis, null-value detection/imputation, min-max/z-score normalization, and data discretization.',
    icon: 'Sliders',
    badge: 'Stats & Prep',
  },
  {
    id: 'preprocess_2',
    index: 8,
    code: 'EXP-05',
    title: 'Transformation & Outlier Analysis',
    category: 'Preprocessing',
    description: 'Box-Cox and log transformations, Tukey IQR/Z-score outlier detection, correlation matrix heatmaps, and exploratory plotting.',
    icon: 'Flame',
    badge: 'Outlier & EDA',
  },
  {
    id: 'classification',
    index: 9,
    code: 'EXP-06',
    title: 'Naïve Bayes & Decision Tree',
    category: 'Machine Learning',
    description: 'Gaussian/Categorical Naïve Bayesian classifier & ID3/CART Decision Tree with Entropy, Gini Impurity, and interactive predictions.',
    icon: 'GitBranch',
    badge: 'Classification',
  },
  {
    id: 'clustering_kmeans',
    index: 10,
    code: 'EXP-07',
    title: 'K-Means & K-Medoids Clustering',
    category: 'Machine Learning',
    description: 'Iterative centroid relocation, PAM algorithm, Lloyd steps, Elbow Method SSE curve, and Silhouette Score analyzer.',
    icon: 'Radio',
    badge: 'Partitioning',
  },
  {
    id: 'clustering_hierarchical',
    index: 11,
    code: 'EXP-08',
    title: 'Hierarchical Clustering & Dendrogram',
    category: 'Machine Learning',
    description: 'Agglomerative clustering with Single, Complete, Average, and Ward linkage, cophenetic matrix, and interactive cutting line.',
    icon: 'Network',
    badge: 'Hierarchical',
  },
  {
    id: 'association_apriori',
    index: 12,
    code: 'EXP-09',
    title: 'Association Rules & Apriori Mining',
    category: 'Data Mining',
    description: 'Frequent Itemset generation (L_k), Association Rule mining with Support, Confidence, Lift faders, and rule network graphs.',
    icon: 'Zap',
    badge: 'Apriori',
  },
  {
    id: 'data_mining_tools',
    index: 13,
    code: 'EXP-10',
    title: 'Data Mining Tools: WEKA & R Studio',
    category: 'Data Mining',
    description: 'Tactile simulation of WEKA 3.8 Explorer (ARFF, J48, SimpleKMeans) and interactive R-Studio console executing live scripts.',
    icon: 'Terminal',
    badge: 'WEKA / R',
  },
  {
    id: 'bi_visualizer',
    index: 14,
    code: 'EXP-11',
    title: 'PowerBI & Tableau BI Canvas',
    category: 'BI & ETL',
    description: 'Drag-and-drop interactive BI dashboard with route flow heatmaps, velocity gauges, cross-slicers, and report generator.',
    icon: 'PieChart',
    badge: 'PowerBI / Tableau',
  },
  {
    id: 'web_scraper',
    index: 15,
    code: 'EXP-12',
    title: 'Web Scraping & Ingestion (Scrapy/BS4)',
    category: 'BI & ETL',
    description: 'Live highway/toll web scraper mimicking Scrapy spiders & BeautifulSoup with XPath/CSS selector tester and ETL auto-loader.',
    icon: 'Globe',
    badge: 'Scrapy & BS4',
  },
  {
    id: 'schema_workbench',
    index: 16,
    code: 'ARCH-01',
    title: 'Star Schema & SQL Workbench',
    category: 'Database Engine',
    description: 'Interactive Star Schema ER diagram, fact-dimension integrity inspector, and raw SQL query execution workbench.',
    icon: 'Database',
    badge: 'Schema & SQL',
  },
];

export const DIM_LOCATIONS = EXACT_LOCATION_DIM;
export const DIM_ROUTES = EXACT_ROUTE_DIM;
export const DIM_VEHICLES = EXACT_VEHICLE_DIM;
export const DIM_ROADS = EXACT_ROAD_DIM;
export const DIM_TIMES = EXACT_TIME_DIM;
export const FACT_ROUTE_TRAFFIC = EXTENDED_TRAFFIC_FACTS;
export const ENRICHED_TRAFFIC_FACTS = getEnrichedTrafficRecords();


