import React, { useEffect, useState, useCallback } from 'react';
import { X, Globe2, Trophy, ChevronDown, ChevronRight, Users, Loader2, AlertCircle } from 'lucide-react';

interface League {
    id: number;
    name: string;
    logo: string;
    country: { name: string; flag: string };
    seasons?: { season: number }[];
}

interface Team {
    id: number;
    name: string;
    logo: string;
}

interface LeagueWithTeams extends League {
    teams: Team[];
    expanded: boolean;
    loadingTeams: boolean;
}

interface CountryInfoModalProps {
    country: { name: string; code: string } | null;
    onClose: () => void;
}

// Country code → flag emoji
function flagEmoji(code: string): string {
    if (!code || code === '-1') return '🏀';
    return code.toUpperCase().replace(/./g, c =>
        String.fromCodePoint(127397 + c.charCodeAt(0))
    );
}

const API_BASE = 'https://v1.basketball.api-sports.io';

const CountryInfoModal: React.FC<CountryInfoModalProps> = ({ country, onClose }) => {
    const [leagues, setLeagues] = useState<LeagueWithTeams[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const apiKey = import.meta.env.VITE_API_SPORTS_BASKETBALL_KEY as string;

    const fetchLeagues = useCallback(async () => {
        if (!country) return;
        setLoading(true);
        setError(null);
        setLeagues([]);

        try {
            const res = await fetch(
                `${API_BASE}/leagues?country=${encodeURIComponent(country.name)}`,
                { headers: { 'x-apisports-key': apiKey } }
            );
            const data = await res.json();

            if (data.response && Array.isArray(data.response)) {
                const items: LeagueWithTeams[] = data.response.map((l: {
                    id: number; name: string; logo: string;
                    country: { name: string; flag: string };
                    seasons?: { season: number }[];
                }) => ({
                    id: l.id,
                    name: l.name,
                    logo: l.logo,
                    country: l.country,
                    seasons: l.seasons,
                    teams: [],
                    expanded: false,
                    loadingTeams: false,
                }));
                setLeagues(items);
            } else {
                setError('No basketball leagues found for this country.');
            }
        } catch (e) {
            console.error('League fetch error:', e);
            setError('Could not load leagues. Check your API key.');
        } finally {
            setLoading(false);
        }
    }, [country, apiKey]);

    useEffect(() => {
        fetchLeagues();
    }, [fetchLeagues]);

    const toggleLeague = async (idx: number) => {
        const league = leagues[idx];

        // If already loaded, just toggle
        if (league.teams.length > 0 || league.expanded) {
            setLeagues(prev => prev.map((l, i) => i === idx ? { ...l, expanded: !l.expanded } : l));
            return;
        }

        // Load teams for this league
        setLeagues(prev => prev.map((l, i) => i === idx ? { ...l, loadingTeams: true, expanded: true } : l));

        // Find the latest season
        const latestSeason = league.seasons?.slice(-1)[0]?.season ?? new Date().getFullYear();

        try {
            const res = await fetch(
                `${API_BASE}/teams?league=${league.id}&season=${latestSeason}`,
                { headers: { 'x-apisports-key': apiKey } }
            );
            const data = await res.json();
            const teams: Team[] = (data.response ?? []).map((t: { id: number; name: string; logo: string }) => ({
                id: t.id,
                name: t.name,
                logo: t.logo,
            }));
            setLeagues(prev => prev.map((l, i) =>
                i === idx ? { ...l, teams, loadingTeams: false } : l
            ));
        } catch {
            setLeagues(prev => prev.map((l, i) =>
                i === idx ? { ...l, loadingTeams: false } : l
            ));
        }
    };

    if (!country) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            {/* Backdrop (light, doesn't block globe clicks) */}
            <div
                className="absolute inset-0 pointer-events-auto"
                onClick={onClose}
            />

            {/* Modal Panel */}
            <div className="relative pointer-events-auto w-96 max-h-[75vh] bg-slate-900/95 border border-slate-600/80 rounded-2xl shadow-2xl backdrop-blur-xl flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center gap-3 p-4 border-b border-slate-700/80 bg-gradient-to-r from-blue-600/20 to-transparent">
                    <span className="text-3xl leading-none">{flagEmoji(country.code)}</span>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-bold text-white leading-tight">{country.name}</h2>
                        <div className="flex items-center gap-1.5 text-xs text-blue-300/80 mt-0.5">
                            <Globe2 size={11} />
                            <span>Basketball Leagues &amp; Teams</span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-700"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-12 gap-3">
                            <Loader2 size={28} className="text-blue-400 animate-spin" />
                            <span className="text-slate-400 text-sm">Loading leagues for {country.name}...</span>
                        </div>
                    )}

                    {error && !loading && (
                        <div className="flex flex-col items-center justify-center py-10 gap-3 text-center px-4">
                            <AlertCircle size={26} className="text-slate-500" />
                            <p className="text-slate-500 text-sm">{error}</p>
                        </div>
                    )}

                    {!loading && !error && leagues.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-10 gap-3 text-center px-4">
                            <Trophy size={26} className="text-slate-600" />
                            <p className="text-slate-500 text-sm">No basketball leagues found for {country.name}.</p>
                        </div>
                    )}

                    {!loading && leagues.length > 0 && (
                        <div className="space-y-2">
                            {leagues.map((league, idx) => (
                                <div key={league.id} className="rounded-xl border border-slate-700/60 overflow-hidden">
                                    {/* League header */}
                                    <button
                                        onClick={() => toggleLeague(idx)}
                                        className="w-full flex items-center gap-3 px-3 py-2.5 bg-slate-800/60 hover:bg-slate-800 transition-colors text-left"
                                    >
                                        {league.logo ? (
                                            <img
                                                src={league.logo}
                                                alt={league.name}
                                                className="w-7 h-7 object-contain flex-shrink-0"
                                                onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                                            />
                                        ) : (
                                            <Trophy size={16} className="text-yellow-500 flex-shrink-0" />
                                        )}
                                        <span className="flex-1 text-sm font-semibold text-slate-100 truncate">{league.name}</span>
                                        {league.loadingTeams ? (
                                            <Loader2 size={14} className="text-blue-400 animate-spin flex-shrink-0" />
                                        ) : league.expanded ? (
                                            <ChevronDown size={14} className="text-slate-400 flex-shrink-0" />
                                        ) : (
                                            <ChevronRight size={14} className="text-slate-500 flex-shrink-0" />
                                        )}
                                    </button>

                                    {/* Teams list */}
                                    {league.expanded && !league.loadingTeams && (
                                        <div className="bg-slate-900/60 px-3 pt-2 pb-3">
                                            {league.teams.length === 0 ? (
                                                <p className="text-xs text-slate-600 italic pl-1">No teams found for this league.</p>
                                            ) : (
                                                <div className="grid grid-cols-2 gap-1.5">
                                                    {league.teams.map(team => (
                                                        <div key={team.id} className="flex items-center gap-2 text-xs text-slate-300 bg-slate-800/40 rounded-lg px-2 py-1.5">
                                                            {team.logo ? (
                                                                <img
                                                                    src={team.logo}
                                                                    alt={team.name}
                                                                    className="w-5 h-5 object-contain flex-shrink-0"
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
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-4 py-2 border-t border-slate-800 text-[10px] text-slate-600 text-right">
                    via API-Sports Basketball
                </div>
            </div>
        </div>
    );
};

export default CountryInfoModal;
