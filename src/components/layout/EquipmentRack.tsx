import React from 'react';
import { RackSwitch } from '../skeuomorphic/RackSwitch';
import { Layers, Sliders, Flame, Cpu, Network, GitMerge, Link2, Terminal, LayoutDashboard, Globe, Database } from 'lucide-react';

export type ModuleKey =
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
}

interface ModuleDef {
  key: ModuleKey;
  code: string;
  label: string;
  badge: string;
  ledColor: 'green' | 'amber' | 'blue' | 'red';
}

const MODULES: ModuleDef[] = [
  { key: 'olap', code: 'EXP-01', label: 'Multi-Dim OLAP Cube', badge: 'OLAP', ledColor: 'green' },
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
}) => {
  return (
    <aside
      id="left-equipment-rack"
      className="w-full lg:w-72 shrink-0 bg-brushed-chassis p-3.5 rounded-2xl border-2 border-neutral-800 shadow-2xl flex flex-col gap-3 relative"
    >
      {/* Top Rack Ear with Screws */}
      <div className="flex items-center justify-between px-2 border-b border-neutral-800/80 pb-2">
        <div className="screw-head" />
        <div className="text-center">
          <div className="text-[11px] font-black tracking-widest text-neutral-300 uppercase font-mono">
            EQUIPMENT RACK
          </div>
          <div className="text-[8px] text-amber-500 font-mono tracking-wider font-bold">
            19-INCH INDUSTRIAL RACK // 11 MODULES
          </div>
        </div>
        <div className="screw-head" />
      </div>

      {/* Vertical Switches Stack */}
      <div className="flex flex-col gap-2 overflow-y-auto max-h-[calc(100vh-210px)] pr-1 custom-scrollbar">
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

      {/* Bottom Rack Ear with Screws */}
      <div className="flex items-center justify-between px-2 border-t border-neutral-800/80 pt-2 mt-auto">
        <div className="screw-head" />
        <div className="text-[8px] font-mono text-neutral-500">
          CHASSIS: BUS-48V // 100% GROUNDED
        </div>
        <div className="screw-head" />
      </div>
    </aside>
  );
};
