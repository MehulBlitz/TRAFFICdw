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

// 11 Master Modules metadata
export const MODULE_REGISTRY: ModuleMeta[] = [
  {
    id: 'olap',
    index: 1,
    code: 'EXP-01',
    title: 'OLAP Operations Studio',
    category: 'OLAP',
    description: 'Interactive Slice, Dice, Rollup, Drilldown, and Pivot multi-dimensional cube analysis with real-time SQL execution.',
    icon: 'Layers',
    badge: 'SQL Cube',
  },
  {
    id: 'preprocess_1',
    index: 2,
    code: 'EXP-04',
    title: 'Data Preprocessing: Stats & Cleaning',
    category: 'Preprocessing',
    description: 'Descriptive statistical analysis, null-value detection/imputation, min-max/z-score normalization, and data discretization.',
    icon: 'Sliders',
    badge: 'Stats & Prep',
  },
  {
    id: 'preprocess_2',
    index: 3,
    code: 'EXP-05',
    title: 'Transformation & Outlier Analysis',
    category: 'Preprocessing',
    description: 'Box-Cox and log transformations, Tukey IQR/Z-score outlier detection, correlation matrix heatmaps, and exploratory plotting.',
    icon: 'Flame',
    badge: 'Outlier & EDA',
  },
  {
    id: 'classification',
    index: 4,
    code: 'EXP-06',
    title: 'Naïve Bayes & Decision Tree',
    category: 'Machine Learning',
    description: 'Gaussian/Categorical Naïve Bayesian classifier & ID3/CART Decision Tree with Entropy, Gini Impurity, and interactive predictions.',
    icon: 'GitBranch',
    badge: 'Classification',
  },
  {
    id: 'clustering_kmeans',
    index: 5,
    code: 'EXP-07',
    title: 'K-Means & K-Medoids Clustering',
    category: 'Machine Learning',
    description: 'Iterative centroid relocation, PAM algorithm, Lloyd steps, Elbow Method SSE curve, and Silhouette Score analyzer.',
    icon: 'Radio',
    badge: 'Partitioning',
  },
  {
    id: 'clustering_hierarchical',
    index: 6,
    code: 'EXP-08',
    title: 'Hierarchical Clustering & Dendrogram',
    category: 'Machine Learning',
    description: 'Agglomerative clustering with Single, Complete, Average, and Ward linkage, cophenetic matrix, and interactive cutting line.',
    icon: 'Network',
    badge: 'Hierarchical',
  },
  {
    id: 'association_apriori',
    index: 7,
    code: 'EXP-09',
    title: 'Association Rules & Apriori Mining',
    category: 'Data Mining',
    description: 'Frequent Itemset generation (L_k), Association Rule mining with Support, Confidence, Lift faders, and rule network graphs.',
    icon: 'Zap',
    badge: 'Apriori',
  },
  {
    id: 'data_mining_tools',
    index: 8,
    code: 'EXP-10',
    title: 'Data Mining Tools: WEKA & R Studio',
    category: 'Data Mining',
    description: 'Tactile simulation of WEKA 3.8 Explorer (ARFF, J48, SimpleKMeans) and interactive R-Studio console executing live scripts.',
    icon: 'Terminal',
    badge: 'WEKA / R',
  },
  {
    id: 'bi_visualizer',
    index: 9,
    code: 'EXP-11',
    title: 'PowerBI & Tableau BI Canvas',
    category: 'BI & ETL',
    description: 'Drag-and-drop interactive BI dashboard with route flow heatmaps, velocity gauges, cross-slicers, and report generator.',
    icon: 'PieChart',
    badge: 'PowerBI / Tableau',
  },
  {
    id: 'web_scraper',
    index: 10,
    code: 'EXP-12',
    title: 'Web Scraping & Ingestion (Scrapy/BS4)',
    category: 'BI & ETL',
    description: 'Live highway/toll web scraper mimicking Scrapy spiders & BeautifulSoup with XPath/CSS selector tester and ETL auto-loader.',
    icon: 'Globe',
    badge: 'Scrapy & BS4',
  },
  {
    id: 'schema_workbench',
    index: 11,
    code: 'ARCH-01',
    title: 'Star Schema & SQL Workbench',
    category: 'OLAP',
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


