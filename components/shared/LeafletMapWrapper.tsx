"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { ChevronDown, ChevronUp, Map as MapIcon, X } from 'lucide-react';

const MapSection = dynamic(() => import('@/components/shared/MapSection'), { 
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-slate-100 animate-pulse rounded-2xl mt-4" />
});

export default function LeafletMapWrapper({ locationName }: { locationName: string }) {
  const [showMap, setShowMap] = useState(false);

  return (
    <div className="w-full mt-4">
      {/* Toggle Button - Designed to look like a premium UI element */}
      <button 
        onClick={() => setShowMap(!showMap)}
        className={`group flex items-center justify-between w-full p-3 rounded-xl border transition-all duration-300 ${
          showMap 
          ? 'bg-indigo-500 border-indigo-600 text-white shadow-lg shadow-indigo-200' 
          : 'bg-indigo-50/50 border-indigo-100 text-indigo-600 hover:bg-indigo-100/50'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-1.5 rounded-lg transition-colors ${showMap ? 'bg-white/20' : 'bg-indigo-100'}`}>
            <MapIcon className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest">
            {showMap ? 'Hide Event Map' : 'View Venue Map'}
          </span>
        </div>
        
        {showMap ? <X className="w-4 h-4 opacity-70" /> : <ChevronDown className="w-4 h-4 opacity-70 group-hover:translate-y-0.5 transition-transform" />}
      </button>

      {/* Map Container - Uses a sleek slide-down animation */}
      {showMap && (
        <div className="mt-4 animate-in fade-in slide-in-from-top-4 duration-500 ease-out">
          <MapSection locationName={locationName} />
        </div>
      )}
    </div>
  );
}