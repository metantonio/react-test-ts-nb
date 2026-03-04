import React, { useEffect, useState, useCallback, useRef } from 'react';
import { X, Globe2, Trophy, Users, Loader2, AlertCircle, GripHorizontal, ExternalLink } from 'lucide-react';

// Wikidata – structured, free, no API key, CORS: Access-Control-Allow-Origin: *
const WD_ENTITY = 'https://www.wikidata.org/w/api.php';
const WD_SPARQL = 'https://query.wikidata.org/sparql';
const BASKETBALL_QID = 'Q5372'; // basketball sport entity in Wikidata

interface WDLeague {
    qid: string;
    name: string;
    logo?: string;
    article?: string;
}
interface WDTeam {
    qid: string;
    name: string;
    logo?: string;
}
interface LeagueWithTeams extends WDLeague {
    teams: WDTeam[];
    loading: boolean;
    loaded: boolean;
}
interface CountryInfoModalProps {
    country: { name: string; code: string } | null;
    onClose: () => void;
}

function flagEmoji(code: string): string {
    if (!code || code.length !== 2) return '🏀';
    return code.toUpperCase().replace(/./g, c =>
        String.fromCodePoint(127397 + c.charCodeAt(0))
    );
}
function qidFromUri(uri: string): string {
    return uri.replace('http://www.wikidata.org/entity/', '');
}

/** Step 1: resolve country name → Wikidata QID */
async function resolveCountryQID(name: string): Promise<string | null> {
    const url = `${WD_ENTITY}?action=wbsearchentities&search=${encodeURIComponent(name)}&language=en&type=item&limit=5&format=json&origin=*`;
    const res = await fetch(url);
    const data = await res.json();
    const results: { id: string; description?: string }[] = data.search ?? [];
    const country = results.find(r =>
        r.description && /country|state|nation|republic/i.test(r.description)
    ) ?? results[0];
    return country?.id ?? null;
}

/** Step 2: SPARQL – basketball leagues located in a country.
 *  Uses broader types and country-of-origin fallback to catch the NBA and others. */
async function fetchLeaguesForCountry(countryQID: string): Promise<WDLeague[]> {
    const sparql = `
SELECT DISTINCT ?league ?leagueLabel ?logo ?article WHERE {
  ?league wdt:P641 wd:${BASKETBALL_QID} ;
          wdt:P31/wdt:P279* ?type ;
          rdfs:label ?leagueLabel .
  { ?league wdt:P17 wd:${countryQID} . }
  UNION
  { ?league wdt:P495 wd:${countryQID} . }
  
  VALUES ?type { wd:Q15089 wd:Q6230 wd:Q15991275 wd:Q15991290 wd:Q18536323 }
  FILTER(LANG(?leagueLabel) = "en")
  OPTIONAL { ?league wdt:P154 ?logo . }
  OPTIONAL {
    ?article schema:about ?league ;
             schema:inLanguage "en" ;
             schema:isPartOf <https://en.wikipedia.org/> .
  }
}
ORDER BY ?leagueLabel
LIMIT 30`;
    const res = await fetch(`${WD_SPARQL}?query=${encodeURIComponent(sparql)}&format=json`, {
        headers: { Accept: 'application/sparql-results+json' }
    });
    const data = await res.json();
    return (data.results?.bindings ?? []).map((b: {
        league: { value: string };
        leagueLabel: { value: string };
        logo?: { value: string };
        article?: { value: string };
    }) => ({
        qid: qidFromUri(b.league.value),
        name: b.leagueLabel.value,
        logo: b.logo?.value,
        article: b.article?.value,
    }));
}

/** Step 3: SPARQL – teams in a specific league.
 *  Handles Wikidata's dual-entity issue and diverse team-type QIDs (Q133930, Q13393265). */
async function fetchTeamsForLeague(leagueQID: string, leagueName: string): Promise<WDTeam[]> {
    const sparql = `
SELECT DISTINCT ?team ?teamLabel ?logo WHERE {
  {
    ?otherLeague rdfs:label "${leagueName.replace(/"/g, '\\"')}"@en .
    { ?team wdt:P118 ?otherLeague . }
    UNION
    { ?otherLeague wdt:P1923 ?team . }
    UNION
    { ?team wdt:P463 ?otherLeague . }
  }
  UNION
  {
    { ?team wdt:P118 wd:${leagueQID} . }
    UNION
    { wd:${leagueQID} wdt:P1923 ?team . }
    UNION
    { ?team wdt:P463 wd:${leagueQID} . }
  }
  
  ?team rdfs:label ?teamLabel .
  FILTER(LANG(?teamLabel) = "en")
  
  # Must be a basketball team type
  ?team wdt:P31 ?teamType .
  VALUES ?teamType { wd:Q133930 wd:Q13393265 }
  
  # Exclude specific humans/topics linked accidentally
  FILTER NOT EXISTS { ?team wdt:P31 wd:Q5 } 
  
  OPTIONAL { ?team wdt:P154 ?logo . }
}
ORDER BY ?teamLabel
LIMIT 60`;
    const res = await fetch(`${WD_SPARQL}?query=${encodeURIComponent(sparql)}&format=json`, {
        headers: { Accept: 'application/sparql-results+json' }
    });
    const data = await res.json();
    return (data.results?.bindings ?? []).map((b: {
        team: { value: string };
        teamLabel: { value: string };
        logo?: { value: string };
    }) => ({
        qid: qidFromUri(b.team.value),
        name: b.teamLabel.value,
        logo: b.logo?.value,
    }));
}

const CountryInfoModal: React.FC<CountryInfoModalProps> = ({ country, onClose }) => {
    const [leagues, setLeagues] = useState<LeagueWithTeams[]>([]);
    const [activeLeagueIdx, setActiveLeagueIdx] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [centered, setCentered] = useState(true);
    const dragging = useRef(false);
    const dragStart = useRef({ mx: 0, my: 0, px: 0, py: 0 });
    const modalRef = useRef<HTMLDivElement>(null);

    const fetchLeagues = useCallback(async () => {
        if (!country) return;
        setLoading(true);
        setError(null);
        setLeagues([]);
        setActiveLeagueIdx(0);
        try {
            const qid = await resolveCountryQID(country.name);
            if (!qid) throw new Error('Country not found in Wikidata');
            const results = await fetchLeaguesForCountry(qid);
            if (results.length === 0) throw new Error('No basketball leagues found for this country.');
            setLeagues(results.map(l => ({ ...l, teams: [], loading: false, loaded: false })));
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Could not load data from Wikidata.');
        } finally {
            setLoading(false);
        }
    }, [country]);

    useEffect(() => {
        fetchLeagues();
        setCentered(true);
    }, [fetchLeagues]);

    const loadTeams = useCallback(async (idx: number) => {
        const league = leagues[idx];
        if (!league || league.loaded || league.loading) return;
        setLeagues(prev => prev.map((l, i) => i === idx ? { ...l, loading: true } : l));
        try {
            const teams = await fetchTeamsForLeague(league.qid, league.name);
            setLeagues(prev => prev.map((l, i) => i === idx ? { ...l, teams, loading: false, loaded: true } : l));
        } catch {
            setLeagues(prev => prev.map((l, i) => i === idx ? { ...l, loading: false, loaded: true } : l));
        }
    }, [leagues]);

    useEffect(() => {
        if (leagues.length > 0) loadTeams(activeLeagueIdx);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeLeagueIdx, leagues.length]);

    const onMouseDown = (e: React.MouseEvent) => {
        if (!modalRef.current) return;
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

                {loading && (
                    <div className="flex flex-col items-center justify-center py-12 gap-3">
                        <Loader2 size={26} className="text-blue-400 animate-spin" />
                        <span className="text-slate-400 text-sm">Loading from Wikidata...</span>
                    </div>
                )}

                {error && !loading && (
                    <div className="flex flex-col items-center justify-center py-10 gap-3 text-center px-4">
                        <AlertCircle size={24} className="text-slate-500" />
                        <p className="text-slate-500 text-sm">{error}</p>
                    </div>
                )}

                {!loading && leagues.length > 0 && (
                    <>
                        <div className="flex overflow-x-auto no-scrollbar border-b border-slate-700/60 bg-slate-900/60">
                            {leagues.map((league, idx) => (
                                <button
                                    key={league.qid}
                                    onMouseDown={e => e.stopPropagation()}
                                    onClick={() => setActiveLeagueIdx(idx)}
                                    title={league.name}
                                    className={`flex items-center gap-1.5 px-3 py-2.5 text-[10px] font-semibold whitespace-nowrap shrink-0 transition-colors border-b-2 ${idx === activeLeagueIdx
                                        ? 'text-blue-300 border-blue-400 bg-slate-800/60'
                                        : 'text-slate-500 border-transparent hover:text-slate-300 hover:bg-slate-800/30'
                                        }`}
                                >
                                    {league.logo ? (
                                        <img src={league.logo} alt="" className="w-4 h-4 object-contain"
                                            onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                                    ) : (
                                        <Trophy size={10} className="text-yellow-500" />
                                    )}
                                    <span className="max-w-[80px] truncate">{league.name}</span>
                                </button>
                            ))}
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
                            {activeLeague?.article && (
                                <a href={activeLeague.article} target="_blank" rel="noopener noreferrer"
                                    onMouseDown={e => e.stopPropagation()}
                                    className="flex items-center gap-1.5 text-[10px] text-blue-400 hover:text-blue-300 mb-3 transition-colors">
                                    <ExternalLink size={10} />
                                    <span>Read about {activeLeague.name} on Wikipedia</span>
                                </a>
                            )}

                            {activeLeague?.loading && (
                                <div className="flex items-center justify-center py-10 gap-2">
                                    <Loader2 size={18} className="text-blue-400 animate-spin" />
                                    <span className="text-slate-400 text-xs">Loading teams...</span>
                                </div>
                            )}

                            {activeLeague?.loaded && activeLeague.teams.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-10 gap-2">
                                    <Users size={22} className="text-slate-600" />
                                    <p className="text-slate-500 text-xs">No teams found for this league in Wikidata.</p>
                                </div>
                            )}

                            {activeLeague?.loaded && activeLeague.teams.length > 0 && (
                                <div className="grid grid-cols-2 gap-2">
                                    {activeLeague.teams.map(team => (
                                        <div key={team.qid}
                                            className="flex items-center gap-2 text-xs text-slate-300 bg-slate-800/50 hover:bg-slate-700/60 rounded-xl px-2.5 py-2 border border-slate-700/40 transition-colors">
                                            {team.logo ? (
                                                <img src={team.logo} alt={team.name} className="w-6 h-6 object-contain flex-shrink-0"
                                                    onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                                            ) : (
                                                <Users size={12} className="text-slate-500 flex-shrink-0" />
                                            )}
                                            <span className="truncate">{team.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="px-4 py-1.5 border-t border-slate-800 text-[10px] text-slate-600 text-right">
                            via Wikidata / Wikipedia
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CountryInfoModal;
