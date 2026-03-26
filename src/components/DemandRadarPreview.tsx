'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Activity, Eye, CheckCircle, Hammer, Rocket } from 'lucide-react';

interface PipelineStage {
  name: string;
  count: number;
  icon: React.ReactNode;
  color: string;
}

interface DemandRadarPreviewProps {
  signalCount?: number;
  pipelineProphet?: PipelineStage[];
}

const DemandRadarPreview: React.FC<DemandRadarPreviewProps> = ({
  signalCount = 461,
  pipelineProphet = [
    { name: 'Watching', count: 120, icon: <Eye className="w-4 h-4" />, color: 'text-blue-400' },
    { name: 'Validating', count: 85, icon: <CheckCircle className="w-4 h-4" />, color: 'text-yellow-400' },
    { name: 'Building', count: 62, icon: <Hammer className="w-4 h-4" />, color: 'text-orange-400' },
    { name: 'Shipped', count: 38, icon: <Rocket className="w-4 h-4" />, color: 'text-green-400' },
  ]
}) => {
  return (
    <section className="py-16 sm:py-20 md:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 border-t border-white/10 bg-gradient-to-b from-purple-900/10 to-transparent">
      <div className="max-w-6xl lg:max-w-7xl mx-auto">
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 lg:px-6 lg:py-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm rounded-full text-purple-300 text-sm lg:text-base mb-6 border border-purple-500/30">
            <Activity className="w-4 h-4 animate-pulse" />
            <span>LIVE TRACKER</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Demand Radar
          </h2>
          
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Tracking market demand signals in real-time • {signalCount.toLocaleString()} signals tracked
          </p>
          
          <Link 
            href="/radar"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg text-white font-medium transition-all duration-300 transform hover:scale-105"
          >
            Explore Full Radar
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        {/* Pipeline Visualization */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {pipelineProphet.map((stage, index) => (
              <div key={stage.name} className="w-full max-w-xs">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 ${stage.color}`}>
                    {stage.icon}
                  </span>
                  <h3 className="text-lg font-semibold text-white">{stage.name}</h3>
                </div>
                
                <div className="relative h-4 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                    style={{ width: `${(stage.count / Math.max(...pipelineProphet.map(s => s.count))) * 100}%` }}
                  ></div>
                </div>
                
                <div className="mt-3 text-center">
                  <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    {stage.count}
                  </span>
                  <span className="text-gray-400 ml-1">signals</span>
                </div>
              </div>
            ))}
            
            {/* Connecting Arrows */}
            <div className="hidden lg:flex items-center justify-center gap-4">
              {[...Array(pipelineProphet.length - 1)].map((_, i) => (
                <svg key={i} className="w-12 h-6 text-gray-600" fill="none" viewBox="0 0 24 12">
                  <path d="M0 6H22M22 6L17 2M22 6L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemandRadarPreview;