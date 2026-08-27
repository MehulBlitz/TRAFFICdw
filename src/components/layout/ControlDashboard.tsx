import React, { useState } from 'react';
import { AnalogDial } from '../skeuomorphic/AnalogDial';
import { VuMeter } from '../skeuomorphic/VuMeter';
import { LedIndicator } from '../skeuomorphic/LedIndicator';
import { MechanicalButton } from '../skeuomorphic/MechanicalButton';
import { toggleAudio, isAudioMuted, playRelayChime } from '../../audio/soundEffects';
import { Volume2, VolumeX, Zap, Radio, RefreshCw, Cpu, Activity } from 'lucide-react';

export const ControlDashboard: React.FC = () => {
  const [muted, setMuted] = useState(isAudioMuted());
  const [pipelineRunning, setPipelineRunning] = useState(false);
  const [gainLevel, setGainLevel] = useState(75);
  const [filterFreq, setFilterFreq] = useState(42);

  const handleAudioToggle = () => {
    const nextMute = toggleAudio();
    setMuted(nextMute);
  };

  const handleTriggerPipeline = () => {
    setPipelineRunning(true);
    playRelayChime();
    setTimeout(() => {
      setPipelineRunning(false);
    }, 1200);
  };

  return (
    <aside
      id="right-control-dashboard"
      className="w-full lg:w-80 shrink-0 bg-brushed-chassis p-4 rounded-2xl border-2 border-neutral-800 shadow-2xl flex flex-col gap-4 relative"
    >
      {/* Top Header Plate with Screws */}
      <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2">
        <div className="screw-head" />
        <div className="text-center">
          <div className="text-[11px] font-black tracking-widest text-neutral-300 uppercase font-mono">
            CONTROL DASHBOARD
          </div>
          <div className="text-[8px] text-amber-500 font-mono tracking-wider font-bold">
            MASTER TELEMETRY & GAUGES
          </div>
        </div>
        <div className="screw-head" />
      </div>

      {/* Analog VU Gauges */}
      <div className="space-y-3">
        <VuMeter
          id="vu-dw-throughput"
          label="DW Stream Ingestion"
          value={pipelineRunning ? 92.4 : 64.2}
          unit=" rec/s"
          subLabel="Live Highway Telemetry Feed"
        />

        <VuMeter
          id="vu-cluster-cohesion"
          label="ML Model Confidence"
          value={pipelineRunning ? 98.0 : 88.5}
          unit="%"
          subLabel="Bayes & Tree Accuracy Index"
        />
      </div>

      {/* Rotary Dials Panel */}
      <div className="bg-instrument-panel p-3 rounded-xl border border-neutral-800">
        <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2 text-center">
          Analog Potentiometers
        </div>
        <div className="grid grid-cols-2 gap-2">
          <AnalogDial
            id="dial-sample-rate"
            label="Sample Rate"
            min={10}
            max={100}
            step={5}
            value={gainLevel}
            unit="Hz"
            onChange={setGainLevel}
          />
          <AnalogDial
            id="dial-filter-freq"
            label="Bandwidth"
            min={10}
            max={99}
            step={1}
            value={filterFreq}
            unit="kHz"
            onChange={setFilterFreq}
          />
        </div>
      </div>

      {/* Tactile Pipeline Execution Button */}
      <div className="bg-instrument-panel p-3.5 rounded-xl border border-neutral-800 space-y-2.5">
        <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider text-center">
          Master Pipeline Trigger
        </div>
        <MechanicalButton
          id="btn-trigger-master-pipeline"
          label={pipelineRunning ? 'PIPELINE ACTIVE...' : 'EXECUTE FULL PIPELINE'}
          size="lg"
          variant="amber"
          active={pipelineRunning}
          onClick={handleTriggerPipeline}
          icon={<Zap className={`w-4 h-4 ${pipelineRunning ? 'animate-bounce text-red-600' : ''}`} />}
        />
        <div className="text-[9px] font-mono text-neutral-400 text-center">
          Triggers ETL -&gt; Star Ingest -&gt; OLAP Refresh
        </div>
      </div>

      {/* System Status Indicators & Audio Toggle */}
      <div className="bg-instrument-panel p-3 rounded-xl border border-neutral-800 space-y-2 mt-auto">
        <div className="flex items-center justify-between text-[10px] font-bold text-neutral-400 uppercase">
          <span>System Status</span>
          <button
            type="button"
            onClick={handleAudioToggle}
            className="flex items-center gap-1 text-amber-400 hover:text-amber-300 cursor-pointer font-mono"
          >
            {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span>{muted ? 'MUTED' : 'AUDIO ON'}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <LedIndicator id="led-dw-status" label="DW CORE" active={true} color="green" />
          <LedIndicator id="led-etl-status" label="ETL SYNC" active={true} color="green" />
          <LedIndicator id="led-ml-status" label="ML ENGINE" active={true} color="blue" />
          <LedIndicator
            id="led-bus-status"
            label="BUS LOAD"
            active={pipelineRunning}
            color="red"
            pulse={pipelineRunning}
          />
        </div>
      </div>
    </aside>
  );
};
