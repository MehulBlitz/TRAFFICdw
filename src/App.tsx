import React, { useState } from 'react';
import { HeaderBar } from './components/layout/HeaderBar';
import { EquipmentRack, ModuleKey } from './components/layout/EquipmentRack';
import { ControlDashboard } from './components/layout/ControlDashboard';
import { CustomDatasetModal } from './components/common/CustomDatasetModal';

// Features B, C, D, E, F
import { Module_OLAPTimeLapse } from './components/modules/Module_OLAPTimeLapse';
import { Module_SpatialGIS } from './components/modules/Module_SpatialGIS';
import { Module_AnomalyFraudDetection } from './components/modules/Module_AnomalyFraudDetection';
import { Module_XAIBenchmark } from './components/modules/Module_XAIBenchmark';
import { Module_VisualSQLPlanner } from './components/modules/Module_VisualSQLPlanner';

// Classic analytical modules
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

import { ENRICHED_TRAFFIC_FACTS } from './data/trafficData';
import { EnrichedTrafficFact } from './types/trafficDW';

export function App() {
  const [activeModule, setActiveModule] = useState<ModuleKey>('olap_timelapse');
  const [facts, setFacts] = useState<EnrichedTrafficFact[]>(ENRICHED_TRAFFIC_FACTS);
  const [datasetName, setDatasetName] = useState<string>('National Indian Highway Star Schema v2.4');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

  const handleDatasetLoaded = (newFacts: EnrichedTrafficFact[], filename: string) => {
    setFacts(newFacts);
    setDatasetName(filename || 'Custom Ingested Star Schema');
  };

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'olap_timelapse':
        return <Module_OLAPTimeLapse facts={facts} />;
      case 'spatial_gis':
        return (
          <Module_SpatialGIS
            facts={facts}
            onOpenUploadModal={() => setIsUploadModalOpen(true)}
          />
        );
      case 'anomaly_fraud':
        return <Module_AnomalyFraudDetection facts={facts} />;
      case 'xai_benchmark':
        return <Module_XAIBenchmark facts={facts} />;
      case 'visual_sql':
        return <Module_VisualSQLPlanner facts={facts} />;
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
        return <Module_OLAPTimeLapse facts={facts} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#ebf0f7] text-slate-800 p-4 sm:p-6 lg:p-8 flex flex-col gap-6 font-sans">
      {/* Top Header Plate */}
      <HeaderBar
        datasetName={datasetName}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
      />

      {/* Main 3-Panel Studio Layout */}
      <main className="flex-1 flex flex-col lg:flex-row gap-6 items-start w-full">
        {/* Left Panel: The Equipment Rack */}
        <EquipmentRack
          activeModule={activeModule}
          onSelectModule={(mod) => setActiveModule(mod)}
          onOpenUploadModal={() => setIsUploadModalOpen(true)}
        />

        {/* Center Panel: The Drafting Table Workspace */}
        <section
          id="center-drafting-table"
          className="flex-1 w-full min-w-0 neu-raised-lg p-6 rounded-3xl overflow-hidden relative flex flex-col gap-5 border border-white/80"
        >
          {/* Top Status Bar */}
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-xs shadow-blue-400" />
              <span className="font-bold text-slate-800">Workspace View</span>
            </div>
            <div className="hidden sm:block text-slate-400 font-mono text-[11px]">
              Active Corridors: Mumbai-Pune • Delhi-Gurugram • Bengaluru ORR • Hyderabad ORR • Chennai OMR • Kolkata EMB • Samruddhi
            </div>
            <div className="text-blue-600 font-bold uppercase tracking-wider text-[11px] px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200">
              Module: {activeModule}
            </div>
          </div>

          {/* Render Active Analytical Module */}
          <div className="w-full">{renderActiveModule()}</div>
        </section>

        {/* Right Panel: The Control Dashboard */}
        <ControlDashboard />
      </main>

      {/* Custom Dataset Upload Modal */}
      <CustomDatasetModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onDatasetLoaded={handleDatasetLoaded}
      />

      {/* Footer Status Bar */}
      <footer className="w-full neu-raised px-6 py-3.5 rounded-2xl flex flex-wrap items-center justify-between text-xs text-slate-400 font-medium">
        <div>
          Traffic Data Warehouse (TrafficDW) • Star Schema v2.4 • Hackathon Engine
        </div>
        <div className="flex items-center gap-6">
          <span>Active Rows: {facts.length}</span>
          <span>ETL Pipeline: Synced</span>
          <span>Precision: IEEE-754</span>
        </div>
      </footer>
    </div>
  );
}

export default App;

