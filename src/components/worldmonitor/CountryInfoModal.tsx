import React, { useEffect, useState, useCallback, useRef } from 'react';
import { X, Globe2, Trophy, Users, Loader2, AlertCircle, GripHorizontal } from 'lucide-react';

interface League {
    id: number;
    name: string;
    logo: string;
    seasons?: { season: number }[];
}

interface Team {
    id: number;
    name: string;
    logo: string;
}

interface LeagueWithTeams extends League {
    teams: Team[];
    loading: boolean;
    loaded: boolean;
}

interface CountryInfoModalProps {
    country: { name: string; code: string } | null;
    onClose: () => void;
}

function flagEmoji(code: string): string {
    if (!code || code === '-1' || code.length !== 2) return '🏀';
    return code.toUpperCase().replace(/./g, c =>
        String.fromCodePoint(127397 + c.charCodeAt(0))
    );
}

const API_BASE = 'https://v1.basketball.api-sports.io';

// corsproxy.io forwards all request headers (including x-apisports-key) to the target
function proxyUrl(path: string) {
    return `https://corsproxy.io/?${encodeURIComponent(API_BASE + path)}`;
}

const CountryInfoModal: React.FC<CountryInfoModalProps> = ({ country, onClose }) => {
    const [leagues, setLeagues] = useState<LeagueWithTeams[]>([]);
    const [activeLeagueIdx, setActiveLeagueIdx] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Drag state
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [centered, setCentered] = useState(true); // use CSS centering until first drag
    const dragging = useRef(false);
    const dragStart = useRef({ mx: 0, my: 0, px: 0, py: 0 });
    const modalRef = useRef<HTMLDivElement>(null);

    const apiKey = import.meta.env.VITE_API_SPORTS_BASKETBALL_KEY as string;

    const fetchLeagues = useCallback(async () => {
        if (!country) return;
        setLoading(true);
        setError(null);
        setLeagues([]);
        setActiveLeagueIdx(0);
        try {
            const res = await fetch(
                proxyUrl(`/leagues?country=${encodeURIComponent(country.name)}`),
                { headers: { 'x-apisports-key': apiKey } }
            );
            const data = await res.json();
            if (data.response && Array.isArray(data.response) && data.response.length > 0) {
                setLeagues(data.response.map((l: {
                    id: number; name: string; logo: string;
                    seasons?: { season: number }[];
                }) => ({
                    id: l.id, name: l.name, logo: l.logo,
                    seasons: l.seasons, teams: [], loading: false, loaded: false,
                })));
            } else {
                setError('No basketball leagues found for this country.');
            }
        } catch {
            setError('Could not load leagues. Check your API key.');
        } finally {
            setLoading(false);
        }
    }, [country, apiKey]);

    useEffect(() => {
        fetchLeagues();
        // Reset drag position when a new country is selected
        setCentered(true);
    }, [fetchLeagues]);

    // Load teams for the active league tab on demand
    const loadTeams = useCallback(async (idx: number) => {
        const league = leagues[idx];
        if (!league || league.loaded || league.loading) return;

        setLeagues(prev => prev.map((l, i) => i === idx ? { ...l, loading: true } : l));
        const season = league.seasons?.slice(-1)[0]?.season ?? new Date().getFullYear();

        try {
            const res = await fetch(
                proxyUrl(`/teams?league=${league.id}&season=${season}`),
                { headers: { 'x-apisports-key': apiKey } }
            );
            const data = await res.json();
            const teams: Team[] = (data.response ?? []).map((t: { id: number; name: string; logo: string }) => ({
                id: t.id, name: t.name, logo: t.logo
            }));
            setLeagues(prev => prev.map((l, i) => i === idx ? { ...l, teams, loading: false, loaded: true } : l));
        } catch {
            setLeagues(prev => prev.map((l, i) => i === idx ? { ...l, loading: false, loaded: true } : l));
        }
    }, [leagues, apiKey]);

    // Load teams whenever active tab changes
    useEffect(() => {
        if (leagues.length > 0) loadTeams(activeLeagueIdx);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeLeagueIdx, leagues.length]);

    // ── Drag handlers ──────────────────────────────────────────────────────
    const onMouseDown = (e: React.MouseEvent) => {
        if (!modalRef.current) return;
        // First drag: compute actual screen position to switch from CSS center to absolute
        if (centered) {
            const rect = modalRef.current.getBoundingClientRect();
            setPos({ x: rect.left, y: rect.top });
            setCentered(false);
            dragStart.current = { mx: e.clientX, my: e.clientY, px: rect.left, py: rect.top };
        } else {
            dragStart.current = { mx: e.clientX, my: e.clientY, px: pos.x, py: pos.y };
        }
        dragging.current = true;
        e.preventDefault();
    };

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            if (!dragging.current) return;
            const dx = e.clientX - dragStart.current.mx;
            const dy = e.clientY - dragStart.current.my;
            setPos({ x: dragStart.current.px + dx, y: dragStart.current.py + dy });
        };
        const onUp = () => { dragging.current = false; };
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
        };
    }, []);

    if (!country) return null;

    const posStyle: React.CSSProperties = centered
        ? { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
        : { top: pos.y, left: pos.x, transform: 'none' };

    const activeLeague = leagues[activeLeagueIdx];

    return (
        <div className="fixed inset-0 z-50 pointer-events-none">
            {/* Modal */}
            <div
                ref={modalRef}
                className="absolute pointer-events-auto w-96 max-h-[75vh] bg-slate-900/95 border border-slate-600/80 rounded-2xl shadow-2xl backdrop-blur-xl flex flex-col overflow-hidden select-none"
                style={posStyle}
            >
                {/* Drag handle / Header */}
                <div
                    onMouseDown={onMouseDown}
                    className="flex items-center gap-3 p-4 border-b border-slate-700/80 bg-gradient-to-r from-blue-600/20 to-transparent cursor-grab active:cursor-grabbing"
                >
                    <GripHorizontal size={14} className="text-slate-500 flex-shrink-0" />
                    <span className="text-2xl leading-none">{flagEmoji(country.code)}</span>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-base font-bold text-white leading-tight">{country.name}</h2>
                        <div className="flex items-center gap-1.5 text-[10px] text-blue-300/80 mt-0.5">
                            <Globe2 size={10} />
                            <span>Basketball Leagues &amp; Teams</span>
                        </div>
                    </div>
                    <button
                        onMouseDown={e => e.stopPropagation()}
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-700 flex-shrink-0"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Loading / Error states */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-12 gap-3">
                        <Loader2 size={26} className="text-blue-400 animate-spin" />
                        <span className="text-slate-400 text-sm">Loading leagues...</span>
                    </div>
                )}

                {error && !loading && (
                    <div className="flex flex-col items-center justify-center py-10 gap-3 text-center px-4">
                        <AlertCircle size={24} className="text-slate-500" />
                        <p className="text-slate-500 text-sm">{error}</p>
                    </div>
                )}

                {/* League Tabs */}
                {!loading && leagues.length > 0 && (
                    <>
                        {/* Tab bar */}
                        <div className="flex overflow-x-auto no-scrollbar border-b border-slate-700/60 bg-slate-900/60">
                            {leagues.map((league, idx) => (
                                <button
                                    key={league.id}
                                    onMouseDown={e => e.stopPropagation()}
                                    onClick={() => setActiveLeagueIdx(idx)}
                                    title={league.name}
                                    className={`flex items-center gap-1.5 px-3 py-2.5 text-[10px] font-semibold whitespace-nowrap shrink-0 transition-colors border-b-2 ${idx === activeLeagueIdx
                                        ? 'text-blue-300 border-blue-400 bg-slate-800/60'
                                        : 'text-slate-500 border-transparent hover:text-slate-300 hover:bg-slate-800/30'
                                        }`}
                                >
                                    {league.logo ? (
                                        <img
                                            src={league.logo}
                                            alt=""
                                            className="w-4 h-4 object-contain"
                                            onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                                        />
                                    ) : (
                                        <Trophy size={10} className="text-yellow-500" />
                                    )}
                                    <span className="max-w-[80px] truncate">{league.name}</span>
                                </button>
                            ))}
                        </div>

                        {/* Tab content: teams */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
                            {activeLeague?.loading && (
                                <div className="flex items-center justify-center py-10 gap-2">
                                    <Loader2 size={18} className="text-blue-400 animate-spin" />
                                    <span className="text-slate-400 text-xs">Loading teams...</span>
                                </div>
                            )}

                            {activeLeague?.loaded && activeLeague.teams.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-10 gap-2">
                                    <Users size={22} className="text-slate-600" />
                                    <p className="text-slate-500 text-xs">No teams found for this league.</p>
                                </div>
                            )}

                            {activeLeague?.loaded && activeLeague.teams.length > 0 && (
                                <div className="grid grid-cols-2 gap-2">
                                    {activeLeague.teams.map(team => (
                                        <div
                                            key={team.id}
                                            className="flex items-center gap-2 text-xs text-slate-300 bg-slate-800/50 hover:bg-slate-700/60 rounded-xl px-2.5 py-2 border border-slate-700/40 transition-colors"
                                        >
                                            {team.logo ? (
                                                <img
                                                    src={team.logo}
                                                    alt={team.name}
                                                    className="w-6 h-6 object-contain flex-shrink-0"
                                                    onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                                                />
                                            ) : (
                                                <Users size={12} className="text-slate-500 flex-shrink-0" />
                                            )}
                                            <span className="truncate">{team.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-4 py-1.5 border-t border-slate-800 text-[10px] text-slate-600 text-right">
                            via API-Sports Basketball
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CountryInfoModal;
