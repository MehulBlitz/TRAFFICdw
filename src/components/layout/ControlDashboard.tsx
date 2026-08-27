import React, { useState } from 'react';
import { AnalogDial } from '../skeuomorphic/AnalogDial';
import { VuMeter } from '../skeuomorphic/VuMeter';
import { LedIndicator } from '../skeuomorphic/LedIndicator';
import { MechanicalButton } from '../skeuomorphic/MechanicalButton';
import { toggleAudio, isAudioMuted, playRelayChime } from '../../audio/soundEffects';
import { Volume2, VolumeX, Zap, Gauge, Sliders, Radio } from 'lucide-react';

export const ControlDashboard: React.FC = () => {
  const [muted, setMuted] = useState(isAudioMuted());
  const [pipelineRunning, setPipelineRunning] = useState(false);
  const [targetTemp, setTargetTemp] = useState(24.0);
  const [gainLevel, setGainLevel] = useState(75);

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
      className="w-full lg:w-80 shrink-0 neu-raised-lg p-5 rounded-3xl flex flex-col gap-4 select-none relative"
    >
      {/* Top Header Card */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-bold tracking-tight text-slate-800">
            Control Dashboard
          </h2>
        </div>
        <button
          type="button"
          onClick={handleAudioToggle}
          className="flex items-center gap-1.5 px-3 py-1 neu-btn text-xs font-semibold text-slate-600 rounded-xl"
        >
          {muted ? <VolumeX className="w-3.5 h-3.5 text-rose-500" /> : <Volume2 className="w-3.5 h-3.5 text-blue-600" />}
          <span>{muted ? 'Muted' : 'Audio On'}</span>
        </button>
      </div>

      {/* Main Circular Rainbow Thermostat Dial (Directly matching uploaded screenshot) */}
      <div className="flex justify-center py-1">
        <AnalogDial
          id="dial-thermostat-tuning"
          label="Telemetry Calibration"
          min={16}
          max={32}
          step={0.5}
          value={targetTemp}
          unit="°C"
          onChange={setTargetTemp}
        />
      </div>

      {/* Neumorphic Telemetry Gauges */}
      <div className="space-y-3">
        <VuMeter
          id="vu-dw-throughput"
          label="DW Ingestion Stream"
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

      {/* Tactile Master Pipeline Execution Trigger */}
      <div className="neu-inset p-4 rounded-2xl flex flex-col items-center gap-2.5 text-center">
        <span className="text-xs font-semibold text-slate-500">
          Master Pipeline Trigger
        </span>
        <div className="w-full">
          <MechanicalButton
            id="btn-trigger-master-pipeline"
            label={pipelineRunning ? 'Pipeline Executing...' : 'Execute Full Pipeline'}
            size="lg"
            variant="primary"
            active={pipelineRunning}
            onClick={handleTriggerPipeline}
            icon={<Zap className={`w-4 h-4 ${pipelineRunning ? 'animate-bounce text-blue-600' : 'text-blue-500'}`} />}
          />
        </div>
        <span className="text-[10px] text-slate-400 font-medium">
          Triggers ETL → Star Ingest → OLAP Refresh
        </span>
      </div>

      {/* System Status Indicators */}
      <div className="neu-raised-sm p-3.5 rounded-2xl flex flex-col gap-2 mt-auto">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600">
          <span>Telemetry Status</span>
          <span className="text-emerald-600 text-[10px]">Optimal</span>
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

