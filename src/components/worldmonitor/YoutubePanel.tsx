import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Youtube, RefreshCcw, Video, AlertCircle } from 'lucide-react';

interface YoutubeVideo {
    id: {
        videoId: string;
    };
    snippet: {
        title: string;
        description: string;
        thumbnails: {
            medium: {
                url: string;
            };
        };
        channelTitle: string;
        publishedAt: string;
    };
}

const NETWORKS = ['ESPN', 'Fox Sports', 'Basketball Network'];
const TOPICS = ['NBA', 'NCAA'];

interface YoutubePanelProps {
    countryFilter?: string | null;
}

const YoutubePanel: React.FC<YoutubePanelProps> = ({ countryFilter }) => {
    const [videos, setVideos] = useState<YoutubeVideo[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeNetwork, setActiveNetwork] = useState(NETWORKS[0]);
    const [activeTopic, setActiveTopic] = useState(TOPICS[0]);

    const fetchVideos = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
            if (!apiKey) {
                throw new Error("Missing YouTube API Key setup");
            }

            const countryTerm = countryFilter ? `+${encodeURIComponent(countryFilter)}` : '';
            const query = encodeURIComponent(`${activeNetwork} ${activeTopic}`) + countryTerm;
            const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&order=date&maxResults=5&q=${query}&key=${apiKey}`;

            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) {
                if (data.error && data.error.code === 403) {
                    throw new Error("YouTube API Access Denied (403). Ensure API key is valid and 'YouTube Data API v3' is enabled in Google Cloud Console.");
                }
                throw new Error(data.error?.message || "Failed to fetch videos from YouTube");
            }

            setVideos(data.items || []);
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'An unknown error occurred';
            console.error('YouTube API Error:', err);
            setError(msg);
            setVideos([]);
        } finally {
            setLoading(false);
        }
    }, [activeNetwork, activeTopic, countryFilter]);

    useEffect(() => {
        fetchVideos();
    }, [fetchVideos]);

    return (
        <Card className="w-80 bg-slate-900/80 border-slate-700 text-white backdrop-blur-md shadow-xl flex flex-col h-[600px]">
            <CardHeader className="pb-2 border-b border-slate-800 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 uppercase tracking-wider text-red-500">
                    <Youtube size={16} />
                    Video Intelligence {countryFilter ? <span className="font-normal text-blue-300 normal-case tracking-normal text-[10px]">• {countryFilter}</span> : ''}
                </CardTitle>
                <button onClick={fetchVideos} className="text-slate-400 hover:text-white transition-colors" disabled={loading}>
                    <RefreshCcw size={14} className={loading ? 'animate-spin' : ''} />
                </button>
            </CardHeader>

            <div className="flex border-b border-slate-800">
                {NETWORKS.map(network => (
                    <button
                        key={network}
                        onClick={() => setActiveNetwork(network)}
                        className={`flex-1 py-2 text-[10px] font-semibold text-center transition-colors truncate px-1 ${activeNetwork === network ? 'text-red-400 border-b-2 border-red-500 bg-slate-800/50' : 'text-slate-500 hover:bg-slate-800/30'}`}
                    >
                        {network === 'Basketball Network' ? 'Bball Net' : network}
                    </button>
                ))}
            </div>

            <div className="flex border-b border-slate-800 bg-slate-900/40">
                {TOPICS.map(topic => (
                    <button
                        key={topic}
                        onClick={() => setActiveTopic(topic)}
                        className={`flex-1 py-1.5 text-xs font-semibold flex justify-center items-center gap-2 transition-colors ${activeTopic === topic ? 'text-white bg-slate-800 shadow-inner' : 'text-slate-500 hover:bg-slate-800/30'}`}
                    >
                        {topic}
                    </button>
                ))}
            </div>

            <CardContent className="pt-2 pb-2 pr-1 flex-1 overflow-hidden flex flex-col">
                {loading && videos.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-2">
                        <Video className="w-8 h-8 text-slate-600 animate-pulse" />
                        <span className="text-slate-500 text-xs animate-pulse">Searching YouTube...</span>
                    </div>
                ) : error ? (
                    <div className="flex-1 flex flex-col items-center justify-center px-4 text-center gap-3">
                        <AlertCircle className="w-8 h-8 text-red-500/80" />
                        <span className="text-red-400/90 text-xs">{error}</span>
                    </div>
                ) : videos.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center">
                        <span className="text-slate-500 text-xs">No videos found.</span>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-3 space-y-4">
                        {/* Featured Video (First Item) */}
                        <div className="bg-slate-800/50 rounded-lg overflow-hidden border border-slate-700 shadow-md">
                            <div className="relative w-full aspect-video">
                                <iframe
                                    src={`https://www.youtube.com/embed/${videos[0].id.videoId}`}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="absolute top-0 left-0 w-full h-full"
                                ></iframe>
                            </div>
                            <div className="p-2">
                                <h4 className="text-xs font-bold text-slate-100 leading-tight line-clamp-2" title={videos[0].snippet.title} dangerouslySetInnerHTML={{ __html: videos[0].snippet.title }}>
                                </h4>
                                <div className="flex justify-between items-center mt-1">
                                    <span className="text-[10px] text-slate-400">{videos[0].snippet.channelTitle}</span>
                                    <span className="text-[10px] text-red-400/80 font-medium uppercase tracking-wider">Latest</span>
                                </div>
                            </div>
                        </div>

                        {/* Recent Videos List */}
                        <div className="space-y-3 pt-1">
                            <h5 className="text-[10px] text-slate-500 font-bold uppercase tracking-wider pl-1">Related Videos</h5>
                            {videos.slice(1).map((video, idx) => {
                                const published = new Date(video.snippet.publishedAt);
                                return (
                                    <a
                                        key={idx}
                                        href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex gap-2 p-1.5 rounded hover:bg-slate-800/70 transition-colors border border-transparent hover:border-slate-700"
                                    >
                                        <div className="relative w-20 h-14 rounded overflow-hidden flex-shrink-0">
                                            <img
                                                src={video.snippet.thumbnails.medium.url}
                                                alt="Thumbnail"
                                                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                            />
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4
                                                className="text-[11px] font-medium text-slate-300 group-hover:text-red-400 transition-colors leading-tight line-clamp-2"
                                                dangerouslySetInnerHTML={{ __html: video.snippet.title }}
                                            />
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[9px] text-slate-500 truncate">{video.snippet.channelTitle}</span>
                                                <span className="text-[9px] text-slate-600">• {published.toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default YoutubePanel;
