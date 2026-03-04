import React, { useState, useCallback } from 'react';
import GlobeChart from '../components/worldmonitor/GlobeChart';
import LiveGamesPanel from '../components/worldmonitor/LiveGamesPanel';
import NewsPanel from '../components/worldmonitor/NewsPanel';
import NcaaPanel from '../components/worldmonitor/NcaaPanel';
import YoutubePanel from '../components/worldmonitor/YoutubePanel';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Globe2, X } from 'lucide-react';

interface SelectedCountry {
    name: string;
    code: string;
}

const BasketballWorldMonitor: React.FC = () => {
    const navigate = useNavigate();
    const [selectedCountry, setSelectedCountry] = useState<SelectedCountry | null>(null);

    const handleCountrySelect = useCallback((country: { name: string; code: string } | null) => {
        setSelectedCountry(country);
    }, []);

    const clearSelection = useCallback(() => {
        setSelectedCountry(null);
    }, []);

    return (
        <div className="relative w-full h-screen overflow-hidden bg-black text-white font-sans">
            {/* 3D Background Globe */}
            <GlobeChart
                onCountrySelect={handleCountrySelect}
                selectedCountry={selectedCountry?.name ?? null}
            />

            {/* Header Overlay */}
            <div className="absolute top-0 left-0 w-full p-4 z-10 pointer-events-none flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/league')}
                        className="pointer-events-auto flex items-center justify-center w-10 h-10 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white transition-colors border border-slate-600 shadow-lg"
                        title="Back to Simulation"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="w-10 h-10 rounded bg-blue-600 flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-500/50">
                        WM
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-white/90 drop-shadow-md">SportVizion World Monitor</h1>
                        <p className="text-xs text-blue-300/80 uppercase tracking-widest font-semibold">Global Intelligence Dashboard</p>
                    </div>
                </div>

                {/* Country Selection Badge */}
                {selectedCountry && (
                    <div className="pointer-events-auto flex items-center gap-2 bg-blue-600/30 border border-blue-500/60 rounded-full px-4 py-2 backdrop-blur-sm shadow-xl mr-4">
                        <Globe2 size={14} className="text-blue-300" />
                        <span className="text-sm font-bold text-white">{selectedCountry.name}</span>
                        {selectedCountry.code && (
                            <span className="text-xs text-blue-300/80 font-mono">{selectedCountry.code}</span>
                        )}
                        <button
                            onClick={clearSelection}
                            className="ml-1 text-slate-400 hover:text-white transition-colors"
                            title="Clear country filter"
                        >
                            <X size={14} />
                        </button>
                    </div>
                )}
            </div>

            {/* Left Panels */}
            <div className="absolute top-24 left-4 z-10 flex flex-col gap-4 pointer-events-auto max-h-[calc(100vh-120px)] overflow-y-auto no-scrollbar pb-4 shadow-2xl">
                <LiveGamesPanel countryFilter={selectedCountry?.name ?? null} />
                <NcaaPanel />
            </div>

            {/* Right Panels */}
            <div className="absolute top-24 right-4 z-10 flex flex-col gap-4 pointer-events-auto max-h-[calc(100vh-120px)] overflow-y-auto no-scrollbar pb-4 shadow-2xl">
                <NewsPanel countryFilter={selectedCountry?.name ?? null} />
                <YoutubePanel countryFilter={selectedCountry?.name ?? null} />
            </div>

        </div>
    );
};

export default BasketballWorldMonitor;
