import React, { useState } from 'react';
import { X, Upload, Download, FileText, CheckCircle2, AlertTriangle, Database, Info } from 'lucide-react';
import { MechanicalButton } from '../skeuomorphic/MechanicalButton';
import { EnrichedTrafficFact } from '../../types/trafficDW';
import { playRelayChime, playSwitchToggle } from '../../audio/soundEffects';

interface CustomDatasetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDatasetLoaded: (newFacts: EnrichedTrafficFact[], datasetName: string) => void;
}

export const CustomDatasetModal: React.FC<CustomDatasetModalProps> = ({
  isOpen,
  onClose,
  onDatasetLoaded,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [parseStatus, setParseStatus] = useState<'idle' | 'parsing' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [parsedCount, setParsedCount] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'upload' | 'spec'>('upload');

  if (!isOpen) return null;

  const handleDownloadSampleCsv = () => {
    playSwitchToggle();
    const csvContent = `Location_Name,City,State,Route_Name,Source_Location,Destination_Location,Vehicle_Type,Vehicle_Category,Road_Name,Road_Type,Lane_Count,Date,Hour,Day,Month,Quarter,Year,Congestion_Level,Distance_KM,Travel_Time_Min,Min_Distance_Vehicles,Avg_Speed_KMPH
Dadar Junction,Mumbai,Maharashtra,Mumbai-Pune Expressway,Mumbai,Pune,Sedan,Light Motor Vehicle,Expressway-01,Expressway,6,2026-08-27,8,Thursday,August,3,2026,Moderate,148.0,120.0,15,74.0
Khandala Ghat,Pune,Maharashtra,Mumbai-Pune Expressway,Mumbai,Pune,SUV,Light Motor Vehicle,Expressway-01,Expressway,6,2026-08-27,9,Thursday,August,3,2026,High,94.5,95.0,8,59.6
Cyber Hub,Gurugram,Delhi / Haryana,Delhi-Gurugram Expressway,Delhi,Gurugram,Sedan,Light Motor Vehicle,National Highway 48,Highway,8,2026-08-27,18,Thursday,August,3,2026,Severe,27.7,65.0,4,25.5
Silk Board,Bengaluru,Karnataka,Bengaluru Outer Ring Road,Silk Board,Hebbal,Bus,Public Transit,Arterial-A2,Arterial Road,6,2026-08-27,19,Thursday,August,3,2026,Severe,62.0,150.0,3,24.8
Gachibowli,Hyderabad,Telangana,Hyderabad Outer Ring Road,Gachibowli,Shamshabad,SUV,Light Motor Vehicle,Expressway-01,Expressway,8,2026-08-27,14,Thursday,August,3,2026,Low,158.0,95.0,25,99.7`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'trafficdw_star_schema_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadSampleJson = () => {
    playSwitchToggle();
    const jsonContent = [
      {
        Location_Name: "Dadar Junction",
        City: "Mumbai",
        State: "Maharashtra",
        Route_Name: "Mumbai-Pune Expressway",
        Source_Location: "Mumbai",
        Destination_Location: "Pune",
        Vehicle_Type: "Sedan",
        Vehicle_Category: "Light Motor Vehicle",
        Road_Name: "Expressway-01",
        Road_Type: "Expressway",
        Lane_Count: 6,
        Date: "2026-08-27",
        Hour: 8,
        Day: "Thursday",
        Month: "August",
        Quarter: 3,
        Year: 2026,
        Congestion_Level: "Moderate",
        Distance_KM: 148.0,
        Travel_Time_Min: 120.0,
        Min_Distance_Vehicles: 15,
        Avg_Speed_KMPH: 74.0
      }
    ];

    const blob = new Blob([JSON.stringify(jsonContent, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'trafficdw_star_schema_template.json');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const processTextData = (content: string, filename: string) => {
    try {
      setParseStatus('parsing');
      let records: Partial<EnrichedTrafficFact>[] = [];

      if (filename.endsWith('.json')) {
        records = JSON.parse(content);
      } else {
        // Parse CSV
        const lines = content.trim().split(/\r?\n/);
        if (lines.length < 2) throw new Error('CSV file must have a header row and at least 1 data row.');
        const headers = lines[0].split(',').map((h) => h.trim().replace(/^["']|["']$/g, ''));

        records = lines.slice(1).map((line) => {
          const vals = line.split(',').map((v) => v.trim().replace(/^["']|["']$/g, ''));
          const obj: Record<string, any> = {};
          headers.forEach((h, i) => {
            obj[h] = vals[i];
          });
          return obj;
        });
      }

      // Validate & map records
      const validated: EnrichedTrafficFact[] = records.map((r, idx) => {
        const speed = parseFloat(String(r.Avg_Speed_KMPH || 50));
        const dist = parseFloat(String(r.Distance_KM || 30));
        const timeMin = parseFloat(String(r.Travel_Time_Min || 45));
        const hour = parseInt(String(r.Hour || 12), 10);
        const laneCount = parseInt(String(r.Lane_Count || 4), 10);

        let congestion = (r.Congestion_Level as any) || 'Moderate';
        if (!['Low', 'Moderate', 'High', 'Severe'].includes(congestion)) {
          congestion = speed < 30 ? 'Severe' : speed < 55 ? 'High' : speed < 75 ? 'Moderate' : 'Low';
        }

        return {
          Traffic_Key: idx + 1000,
          Route_Key: (idx % 4) + 1,
          Location_Key: (idx % 4) + 1,
          Road_Key: (idx % 4) + 1,
          Vehicle_Key: (idx % 4) + 1,
          Time_Key: (idx % 4) + 1,
          Location_Name: r.Location_Name || 'Custom Node Point',
          City: r.City || 'Metro Hub',
          State: r.State || 'India',
          Route_Name: r.Route_Name || 'Uploaded Road Corridor',
          Source_Location: r.Source_Location || 'Origin A',
          Destination_Location: r.Destination_Location || 'Destination B',
          Vehicle_Type: r.Vehicle_Type || 'Sedan',
          Vehicle_Category: r.Vehicle_Category || 'Light Motor Vehicle',
          Road_Name: r.Road_Name || 'Expressway-01',
          Road_Type: r.Road_Type || 'Expressway',
          Lane_Count: isNaN(laneCount) ? 4 : laneCount,
          Date: r.Date || '2026-08-27',
          Hour: isNaN(hour) ? 12 : Math.max(0, Math.min(23, hour)),
          Day: r.Day || 'Thursday',
          Month: r.Month || 'August',
          Quarter: Number(r.Quarter || 3),
          Year: Number(r.Year || 2026),
          Congestion_Level: congestion,
          Distance_KM: isNaN(dist) ? 35 : dist,
          Travel_Time_Min: isNaN(timeMin) ? 40 : timeMin,
          Min_Distance_Vehicles: Number(r.Min_Distance_Vehicles || 10),
          Avg_Speed_KMPH: isNaN(speed) ? 55 : speed,
        };
      });

      setParsedCount(validated.length);
      setParseStatus('success');
      setStatusMessage(`Successfully validated & mapped ${validated.length} records into Star Schema.`);
      playRelayChime();

      setTimeout(() => {
        onDatasetLoaded(validated, filename);
        onClose();
      }, 1200);
    } catch (err: any) {
      setParseStatus('error');
      setStatusMessage(err?.message || 'Failed to parse file. Please verify CSV/JSON schema format.');
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        processTextData(text, file.name);
      };
      reader.readAsText(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        processTextData(text, file.name);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-3xl neu-raised-lg bg-[#ebf0f7] rounded-3xl p-6 relative flex flex-col gap-5 border border-white shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl neu-inset flex items-center justify-center text-blue-600">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 tracking-tight">
                Upload Custom Traffic Dataset
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Seamlessly ingest external CSV / JSON files into the Star Schema Warehouse
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl neu-raised flex items-center justify-center text-slate-500 hover:text-slate-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'upload' ? 'neu-inset bg-blue-50/50 text-blue-600' : 'neu-btn text-slate-600'
            }`}
          >
            Upload Files
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('spec')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'spec' ? 'neu-inset bg-blue-50/50 text-blue-600' : 'neu-btn text-slate-600'
            }`}
          >
            Schema Format Spec & Templates
          </button>
        </div>

        {activeTab === 'upload' ? (
          <div className="space-y-4">
            {/* Drag and Drop Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleFileDrop}
              className={`p-8 border-2 border-dashed rounded-3xl text-center flex flex-col items-center justify-center gap-3 transition-all ${
                dragActive
                  ? 'border-blue-500 bg-blue-50/30 scale-[0.99]'
                  : 'border-slate-300 neu-inset'
              }`}
            >
              <div className="w-14 h-14 rounded-2xl neu-raised flex items-center justify-center text-blue-600">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700">
                  Drag and drop your CSV or JSON dataset here
                </p>
                <p className="text-xs text-slate-400 font-medium mt-1">
                  Supports .csv and .json files formatted to TrafficDW Star Schema
                </p>
              </div>

              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".csv,.json"
                  className="hidden"
                  onChange={handleFileInput}
                />
                <span className="px-5 py-2 neu-raised text-xs font-bold text-blue-600 rounded-xl hover:bg-blue-50 inline-block transition-all">
                  Browse Files from Computer
                </span>
              </label>
            </div>

            {/* Status alerts */}
            {parseStatus === 'success' && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 text-xs font-semibold">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{statusMessage}</span>
              </div>
            )}
            {parseStatus === 'error' && (
              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-3 text-xs font-semibold">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>{statusMessage}</span>
              </div>
            )}

            {/* Quick Sample Downloads */}
            <div className="neu-raised-sm p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <Info className="w-4 h-4 text-blue-600" />
                <span>Need a ready-made template to get started?</span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleDownloadSampleCsv}
                  className="flex items-center gap-1.5 px-3 py-1.5 neu-btn text-xs font-bold text-slate-700 rounded-xl"
                >
                  <Download className="w-3.5 h-3.5 text-blue-600" />
                  <span>Download Sample CSV</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadSampleJson}
                  className="flex items-center gap-1.5 px-3 py-1.5 neu-btn text-xs font-bold text-slate-700 rounded-xl"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Download Sample JSON</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-xs text-slate-600">
              Your uploaded file should include the following header columns (case-insensitive):
            </div>

            <div className="overflow-x-auto neu-inset rounded-2xl p-2 max-h-72">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                    <th className="p-2">Column Name</th>
                    <th className="p-2">Data Type</th>
                    <th className="p-2">Example Value</th>
                    <th className="p-2">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60 font-mono text-slate-700">
                  <tr>
                    <td className="p-2 font-bold text-blue-600">Location_Name</td>
                    <td className="p-2">STRING</td>
                    <td className="p-2">Dadar Junction</td>
                    <td className="p-2 font-sans">Physical junction or sensor point</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-blue-600">City / State</td>
                    <td className="p-2">STRING</td>
                    <td className="p-2">Mumbai / Maharashtra</td>
                    <td className="p-2 font-sans">Geographic hierarchy</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-blue-600">Route_Name</td>
                    <td className="p-2">STRING</td>
                    <td className="p-2">Mumbai-Pune Expressway</td>
                    <td className="p-2 font-sans">Highway corridor name</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-blue-600">Hour</td>
                    <td className="p-2">INTEGER (0-23)</td>
                    <td className="p-2">18</td>
                    <td className="p-2 font-sans">Hour of day for temporal slicing</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-blue-600">Avg_Speed_KMPH</td>
                    <td className="p-2">FLOAT</td>
                    <td className="p-2">64.5</td>
                    <td className="p-2 font-sans">Vehicle velocity telemetry in km/h</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-blue-600">Congestion_Level</td>
                    <td className="p-2">ENUM</td>
                    <td className="p-2">Low | Moderate | High | Severe</td>
                    <td className="p-2 font-sans">Ground-truth congestion status</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-blue-600">Vehicle_Type</td>
                    <td className="p-2">STRING</td>
                    <td className="p-2">Sedan / SUV / Heavy Truck</td>
                    <td className="p-2 font-sans">Vehicle dimension classification</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-blue-600">Distance_KM</td>
                    <td className="p-2">FLOAT</td>
                    <td className="p-2">94.5</td>
                    <td className="p-2 font-sans">Segment or corridor distance</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleDownloadSampleCsv}
                className="flex items-center gap-1.5 px-4 py-2 neu-btn text-xs font-bold text-slate-700 rounded-xl"
              >
                <Download className="w-4 h-4 text-blue-600" />
                <span>Download Sample CSV</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
