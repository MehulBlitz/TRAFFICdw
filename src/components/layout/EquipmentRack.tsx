import React from 'react';
import { RackSwitch } from '../skeuomorphic/RackSwitch';
import { Layers, Sliders, Flame, Cpu, Network, GitMerge, Link2, Terminal, LayoutDashboard, Globe, Database } from 'lucide-react';

export type ModuleKey =
  | 'olap_timelapse'
  | 'spatial_gis'
  | 'anomaly_fraud'
  | 'xai_benchmark'
  | 'visual_sql'
  | 'olap'
  | 'prep1'
  | 'prep2'
  | 'classify'
  | 'kmeans'
  | 'hierarchical'
  | 'apriori'
  | 'weka_r'
  | 'powerbi'
  | 'scraper'
  | 'schema_sql';

interface EquipmentRackProps {
  activeModule: ModuleKey;
  onSelectModule: (module: ModuleKey) => void;
  onOpenUploadModal?: () => void;
}

interface ModuleDef {
  key: ModuleKey;
  code: string;
  label: string;
  badge: string;
  ledColor: 'green' | 'amber' | 'blue' | 'red';
}

const MODULES: ModuleDef[] = [
  { key: 'olap_timelapse', code: 'EXP-01B', label: 'B: OLAP Time-Lapse', badge: 'ANIM-24H', ledColor: 'blue' },
  { key: 'spatial_gis', code: 'GIS-01C', label: 'C: Indian Spatial GIS', badge: '3D-CORR', ledColor: 'green' },
  { key: 'anomaly_fraud', code: 'ANOM-01D', label: 'D: Anomaly & Fraud', badge: 'ISOL-FOR', ledColor: 'red' },
  { key: 'xai_benchmark', code: 'XAI-01E', label: 'E: Model Arena & SHAP', badge: 'XAI-ML', ledColor: 'amber' },
  { key: 'visual_sql', code: 'SQL-01F', label: 'F: Visual SQL Planner', badge: 'AST-COST', ledColor: 'green' },
  { key: 'olap', code: 'EXP-01', label: 'Classic OLAP Cube', badge: 'OLAP', ledColor: 'green' },
  { key: 'prep1', code: 'EXP-04', label: 'Stats & Imputation', badge: 'ETL-1', ledColor: 'amber' },
  { key: 'prep2', code: 'EXP-05', label: 'Transform & Outliers', badge: 'ETL-2', ledColor: 'amber' },
  { key: 'classify', code: 'EXP-06', label: 'Naïve Bayes & Trees', badge: 'ML-CLS', ledColor: 'red' },
  { key: 'kmeans', code: 'EXP-07', label: 'K-Means & K-Medoids', badge: 'ML-CLU', ledColor: 'blue' },
  { key: 'hierarchical', code: 'EXP-08', label: 'Agglomerative Tree', badge: 'DENDRO', ledColor: 'blue' },
  { key: 'apriori', code: 'EXP-09', label: 'Apriori Rule Mining', badge: 'ASSOC', ledColor: 'amber' },
  { key: 'weka_r', code: 'EXP-02/03', label: 'WEKA & R Analytical', badge: 'CLI', ledColor: 'green' },
  { key: 'powerbi', code: 'EXP-10', label: 'PowerBI / Tableau', badge: 'BI-DASH', ledColor: 'amber' },
  { key: 'scraper', code: 'EXP-11', label: 'Web Scraper & Ingest', badge: 'BS4/SCRAPY', ledColor: 'green' },
  { key: 'schema_sql', code: 'ARCH-00', label: 'Star Schema & SQL', badge: 'CORE', ledColor: 'green' },
];

export const EquipmentRack: React.FC<EquipmentRackProps> = ({
  activeModule,
  onSelectModule,
  onOpenUploadModal,
}) => {
  return (
    <aside
      id="left-equipment-rack"
      className="w-full lg:w-80 shrink-0 neu-raised-lg p-5 rounded-3xl flex flex-col gap-4 select-none relative"
    >
      {/* Top Header Card */}
      <div className="flex items-center justify-between px-1">
        <div>
          <div className="text-sm font-bold text-slate-800 tracking-tight">
            Equipment Rack
          </div>
          <div className="text-xs text-slate-400 font-medium">
            16 Advanced Telemetry & ML Modules
          </div>
        </div>
        {onOpenUploadModal && (
          <button
            type="button"
            onClick={onOpenUploadModal}
            className="px-2.5 py-1 rounded-xl text-xs font-bold neu-btn text-blue-600 hover:bg-blue-50"
          >
            + Upload
          </button>
        )}
      </div>

      {/* Vertical Switches Stack */}
      <div className="flex flex-col gap-2.5 overflow-y-auto max-h-[calc(100vh-230px)] pr-1 custom-scrollbar">
        {MODULES.map((mod) => (
          <RackSwitch
            key={mod.key}
            id={`switch-${mod.key}`}
            code={mod.code}
            label={mod.label}
            badge={mod.badge}
            active={activeModule === mod.key}
            ledColor={mod.ledColor}
            onToggle={() => onSelectModule(mod.key)}
          />
        ))}
      </div>

      {/* Bottom Status Card */}
      <div className="flex items-center justify-between px-1 pt-3 border-t border-slate-200/80 text-xs text-slate-400 font-medium">
        <span>Bus Interconnect</span>
        <span className="text-blue-600 font-semibold">100% Synced</span>
      </div>
    </aside>
  );
};
