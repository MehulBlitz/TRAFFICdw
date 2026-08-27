/**
 * Association Rule Mining - Apriori Algorithm Engine
 * Generates Candidate Itemsets (C_k), Frequent Itemsets (L_k),
 * and Strong Association Rules with Support, Confidence, and Lift metrics.
 */

import { EnrichedTrafficFact, getEnrichedTrafficRecords } from '../data/trafficData';

export interface FrequentItemset {
  items: string[];
  support: number;
  count: number;
  length: number;
}

export interface AssociationRule {
  id: string;
  antecedent: string[];
  consequent: string[];
  support: number; // P(A and B)
  confidence: number; // P(B | A) = P(A and B) / P(A)
  lift: number; // Confidence / P(B)
  conviction: number;
  leverage: number;
  interpretation: string;
}

export interface AprioriResult {
  minSupport: number;
  minConfidence: number;
  minLift: number;
  totalTransactions: number;
  frequentItemsets: FrequentItemset[];
  rules: AssociationRule[];
  summary: string;
  itemsetFrequencyDistribution: Array<{ length: number; count: number }>;
}

export function runApriori(
  records = getEnrichedTrafficRecords(),
  minSupport = 0.25,
  minConfidence = 0.6,
  minLift = 1.0
): AprioriResult {
  // Convert TrafficDW enriched facts into market-basket transaction style itemsets
  const transactions: string[][] = records.map((r) => [
    `Route:${r.Route_Name.split(' ')[0]}`,
    `City:${r.City}`,
    `Veh:${r.Vehicle_Type}`,
    `Road:${r.Road_Type}`,
    `Congestion:${r.Congestion_Level}`,
    r.Hour < 12 ? 'Time:Morning' : r.Hour < 17 ? 'Time:Afternoon' : 'Time:Evening',
    r.Avg_Speed_KMPH > 50 ? 'Speed:High' : r.Avg_Speed_KMPH > 30 ? 'Speed:Medium' : 'Speed:Low',
  ]);

  const n = transactions.length;

  // Helper to calculate support of an itemset
  const getSupport = (itemset: string[]): { support: number; count: number } => {
    let count = 0;
    transactions.forEach((tx) => {
      if (itemset.every((item) => tx.includes(item))) {
        count++;
      }
    });
    return { support: count / n, count };
  };

  // 1. Generate L1 (Frequent 1-itemsets)
  const itemCounts: Record<string, number> = {};
  transactions.forEach((tx) => {
    tx.forEach((item) => {
      itemCounts[item] = (itemCounts[item] || 0) + 1;
    });
  });

  const allFrequentItemsets: FrequentItemset[] = [];
  let currentL: string[][] = [];

  Object.entries(itemCounts).forEach(([item, cnt]) => {
    const supp = cnt / n;
    if (supp >= minSupport) {
      allFrequentItemsets.push({
        items: [item],
        support: Number(supp.toFixed(3)),
        count: cnt,
        length: 1,
      });
      currentL.push([item]);
    }
  });

  // 2. Generate L2, L3...
  let k = 2;
  while (currentL.length > 0 && k <= 3) {
    const candidates: string[][] = [];

    // Join step (L_k-1 join L_k-1)
    for (let i = 0; i < currentL.length; i++) {
      for (let j = i + 1; j < currentL.length; j++) {
        const itemsetA = currentL[i];
        const itemsetB = currentL[j];
        const combined = Array.from(new Set([...itemsetA, ...itemsetB])).sort();
        if (combined.length === k) {
          if (!candidates.some((c) => c.every((it, idx) => it === combined[idx]))) {
            candidates.push(combined);
          }
        }
      }
    }

    // Prune step
    const nextL: string[][] = [];
    candidates.forEach((cand) => {
      const { support, count } = getSupport(cand);
      if (support >= minSupport) {
        allFrequentItemsets.push({
          items: cand,
          support: Number(support.toFixed(3)),
          count,
          length: k,
        });
        nextL.push(cand);
      }
    });

    currentL = nextL;
    k++;
  }

  // 3. Generate Association Rules from Itemsets of length >= 2
  const rules: AssociationRule[] = [];
  let ruleId = 1;

  allFrequentItemsets
    .filter((fis) => fis.length >= 2)
    .forEach((fis) => {
      const items = fis.items;
      const suppAB = fis.support;

      // Generate single consequent rules (X -> Y)
      for (let i = 0; i < items.length; i++) {
        const consequent = [items[i]];
        const antecedent = items.filter((_, idx) => idx !== i);

        const suppA = getSupport(antecedent).support;
        const suppB = getSupport(consequent).support;

        if (suppA === 0 || suppB === 0) continue;

        const confidence = suppAB / suppA;
        const lift = confidence / suppB;
        const leverage = suppAB - suppA * suppB;
        const conviction = 1 - confidence === 0 ? 999 : (1 - suppB) / (1 - confidence);

        if (confidence >= minConfidence && lift >= minLift) {
          rules.push({
            id: `rule-${ruleId++}`,
            antecedent,
            consequent,
            support: Number(suppAB.toFixed(3)),
            confidence: Number(confidence.toFixed(3)),
            lift: Number(lift.toFixed(2)),
            leverage: Number(leverage.toFixed(3)),
            conviction: Number(Math.min(conviction, 99).toFixed(2)),
            interpretation: `IF {${antecedent.join(', ')}} THEN {${consequent.join(', ')}} with ${(confidence * 100).toFixed(0)}% confidence (${lift.toFixed(1)}x baseline likelihood).`,
          });
        }
      }
    });

  // Frequency distribution by itemset length
  const itemsetFrequencyDistribution = [1, 2, 3].map((len) => ({
    length: len,
    count: allFrequentItemsets.filter((fis) => fis.length === len).length,
  }));

  const summary = `Apriori Mining Complete: Identified ${allFrequentItemsets.length} frequent itemsets (minSup=${(minSupport * 100).toFixed(0)}%) and mined ${rules.length} strong association rules (minConf=${(minConfidence * 100).toFixed(0)}%, minLift=${minLift.toFixed(1)}).`;

  return {
    minSupport,
    minConfidence,
    minLift,
    totalTransactions: n,
    frequentItemsets: allFrequentItemsets.sort((a, b) => b.support - a.support),
    rules: rules.sort((a, b) => b.lift - a.lift),
    summary,
    itemsetFrequencyDistribution,
  };
}
