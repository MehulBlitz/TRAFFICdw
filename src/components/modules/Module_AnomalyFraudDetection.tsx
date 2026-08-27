import React, { useState } from 'react';
import {
  ShieldAlert,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Zap,
  Wrench,
  Eye,
  FileSpreadsheet,
} from 'lucide-react';
import { MechanicalButton } from '../skeuomorphic/MechanicalButton';
import { EnrichedTrafficFact, AnomalyRecord } from '../../types/trafficDW';
import { INITIAL_ANOMALIES } from '../../data/trafficData';
import { runAnomalyDetectionEngine } from '../../utils/anomalyEngine';
import { playSwitchToggle, playRelayChime } from '../../audio/soundEffects';

interface ModuleAnomalyFraudDetectionProps {
  facts: EnrichedTrafficFact[];
}

export const Module_AnomalyFraudDetection: React.FC<ModuleAnomalyFraudDetectionProps> = ({
  facts,
}) => {
  const [isolationThreshold, setIsolationThreshold] = useState<number>(0.75);
  const [anomalyList, setAnomalyList] = useState<AnomalyRecord[]>(INITIAL_ANOMALIES);
  const [selectedAnomaly, setSelectedAnomaly] = useState<AnomalyRecord | null>(INITIAL_ANOMALIES[0]);
  const [filterType, setFilterType] = useState<string>('ALL');

  const detectionResult = runAnomalyDetectionEngine(facts, isolationThreshold);
  const combinedAnomalies = [...anomalyList, ...detectionResult.records];

  // De-duplicate by ID
  const uniqueAnomalies = Array.from(
    new Map(combinedAnomalies.map((item) => [item.id, item])).values()
  );

  const filteredList = uniqueAnomalies.filter((a) => {
    if (filterType === 'ALL') return true;
    return a.type === filterType;
  });

  const handleCleanseRecord = (id: string) => {
    playRelayChime();
    setAnomalyList((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'Cleansed' } : a))
    );
    if (selectedAnomaly?.id === id) {
      setSelectedAnomaly((prev) => (prev ? { ...prev, status: 'Cleansed' } : null));
    }
  };

  const handleCleanseAll = () => {
    playRelayChime();
    setAnomalyList((prev) => prev.map((a) => ({ ...a, status: 'Cleansed' })));
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 neu-raised p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl neu-inset flex items-center justify-center text-rose-600">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800 tracking-tight">
              Feature D: Telemetry Anomaly & FASTag Fraud Detection Engine
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Isolation Forest, Mahalanobis Distance, Phantom Jam Shockwaves & FASTag Tariff Auditing
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCleanseAll}
          className="px-4 py-2 neu-raised text-xs font-bold text-emerald-600 rounded-xl hover:bg-emerald-50 transition-all flex items-center gap-1.5"
        >
          <Wrench className="w-4 h-4" />
          <span>Auto-Cleanse & Repair All</span>
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="neu-raised p-4 rounded-2xl flex flex-col gap-1">
          <span className="text-xs text-slate-500 font-medium">Total Scanned Telemetry</span>
          <div className="text-2xl font-bold text-slate-800">
            {facts.length * 480} <span className="text-xs text-slate-400 font-normal">sensor rows</span>
          </div>
          <span className="text-[10px] text-blue-600 font-semibold">
            100% Star Schema Fact Coverage
          </span>
        </div>

        <div className="neu-raised p-4 rounded-2xl flex flex-col gap-1">
          <span className="text-xs text-slate-500 font-medium">Anomalies & Fraud Flagged</span>
          <div className="text-2xl font-bold text-rose-600">
            {uniqueAnomalies.filter((a) => a.status === 'Flagged').length}
          </div>
          <span className="text-[10px] text-rose-500 font-medium">
            Pending Remediation
          </span>
        </div>

        <div className="neu-raised p-4 rounded-2xl flex flex-col gap-1">
          <span className="text-xs text-slate-500 font-medium">FASTag Tariff Mismatches</span>
          <div className="text-2xl font-bold text-amber-600">
            {uniqueAnomalies.filter((a) => a.type === 'FASTAG_FRAUD').length}
          </div>
          <span className="text-[10px] text-amber-600 font-medium">
            Axle Counter vs RFID Tag
          </span>
        </div>

        <div className="neu-raised p-4 rounded-2xl flex flex-col gap-1">
          <span className="text-xs text-slate-500 font-medium">Successfully Cleansed</span>
          <div className="text-2xl font-bold text-emerald-600">
            {uniqueAnomalies.filter((a) => a.status === 'Cleansed').length}
          </div>
          <span className="text-[10px] text-emerald-600 font-medium">
            Imputed into Star Schema
          </span>
        </div>
      </div>

      {/* Threshold Slider & Type Filters */}
      <div className="neu-raised-lg p-5 rounded-3xl flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Sliders className="w-4 h-4 text-slate-500" />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-700">
                Isolation Forest Cutoff Threshold: {isolationThreshold.toFixed(2)}
              </span>
              <span className="text-[10px] text-slate-400">
                Higher values only flag extreme multivariate outliers
              </span>
            </div>
            <input
              type="range"
              min={0.5}
              max={0.95}
              step={0.05}
              value={isolationThreshold}
              onChange={(e) => setIsolationThreshold(parseFloat(e.target.value))}
              className="w-32 h-2 accent-blue-600 neu-inset rounded-lg"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            {['ALL', 'SENSOR_DEADLOCK', 'FASTAG_FRAUD', 'PHANTOM_JAM', 'TELEPORTATION_VIOLATION'].map(
              (type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    playSwitchToggle();
                    setFilterType(type);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap ${
                    filterType === type
                      ? 'neu-inset bg-blue-50/50 text-blue-600 border border-blue-200'
                      : 'neu-btn text-slate-600'
                  }`}
                >
                  {type.replace('_', ' ')}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Anomaly Table & Detail Inspection Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Anomaly Table */}
        <div className="lg:col-span-2 neu-raised-lg p-5 rounded-3xl flex flex-col gap-3">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Flagged Telemetry Incidents & Fraud Log
          </h3>

          <div className="overflow-x-auto neu-inset rounded-2xl p-2 max-h-96">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                  <th className="p-2.5">Severity</th>
                  <th className="p-2.5">Anomaly Type</th>
                  <th className="p-2.5">Corridor / Location</th>
                  <th className="p-2.5">Score</th>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 font-mono text-slate-700">
                {filteredList.map((anom) => {
                  const isSelected = selectedAnomaly?.id === anom.id;
                  const severityBadge =
                    anom.severity === 'Critical'
                      ? 'bg-rose-100 text-rose-700'
                      : anom.severity === 'High'
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-amber-100 text-amber-700';

                  return (
                    <tr
                      key={anom.id}
                      onClick={() => {
                        playSwitchToggle();
                        setSelectedAnomaly(anom);
                      }}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-50/80 font-bold' : 'hover:bg-slate-100/50'
                      }`}
                    >
                      <td className="p-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${severityBadge}`}>
                          {anom.severity}
                        </span>
                      </td>
                      <td className="p-2.5 font-bold text-slate-800 font-sans">
                        {anom.type.replace('_', ' ')}
                      </td>
                      <td className="p-2.5 font-sans">
                        <div className="text-slate-800 font-semibold">{anom.corridor}</div>
                        <div className="text-[10px] text-slate-400">{anom.location}</div>
                      </td>
                      <td className="p-2.5 text-blue-600 font-bold">
                        {anom.isolationScore.toFixed(2)}
                      </td>
                      <td className="p-2.5 font-sans">
                        {anom.status === 'Cleansed' ? (
                          <span className="text-emerald-600 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Cleansed
                          </span>
                        ) : (
                          <span className="text-rose-600 font-bold">Flagged</span>
                        )}
                      </td>
                      <td className="p-2.5 text-right">
                        {anom.status === 'Flagged' && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCleanseRecord(anom.id);
                            }}
                            className="px-2.5 py-1 neu-btn text-[10px] font-bold text-emerald-600 rounded-lg hover:bg-emerald-50"
                          >
                            Cleanse
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Deep Inspection & Remediation Protocol */}
        <div className="neu-raised-lg p-5 rounded-3xl flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Diagnostic Dossier
            </h3>
            {selectedAnomaly && (
              <span className="text-xs font-mono text-blue-600 font-bold">
                {selectedAnomaly.id}
              </span>
            )}
          </div>

          {selectedAnomaly ? (
            <div className="flex flex-col gap-3 text-xs">
              <div className="neu-inset p-3 rounded-2xl flex flex-col gap-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Observed Signal</span>
                <p className="font-mono text-slate-800 font-semibold">
                  {selectedAnomaly.observedValue}
                </p>
              </div>

              <div className="neu-inset p-3 rounded-2xl flex flex-col gap-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Expected Threshold</span>
                <p className="font-mono text-slate-800 font-semibold">
                  {selectedAnomaly.expectedRange}
                </p>
              </div>

              <div className="neu-raised-sm p-3 rounded-2xl flex flex-col gap-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Root Cause Analysis</span>
                <p className="text-slate-700">{selectedAnomaly.description}</p>
              </div>

              <div className="neu-raised-sm p-3 rounded-2xl flex flex-col gap-1 bg-emerald-50/40 border border-emerald-200">
                <span className="text-[10px] text-emerald-700 font-bold uppercase">Recommended ETL Remediation</span>
                <p className="text-emerald-900 font-medium">{selectedAnomaly.remediation}</p>
              </div>

              {selectedAnomaly.status === 'Flagged' ? (
                <button
                  type="button"
                  onClick={() => handleCleanseRecord(selectedAnomaly.id)}
                  className="w-full py-2.5 neu-raised text-xs font-bold text-emerald-600 rounded-xl hover:bg-emerald-50 transition-all flex items-center justify-center gap-1.5 mt-2"
                >
                  <Wrench className="w-4 h-4" />
                  <span>Apply Suggested Imputation</span>
                </button>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 text-center font-bold text-xs mt-2">
                  Record Cleanse Complete in Star Schema
                </div>
              )}
            </div>
          ) : (
            <div className="text-xs text-slate-400 py-12 text-center">
              Select an incident from the audit table to view diagnostics
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
