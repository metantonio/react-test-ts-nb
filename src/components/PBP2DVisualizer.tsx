import React, { useMemo, useRef } from 'react';

interface Player {
    name: string;
    positions: string;
}

interface PlayerPos {
    x: number;
    y: number;
    name: string;
    team: 'away' | 'home';
    hasBall: boolean;
}

interface PBP2DVisualizerProps {
    scoreBoard: {
        away_player1: string; away_player2: string; away_player3: string; away_player4: string; away_player5: string;
        home_player1: string; home_player2: string; home_player3: string; home_player4: string; home_player5: string;
        quarter: number;
        away_score: number;
        home_score: number;
    } | null;
    currentPlay: string | undefined;
    playersAway: Player[];
    playersHome: Player[];
}

const COURT_WIDTH = 940;
const COURT_HEIGHT = 500;

const PBP2DVisualizer: React.FC<PBP2DVisualizerProps> = ({ scoreBoard, currentPlay, playersAway = [], playersHome = [] }) => {
    // Keep track of the last side a team was on to prevent flickering
    const lastPossession = useRef<'away' | 'home'>('away');
    const lastBallPos = useRef({ x: COURT_WIDTH / 2, y: COURT_HEIGHT / 2 });

    const positions = useMemo(() => {
        if (!scoreBoard) return null;

        const onCourtAway = [
            scoreBoard.away_player1, scoreBoard.away_player2, scoreBoard.away_player3,
            scoreBoard.away_player4, scoreBoard.away_player5
        ].map(n => n || "Unknown");

        const onCourtHome = [
            scoreBoard.home_player1, scoreBoard.home_player2, scoreBoard.home_player3,
            scoreBoard.home_player4, scoreBoard.home_player5
        ].map(n => n || "Unknown");

        const playText = currentPlay?.toLowerCase() || "";

        // Build name dictionaries for better matching
        const awayRoster = (playersAway || []).flatMap(p => [p.name, p.name.split(' ').pop() || '']);
        const homeRoster = (playersHome || []).flatMap(p => [p.name, p.name.split(' ').pop() || '']);
        // Improved name matching logic that returns the index of the mention
        const getMentionIndex = (name: string, team: 'away' | 'home') => {
            if (!name || name === "Unknown") return -1;
            const lower = name.toLowerCase();
            const lastName = lower.split(' ').pop() || '';

            const fullIdx = playText.lastIndexOf(lower);
            const lastIdx = lastName.length > 2 ? playText.lastIndexOf(lastName) : -1;
            const idx = Math.max(fullIdx, lastIdx);

            if (idx === -1) return -1;

            // Validate against roster to prevent cross-team mismatches
            const roster = team === 'away' ? awayRoster : homeRoster;
            const isAuthentic = roster.some(r => r.toLowerCase() === lower || r.toLowerCase() === lastName);
            return isAuthentic ? idx : -1;
        };

        // Possession detection based on mentions
        let currentPos = lastPossession.current;
        const awayMentions = onCourtAway.map(p => getMentionIndex(p, 'away'));
        const homeMentions = onCourtHome.map(p => getMentionIndex(p, 'home'));

        const maxAwayIdx = Math.max(...awayMentions);
        const maxHomeIdx = Math.max(...homeMentions);

        if (maxAwayIdx > maxHomeIdx || playText.includes("hawks") || playText.includes("atlanta")) {
            currentPos = 'away';
        } else if (maxHomeIdx > maxAwayIdx || playText.includes("celtics") || playText.includes("boston")) {
            currentPos = 'home';
        }
        lastPossession.current = currentPos;

        // Sides
        const awaySide = scoreBoard.quarter <= 2 ? 0 : 1;
        const homeSide = scoreBoard.quarter <= 2 ? 1 : 0;
        const isAwayOffense = currentPos === 'away';

        const locations: Record<string, { x: number, y: number }> = {
            'corner': { x: 50, y: 50 },
            'baseline': { x: 30, y: 250 },
            'wing': { x: 220, y: 100 },
            'lane': { x: 150, y: 250 },
            'paint': { x: 120, y: 250 },
            'foul line': { x: 190, y: 250 },
            'top of the key': { x: 380, y: 250 },
            'high post': { x: 220, y: 250 },
            'low post': { x: 100, y: 300 },
            '3 point': { x: 320, y: 250 },
            'rim': { x: 55, y: 250 },
            'backboard': { x: 45, y: 250 },
            'upcourt': { x: 470, y: 250 },
        };

        const ballPos = { ...lastBallPos.current };
        const nodes: PlayerPos[] = [];

        const findActive = () => {
            if (maxAwayIdx === -1 && maxHomeIdx === -1) return null;
            if (maxAwayIdx >= maxHomeIdx) {
                const idx = awayMentions.indexOf(maxAwayIdx);
                return { name: onCourtAway[idx], team: 'away' as const };
            } else {
                const idx = homeMentions.indexOf(maxHomeIdx);
                return { name: onCourtHome[idx], team: 'home' as const };
            }
        };
        const active = findActive();

        if (playText.includes("start of") || playText.includes("jump ball")) {
            ballPos.x = 470; ballPos.y = 250;
        }

        // Render Away
        onCourtAway.forEach((n, i) => {
            const offence = isAwayOffense;
            const side = offence ? awaySide : homeSide;
            let x = side === 0 ? 150 : 790;
            let y = [100, 200, 250, 300, 400][i];

            if (active?.name === n && active.team === 'away') {
                for (const [k, v] of Object.entries(locations)) {
                    if (playText.includes(k)) {
                        const loc = side === 0 ? v : { x: COURT_WIDTH - v.x, y: v.y };
                        x = loc.x; y = loc.y;
                        ballPos.x = x; ballPos.y = y;
                        break;
                    }
                }
                if (ballPos.x === lastBallPos.current.x) { // If no location found but player active
                    ballPos.x = x; ballPos.y = y;
                }
            }
            nodes.push({ x, y, name: n, team: 'away', hasBall: active?.name === n && active.team === 'away' });
        });

        // Render Home
        onCourtHome.forEach((n, i) => {
            const offence = !isAwayOffense;
            const side = offence ? homeSide : awaySide;
            let x = side === 0 ? 150 : 790;
            let y = [120, 220, 270, 320, 420][i]; // Slightly offset from away to minimize overlap if center

            if (active?.name === n && active.team === 'home') {
                for (const [k, v] of Object.entries(locations)) {
                    if (playText.includes(k)) {
                        const loc = side === 0 ? v : { x: COURT_WIDTH - v.x, y: v.y };
                        x = loc.x; y = loc.y;
                        ballPos.x = x; ballPos.y = y;
                        break;
                    }
                }
                if (ballPos.x === lastBallPos.current.x) {
                    ballPos.x = x; ballPos.y = y;
                }
            }
            nodes.push({ x, y, name: n, team: 'home', hasBall: active?.name === n && active.team === 'home' });
        });

        lastBallPos.current = ballPos;
        return { players: nodes, ball: ballPos };
    }, [scoreBoard, currentPlay, playersAway, playersHome]);

    if (!scoreBoard || !positions) return null;

    return (
        <div className="relative w-full aspect-[94/50] rounded-lg overflow-hidden shadow-2xl border-4 border-gray-800 bg-[#f3d299]">
            {/* Parquet Texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: 'repeating-linear-gradient(90deg, #000, #000 2px, transparent 2px, transparent 40px), repeating-linear-gradient(0deg, #000, #000 2px, transparent 2px, transparent 120px)' }} />

            <svg viewBox={`0 0 ${COURT_WIDTH} ${COURT_HEIGHT}`} className="absolute inset-0 w-full h-full">
                <rect x="0" y="0" width={COURT_WIDTH} height={COURT_HEIGHT} fill="none" stroke="white" strokeWidth="4" />
                <line x1={COURT_WIDTH / 2} y1="0" x2={COURT_WIDTH / 2} y2={COURT_HEIGHT} stroke="white" strokeWidth="3" />
                <circle cx={COURT_WIDTH / 2} cy={COURT_HEIGHT / 2} r="60" fill="none" stroke="white" strokeWidth="3" />

                {/* Left Side */}
                <path d="M 0 40 L 220 40 Q 420 250 220 460 L 0 460" fill="none" stroke="white" strokeWidth="3" /> {/* 3pt Line */}
                <rect x="0" y="170" width="190" height="160" fill="rgba(255,255,255,0.05)" stroke="white" strokeWidth="3" />
                <circle cx="190" cy="250" r="60" fill="none" stroke="white" strokeWidth="3" />
                <line x1="30" y1="220" x2="30" y2="280" stroke="white" strokeWidth="5" />
                <circle cx="45" cy="250" r="12" fill="none" stroke="orange" strokeWidth="3" />

                {/* Right Side */}
                <path d={`M ${COURT_WIDTH} 40 L ${COURT_WIDTH - 220} 40 Q ${COURT_WIDTH - 420} 250 ${COURT_WIDTH - 220} 460 L ${COURT_WIDTH} 460`} fill="none" stroke="white" strokeWidth="3" />
                <rect x={COURT_WIDTH - 190} y="170" width="190" height="160" fill="rgba(255,255,255,0.05)" stroke="white" strokeWidth="3" />
                <circle cx={COURT_WIDTH - 190} cy="250" r="60" fill="none" stroke="white" strokeWidth="3" />
                <line x1={COURT_WIDTH - 30} y1="220" x2={COURT_WIDTH - 30} y2="280" stroke="white" strokeWidth="5" />
                <circle cx={COURT_WIDTH - 45} cy={COURT_HEIGHT / 2} r="12" fill="none" stroke="orange" strokeWidth="3" />
            </svg>

            {/* Players */}
            {positions.players.map((p, i) => (
                <div key={i}
                    className={`absolute rounded-full flex items-center justify-center font-bold text-white transition-all duration-500 ease-in-out border-2 shadow-lg
                        ${p.team === 'away' ? 'bg-red-600 border-red-200' : 'bg-blue-600 border-blue-200'}
                        ${p.hasBall ? 'z-30 ring-4 ring-yellow-400 shadow-[0_0_20px_rgba(255,255,0,0.6)]' : 'z-10'}`}
                    style={{
                        left: `${(p.x / COURT_WIDTH) * 100}%`,
                        top: `${(p.y / COURT_HEIGHT) * 100}%`,
                        transform: `translate(-50%, -50%) ${p.hasBall ? 'scale(1.5)' : 'scale(1)'}`,
                        width: '28px',
                        height: '28px',
                    }} >
                    <span className="text-[10px] font-black tracking-tighter drop-shadow-md">
                        {p.name !== "Unknown" ? p.name.split(' ').pop()?.substring(0, 3).toUpperCase() : "?"}
                    </span>
                </div>
            ))}

            {/* Ball */}
            <div className="absolute w-4 h-4 bg-orange-600 rounded-full transition-all duration-500 ease-out border-2 border-black shadow-xl"
                style={{
                    left: `${(positions.ball.x / COURT_WIDTH) * 100}%`,
                    top: `${(positions.ball.y / COURT_HEIGHT) * 100}%`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10
                }} />

            {/* Top Left: Ball Holder Name */}
            {positions.players.find(p => p.hasBall) && (
                <div className="absolute top-3 left-4 bg-black/70 backdrop-blur-sm px-4 py-1.5 rounded-lg border border-white/20 shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-left-4 z-40">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full animate-pulse ${positions.players.find(p => p.hasBall)?.team === 'away' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]'}`} />
                        <span className="text-white text-[12px] font-bold tracking-wide uppercase">
                            {positions.players.find(p => p.hasBall)?.name}
                        </span>
                    </div>
                </div>
            )}

            {/* Score Overlay (Top Right) */}
            <div className="absolute top-3 right-4 flex gap-4 bg-black/70 backdrop-blur-sm px-4 py-1 rounded-full border border-white/20 text-white text-[10px] font-mono z-40">
                <span className="text-red-400 font-bold">{scoreBoard.away_score}</span>
                <span className="opacity-50">VS</span>
                <span className="text-blue-400 font-bold">{scoreBoard.home_score}</span>
                <span className="ml-2 border-l border-white/20 pl-2">Q{scoreBoard.quarter}</span>
            </div>

            <div className="absolute bottom-3 left-4 right-4 bg-black/70 backdrop-blur-md p-2 rounded-lg text-[11px] text-white border border-white/10 shadow-2xl flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${lastPossession.current === 'away' ? 'bg-red-500' : 'bg-blue-500'} animate-pulse`} />
                <span className="flex-1 italic truncate">{currentPlay || "Waiting for action..."}</span>
            </div>
        </div>
    );
};

export default PBP2DVisualizer;
