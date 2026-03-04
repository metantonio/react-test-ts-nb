import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Newspaper, RefreshCcw, ExternalLink } from 'lucide-react';

interface NewsItem {
    title: string;
    link: string;
    pubDate: string;
    thumbnail: string;
    description: string;
    author: string;
}

// ESPN RSS → JSON via rss2json proxy (free, no key needed)
const FEEDS: Record<string, string> = {
    NBA: 'https://www.espn.com/espn/rss/nba/news',
    NCAA: 'https://www.espn.com/espn/rss/ncb/news',
};

const TABS = ['NBA', 'NCAA'] as const;
type Tab = typeof TABS[number];

interface NewsPanelProps {
    countryFilter?: string | null;
}

const NewsPanel: React.FC<NewsPanelProps> = ({ countryFilter }) => {
    const [activeTab, setActiveTab] = useState<Tab>('NBA');
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchNews = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const rssUrl = encodeURIComponent(FEEDS[activeTab]);
            const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}&api_key=0&count=12`);
            const data = await res.json();

            if (data.status === 'ok' && data.items) {
                setNews(data.items.map((item: {
                    title?: string;
                    link?: string;
                    pubDate?: string;
                    thumbnail?: string;
                    description?: string;
                    author?: string;
                }) => ({
                    title: item.title ?? '',
                    link: item.link ?? '#',
                    pubDate: item.pubDate ?? '',
                    thumbnail: item.thumbnail ?? '',
                    description: item.description ?? '',
                    author: item.author ?? 'ESPN',
                })));
            } else {
                setError('Could not load ESPN headlines right now.');
            }
        } catch {
            setError('Failed to fetch ESPN RSS feed.');
        } finally {
            setLoading(false);
        }
    }, [activeTab]);

    useEffect(() => {
        fetchNews();
    }, [fetchNews]);

    return (
        <Card className="w-80 bg-slate-900/80 border-slate-700 text-white backdrop-blur-md shadow-xl flex flex-col h-[460px]">
            <CardHeader className="pb-2 border-b border-slate-800 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 uppercase tracking-wider text-green-400">
                    <Newspaper size={16} />
                    <span>ESPN Headlines</span>
                    {countryFilter && (
                        <span className="font-normal text-blue-300 normal-case tracking-normal text-[10px]">• {countryFilter}</span>
                    )}
                </CardTitle>
                <button onClick={fetchNews} disabled={loading} className="text-slate-400 hover:text-white transition-colors">
                    <RefreshCcw size={14} className={loading ? 'animate-spin' : ''} />
                </button>
            </CardHeader>

            {/* NBA / NCAA tabs */}
            <div className="flex border-b border-slate-800">
                {TABS.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-2 text-xs font-bold transition-colors ${activeTab === tab
                                ? 'text-green-400 border-b-2 border-green-400 bg-slate-800/50'
                                : 'text-slate-500 hover:bg-slate-800/30'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <CardContent className="pt-3 flex-1 overflow-y-auto custom-scrollbar">
                {loading ? (
                    <div className="flex justify-center mt-10">
                        <span className="text-slate-400 text-xs animate-pulse">Loading ESPN headlines...</span>
                    </div>
                ) : error ? (
                    <div className="text-center mt-8 px-3">
                        <p className="text-slate-500 text-xs">{error}</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {news.map((item, idx) => {
                            const date = item.pubDate ? new Date(item.pubDate) : null;
                            return (
                                <a
                                    key={idx}
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex gap-3"
                                >
                                    {item.thumbnail && (
                                        <img
                                            src={item.thumbnail}
                                            alt=""
                                            className="w-16 h-16 object-cover rounded flex-shrink-0 opacity-90 group-hover:opacity-100 transition-opacity"
                                            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                                        />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-xs font-medium text-slate-200 group-hover:text-green-300 transition-colors leading-tight line-clamp-3">
                                            {item.title}
                                        </h4>
                                        <div className="flex items-center justify-between mt-1 gap-1">
                                            <span className="text-[10px] text-slate-500 truncate">{item.author || 'ESPN'}</span>
                                            <div className="flex items-center gap-1 text-[10px] text-slate-600 shrink-0">
                                                {date && <span>{date.toLocaleDateString()}</span>}
                                                <ExternalLink size={9} className="text-slate-600 group-hover:text-green-500 transition-colors" />
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default NewsPanel;
