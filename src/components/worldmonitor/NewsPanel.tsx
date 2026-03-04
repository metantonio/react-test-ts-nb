import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Newspaper, RefreshCcw, ExternalLink } from 'lucide-react';

interface NewsItem {
    title: string;
    link: string;
    pubDate: string;
    thumbnail: string;
}

// Proxy raw RSS XML through allorigins.win (free, reliable, no key needed)
function proxyUrl(url: string) {
    return `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
}

const SOURCES = ['ESPN', 'Fox Sports'] as const;
const TOPICS = ['NBA', 'NCAA'] as const;
type Source = typeof SOURCES[number];
type Topic = typeof TOPICS[number];

// Google News RSS filtered by site — most reliable cross-origin approach
function buildGoogleNewsUrl(source: Source, topic: Topic): string {
    const siteFilter =
        source === 'ESPN' ? 'site:espn.com' : 'site:foxsports.com';
    const topicQuery =
        topic === 'NCAA' ? 'college basketball' : 'NBA';
    return `https://news.google.com/rss/search?q=${encodeURIComponent(topicQuery + ' ' + siteFilter)}&hl=en-US&gl=US&ceid=US:en`;
}

function parseRSS(xml: string): NewsItem[] {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'application/xml');
    const items = Array.from(doc.querySelectorAll('item'));
    return items.slice(0, 12).map(item => {
        let thumbnail = '';
        const mediaThumbnail = item.querySelector('thumbnail');
        const enclosure = item.querySelector('enclosure');
        if (mediaThumbnail) thumbnail = mediaThumbnail.getAttribute('url') ?? '';
        else if (enclosure) thumbnail = enclosure.getAttribute('url') ?? '';

        // Google News wraps the real link in <link> as CDATA after <title>
        // The textContent of <link> is empty; use nextSibling trick
        const linkEl = item.querySelector('link');
        let link = '#';
        if (linkEl) {
            // Google News puts the URL in a sibling text node after <link/>
            const next = linkEl.nextSibling;
            if (next?.nodeType === Node.TEXT_NODE && next.textContent?.startsWith('http')) {
                link = next.textContent.trim();
            } else {
                link = linkEl.textContent?.trim() || '#';
            }
        }

        return {
            title: item.querySelector('title')?.textContent?.trim() ?? '',
            link,
            pubDate: item.querySelector('pubDate')?.textContent ?? '',
            thumbnail,
        };
    });
}

interface NewsPanelProps {
    countryFilter?: string | null;
}

const SOURCE_COLORS: Record<Source, string> = {
    'ESPN': 'text-orange-400 border-orange-400',
    'Fox Sports': 'text-blue-400 border-blue-400',
};

const NewsPanel: React.FC<NewsPanelProps> = ({ countryFilter }) => {
    const [activeSource, setActiveSource] = useState<Source>('ESPN');
    const [activeTopic, setActiveTopic] = useState<Topic>('NBA');
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchNews = useCallback(async () => {
        setLoading(true);
        setError(null);
        setNews([]);
        try {
            const feedUrl = buildGoogleNewsUrl(activeSource, activeTopic);
            const res = await fetch(proxyUrl(feedUrl), { cache: 'no-store' });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const text = await res.text();
            const parsed = parseRSS(text);
            if (parsed.length === 0) throw new Error('No articles found in feed');
            setNews(parsed);
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : 'Unknown error';
            console.error('News RSS error:', msg);
            setError(`Could not load ${activeSource} headlines: ${msg}`);
        } finally {
            setLoading(false);
        }
    }, [activeSource, activeTopic]);

    useEffect(() => {
        fetchNews();
    }, [fetchNews]);

    const activeColor = SOURCE_COLORS[activeSource];

    return (
        <Card className="w-80 bg-slate-900/80 border-slate-700 text-white backdrop-blur-md shadow-xl flex flex-col h-[480px]">
            <CardHeader className="pb-2 border-b border-slate-800 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 uppercase tracking-wider text-green-400">
                    <Newspaper size={16} />
                    <span>Headlines</span>
                    {countryFilter && (
                        <span className="font-normal text-blue-300 normal-case tracking-normal text-[10px]">• {countryFilter}</span>
                    )}
                </CardTitle>
                <button onClick={fetchNews} disabled={loading} className="text-slate-400 hover:text-white transition-colors">
                    <RefreshCcw size={14} className={loading ? 'animate-spin' : ''} />
                </button>
            </CardHeader>

            {/* Source selector: ESPN / Fox Sports */}
            <div className="flex border-b border-slate-800">
                {SOURCES.map(src => (
                    <button
                        key={src}
                        onClick={() => setActiveSource(src)}
                        className={`flex-1 py-2 text-[10px] font-bold transition-colors ${activeSource === src
                                ? `${SOURCE_COLORS[src]} border-b-2 bg-slate-800/50`
                                : 'text-slate-500 hover:bg-slate-800/30'
                            }`}
                    >
                        {src}
                    </button>
                ))}
            </div>

            {/* Topic selector: NBA / NCAA */}
            <div className="flex border-b border-slate-800 bg-slate-900/40">
                {TOPICS.map(topic => (
                    <button
                        key={topic}
                        onClick={() => setActiveTopic(topic)}
                        className={`flex-1 py-1.5 text-xs font-semibold transition-colors ${activeTopic === topic
                                ? `text-white bg-slate-800/80 border-b-2 ${activeColor}`
                                : 'text-slate-500 hover:bg-slate-800/30'
                            }`}
                    >
                        {topic}
                    </button>
                ))}
            </div>

            <CardContent className="pt-3 pb-2 pr-1 flex-1 overflow-y-auto custom-scrollbar">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <span className="text-slate-400 text-xs animate-pulse">
                            Loading {activeSource} {activeTopic} news...
                        </span>
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center h-full px-4 text-center">
                        <p className="text-slate-500 text-xs">{error}</p>
                    </div>
                ) : (
                    <div className="space-y-4 pr-3">
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
                                            className="w-14 h-10 object-cover rounded flex-shrink-0 opacity-90 group-hover:opacity-100 transition-opacity"
                                            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                                        />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-xs font-medium text-slate-200 group-hover:text-green-300 transition-colors leading-tight line-clamp-3">
                                            {item.title}
                                        </h4>
                                        <div className="flex items-center justify-between mt-1 gap-1">
                                            <span className="text-[10px] text-slate-500">{activeSource}</span>
                                            <div className="flex items-center gap-1 text-[10px] text-slate-600 shrink-0">
                                                {date && <span>{date.toLocaleDateString()}</span>}
                                                <ExternalLink size={9} className="group-hover:text-green-500 transition-colors" />
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
