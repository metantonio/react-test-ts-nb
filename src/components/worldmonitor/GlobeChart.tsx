import React, { useEffect, useRef, useState, useCallback } from 'react';
import Globe, { GlobeMethods } from 'react-globe.gl';


// GeoJSON geometry — loosened coords type to avoid recursive generics
interface Geometry {
    type: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    coordinates: any[];
}

function getCentroid(geometry: Geometry): { lat: number; lng: number } {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ring: number[][] = [];
    if (geometry.type === 'Polygon') {
        ring = geometry.coordinates[0] as number[][];
    } else if (geometry.type === 'MultiPolygon') {
        let maxLen = 0;
        // Find the largest polygon ring (the main landmass)
        for (const poly of geometry.coordinates as number[][][][]) {
            if (poly[0].length > maxLen) {
                maxLen = poly[0].length;
                ring = poly[0];
            }
        }
    }
    if (!ring.length) return { lat: 0, lng: 0 };
    const lat = ring.reduce((s: number, c: number[]) => s + c[1], 0) / ring.length;
    const lng = ring.reduce((s: number, c: number[]) => s + c[0], 0) / ring.length;
    return { lat, lng };
}

interface CountryFeature {
    type: string;
    properties: {
        NAME: string;
        ISO_A2: string;
    };
    geometry: Geometry;
}

interface LabelData {
    lat: number;
    lng: number;
    text: string;
    size: number;
    color: string;
}

interface GlobeChartProps {
    onCountrySelect?: (country: { name: string; code: string } | null) => void;
    selectedCountry?: string | null;
    onReady?: (controls: { toggleRotation: () => void; resetView: () => void; autoRotate: boolean }) => void;
}

const GlobeChart: React.FC<GlobeChartProps> = ({ onCountrySelect, selectedCountry, onReady }) => {
    const globeEl = useRef<GlobeMethods | undefined>(undefined);
    const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
    const [countries, setCountries] = useState<CountryFeature[]>([]);
    const [hoveredCountry, setHoveredCountry] = useState<CountryFeature | null>(null);
    const [autoRotate, setAutoRotate] = useState(true);

    useEffect(() => {
        const handleResize = () =>
            setDimensions({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
            .then(r => r.json())
            .then(data => setCountries(data.features as CountryFeature[]))
            .catch(err => console.warn('Could not load country boundaries:', err));
    }, []);

    // globe setup
    useEffect(() => {
        if (globeEl.current) {
            globeEl.current.controls().autoRotate = true;
            globeEl.current.controls().autoRotateSpeed = 0.4;
            globeEl.current.pointOfView({ altitude: 2.2 });
        }
    }, []);

    // Focus camera when selectedCountry changes (fallback for when countries load after selection)
    useEffect(() => {
        if (selectedCountry && countries.length > 0 && globeEl.current) {
            const feature = countries.find(f => f.properties.NAME === selectedCountry);
            if (feature) {
                const { lat, lng } = getCentroid(feature.geometry);
                globeEl.current.controls().autoRotate = false;
                setAutoRotate(false);
                globeEl.current.pointOfView({ lat, lng, altitude: 1.4 }, 1200);
            }
        }
    }, [selectedCountry, countries]);

    // Expose controls to parent once globe is ready
    useEffect(() => {
        if (onReady) {
            onReady({ toggleRotation, resetView, autoRotate });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoRotate]);

    const handlePolygonClick = useCallback((polygon: object) => {
        const feature = polygon as CountryFeature;
        const name = feature?.properties?.NAME;
        const code = feature?.properties?.ISO_A2;
        if (name) {
            // Animate camera immediately on click — don't wait for state update
            if (globeEl.current && countries.length > 0) {
                const { lat, lng } = getCentroid(feature.geometry);
                globeEl.current.controls().autoRotate = false;
                setAutoRotate(false);
                globeEl.current.pointOfView({ lat, lng, altitude: 1.4 }, 1200);
            }
            if (onCountrySelect) onCountrySelect({ name, code });
        }
    }, [onCountrySelect, countries]);

    const getPolygonColor = useCallback((polygon: object) => {
        const feature = polygon as CountryFeature;
        const name = feature?.properties?.NAME;
        if (name === selectedCountry) return 'rgba(59, 130, 246, 0.85)';
        if (feature === hoveredCountry) return 'rgba(148, 163, 184, 0.5)';
        return 'rgba(71, 85, 105, 0.22)';
    }, [selectedCountry, hoveredCountry]);

    const getPolygonAltitude = useCallback((polygon: object) => {
        const feature = polygon as CountryFeature;
        return feature?.properties?.NAME === selectedCountry ? 0.07 : 0.01;
    }, [selectedCountry]);

    // Show label only for hovered or selected countries
    const labelsData: LabelData[] = [];
    if (hoveredCountry) {
        const { lat, lng } = getCentroid(hoveredCountry.geometry);
        labelsData.push({ lat, lng, text: hoveredCountry.properties.NAME, size: 0.6, color: '#e2e8f0' });
    }
    if (selectedCountry && hoveredCountry?.properties.NAME !== selectedCountry) {
        const selFeature = countries.find(f => f.properties.NAME === selectedCountry);
        if (selFeature) {
            const { lat, lng } = getCentroid(selFeature.geometry);
            labelsData.push({ lat, lng, text: selectedCountry, size: 0.7, color: '#93c5fd' });
        }
    }

    const toggleRotation = () => {
        if (globeEl.current) {
            const next = !autoRotate;
            globeEl.current.controls().autoRotate = next;
            setAutoRotate(next);
        }
    };

    const resetView = () => {
        if (globeEl.current) {
            globeEl.current.pointOfView({ lat: 20, lng: 0, altitude: 2.2 }, 800);
        }
    };

    return (
        <div className="absolute inset-0 z-0 bg-[#050510]">
            <Globe
                ref={globeEl}
                width={dimensions.width}
                height={dimensions.height}
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                backgroundColor="#050510"
                atmosphereColor="#60a5fa"
                atmosphereAltitude={0.18}
                polygonsData={countries}
                polygonAltitude={getPolygonAltitude}
                polygonCapColor={getPolygonColor}
                polygonSideColor={() => 'rgba(0,0,0,0.05)'}
                polygonStrokeColor={() => 'rgba(148, 163, 184, 0.25)'}
                polygonLabel={() => ''}
                onPolygonClick={handlePolygonClick}
                onPolygonHover={(polygon) => {
                    setHoveredCountry(polygon as CountryFeature | null);
                    document.body.style.cursor = polygon ? 'pointer' : 'default';
                }}
                labelsData={labelsData}
                labelLat={(d) => (d as LabelData).lat}
                labelLng={(d) => (d as LabelData).lng}
                labelText={(d) => (d as LabelData).text}
                labelSize={(d) => (d as LabelData).size}
                labelColor={(d) => (d as LabelData).color}
                labelDotRadius={0.3}
                labelResolution={2}
            />

            {/* NO controls here — they are rendered in the parent with higher z-index */}
        </div>
    );
};

export default GlobeChart;
