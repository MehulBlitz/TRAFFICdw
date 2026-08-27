/**
 * TrafficDW Studio - Visual SQL Query Builder & Execution Planner Engine
 * Translates visual dimension & measure choices into optimized ANSI SQL-99
 * and renders a relational query execution plan tree with cost heuristics.
 */

import { ExecutionPlanNode } from '../types/trafficDW';

export interface VisualQueryState {
  dimensions: string[];
  measures: { column: string; agg: 'SUM' | 'AVG' | 'COUNT' | 'MIN' | 'MAX'; alias: string }[];
  filters: { column: string; operator: '=' | '>' | '<' | 'IN' | 'BETWEEN'; value: string }[];
  groupByType: 'STANDARD' | 'ROLLUP' | 'CUBE' | 'GROUPING_SETS';
  havingClause?: string;
  orderByColumn: string;
  orderDirection: 'ASC' | 'DESC';
  limit: number;
}

export function generateAnsiSql(state: VisualQueryState): string {
  const selectItems: string[] = [];

  // Add dimensions
  state.dimensions.forEach((dim) => {
    selectItems.push(`  d.${dim}`);
  });

  // Add aggregated measures
  state.measures.forEach((m) => {
    selectItems.push(`  ${m.agg}(f.${m.column}) AS ${m.alias}`);
  });

  const selectClause = selectItems.join(',\n');

  // From and Join clauses
  const fromClause = `FROM\n  Route_Traffic_Fact f\n  JOIN Route_Dim r ON f.Route_Key = r.Route_Key\n  JOIN Location_Dim l ON f.Location_Key = l.Location_Key\n  JOIN Road_Dim rd ON f.Road_Key = rd.Road_Key\n  JOIN Vehicle_Dim v ON f.Vehicle_Key = v.Vehicle_Key\n  JOIN Time_Dim t ON f.Time_Key = t.Time_Key`;

  // Where clause
  const whereClauses: string[] = [];
  state.filters.forEach((f) => {
    if (f.operator === 'BETWEEN') {
      whereClauses.push(`  ${f.column} BETWEEN ${f.value}`);
    } else if (f.operator === 'IN') {
      whereClauses.push(`  ${f.column} IN (${f.value})`);
    } else {
      whereClauses.push(`  ${f.column} ${f.operator} '${f.value}'`);
    }
  });
  const whereClause = whereClauses.length > 0 ? `WHERE\n${whereClauses.join(' AND\n')}` : '';

  // Group By clause
  let groupByClause = '';
  if (state.dimensions.length > 0) {
    if (state.groupByType === 'ROLLUP') {
      groupByClause = `GROUP BY ROLLUP (${state.dimensions.map((d) => `d.${d}`).join(', ')})`;
    } else if (state.groupByType === 'CUBE') {
      groupByClause = `GROUP BY CUBE (${state.dimensions.map((d) => `d.${d}`).join(', ')})`;
    } else if (state.groupByType === 'GROUPING_SETS') {
      groupByClause = `GROUP BY GROUPING SETS ((${state.dimensions.map((d) => `d.${d}`).join(', ')}), ())`;
    } else {
      groupByClause = `GROUP BY ${state.dimensions.map((d) => `d.${d}`).join(', ')}`;
    }
  }

  // Order By
  const orderByClause = state.orderByColumn ? `ORDER BY ${state.orderByColumn} ${state.orderDirection}` : '';
  const limitClause = `LIMIT ${state.limit}`;

  return [
    'SELECT',
    selectClause,
    fromClause,
    whereClause,
    groupByClause,
    state.havingClause ? `HAVING ${state.havingClause}` : '',
    orderByClause,
    limitClause,
  ]
    .filter(Boolean)
    .join('\n');
}

export function generateExecutionPlan(state: VisualQueryState): ExecutionPlanNode {
  const rowEstimate = Math.max(12, Math.floor(45000 / (state.dimensions.length * 2 || 1)));
  const totalCost = Number((142.5 + state.dimensions.length * 48.2 + state.measures.length * 15.0).toFixed(2));

  return {
    id: 'node-limit',
    nodeType: 'Limit',
    startupCost: 12.5,
    totalCost,
    planRows: state.limit,
    planWidth: 64,
    actualStartupTimeMs: 0.12,
    actualTotalTimeMs: 1.45,
    actualRows: state.limit,
    subNodes: [
      {
        id: 'node-sort',
        nodeType: 'Sort',
        startupCost: 85.0,
        totalCost: totalCost - 5,
        planRows: rowEstimate,
        planWidth: 64,
        actualStartupTimeMs: 0.95,
        actualTotalTimeMs: 1.35,
        actualRows: rowEstimate,
        filter: `Sort Key: ${state.orderByColumn || 'f.Traffic_Key'} ${state.orderDirection}`,
        subNodes: [
          {
            id: 'node-aggregate',
            nodeType: state.groupByType === 'ROLLUP' ? 'Mixed Aggregate (ROLLUP)' : 'HashAggregate',
            startupCost: 52.0,
            totalCost: totalCost - 25,
            planRows: rowEstimate,
            planWidth: 64,
            actualStartupTimeMs: 0.65,
            actualTotalTimeMs: 0.98,
            actualRows: rowEstimate,
            filter: `Group Key: ${state.dimensions.join(', ') || 'Global Aggregate'}`,
            subNodes: [
              {
                id: 'node-hash-join-route',
                nodeType: 'Hash Join',
                startupCost: 28.0,
                totalCost: 110.5,
                planRows: 45000,
                planWidth: 128,
                joinCondition: 'f.Route_Key = r.Route_Key',
                subNodes: [
                  {
                    id: 'node-fact-scan',
                    nodeType: 'Bitmap Heap Scan',
                    relationName: 'Route_Traffic_Fact f',
                    startupCost: 4.5,
                    totalCost: 65.2,
                    planRows: 45000,
                    planWidth: 64,
                    filter: state.filters.length > 0 ? state.filters.map((f) => `${f.column} ${f.operator} '${f.value}'`).join(' AND ') : undefined,
                    subNodes: [
                      {
                        id: 'node-index-scan',
                        nodeType: 'Bitmap Index Scan',
                        indexName: 'idx_traffic_fact_star_composite',
                        startupCost: 0.0,
                        totalCost: 4.5,
                        planRows: 45000,
                        planWidth: 0,
                      },
                    ],
                  },
                  {
                    id: 'node-dim-route-scan',
                    nodeType: 'Seq Scan',
                    relationName: 'Route_Dim r',
                    startupCost: 0.0,
                    totalCost: 1.25,
                    planRows: 7,
                    planWidth: 48,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };
}
