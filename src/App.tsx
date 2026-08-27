import React, { useState } from 'react';
import { HeaderBar } from './components/layout/HeaderBar';
import { EquipmentRack, ModuleKey } from './components/layout/EquipmentRack';
import { ControlDashboard } from './components/layout/ControlDashboard';

// Module Components
import { Module1_OLAP } from './components/modules/Module1_OLAP';
import { Module2_PreprocessingPart1 } from './components/modules/Module2_PreprocessingPart1';
import { Module3_PreprocessingPart2 } from './components/modules/Module3_PreprocessingPart2';
import { Module4_Classification } from './components/modules/Module4_Classification';
import { Module5_KMeansClustering } from './components/modules/Module5_KMeansClustering';
import { Module6_HierarchicalClustering } from './components/modules/Module6_HierarchicalClustering';
import { Module7_AprioriRules } from './components/modules/Module7_AprioriRules';
import { Module8_WekaAndRTool } from './components/modules/Module8_WekaAndRTool';
import { Module9_PowerBITableau } from './components/modules/Module9_PowerBITableau';
import { Module10_WebScraper } from './components/modules/Module10_WebScraper';
import { Module11_SchemaAndSQL } from './components/modules/Module11_SchemaAndSQL';

export function App() {
  const [activeModule, setActiveModule] = useState<ModuleKey>('olap');

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'olap':
        return <Module1_OLAP />;
      case 'prep1':
        return <Module2_PreprocessingPart1 />;
      case 'prep2':
        return <Module3_PreprocessingPart2 />;
      case 'classify':
        return <Module4_Classification />;
      case 'kmeans':
        return <Module5_KMeansClustering />;
      case 'hierarchical':
        return <Module6_HierarchicalClustering />;
      case 'apriori':
        return <Module7_AprioriRules />;
      case 'weka_r':
        return <Module8_WekaAndRTool />;
      case 'powerbi':
        return <Module9_PowerBITableau />;
      case 'scraper':
        return <Module10_WebScraper />;
      case 'schema_sql':
        return <Module11_SchemaAndSQL />;
      default:
        return <Module1_OLAP />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-3 sm:p-5 flex flex-col gap-4 font-mono">
      {/* Top Industrial Header Plate */}
      <HeaderBar />

      {/* Main 3-Panel Industrial Studio Layout */}
      <main className="flex-1 flex flex-col lg:flex-row gap-4 items-start w-full">
        {/* Left Panel: The Equipment Rack (11 Module Switches) */}
        <EquipmentRack
          activeModule={activeModule}
          onSelectModule={(mod) => setActiveModule(mod)}
        />

        {/* Center Panel: The Drafting Table Workspace */}
        <section
          id="center-drafting-table"
          className="flex-1 w-full min-w-0 bg-brushed-chassis p-4 rounded-2xl border-2 border-neutral-800 shadow-2xl overflow-hidden relative flex flex-col gap-4"
        >
          {/* Top Drafting Table Ruler Bar */}
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2 text-[10px] text-neutral-400 font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-400" />
              <span className="font-bold text-neutral-300 uppercase">DRAFTING TABLE WORKSPACE</span>
            </div>
            <div className="hidden sm:block text-neutral-500">
              COORDINATES: [LAT 19.0760, LNG 72.8777] // MUMBAI-PUNE CORRIDOR
            </div>
            <div className="text-amber-400 font-bold uppercase">
              ACTIVE MODULE: {activeModule.toUpperCase()}
            </div>
          </div>

          {/* Render Active Analytical Module */}
          <div className="w-full">{renderActiveModule()}</div>
        </section>

        {/* Right Panel: The Control Dashboard (VU Meters, Dials, Master Trigger) */}
        <ControlDashboard />
      </main>

      {/* Industrial Footer Status Bar */}
      <footer className="w-full bg-neutral-950 p-2.5 rounded-xl border border-neutral-800 flex flex-wrap items-center justify-between text-[10px] text-neutral-500 font-mono">
        <div>
          TRAFFIC DATA WAREHOUSE (TrafficDW) // REPOSITORY SCHEMA: STAR-01
        </div>
        <div className="flex items-center gap-4">
          <span>ETL ENGINE: ONLINE</span>
          <span>OLAP SLICING: ANSI SQL READY</span>
          <span>PRECISION: IEEE-754</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
