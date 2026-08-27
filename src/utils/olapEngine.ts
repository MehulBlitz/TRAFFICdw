/**
 * OLAP Engine for TrafficDW
 * Implements Slice, Dice, Rollup, Drilldown, and Pivot multi-dimensional operations
 * with live SQL generator matching the exact MySQL schema.
 */

import { EnrichedTrafficFact, getEnrichedTrafficRecords } from '../data/trafficData';

export type OlapOperation = 'slice' | 'dice' | 'rollup' | 'drilldown' | 'pivot' | 'cube';

export interface SliceConfig {
  dimension: 'City' | 'Vehicle_Type' | 'Road_Type' | 'Congestion_Level' | 'Day' | 'Month';
  value: string;
}

export interface DiceConfig {
  cities: string[];
  vehicleTypes: string[];
  congestionLevels: string[];
  roadTypes: string[];
}

export interface RollupDrilldownConfig {
  hierarchy: 'geographic' | 'temporal' | 'transport';
  level: number; // 0 to max depth
}

export interface PivotConfig {
  rowDimension: 'Route_Name' | 'City' | 'Vehicle_Type' | 'Road_Type' | 'Month';
  colDimension: 'Congestion_Level' | 'Vehicle_Category' | 'Day' | 'Road_Type';
  metric: 'Avg_Speed_KMPH' | 'Travel_Time_Min' | 'Distance_KM' | 'Min_Distance_Vehicles';
  aggregation: 'AVG' | 'SUM' | 'COUNT' | 'MIN' | 'MAX';
}

export interface OlapResult {
  operation: OlapOperation;
  title: string;
  summary: string;
  sqlQuery: string;
  records: EnrichedTrafficFact[];
  aggregatedData?: Array<Record<string, unknown>>;
  pivotGrid?: {
    rows: string[];
    cols: string[];
    values: Record<string, Record<string, number | null>>;
    rowTotals: Record<string, number>;
    colTotals: Record<string, number>;
    grandTotal: number;
  };
}

export const HIERARCHIES = {
  geographic: {
    name: 'Geographic Hierarchy',
    levels: ['State', 'City', 'Location_Name'],
  },
  temporal: {
    name: 'Temporal Hierarchy',
    levels: ['Year', 'Quarter', 'Month', 'Day', 'Hour'],
  },
  transport: {
    name: 'Transport Hierarchy',
    levels: ['Vehicle_Category', 'Vehicle_Type'],
  },
};

export function executeSlice(config: SliceConfig, facts = getEnrichedTrafficRecords()): OlapResult {
  const filtered = facts.filter((f) => {
    const val = f[config.dimension as keyof EnrichedTrafficFact];
    return String(val).toLowerCase() === String(config.value).toLowerCase();
  });

  const sqlQuery = `SELECT 
  f.Traffic_Key, r.Route_Name, l.Location_Name, l.City,
  v.Vehicle_Type, rd.Road_Name, t.Date, t.Hour,
  f.Congestion_Level, f.Distance_KM, f.Travel_Time_Min, f.Avg_Speed_KMPH
FROM Route_Traffic_Fact f
JOIN Route_Dim r ON f.Route_Key = r.Route_Key
JOIN Location_Dim l ON f.Location_Key = l.Location_Key
JOIN Vehicle_Dim v ON f.Vehicle_Key = v.Vehicle_Key
JOIN Road_Dim rd ON f.Road_Key = rd.Road_Key
JOIN Time_Dim t ON f.Time_Key = t.Time_Key
WHERE ${getSqlColumnForDim(config.dimension)} = '${config.value}';`;

  return {
    operation: 'slice',
    title: `OLAP Slice: ${config.dimension} = "${config.value}"`,
    summary: `Isolated a 2D slice from the TrafficDW hypercube along the '${config.dimension}' dimension with condition '${config.value}'. Returned ${filtered.length} matching fact rows.`,
    sqlQuery,
    records: filtered,
  };
}

export function executeDice(config: DiceConfig, facts = getEnrichedTrafficRecords()): OlapResult {
  const filtered = facts.filter((f) => {
    const matchCity = config.cities.length === 0 || config.cities.includes(f.City);
    const matchVeh = config.vehicleTypes.length === 0 || config.vehicleTypes.includes(f.Vehicle_Type);
    const matchCong = config.congestionLevels.length === 0 || config.congestionLevels.includes(f.Congestion_Level);
    const matchRoad = config.roadTypes.length === 0 || config.roadTypes.includes(f.Road_Type);
    return matchCity && matchVeh && matchCong && matchRoad;
  });

  const whereClauses: string[] = [];
  if (config.cities.length) whereClauses.push(`l.City IN (${config.cities.map((c) => `'${c}'`).join(', ')})`);
  if (config.vehicleTypes.length) whereClauses.push(`v.Vehicle_Type IN (${config.vehicleTypes.map((v) => `'${v}'`).join(', ')})`);
  if (config.congestionLevels.length) whereClauses.push(`f.Congestion_Level IN (${config.congestionLevels.map((cg) => `'${cg}'`).join(', ')})`);
  if (config.roadTypes.length) whereClauses.push(`rd.Road_Type IN (${config.roadTypes.map((r) => `'${r}'`).join(', ')})`);

  const sqlQuery = `SELECT 
  f.Traffic_Key, r.Route_Name, l.City, v.Vehicle_Type, rd.Road_Type,
  f.Congestion_Level, f.Distance_KM, f.Travel_Time_Min, f.Avg_Speed_KMPH
FROM Route_Traffic_Fact f
JOIN Location_Dim l ON f.Location_Key = l.Location_Key
JOIN Vehicle_Dim v ON f.Vehicle_Key = v.Vehicle_Key
JOIN Road_Dim rd ON f.Road_Key = rd.Road_Key
JOIN Route_Dim r ON f.Route_Key = r.Route_Key
${whereClauses.length ? 'WHERE ' + whereClauses.join('\n  AND ') : ''};`;

  return {
    operation: 'dice',
    title: `OLAP Dice: Multi-Dimensional Sub-Cube`,
    summary: `Extracted a sub-cube bounding ${config.cities.join('/') || 'All Cities'}, ${config.vehicleTypes.join('/') || 'All Vehicles'}, and ${config.congestionLevels.join('/') || 'All Congestion'}. Returned ${filtered.length} fact rows.`,
    sqlQuery,
    records: filtered,
  };
}

export function executeRollupDrilldown(
  isRollup: boolean,
  hierarchyKey: 'geographic' | 'temporal' | 'transport',
  levelIndex: number,
  facts = getEnrichedTrafficRecords()
): OlapResult {
  const hierarchy = HIERARCHIES[hierarchyKey];
  const activeLevel = hierarchy.levels[Math.min(levelIndex, hierarchy.levels.length - 1)];

  // Group by the target level
  const groups: Record<string, { count: number; totalSpeed: number; totalTravel: number; totalDistance: number }> = {};

  facts.forEach((f) => {
    const key = String(f[activeLevel as keyof EnrichedTrafficFact] ?? 'Unknown');
    if (!groups[key]) {
      groups[key] = { count: 0, totalSpeed: 0, totalTravel: 0, totalDistance: 0 };
    }
    groups[key].count += 1;
    groups[key].totalSpeed += f.Avg_Speed_KMPH;
    groups[key].totalTravel += f.Travel_Time_Min;
    groups[key].totalDistance += f.Distance_KM;
  });

  const aggregatedData = Object.entries(groups).map(([groupKey, stats]) => ({
    [activeLevel]: groupKey,
    Record_Count: stats.count,
    Avg_Speed_KMPH: Number((stats.totalSpeed / stats.count).toFixed(2)),
    Avg_Travel_Time_Min: Number((stats.totalTravel / stats.count).toFixed(2)),
    Total_Distance_KM: Number(stats.totalDistance.toFixed(2)),
  }));

  const opName = isRollup ? 'Rollup (Generalization)' : 'Drilldown (Specialization)';
  const sqlQuery = `-- OLAP ${opName} along ${hierarchy.name} to level: [${activeLevel}]
SELECT 
  ${activeLevel},
  COUNT(*) AS Record_Count,
  ROUND(AVG(f.Avg_Speed_KMPH), 2) AS Avg_Speed_KMPH,
  ROUND(AVG(f.Travel_Time_Min), 2) AS Avg_Travel_Time_Min,
  ROUND(SUM(f.Distance_KM), 2) AS Total_Distance_KM
FROM Route_Traffic_Fact f
JOIN Location_Dim l ON f.Location_Key = l.Location_Key
JOIN Route_Dim r ON f.Route_Key = r.Route_Key
JOIN Vehicle_Dim v ON f.Vehicle_Key = v.Vehicle_Key
JOIN Road_Dim rd ON f.Road_Key = rd.Road_Key
JOIN Time_Dim t ON f.Time_Key = t.Time_Key
GROUP BY ${activeLevel} WITH ROLLUP;`;

  return {
    operation: isRollup ? 'rollup' : 'drilldown',
    title: `OLAP ${opName}: Hierarchy Level [${activeLevel}]`,
    summary: `${isRollup ? 'Aggregated upwards' : 'Navigated downwards'} the ${hierarchy.name} hierarchy. Grouping at level "${activeLevel}" resulting in ${aggregatedData.length} summary categories.`,
    sqlQuery,
    records: facts,
    aggregatedData,
  };
}

export function executePivot(config: PivotConfig, facts = getEnrichedTrafficRecords()): OlapResult {
  const rowValues = Array.from(new Set(facts.map((f) => String(f[config.rowDimension as keyof EnrichedTrafficFact]))));
  const colValues = Array.from(new Set(facts.map((f) => String(f[config.colDimension as keyof EnrichedTrafficFact]))));

  const values: Record<string, Record<string, number | null>> = {};
  const rowTotals: Record<string, number> = {};
  const colTotals: Record<string, number> = {};
  let grandTotal = 0;
  let totalCount = 0;

  rowValues.forEach((r) => {
    values[r] = {};
    let rSum = 0;
    let rCount = 0;

    colValues.forEach((c) => {
      const cellFacts = facts.filter(
        (f) =>
          String(f[config.rowDimension as keyof EnrichedTrafficFact]) === r &&
          String(f[config.colDimension as keyof EnrichedTrafficFact]) === c
      );

      if (cellFacts.length === 0) {
        values[r][c] = null;
      } else {
        const sum = cellFacts.reduce((acc, curr) => acc + curr[config.metric], 0);
        let val = sum;
        if (config.aggregation === 'AVG') val = sum / cellFacts.length;
        if (config.aggregation === 'COUNT') val = cellFacts.length;
        if (config.aggregation === 'MIN') val = Math.min(...cellFacts.map((cf) => cf[config.metric]));
        if (config.aggregation === 'MAX') val = Math.max(...cellFacts.map((cf) => cf[config.metric]));

        const finalVal = Number(val.toFixed(2));
        values[r][c] = finalVal;
        rSum += finalVal;
        rCount++;

        colTotals[c] = (colTotals[c] || 0) + finalVal;
        grandTotal += finalVal;
        totalCount++;
      }
    });

    rowTotals[r] = Number((config.aggregation === 'AVG' && rCount ? rSum / rCount : rSum).toFixed(2));
  });

  // Normalize col totals if AVG
  if (config.aggregation === 'AVG') {
    colValues.forEach((c) => {
      let count = 0;
      let sum = 0;
      rowValues.forEach((r) => {
        if (values[r][c] !== null) {
          sum += values[r][c]!;
          count++;
        }
      });
      colTotals[c] = count ? Number((sum / count).toFixed(2)) : 0;
    });
    grandTotal = totalCount ? Number((grandTotal / totalCount).toFixed(2)) : 0;
  }

  const sqlCasePivot = colValues
    .map(
      (c) =>
        `  ${config.aggregation}(CASE WHEN ${getSqlColumnForDim(config.colDimension)} = '${c}' THEN f.${config.metric} ELSE NULL END) AS \`${c}\``
    )
    .join(',\n');

  const sqlQuery = `-- OLAP Cross-Tabulation Pivot: ${config.rowDimension} vs ${config.colDimension}
SELECT 
  ${getSqlColumnForDim(config.rowDimension)} AS \`${config.rowDimension}\`,
${sqlCasePivot}
FROM Route_Traffic_Fact f
JOIN Location_Dim l ON f.Location_Key = l.Location_Key
JOIN Route_Dim r ON f.Route_Key = r.Route_Key
JOIN Vehicle_Dim v ON f.Vehicle_Key = v.Vehicle_Key
JOIN Road_Dim rd ON f.Road_Key = rd.Road_Key
JOIN Time_Dim t ON f.Time_Key = t.Time_Key
GROUP BY ${getSqlColumnForDim(config.rowDimension)};`;

  return {
    operation: 'pivot',
    title: `OLAP Pivot: ${config.rowDimension} × ${config.colDimension}`,
    summary: `Rotated axes to view ${config.metric} (${config.aggregation}) across ${rowValues.length} rows and ${colValues.length} columns.`,
    sqlQuery,
    records: facts,
    pivotGrid: {
      rows: rowValues,
      cols: colValues,
      values,
      rowTotals,
      colTotals,
      grandTotal: Number(grandTotal.toFixed(2)),
    },
  };
}

function getSqlColumnForDim(dim: string): string {
  switch (dim) {
    case 'City':
      return 'l.City';
    case 'Location_Name':
      return 'l.Location_Name';
    case 'State':
      return 'l.State';
    case 'Route_Name':
      return 'r.Route_Name';
    case 'Vehicle_Type':
      return 'v.Vehicle_Type';
    case 'Vehicle_Category':
      return 'v.Vehicle_Category';
    case 'Road_Type':
      return 'rd.Road_Type';
    case 'Road_Name':
      return 'rd.Road_Name';
    case 'Congestion_Level':
      return 'f.Congestion_Level';
    case 'Month':
      return 't.Month';
    case 'Day':
      return 't.Day';
    case 'Quarter':
      return 't.Quarter';
    case 'Year':
      return 't.Year';
    case 'Hour':
      return 't.Hour';
    default:
      return dim;
  }
}
