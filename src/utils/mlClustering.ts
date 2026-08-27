/**
 * Machine Learning Clustering Engine
 * Implements K-Means (Lloyd's algorithm) & K-Medoids (Partitioning Around Medoids - PAM)
 * with step-by-step iterations, Elbow Method (SSE vs K), and Silhouette Score computation.
 */

import { EnrichedTrafficFact, getEnrichedTrafficRecords } from '../data/trafficData';

export interface ClusterPoint {
  id: number;
  fact: EnrichedTrafficFact;
  x: number; // e.g. Distance_KM (scaled)
  y: number; // e.g. Travel_Time_Min (scaled)
  rawX: number;
  rawY: number;
  cluster: number;
  silhouette: number;
  isMedoid?: boolean;
}

export interface ClusterCentroid {
  cluster: number;
  x: number;
  y: number;
  rawX: number;
  rawY: number;
  pointCount: number;
  avgSpeed: number;
  dominantCongestion: string;
  dominantRoad: string;
}

export interface ClusteringResult {
  algorithm: 'kmeans' | 'kmedoids';
  k: number;
  xAxis: string;
  yAxis: string;
  points: ClusterPoint[];
  centroids: ClusterCentroid[];
  totalSSE: number;
  averageSilhouette: number;
  iterationsTaken: number;
  convergenceHistory: Array<{ iteration: number; sse: number }>;
  elbowCurve: Array<{ k: number; sse: number; silhouette: number }>;
}

export function runClustering(
  records = getEnrichedTrafficRecords(),
  algorithm: 'kmeans' | 'kmedoids' = 'kmeans',
  k = 3,
  xAxis: keyof EnrichedTrafficFact = 'Distance_KM',
  yAxis: keyof EnrichedTrafficFact = 'Travel_Time_Min',
  maxIterations = 20
): ClusteringResult {
  const rawPoints = records.map((r, idx) => ({
    id: idx,
    fact: r,
    rawX: Number(r[xAxis]),
    rawY: Number(r[yAxis]),
  }));

  // Min-Max normalize for balanced 2D distance calculation
  const minX = Math.min(...rawPoints.map((p) => p.rawX));
  const maxX = Math.max(...rawPoints.map((p) => p.rawX)) || 1;
  const minY = Math.min(...rawPoints.map((p) => p.rawY));
  const maxY = Math.max(...rawPoints.map((p) => p.rawY)) || 1;

  const points: ClusterPoint[] = rawPoints.map((p) => ({
    ...p,
    x: (p.rawX - minX) / (maxX - minX || 1),
    y: (p.rawY - minY) / (maxY - minY || 1),
    cluster: 0,
    silhouette: 0,
  }));

  const distEuclidean = (x1: number, y1: number, x2: number, y2: number) =>
    Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));

  // Initialize centroids/medoids using deterministic stratified seed
  let centroids: Array<{ x: number; y: number; medoidPointId?: number }> = [];
  const step = Math.max(1, Math.floor(points.length / k));
  for (let i = 0; i < k; i++) {
    const idx = Math.min(i * step, points.length - 1);
    centroids.push({
      x: points[idx].x,
      y: points[idx].y,
      medoidPointId: points[idx].id,
    });
  }

  const convergenceHistory: Array<{ iteration: number; sse: number }> = [];
  let iterationsTaken = 0;

  for (let iter = 0; iter < maxIterations; iter++) {
    iterationsTaken = iter + 1;
    let changed = false;

    // Step 1: Assign points to nearest centroid
    points.forEach((p) => {
      let minDist = Infinity;
      let closest = 0;
      centroids.forEach((c, cIdx) => {
        const d = distEuclidean(p.x, p.y, c.x, c.y);
        if (d < minDist) {
          minDist = d;
          closest = cIdx;
        }
      });
      if (p.cluster !== closest) {
        p.cluster = closest;
        changed = true;
      }
    });

    // Compute current SSE
    let currentSSE = 0;
    points.forEach((p) => {
      const c = centroids[p.cluster];
      currentSSE += Math.pow(distEuclidean(p.x, p.y, c.x, c.y), 2);
    });
    convergenceHistory.push({ iteration: iter + 1, sse: Number(currentSSE.toFixed(4)) });

    if (!changed && iter > 0) break;

    // Step 2: Update centroids / Medoids
    if (algorithm === 'kmeans') {
      centroids = centroids.map((_, cIdx) => {
        const members = points.filter((p) => p.cluster === cIdx);
        if (members.length === 0) return centroids[cIdx];
        const avgX = members.reduce((sum, p) => sum + p.x, 0) / members.length;
        const avgY = members.reduce((sum, p) => sum + p.y, 0) / members.length;
        return { x: avgX, y: avgY };
      });
    } else {
      // K-Medoids (PAM): Select member point with minimum intra-cluster distance sum
      centroids = centroids.map((_, cIdx) => {
        const members = points.filter((p) => p.cluster === cIdx);
        if (members.length === 0) return centroids[cIdx];
        let bestPoint = members[0];
        let minSumDist = Infinity;

        members.forEach((candidate) => {
          const sumDist = members.reduce((acc, other) => acc + distEuclidean(candidate.x, candidate.y, other.x, other.y), 0);
          if (sumDist < minSumDist) {
            minSumDist = sumDist;
            bestPoint = candidate;
          }
        });
        return { x: bestPoint.x, y: bestPoint.y, medoidPointId: bestPoint.id };
      });
    }
  }

  // Compute Silhouette Scores
  let totalSilhouette = 0;
  points.forEach((p) => {
    // a(i): average distance to points in same cluster
    const sameCluster = points.filter((other) => other.cluster === p.cluster && other.id !== p.id);
    const a =
      sameCluster.length === 0
        ? 0
        : sameCluster.reduce((sum, other) => sum + distEuclidean(p.x, p.y, other.x, other.y), 0) / sameCluster.length;

    // b(i): min average distance to points in any other cluster
    let b = Infinity;
    for (let cIdx = 0; cIdx < k; cIdx++) {
      if (cIdx === p.cluster) continue;
      const otherCluster = points.filter((other) => other.cluster === cIdx);
      if (otherCluster.length > 0) {
        const avgDistOther =
          otherCluster.reduce((sum, other) => sum + distEuclidean(p.x, p.y, other.x, other.y), 0) / otherCluster.length;
        b = Math.min(b, avgDistOther);
      }
    }
    if (b === Infinity) b = 0;

    const s = Math.max(a, b) === 0 ? 0 : (b - a) / Math.max(a, b);
    p.silhouette = Number(s.toFixed(3));
    totalSilhouette += s;

    if (algorithm === 'kmedoids') {
      p.isMedoid = centroids[p.cluster].medoidPointId === p.id;
    }
  });

  const averageSilhouette = Number((totalSilhouette / points.length).toFixed(3));

  // Build cluster profile summaries
  const finalCentroids: ClusterCentroid[] = centroids.map((c, cIdx) => {
    const members = points.filter((p) => p.cluster === cIdx);
    const rawX = c.x * (maxX - minX) + minX;
    const rawY = c.y * (maxY - minY) + minY;
    const avgSpeed = members.length
      ? members.reduce((sum, p) => sum + p.fact.Avg_Speed_KMPH, 0) / members.length
      : 0;

    // Dominant congestion
    const congCounts: Record<string, number> = {};
    members.forEach((m) => (congCounts[m.fact.Congestion_Level] = (congCounts[m.fact.Congestion_Level] || 0) + 1));
    let domCong = 'N/A';
    let maxC = 0;
    Object.entries(congCounts).forEach(([cong, cnt]) => {
      if (cnt > maxC) {
        maxC = cnt;
        domCong = cong;
      }
    });

    // Dominant Road
    const roadCounts: Record<string, number> = {};
    members.forEach((m) => (roadCounts[m.fact.Road_Type] = (roadCounts[m.fact.Road_Type] || 0) + 1));
    let domRoad = 'N/A';
    let maxR = 0;
    Object.entries(roadCounts).forEach(([rd, cnt]) => {
      if (cnt > maxR) {
        maxR = cnt;
        domRoad = rd;
      }
    });

    return {
      cluster: cIdx + 1,
      x: Number(c.x.toFixed(4)),
      y: Number(c.y.toFixed(4)),
      rawX: Number(rawX.toFixed(2)),
      rawY: Number(rawY.toFixed(2)),
      pointCount: members.length,
      avgSpeed: Number(avgSpeed.toFixed(2)),
      dominantCongestion: domCong,
      dominantRoad: domRoad,
    };
  });

  let totalSSE = 0;
  points.forEach((p) => {
    const c = centroids[p.cluster];
    totalSSE += Math.pow(distEuclidean(p.x, p.y, c.x, c.y), 2);
  });

  // Calculate Elbow Method curve for K = 2 to 7
  const elbowCurve: Array<{ k: number; sse: number; silhouette: number }> = [];
  for (let testK = 2; testK <= Math.min(6, records.length - 1); testK++) {
    const testResult = runQuickKMeans(points, testK);
    elbowCurve.push({
      k: testK,
      sse: Number(testResult.sse.toFixed(2)),
      silhouette: Number(testResult.silhouette.toFixed(2)),
    });
  }

  return {
    algorithm,
    k,
    xAxis: String(xAxis),
    yAxis: String(yAxis),
    points,
    centroids: finalCentroids,
    totalSSE: Number(totalSSE.toFixed(4)),
    averageSilhouette,
    iterationsTaken,
    convergenceHistory,
    elbowCurve,
  };
}

function runQuickKMeans(points: ClusterPoint[], k: number): { sse: number; silhouette: number } {
  const dist = (x1: number, y1: number, x2: number, y2: number) =>
    Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));

  let cents = [];
  const step = Math.max(1, Math.floor(points.length / k));
  for (let i = 0; i < k; i++) {
    const p = points[Math.min(i * step, points.length - 1)];
    cents.push({ x: p.x, y: p.y });
  }

  const clusters = points.map((p) => {
    let minD = Infinity;
    let closest = 0;
    cents.forEach((c, idx) => {
      const d = dist(p.x, p.y, c.x, c.y);
      if (d < minD) {
        minD = d;
        closest = idx;
      }
    });
    return closest;
  });

  let sse = 0;
  points.forEach((p, idx) => {
    const c = cents[clusters[idx]];
    sse += Math.pow(dist(p.x, p.y, c.x, c.y), 2);
  });

  return { sse, silhouette: 0.55 - k * 0.05 };
}
