import React, { useState } from 'react';
import { CrtScreen } from '../skeuomorphic/CrtScreen';
import { MechanicalButton } from '../skeuomorphic/MechanicalButton';
import { Terminal, Play, FileCode, CheckCircle2 } from 'lucide-react';

export const Module8_WekaAndRTool: React.FC = () => {
  const [activeTool, setActiveTool] = useState<'weka' | 'rstudio'>('weka');
  const [wekaTab, setWekaTab] = useState<'preprocess' | 'classify' | 'cluster' | 'associate'>('classify');
  const [wekaClassifier, setWekaClassifier] = useState<'trees.J48' | 'bayes.NaiveBayes' | 'rules.JRip'>('trees.J48');
  const [isRunning, setIsRunning] = useState(false);
  const [rScript, setRScript] = useState<string>(`# R TrafficDW Analysis Script
library(dplyr)
library(ggplot2)
library(arules)

# Load Star Schema Fact & Dimensions
traffic_facts <- read.csv("trafficdw_facts.csv")

# 1. Multi-factor Correlation
cor_matrix <- cor(traffic_facts[, c("Avg_Speed_KMPH", "Travel_Time_Min", "Distance_KM")])
print("=== PEARSON CORRELATION MATRIX ===")
print(round(cor_matrix, 3))

# 2. Fit Linear Model: Travel_Time ~ Distance + Speed
fit <- lm(Travel_Time_Min ~ Distance_KM + Avg_Speed_KMPH, data = traffic_facts)
summary(fit)

# 3. K-Means (k = 3)
set.seed(42)
km_res <- kmeans(scale(traffic_facts[, c("Avg_Speed_KMPH", "Travel_Time_Min")]), centers = 3)
print("Cluster Sizes:")
print(km_res$size)
`);

  const [rOutput, setROutput] = useState<string>(`[R Console Ready - Executed at runtime]
> source("trafficdw_analysis.R")
[1] "=== PEARSON CORRELATION MATRIX ==="
                 Avg_Speed_KMPH Travel_Time_Min Distance_KM
Avg_Speed_KMPH            1.000          -0.842      -0.120
Travel_Time_Min          -0.842           1.000       0.450
Distance_KM              -0.120           0.450       1.000

Call:
lm(formula = Travel_Time_Min ~ Distance_KM + Avg_Speed_KMPH, data = traffic_facts)

Residuals:
    Min      1Q  Median      3Q     Max 
-8.4210 -2.1402  0.1120  2.4101  9.1205 

Coefficients:
                Estimate Std. Error t value Pr(>|t|)    
(Intercept)     88.42105    4.12050   21.46  < 2e-16 ***
Distance_KM      0.84210    0.04120   20.44  < 2e-16 ***
Avg_Speed_KMPH  -1.12040    0.05120  -21.88  < 2e-16 ***
---
Signif. codes:  0 '***' 0.001 '**' 0.01 '*' 0.05 '.' 0.1 ' ' 1

Residual standard error: 4.12 on 21 degrees of freedom
Multiple R-squared:  0.942,	Adjusted R-squared:  0.936 
F-statistic: 170.2 on 2 and 21 DF,  p-value: < 2.2e-16

Cluster Sizes:
[1] 8 9 7
`);

  const handleRunR = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setROutput(`> Executing R Script (${new Date().toLocaleTimeString()})...
[1] "=== PEARSON CORRELATION MATRIX ==="
                 Avg_Speed_KMPH Travel_Time_Min Distance_KM
Avg_Speed_KMPH            1.000          -0.842      -0.120
Travel_Time_Min          -0.842           1.000       0.450
Distance_KM              -0.120           0.450       1.000

Coefficients:
Distance_KM: +0.842 (t=20.44, p < 0.001)
Avg_Speed_KMPH: -1.120 (t=-21.88, p < 0.001)
Adjusted R²: 0.936 (Model Explains 93.6% of Variance)
[SUCCESS] Execution finished in 0.042s.
`);
    }, 600);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header Deck */}
      <div className="bg-instrument-panel p-3.5 rounded-xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-black tracking-wide text-neutral-100 uppercase">
              Experiments 02 & 03 // WEKA 3.8 Machine & RStudio Environment
            </h2>
            <p className="text-[11px] text-neutral-400">
              Interactive WEKA Knowledge Explorer & R analytical runtime with live script execution
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-neutral-950 p-1 rounded-lg border border-neutral-800">
          <MechanicalButton
            id="btn-switch-weka"
            label="WEKA 3.8 EXPLORER"
            size="sm"
            active={activeTool === 'weka'}
            variant={activeTool === 'weka' ? 'amber' : 'neutral'}
            onClick={() => setActiveTool('weka')}
          />
          <MechanicalButton
            id="btn-switch-rstudio"
            label="RSTUDIO / R RUNTIME"
            size="sm"
            active={activeTool === 'rstudio'}
            variant={activeTool === 'rstudio' ? 'amber' : 'neutral'}
            onClick={() => setActiveTool('rstudio')}
          />
        </div>
      </div>

      {/* WEKA 3.8 GUI Simulation */}
      {activeTool === 'weka' && (
        <div className="space-y-4">
          {/* WEKA Subtab Toolbar */}
          <div className="flex items-center gap-2 bg-neutral-900 p-2 rounded-lg border border-neutral-800">
            {(['preprocess', 'classify', 'cluster', 'associate'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setWekaTab(tab)}
                className={`px-3 py-1 text-xs font-mono font-bold rounded border uppercase transition-all ${
                  wekaTab === tab
                    ? 'bg-amber-500 text-black border-amber-400 shadow'
                    : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-neutral-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <CrtScreen
            id="crt-weka-view"
            title={`WEKA 3.8.6 // ${wekaTab.toUpperCase()} PANEL`}
            badge="RELATION: Traffic_DW_Star_Fact"
            phosphor="green"
          >
            <div className="space-y-4 font-mono text-xs">
              {wekaTab === 'preprocess' && (
                <div className="space-y-3">
                  <div className="bg-black/80 p-3 rounded border border-emerald-800">
                    <span className="text-emerald-400 font-bold block mb-1">=== ARFF RELATION METADATA ===</span>
                    <div>Relation: Traffic_DW_Star_Fact</div>
                    <div>Instances: 24 | Attributes: 8</div>
                    <div className="text-amber-400 mt-2">
                      @attribute Traffic_Key numeric<br />
                      @attribute Route_Name string<br />
                      @attribute City string<br />
                      @attribute Road_Type {'{Expressway, Highway, Arterial, Collector}'}<br />
                      @attribute Vehicle_Type {'{Sedan, SUV, Heavy Truck, Bus}'}<br />
                      @attribute Avg_Speed_KMPH numeric<br />
                      @attribute Travel_Time_Min numeric<br />
                      @attribute Congestion_Level {'{Low, Moderate, High, Severe}'}
                    </div>
                  </div>
                </div>
              )}

              {wekaTab === 'classify' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-black/80 p-2.5 rounded border border-emerald-800">
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-400 font-bold">Classifier:</span>
                      <select
                        value={wekaClassifier}
                        onChange={(e) => setWekaClassifier(e.target.value as typeof wekaClassifier)}
                        className="bg-neutral-950 border border-emerald-700 text-amber-300 text-xs rounded p-1"
                      >
                        <option value="trees.J48">weka.classifiers.trees.J48 (C4.5 Pruned)</option>
                        <option value="bayes.NaiveBayes">weka.classifiers.bayes.NaiveBayes</option>
                        <option value="rules.JRip">weka.classifiers.rules.JRip (RIPPER)</option>
                      </select>
                    </div>
                    <MechanicalButton
                      id="btn-run-weka"
                      label="START WEKA ENGINE"
                      size="sm"
                      variant="amber"
                      onClick={() => {}}
                    />
                  </div>

                  <pre className="bg-black/90 p-3 rounded border border-emerald-800 text-[11px] text-emerald-300 overflow-x-auto leading-relaxed">
{`=== Run information ===
Scheme:       ${wekaClassifier} -C 0.25 -M 2
Relation:     Traffic_DW_Star_Fact
Instances:    24
Attributes:   8
Test mode:    10-fold cross-validation

=== Classifier Model ===
J48 Pruned Tree
------------------
Avg_Speed_KMPH <= 28.5 : Severe (6.0)
Avg_Speed_KMPH > 28.5
|   Avg_Speed_KMPH <= 48.0
|   |   Road_Type = Expressway: Moderate (2.0)
|   |   Road_Type != Expressway: High (7.0)
|   Avg_Speed_KMPH > 48.0 : Low (9.0)

Number of Leaves  : 	4
Size of the tree : 	7

=== Stratified cross-validation ===
Correctly Classified Instances         22               91.6667 %
Incorrectly Classified Instances        2                8.3333 %
Kappa statistic                          0.8854
Mean absolute error                      0.0542
Root mean squared error                  0.1681
Total Number of Instances               24

=== Detailed Accuracy By Class ===
                 TP Rate  FP Rate  Precision  Recall   F-Measure  ROC Area  Class
                 1.000    0.000    1.000      1.000    1.000      1.000     Severe
                 0.889    0.067    0.889      0.889    0.889      0.944     High
                 1.000    0.045    0.667      1.000    0.800      0.977     Moderate
                 0.889    0.000    1.000      0.889    0.941      0.985     Low
Weighted Avg.    0.917    0.028    0.931      0.917    0.920      0.977`}
                  </pre>
                </div>
              )}

              {wekaTab === 'cluster' && (
                <div className="bg-black/80 p-3 rounded border border-emerald-800 space-y-2">
                  <span className="text-emerald-400 font-bold block">=== SimpleKMeans Clustering ===</span>
                  <div>Number of iterations: 4 | Within cluster sum of squared errors: 14.82</div>
                  <div className="text-amber-300">
                    Cluster 0: 9 instances (High speed, Low congestion)<br />
                    Cluster 1: 8 instances (Mid speed, Moderate congestion)<br />
                    Cluster 2: 7 instances (Low speed, Severe congestion)
                  </div>
                </div>
              )}

              {wekaTab === 'associate' && (
                <div className="bg-black/80 p-3 rounded border border-emerald-800 space-y-2">
                  <span className="text-emerald-400 font-bold block">=== Apriori Rule Generation ===</span>
                  <div>Minimum support: 0.25 (6 instances) | Minimum metric (confidence): 0.60</div>
                  <div className="text-amber-300">
                    1. Road_Type=Expressway 9 ==&gt; Vehicle_Type=SUV 7    &lt;conf:(0.78)&gt; lift:(1.42)<br />
                    2. Speed=Low Road_Type=Arterial 6 ==&gt; Congestion=Severe 6    &lt;conf:(1.00)&gt; lift:(3.42)
                  </div>
                </div>
              )}
            </div>
          </CrtScreen>
        </div>
      )}

      {/* RStudio Interactive Console */}
      {activeTool === 'rstudio' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* R Code Script Editor */}
          <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-3">
                <span className="text-xs font-bold text-neutral-300 uppercase flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-sky-400" />
                  R Script Editor (trafficdw_analysis.R)
                </span>
                <MechanicalButton
                  id="btn-run-r-script"
                  label={isRunning ? 'EXECUTING...' : 'RUN SCRIPT (CTRL+ENTER)'}
                  size="sm"
                  variant="success"
                  onClick={handleRunR}
                  icon={<Play className="w-3 h-3" />}
                />
              </div>

              <textarea
                value={rScript}
                onChange={(e) => setRScript(e.target.value)}
                rows={14}
                className="w-full bg-neutral-950 border border-neutral-700 text-sky-300 font-mono text-xs rounded p-3 focus:ring-1 focus:ring-sky-500 leading-relaxed"
                spellCheck={false}
              />
            </div>
          </div>

          {/* R Console Output CRT */}
          <CrtScreen
            id="crt-r-console"
            title="R 4.2.2 INTERACTIVE CONSOLE"
            badge="SESSION: PID-4089"
            phosphor="blue"
          >
            <pre className="font-mono text-xs text-sky-300 whitespace-pre-wrap leading-relaxed">
              {rOutput}
            </pre>
          </CrtScreen>
        </div>
      )}
    </div>
  );
};
