import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Newspaper, RefreshCcw } from 'lucide-react';

interface NewsItem {
    title: string;
    link: string;
    description: string;
    pubDate: string;
    source: string;
}

interface NewsPanelProps {
    countryFilter?: string | null;
}

const NewsPanel: React.FC<NewsPanelProps> = ({ countryFilter }) => {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchNcaaNews = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('https://ncaa-api.henrygd.me/news/basketball-men/d1');
            const data = await res.json();
            if (data.items) {
                const filtered: NewsItem[] = data.items.slice(0, 8).map((item: {
                    title: string;
                    link: string;
                    description: string;
                    pubDate: string;
                    creator?: string;
                }) => ({
                    title: item.title,
                    link: item.link,
                    description: item.description,
                    pubDate: item.pubDate,
                    source: item.creator || 'NCAA.com',
                }));
                setNews(filtered);
            }
        } catch (e) {
            console.warn('NewsPanel fetch failed:', e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchNcaaNews();
    }, [fetchNcaaNews, countryFilter]);

    const displayCountry = countryFilter || 'Global';

    return (
        <Card className="w-80 bg-slate-900/80 border-slate-700 text-white backdrop-blur-md shadow-xl flex flex-col h-[400px]">
            <CardHeader className="pb-2 border-b border-slate-800 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 uppercase tracking-wider text-green-400">
                    <Newspaper size={16} />
                    <span>Intelligence</span>
                    {countryFilter && (
                        <span className="font-normal text-blue-300 normal-case tracking-normal text-[10px]">• {countryFilter}</span>
                    )}
                </CardTitle>
                <button onClick={fetchNcaaNews} disabled={loading} className="text-slate-400 hover:text-white transition-colors">
                    <RefreshCcw size={14} className={loading ? 'animate-spin' : ''} />
                </button>
            </CardHeader>
            <CardContent className="pt-4 flex-1 overflow-y-auto custom-scrollbar">
                {loading && news.length === 0 ? (
                    <div className="flex justify-center mt-10">
                        <span className="text-slate-400 text-sm animate-pulse">Loading {displayCountry} news...</span>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {news.map((item, idx) => {
                            const date = new Date(item.pubDate);
                            return (
                                <a key={idx} href={item.link} target="_blank" rel="noopener noreferrer" className="block group">
                                    <h4 className="text-sm font-medium text-slate-200 group-hover:text-green-300 transition-colors leading-tight line-clamp-2">
                                        {item.title}
                                    </h4>
                                    <div className="flex justify-between items-center mt-1 text-[10px] text-slate-500 uppercase tracking-wide font-medium">
                                        <span>{item.source}</span>
                                        <span>{date.toLocaleDateString()}</span>
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
