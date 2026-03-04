import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { GraduationCap, RefreshCcw, Newspaper, Trophy } from 'lucide-react';

interface NcaaGame {
    game: {
        gameID: string;
        title: string;
        network: string;
        startTime: string;
        currentPeriod: string;
        gameState: string; // pre, live, final
        contestClock: string;
        away: {
            score: string;
            names: { short: string; char6: string; };
            rank: string;
        };
        home: {
            score: string;
            names: { short: string; char6: string; };
            rank: string;
        };
    };
}

interface NcaaNews {
    title: string;
    link: string;
    pubDate: string;
    image: string;
}

const NCAA_BASE = 'https://ncaa-api.henrygd.me';
function proxy(path: string) {
    return `https://api.allorigins.win/raw?url=${encodeURIComponent(NCAA_BASE + path)}`;
}

const NcaaPanel: React.FC = () => {
    const [games, setGames] = useState<NcaaGame[]>([]);
    const [news, setNews] = useState<NcaaNews[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'scores' | 'news'>('scores');

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch Scores via proxy (NCAA API lacks CORS headers)
            const scoreRes = await fetch(proxy('/scoreboard/basketball-men/d1'));
            const scoreData = await scoreRes.json();
            if (scoreData.games) {
                setGames(scoreData.games.slice(0, 15));
            }

            // Fetch News via proxy
            const newsRes = await fetch(proxy('/news/basketball-men/d1'));
            const newsData = await newsRes.json();
            if (newsData.items) {
                setNews(newsData.items.slice(0, 10));
            }
        } catch (error) {
            console.error('Failed to fetch NCAA data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 60000); // 1 minute
        return () => clearInterval(interval);
    }, []);

    const renderGameState = (game: NcaaGame['game']) => {
        if (game.gameState === 'live') {
            return (
                <div className="text-red-400 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                    {game.currentPeriod} {game.contestClock}
                </div>
            );
        }
        if (game.gameState === 'final') return <span className="text-slate-400">Final</span>;
        return <span className="text-slate-400">{game.startTime}</span>;
    };

    return (
        <Card className="w-80 bg-slate-900/80 border-slate-700 text-white backdrop-blur-md shadow-xl flex flex-col h-[400px]">
            <CardHeader className="pb-2 border-b border-slate-800 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 uppercase tracking-wider text-orange-400">
                    <GraduationCap size={16} />
                    NCAA D1 Men's
                </CardTitle>
                <button onClick={fetchData} className="text-slate-400 hover:text-white transition-colors" disabled={loading}>
                    <RefreshCcw size={14} className={loading ? 'animate-spin' : ''} />
                </button>
            </CardHeader>

            <div className="flex border-b border-slate-800">
                <button
                    onClick={() => setActiveTab('scores')}
                    className={`flex-1 py-2 text-xs font-semibold flex justify-center items-center gap-2 transition-colors ${activeTab === 'scores' ? 'text-orange-400 border-b-2 border-orange-400 bg-slate-800/50' : 'text-slate-500 hover:bg-slate-800/30'}`}
                >
                    <Trophy size={14} /> Scores
                </button>
                <button
                    onClick={() => setActiveTab('news')}
                    className={`flex-1 py-2 text-xs font-semibold flex justify-center items-center gap-2 transition-colors ${activeTab === 'news' ? 'text-orange-400 border-b-2 border-orange-400 bg-slate-800/50' : 'text-slate-500 hover:bg-slate-800/30'}`}
                >
                    <Newspaper size={14} /> News
                </button>
            </div>

            <CardContent className="pt-2 pb-2 pr-1 flex-1 overflow-hidden flex flex-col">
                {loading && games.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center">
                        <span className="text-slate-500 text-xs animate-pulse">Loading NCAA Data...</span>
                    </div>
                ) : activeTab === 'scores' ? (
                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-3 space-y-3">
                        {games.length === 0 ? (
                            <div className="text-xs text-slate-500 text-center mt-4">No games available</div>
                        ) : (
                            games.map((g, idx) => {
                                const match = g.game;
                                return (
                                    <div key={idx} className="bg-slate-800/50 rounded p-2 text-sm border border-slate-700 hover:border-orange-500/50 transition-colors">
                                        <div className="flex justify-between items-center mb-1">
                                            <div className="text-[10px] text-orange-300/80 font-medium">
                                                {match.network || 'N/A'}
                                            </div>
                                            <div className="text-[10px] uppercase font-bold tracking-wider">
                                                {renderGameState(match)}
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center py-0.5">
                                            <div className="flex items-center gap-2">
                                                {match.away.rank && <span className="text-[10px] text-slate-400">#{match.away.rank}</span>}
                                                <span className="font-medium text-slate-200">{match.away.names.short}</span>
                                            </div>
                                            <span className="font-bold">{match.away.score || '-'}</span>
                                        </div>

                                        <div className="flex justify-between items-center py-0.5">
                                            <div className="flex items-center gap-2">
                                                {match.home.rank && <span className="text-[10px] text-slate-400">#{match.home.rank}</span>}
                                                <span className="font-medium text-slate-200">{match.home.names.short}</span>
                                            </div>
                                            <span className="font-bold">{match.home.score || '-'}</span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-3 space-y-4 pt-2">
                        {news.length === 0 ? (
                            <div className="text-xs text-slate-500 text-center mt-4">No news available</div>
                        ) : (
                            news.map((item, idx) => {
                                const date = new Date(item.pubDate);
                                return (
                                    <a key={idx} href={item.link} target="_blank" rel="noopener noreferrer" className="block group">
                                        <div className="flex gap-3">
                                            {item.image && (
                                                <img src={item.image} alt="News" className="w-16 h-16 object-cover rounded opacity-80 group-hover:opacity-100 transition-opacity" />
                                            )}
                                            <div className="flex-1">
                                                <h4 className="text-xs font-medium text-slate-200 group-hover:text-orange-300 transition-colors leading-tight line-clamp-3">
                                                    {item.title}
                                                </h4>
                                                <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-wide">
                                                    {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                );
                            })
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default NcaaPanel;
