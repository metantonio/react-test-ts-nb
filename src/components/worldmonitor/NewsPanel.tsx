import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Newspaper } from 'lucide-react';

const mockNews = [
    { id: 1, title: 'Lakers secure dramatic overtime victory against Celtics', source: 'ESPN', time: '2h ago' },
    { id: 2, title: 'Euroleague: Real Madrid edges out Barcelona in El Clasico', source: 'Eurohoops', time: '4h ago' },
    { id: 3, title: 'Wembanyama breaks rookie block record', source: 'NBA.com', time: '5h ago' },
    { id: 4, title: 'FIBA World Cup dates announced for 2027', source: 'FIBA', time: '1d ago' },
];

const NewsPanel: React.FC = () => {
    return (
        <Card className="w-80 bg-slate-900/80 border-slate-700 text-white backdrop-blur-md shadow-xl flex flex-col h-[400px]">
            <CardHeader className="pb-2 border-b border-slate-800">
                <CardTitle className="text-sm font-semibold flex items-center gap-2 uppercase tracking-wider text-green-400">
                    <Newspaper size={16} />
                    Global Intelligence
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 flex-1 overflow-y-auto custom-scrollbar">
                <div className="space-y-4">
                    {mockNews.map(news => (
                        <div key={news.id} className="group cursor-pointer">
                            <h4 className="text-sm font-medium text-slate-200 group-hover:text-green-300 transition-colors leading-tight">
                                {news.title}
                            </h4>
                            <div className="flex justify-between items-center mt-1 text-[10px] text-slate-500 uppercase tracking-wide font-medium">
                                <span>{news.source}</span>
                                <span>{news.time}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default NewsPanel;
