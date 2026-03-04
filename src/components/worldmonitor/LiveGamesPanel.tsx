import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Activity } from 'lucide-react';

interface Game {
    id: number;
    league: { name: string; country: string; logo: string };
    teams: {
        home: { name: string; logo: string };
        away: { name: string; logo: string };
    };
    scores: { home: { total: number }; away: { total: number } };
    status: { short: string; timer?: string };
}

interface LiveGamesPanelProps {
    countryFilter?: string | null;
}

const API_BASE = 'https://v1.basketball.api-sports.io';
function proxyUrl(path: string) {
    return `https://corsproxy.io/?${encodeURIComponent(API_BASE + path)}`;
}

const LiveGamesPanel: React.FC<LiveGamesPanelProps> = ({ countryFilter }) => {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const apiKey = import.meta.env.VITE_API_SPORTS_BASKETBALL_KEY;
                if (!apiKey) {
                    console.error("No API key defined for Basketball Sports API");
                    setLoading(false);
                    return;
                }

                // Fetch today's live games (using API-Sports basketball endpoint)
                // Usually it's GET https://v1.basketball.api-sports.io/games?live=all
                const response = await fetch(proxyUrl('/games?live=all'), {
                    method: 'GET',
                    headers: {
                        'x-apisports-key': apiKey,
                    }
                });
                const data = await response.json();

                // Ensure data.response exists and is an array, else fallback to empty
                if (data.response && Array.isArray(data.response)) {
                    setGames(data.response);
                } else {
                    console.error("Invalid response from API", data);
                    setGames([]);
                }
            } catch (error) {
                console.error("Failed to fetch live games", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGames();
        const interval = setInterval(fetchGames, 60000); // refresh every minute

        return () => clearInterval(interval);
    }, []);

    const displayedGames = countryFilter
        ? games.filter(g =>
            g.league.country.toLowerCase().includes(countryFilter.toLowerCase())
        )
        : games;

    return (
        <Card className="w-80 bg-slate-900/80 border-slate-700 text-white backdrop-blur-md shadow-xl flex flex-col h-[500px]">
            <CardHeader className="pb-2 border-b border-slate-800">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 uppercase tracking-wider text-blue-400">
                    <Activity size={16} className="text-red-500 animate-pulse" />
                    Live Global Games
                    {countryFilter && (
                        <span className="font-normal text-blue-300 normal-case tracking-normal text-[10px]">• {countryFilter}</span>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 flex-1 overflow-y-auto custom-scrollbar">
                {loading ? (
                    <div className="flex justify-center mt-10">
                        <span className="text-slate-400 text-sm animate-pulse">Scanning live data...</span>
                    </div>
                ) : displayedGames.length === 0 ? (
                    <div className="text-center mt-10 text-slate-500 text-sm italic">
                        {countryFilter ? `No live games for ${countryFilter}.` : 'No live games detected currently.'}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {displayedGames.map(game => (
                            <div key={game.id} className="bg-slate-800/50 p-3 rounded-md border border-slate-700/50 hover:bg-slate-800 transition-colors">
                                <div className="flex items-center gap-2 mb-2">
                                    <img src={game.league.logo} alt={game.league.name} className="w-4 h-4 object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
                                    <span className="text-xs text-slate-400 truncate">{game.league.name} ({game.league.country})</span>
                                    <span className="ml-auto text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded font-medium border border-red-500/30">
                                        {game.status.short} {game.status.timer ? `'${game.status.timer}` : ''}
                                    </span>
                                </div>
                                <div className="space-y-1 mt-2">
                                    <div className="flex justify-between items-center text-sm font-medium">
                                        <span className="truncate pr-2">{game.teams.home.name}</span>
                                        <span className="text-blue-300 tabular-nums">{game.scores.home.total || 0}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm font-medium text-slate-300">
                                        <span className="truncate pr-2">{game.teams.away.name}</span>
                                        <span className="tabular-nums">{game.scores.away.total || 0}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default LiveGamesPanel;
