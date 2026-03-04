import React, { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';

const GlobeChart: React.FC = () => {
    const globeEl = useRef<any>();
    const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

    useEffect(() => {
        const handleResize = () => {
            setDimensions({ width: window.innerWidth, height: window.innerHeight });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Use a dark map texture
    const globeImageUrl = '//unpkg.com/three-globe/example/img/earth-dark.jpg';
    // A bump map to make mountains stand out
    const bumpImageUrl = '//unpkg.com/three-globe/example/img/earth-topology.png';

    useEffect(() => {
        if (globeEl.current) {
            // Auto-rotate the globe slowly
            globeEl.current.controls().autoRotate = true;
            globeEl.current.controls().autoRotateSpeed = 0.5;
            globeEl.current.pointOfView({ altitude: 2 });
        }
    }, []);

    return (
        <div className="absolute inset-0 z-0 bg-black">
            <Globe
                ref={globeEl}
                width={dimensions.width}
                height={dimensions.height}
                globeImageUrl={globeImageUrl}
                bumpImageUrl={bumpImageUrl}
                backgroundColor="#050510" // very dark blue/black
                atmosphereColor="#3b82f6"
                atmosphereAltitude={0.15}
            />
        </div>
    );
};

export default GlobeChart;
