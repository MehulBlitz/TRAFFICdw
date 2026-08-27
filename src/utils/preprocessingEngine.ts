/**
 * Data Preprocessing & Exploration Engine
 * Covers Descriptive Analysis, Null Handling, Normalization, Discretization,
 * Transformations, and Outlier Analysis (Z-score & Tukey IQR).
 */

import { EnrichedTrafficFact, getEnrichedTrafficRecords } from '../data/trafficData';

export interface DescriptiveStats {
  column: string;
  count: number;
  mean: number;
  median: number;
  mode: number | string;
  stdDev: number;
  variance: number;
  min: number;
  max: number;
  range: number;
  q1: number;
  q3: number;
  iqr: number;
  skewness: number;
  kurtosis: number;
}

export type NormalizationType = 'min_max' | 'z_score' | 'decimal_scaling' | 'robust_scaler';
export type DiscretizationType = 'equal_width' | 'equal_frequency' | 'custom_bins';
export type TransformationType = 'log_e' | 'log_10' | 'sqrt' | 'box_cox' | 'one_hot' | 'label_encode';
export type NullImputationMethod = 'mean' | 'median' | 'mode' | 'forward_fill' | 'constant' | 'drop';
export type OutlierMethod = 'z_score' | 'tukey_iqr';

// Calculate descriptive statistics for numeric attributes
export function calculateDescriptiveStats(
  records: EnrichedTrafficFact[],
  numericFields: Array<keyof EnrichedTrafficFact> = [
    'Avg_Speed_KMPH',
    'Distance_KM',
    'Travel_Time_Min',
    'Min_Distance_Vehicles',
    'Lane_Count',
    'Hour',
  ]
): DescriptiveStats[] {
  return numericFields.map((field) => {
    const rawValues = records
      .map((r) => Number(r[field]))
      .filter((v) => !isNaN(v) && v !== null && v !== undefined);

    if (rawValues.length === 0) {
      return {
        column: String(field),
        count: 0,
        mean: 0,
        median: 0,
        mode: 0,
        stdDev: 0,
        variance: 0,
        min: 0,
        max: 0,
        range: 0,
        q1: 0,
        q3: 0,
        iqr: 0,
        skewness: 0,
        kurtosis: 0,
      };
    }

    const sorted = [...rawValues].sort((a, b) => a - b);
    const n = sorted.length;
    const sum = sorted.reduce((a, b) => a + b, 0);
    const mean = sum / n;

    // Median
    const mid = Math.floor(n / 2);
    const median = n % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

    // Mode
    const freq: Record<number, number> = {};
    sorted.forEach((v) => (freq[v] = (freq[v] || 0) + 1));
    let modeVal = sorted[0];
    let maxFreq = 0;
    Object.entries(freq).forEach(([v, f]) => {
      if (f > maxFreq) {
        maxFreq = f;
        modeVal = Number(v);
      }
    });

    // Variance & StdDev
    const variance = sorted.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / (n > 1 ? n - 1 : 1);
    const stdDev = Math.sqrt(variance);

    // Min, Max, Range
    const min = sorted[0];
    const max = sorted[n - 1];
    const range = max - min;

    // Quartiles
    const getPercentile = (p: number) => {
      const pos = (n - 1) * p;
      const base = Math.floor(pos);
      const rest = pos - base;
      if (sorted[base + 1] !== undefined) {
        return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
      }
      return sorted[base];
    };
    const q1 = getPercentile(0.25);
    const q3 = getPercentile(0.75);
    const iqr = q3 - q1;

    // Skewness & Kurtosis
    let skewSum = 0;
    let kurtSum = 0;
    sorted.forEach((v) => {
      skewSum += Math.pow((v - mean) / (stdDev || 1), 3);
      kurtSum += Math.pow((v - mean) / (stdDev || 1), 4);
    });
    const skewness = (n / ((n - 1) * (n - 2 || 1))) * skewSum;
    const kurtosis = kurtSum / n - 3;

    return {
      column: String(field),
      count: n,
      mean: Number(mean.toFixed(2)),
      median: Number(median.toFixed(2)),
      mode: Number(modeVal.toFixed(2)),
      stdDev: Number(stdDev.toFixed(2)),
      variance: Number(variance.toFixed(2)),
      min: Number(min.toFixed(2)),
      max: Number(max.toFixed(2)),
      range: Number(range.toFixed(2)),
      q1: Number(q1.toFixed(2)),
      q3: Number(q3.toFixed(2)),
      iqr: Number(iqr.toFixed(2)),
      skewness: Number(skewness.toFixed(3)),
      kurtosis: Number(kurtosis.toFixed(3)),
    };
  });
}

// Normalization functions
export function normalizeData(
  records: EnrichedTrafficFact[],
  field: keyof EnrichedTrafficFact,
  type: NormalizationType,
  minTarget = 0,
  maxTarget = 1
): { original: number[]; normalized: number[]; formula: string; explanation: string } {
  const original = records.map((r) => Number(r[field]));
  const n = original.length;
  const min = Math.min(...original);
  const max = Math.max(...original);
  const mean = original.reduce((a, b) => a + b, 0) / n;
  const stdDev = Math.sqrt(original.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / (n - 1 || 1));

  let normalized: number[] = [];
  let formula = '';
  let explanation = '';

  switch (type) {
    case 'min_max':
      formula = `v' = \\frac{v - min}{max - min} \\times (new\\_max - new\\_min) + new\\_min`;
      explanation = `Scaled linearly to the range [${minTarget}, ${maxTarget}]. Preserves exact relationships without distorting distances.`;
      normalized = original.map((v) => {
        if (max === min) return minTarget;
        return Number((((v - min) / (max - min)) * (maxTarget - minTarget) + minTarget).toFixed(4));
      });
      break;

    case 'z_score':
      formula = `z = \\frac{v - \\mu}{\\sigma} \\quad (\\mu = ${mean.toFixed(2)}, \\sigma = ${stdDev.toFixed(2)})`;
      explanation = `Transformed to standard normal distribution with mean = 0 and standard deviation = 1.`;
      normalized = original.map((v) => {
        if (stdDev === 0) return 0;
        return Number(((v - mean) / stdDev).toFixed(4));
      });
      break;

    case 'decimal_scaling': {
      const maxAbs = Math.max(...original.map((v) => Math.abs(v)));
      const j = Math.ceil(Math.log10(maxAbs || 1));
      formula = `v' = \\frac{v}{10^j} \\quad (j = ${j}, 10^j = ${Math.pow(10, j)})`;
      explanation = `Divided by $10^j$ such that maximum absolute value is $< 1.0$.`;
      normalized = original.map((v) => Number((v / Math.pow(10, j)).toFixed(4)));
      break;
    }

    case 'robust_scaler': {
      const sorted = [...original].sort((a, b) => a - b);
      const median = sorted[Math.floor(n / 2)];
      const q1 = sorted[Math.floor(n * 0.25)];
      const q3 = sorted[Math.floor(n * 0.75)];
      const iqr = q3 - q1 || 1;
      formula = `v' = \\frac{v - Median}{IQR} \\quad (Median = ${median.toFixed(2)}, IQR = ${iqr.toFixed(2)})`;
      explanation = `Robust against outliers by scaling using Median and Interquartile Range (IQR).`;
      normalized = original.map((v) => Number(((v - median) / iqr).toFixed(4)));
      break;
    }
  }

  return { original, normalized, formula, explanation };
}

// Discretization / Binning functions
export function discretizeData(
  records: EnrichedTrafficFact[],
  field: keyof EnrichedTrafficFact,
  type: DiscretizationType,
  numBins = 4,
  customCuts?: number[]
): {
  binnedValues: string[];
  bins: Array<{ label: string; min: number; max: number; count: number; percentage: number }>;
  methodSummary: string;
} {
  const original = records.map((r) => Number(r[field]));
  const n = original.length;
  const min = Math.min(...original);
  const max = Math.max(...original);

  let binIntervals: Array<{ min: number; max: number; label: string }> = [];
  let methodSummary = '';

  if (type === 'equal_width') {
    const width = (max - min) / numBins;
    methodSummary = `Equal-Width Binning: Range [${min.toFixed(1)}, ${max.toFixed(1)}] partitioned into ${numBins} uniform intervals of width ${width.toFixed(2)}.`;
    for (let i = 0; i < numBins; i++) {
      const bMin = min + i * width;
      const bMax = i === numBins - 1 ? max : min + (i + 1) * width;
      binIntervals.push({
        min: bMin,
        max: bMax,
        label: `Bin ${i + 1} [${bMin.toFixed(1)} - ${bMax.toFixed(1)}]`,
      });
    }
  } else if (type === 'equal_frequency') {
    const sorted = [...original].sort((a, b) => a - b);
    methodSummary = `Equal-Frequency (Quantile) Binning: ${numBins} intervals created with approx ${Math.round(n / numBins)} data points per bin.`;
    for (let i = 0; i < numBins; i++) {
      const startIdx = Math.floor((i * n) / numBins);
      const endIdx = i === numBins - 1 ? n - 1 : Math.floor(((i + 1) * n) / numBins) - 1;
      const bMin = sorted[startIdx];
      const bMax = sorted[endIdx];
      binIntervals.push({
        min: bMin,
        max: bMax,
        label: `Q${i + 1} [${bMin.toFixed(1)} - ${bMax.toFixed(1)}]`,
      });
    }
  } else {
    // Custom cuts
    const cuts = customCuts || [0, 30, 60, 90, 150];
    methodSummary = `Domain-Specific Custom Cuts: [${cuts.join(', ')}]`;
    for (let i = 0; i < cuts.length - 1; i++) {
      binIntervals.push({
        min: cuts[i],
        max: cuts[i + 1],
        label: `Tier ${i + 1} [${cuts[i]} - ${cuts[i + 1]}]`,
      });
    }
  }

  const counts: Record<number, number> = {};
  binIntervals.forEach((_, idx) => (counts[idx] = 0));

  const binnedValues = original.map((v) => {
    for (let i = 0; i < binIntervals.length; i++) {
      const b = binIntervals[i];
      if (v >= b.min && (i === binIntervals.length - 1 ? v <= b.max : v < b.max)) {
        counts[i] = (counts[i] || 0) + 1;
        return b.label;
      }
    }
    // Default fallback
    counts[0] = (counts[0] || 0) + 1;
    return binIntervals[0].label;
  });

  const bins = binIntervals.map((b, idx) => ({
    label: b.label,
    min: b.min,
    max: b.max,
    count: counts[idx] || 0,
    percentage: Number((((counts[idx] || 0) / n) * 100).toFixed(1)),
  }));

  return { binnedValues, bins, methodSummary };
}

// Data Transformation functions
export function transformData(
  records: EnrichedTrafficFact[],
  field: keyof EnrichedTrafficFact,
  type: TransformationType,
  lambda = 0.5
): { transformed: (number | string)[]; formula: string; interpretation: string } {
  const raw = records.map((r) => r[field]);

  switch (type) {
    case 'log_e':
      return {
        transformed: raw.map((v) => Number(Math.log(Math.max(Number(v), 0.001) + 1).toFixed(4))),
        formula: `y = \\ln(x + 1)`,
        interpretation: 'Natural logarithm transformation. Compresses right-skewed velocity/travel time distributions to approach normality.',
      };
    case 'log_10':
      return {
        transformed: raw.map((v) => Number(Math.log10(Math.max(Number(v), 0.001)).toFixed(4))),
        formula: `y = \\log_{10}(x)`,
        interpretation: 'Base-10 log transformation. Decouples exponential magnitude variances.',
      };
    case 'sqrt':
      return {
        transformed: raw.map((v) => Number(Math.sqrt(Math.max(Number(v), 0)).toFixed(4))),
        formula: `y = \\sqrt{x}`,
        interpretation: 'Square root transformation. Stabilizes variance for Poisson count distributed vehicle metrics.',
      };
    case 'box_cox':
      return {
        transformed: raw.map((v) => {
          const x = Math.max(Number(v), 0.001);
          const val = lambda === 0 ? Math.log(x) : (Math.pow(x, lambda) - 1) / lambda;
          return Number(val.toFixed(4));
        }),
        formula: lambda === 0 ? `y = \\ln(x)` : `y = \\frac{x^\\lambda - 1}{\\lambda} \\quad (\\lambda = ${lambda})`,
        interpretation: `Parametric Box-Cox power transform at optimal tuning parameter $\\lambda = ${lambda}$.`,
      };
    case 'one_hot': {
      const distinct = Array.from(new Set(raw.map((v) => String(v))));
      return {
        transformed: raw.map((v) => {
          const obj: Record<string, number> = {};
          distinct.forEach((d) => (obj[`is_${d}`] = String(v) === d ? 1 : 0));
          return JSON.stringify(obj);
        }),
        formula: `\\text{One-Hot: } [${distinct.map((d) => `is_${d}`).join(', ')}]`,
        interpretation: `Binarized ${distinct.length} distinct categorical levels into orthogonal indicator columns.`,
      };
    }
    case 'label_encode': {
      const distinct = Array.from(new Set(raw.map((v) => String(v)))).sort();
      const map = new Map(distinct.map((d, i) => [d, i]));
      return {
        transformed: raw.map((v) => map.get(String(v)) ?? 0),
        formula: `\\text{Ordinal Map: } \\{${distinct.map((d, i) => `"${d}": ${i}`).join(', ')}\\}`,
        interpretation: `Mapped categories into sequential integer rank indices [0 .. ${distinct.length - 1}].`,
      };
    }
  }
}

// Outlier detection functions
export interface OutlierAnalysisResult {
  method: OutlierMethod;
  threshold: number;
  totalRecords: number;
  outlierCount: number;
  outlierIndices: number[];
  lowerBound: number;
  upperBound: number;
  points: Array<{ index: number; value: number; isOutlier: boolean; zScore?: number; distance?: number }>;
  summary: string;
}

export function detectOutliers(
  records: EnrichedTrafficFact[],
  field: keyof EnrichedTrafficFact,
  method: OutlierMethod = 'tukey_iqr',
  threshold = 1.5 // 1.5 for IQR or 2.5/3 for Z-Score
): OutlierAnalysisResult {
  const values = records.map((r) => Number(r[field]));
  const n = values.length;
  const outlierIndices: number[] = [];

  let lowerBound = 0;
  let upperBound = 0;
  let summary = '';
  const points: OutlierAnalysisResult['points'] = [];

  if (method === 'tukey_iqr') {
    const sorted = [...values].sort((a, b) => a - b);
    const q1 = sorted[Math.floor(n * 0.25)];
    const q3 = sorted[Math.floor(n * 0.75)];
    const iqr = q3 - q1;
    lowerBound = q1 - threshold * iqr;
    upperBound = q3 + threshold * iqr;

    values.forEach((v, idx) => {
      const isOutlier = v < lowerBound || v > upperBound;
      if (isOutlier) outlierIndices.push(idx);
      points.push({
        index: idx,
        value: v,
        isOutlier,
        distance: isOutlier ? (v > upperBound ? v - upperBound : lowerBound - v) : 0,
      });
    });

    summary = `Tukey 1.5×IQR Fences: Q1 = ${q1.toFixed(1)}, Q3 = ${q3.toFixed(1)}, IQR = ${iqr.toFixed(1)}. Valid Range [${lowerBound.toFixed(2)}, ${upperBound.toFixed(2)}]. Found ${outlierIndices.length} anomalies.`;
  } else {
    // Z-Score method
    const mean = values.reduce((a, b) => a + b, 0) / n;
    const stdDev = Math.sqrt(values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / (n - 1 || 1));
    lowerBound = mean - threshold * stdDev;
    upperBound = mean + threshold * stdDev;

    values.forEach((v, idx) => {
      const z = stdDev === 0 ? 0 : Math.abs((v - mean) / stdDev);
      const isOutlier = z > threshold;
      if (isOutlier) outlierIndices.push(idx);
      points.push({
        index: idx,
        value: v,
        isOutlier,
        zScore: Number(z.toFixed(2)),
      });
    });

    summary = `Z-Score $\\pm${threshold}\\sigma$ Method: Mean = ${mean.toFixed(2)}, StdDev = ${stdDev.toFixed(2)}. Normal Band [${lowerBound.toFixed(2)}, ${upperBound.toFixed(2)}]. Identified ${outlierIndices.length} points beyond threshold.`;
  }

  return {
    method,
    threshold,
    totalRecords: n,
    outlierCount: outlierIndices.length,
    outlierIndices,
    lowerBound: Number(lowerBound.toFixed(2)),
    upperBound: Number(upperBound.toFixed(2)),
    points,
    summary,
  };
}

// Compute Correlation Matrix for bivariate exploration
export function calculateCorrelationMatrix(
  records: EnrichedTrafficFact[],
  fields: Array<keyof EnrichedTrafficFact> = ['Avg_Speed_KMPH', 'Distance_KM', 'Travel_Time_Min', 'Min_Distance_Vehicles', 'Lane_Count', 'Hour']
): { fields: string[]; matrix: number[][] } {
  const fieldNames = fields.map(String);
  const matrix: number[][] = [];

  for (let i = 0; i < fields.length; i++) {
    matrix[i] = [];
    const arrA = records.map((r) => Number(r[fields[i]]));
    const meanA = arrA.reduce((a, b) => a + b, 0) / arrA.length;

    for (let j = 0; j < fields.length; j++) {
      if (i === j) {
        matrix[i][j] = 1.0;
        continue;
      }
      const arrB = records.map((r) => Number(r[fields[j]]));
      const meanB = arrB.reduce((a, b) => a + b, 0) / arrB.length;

      let num = 0;
      let denA = 0;
      let denB = 0;
      for (let k = 0; k < arrA.length; k++) {
        const diffA = arrA[k] - meanA;
        const diffB = arrB[k] - meanB;
        num += diffA * diffB;
        denA += diffA * diffA;
        denB += diffB * diffB;
      }
      const r = denA * denB === 0 ? 0 : num / Math.sqrt(denA * denB);
      matrix[i][j] = Number(r.toFixed(3));
    }
  }

  return { fields: fieldNames, matrix };
}
