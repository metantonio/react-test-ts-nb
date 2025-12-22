import React, { useMemo } from 'react';

interface PlayerPos {
    x: number;
    y: number;
    name: string;
    team: 'away' | 'home';
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
}

const COURT_WIDTH = 940;
const COURT_HEIGHT = 500;

const PBP2DVisualizer: React.FC<PBP2DVisualizerProps> = ({ scoreBoard, currentPlay }) => {
    const positions = useMemo<{ players: PlayerPos[]; ball: { x: number; y: number } } | null>(() => {
        if (!scoreBoard) return null;

        const awayPlayers = [
            scoreBoard.away_player1, scoreBoard.away_player2, scoreBoard.away_player3,
            scoreBoard.away_player4, scoreBoard.away_player5
        ].filter(Boolean);
        const homePlayers = [
            scoreBoard.home_player1, scoreBoard.home_player2, scoreBoard.home_player3,
            scoreBoard.home_player4, scoreBoard.home_player5
        ].filter(Boolean);

        const playText = currentPlay?.toLowerCase() || "";

        // Determine which team has the ball
        // Simple logic: check if an away player or home player is mentioned in the active action
        const isAwayAction = awayPlayers.some(p => playText.includes(p.toLowerCase()));
        const isHomeAction = homePlayers.some(p => playText.includes(p.toLowerCase()));

        // Offensive side changes after halftime (Quarter 3)
        // Q1, Q2: Away attacks Left (0), Home attacks Right (1)
        // Q3, Q4: Away attacks Right (1), Home attacks Left (0)
        const awayOffenseSide = scoreBoard.quarter <= 2 ? 0 : 1;
        const homeOffenseSide = scoreBoard.quarter <= 2 ? 1 : 0;

        const currentOffenseSide = isAwayAction ? awayOffenseSide : (isHomeAction ? homeOffenseSide : (awayOffenseSide)); // Default to away offense for jump ball etc

        // Base positions relative to the offense side
        const getBasePos = (index: number, team: 'away' | 'home') => {
            const isOffense = (team === 'away' && isAwayAction) || (team === 'home' && isHomeAction);
            const side = team === 'away' ? (isOffense ? awayOffenseSide : homeOffenseSide) : (isOffense ? homeOffenseSide : awayOffenseSide);

            const baseX = side === 0 ? 150 : 790;
            const spreadY = [100, 200, 250, 300, 400];

            return {
                x: baseX + (Math.random() * 60 - 30),
                y: spreadY[index] + (Math.random() * 40 - 20)
            };
        };

        const locations: Record<string, { x: number, y: number }> = {
            'corner': { x: 50, y: 50 },
            'baseline': { x: 30, y: 250 },
            'wing': { x: 220, y: 100 },
            'lane': { x: 150, y: 250 },
            'paint': { x: 120, y: 250 },
            '3 point': { x: 320, y: 250 },
            'rim': { x: 55, y: 250 },
            'backboard': { x: 45, y: 250 },
            'upcourt': { x: 470, y: 250 },
            'half court': { x: 400, y: 250 },
        };

        const ballPos = { x: 470, y: 250 };
        const playerNodes: PlayerPos[] = [];

        // Common logic to place a player and the ball
        const setNodeAndBall = (name: string, team: 'away' | 'home', index: number) => {
            let pos = getBasePos(index, team);
            const teamOffenseSide = team === 'away' ? awayOffenseSide : homeOffenseSide;

            if (playText.includes(name.toLowerCase())) {
                let foundLoc = false;
                for (const [key, loc] of Object.entries(locations)) {
                    if (playText.includes(key)) {
                        pos = teamOffenseSide === 0 ? loc : { x: COURT_WIDTH - loc.x, y: loc.y };
                        ballPos.x = pos.x; ballPos.y = pos.y;
                        foundLoc = true;
                        break;
                    }
                }
                if (!foundLoc) {
                    ballPos.x = pos.x; ballPos.y = pos.y;
                }
            }
            playerNodes.push({ ...pos, name, team });
        };

        awayPlayers.forEach((name, i) => setNodeAndBall(name, 'away', i));
        homePlayers.forEach((name, i) => setNodeAndBall(name, 'home', i));

        return { players: playerNodes, ball: ballPos };
    }, [scoreBoard, currentPlay]);

    if (!scoreBoard || !positions) return null;

    return (
        <div className="relative w-full aspect-[94/50] rounded-lg overflow-hidden shadow-2xl border-4 border-gray-800"
            style={{
                background: 'linear-gradient(45deg, #f3d299 25%, #eed090 25%, #eed090 50%, #f3d299 50%, #f3d299 75%, #eed090 75%, #eed090 100%)',
                backgroundSize: '40px 40px'
            }}>
            {/* Wood Parquet Overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, #000, #000 1px, transparent 1px, transparent 10px)' }}></div>

            {/* Court Lines SVG */}
            <svg viewBox={`0 0 ${COURT_WIDTH} ${COURT_HEIGHT}`} className="absolute inset-0 w-full h-full">
                {/* Borders */}
                <rect x="0" y="0" width={COURT_WIDTH} height={COURT_HEIGHT} fill="none" stroke="white" strokeWidth="6" />

                {/* Midcourt */}
                <line x1={COURT_WIDTH / 2} y1="0" x2={COURT_WIDTH / 2} y2={COURT_HEIGHT} stroke="white" strokeWidth="4" />
                <circle cx={COURT_WIDTH / 2} cy={COURT_HEIGHT / 2} r="60" fill="none" stroke="white" strokeWidth="4" />

                {/* Left Side */}
                <path d="M 0 50 Q 350 250 0 450" fill="none" stroke="white" strokeWidth="4" /> {/* 3pt Arc */}
                <rect x="0" y="170" width="190" height="160" fill="rgba(255,255,255,0.1)" stroke="white" strokeWidth="4" /> {/* Key */}
                <circle cx="190" cy="250" r="60" fill="none" stroke="white" strokeWidth="4" /> {/* Free Throw Circle */}
                <line x1="40" y1="220" x2="40" y2="280" stroke="white" strokeWidth="6" /> {/* Backboard */}
                <circle cx="55" cy="250" r="15" fill="none" stroke="orange" strokeWidth="3" /> {/* Rim */}

                {/* Right Side */}
                <path d={`M ${COURT_WIDTH} 50 Q ${COURT_WIDTH - 350} 250 ${COURT_WIDTH} 450`} fill="none" stroke="white" strokeWidth="4" /> {/* 3pt Arc */}
                <rect x={COURT_WIDTH - 190} y="170" width="190" height="160" fill="rgba(255,255,255,0.1)" stroke="white" strokeWidth="4" /> {/* Key */}
                <circle cx={COURT_WIDTH - 190} cy="250" r="60" fill="none" stroke="white" strokeWidth="4" /> {/* Free Throw Circle */}
                <line x1={COURT_WIDTH - 40} y1="220" x2={COURT_WIDTH - 40} y2="280" stroke="white" strokeWidth="6" /> {/* Backboard */}
                <circle cx={COURT_WIDTH - 55} cy="250" r="15" fill="none" stroke="orange" strokeWidth="3" /> {/* Rim */}
            </svg>

            {/* Players */}
            {positions.players.map((p, i) => (
                <div
                    key={i}
                    className={`absolute w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white transition-all duration-700 ease-in-out border-2 border-white shadow-lg
            ${p.team === 'away' ? 'bg-red-600' : 'bg-blue-600'}`}
                    style={{
                        left: `${(p.x / COURT_WIDTH) * 100}%`,
                        top: `${(p.y / COURT_HEIGHT) * 100}%`,
                        transform: 'translate(-50%, -50%)',
                        zIndex: 5
                    }}
                    title={p.name}
                >
                    {p.name?.substring(0, 1)}
                </div>
            ))}

            {/* Ball */}
            <div
                className="absolute w-4 h-4 bg-orange-500 rounded-full transition-all duration-500 ease-out border-2 border-black shadow-xl"
                style={{
                    left: `${(positions.ball.x / COURT_WIDTH) * 100}%`,
                    top: `${(positions.ball.y / COURT_HEIGHT) * 100}%`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10
                }}
            >
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[1px] h-full bg-black/30"></div>
                    <div className="h-[1px] w-full bg-black/30"></div>
                </div>
            </div>

            {/* Legend & Stats Overlay */}
            <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                <div className="bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-[10px] text-white flex gap-3">
                    <div className="flex items-center gap-1"><div className="w-2 h-2 bg-red-600 rounded-full"></div> {scoreBoard.away_score}</div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-600 rounded-full"></div> {scoreBoard.home_score}</div>
                    <div className="font-mono">Q{scoreBoard.quarter}</div>
                </div>
            </div>

            <div className="absolute bottom-2 left-2 max-w-[60%] bg-black/40 backdrop-blur-sm p-1 rounded text-[10px] text-white italic truncate">
                {currentPlay || "Waiting for tip-off..."}
            </div>
        </div>
    );
};

export default PBP2DVisualizer;
