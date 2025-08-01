import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '@/contexts/ApiContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';

interface Message {
  message: string;
}

interface League {
  league_name: string;
}

interface LeagueResponse {
  data: League[];
}

interface Teams {
  teams: string;
}

interface TeamsResponse {
  data: Teams[];
}

interface PlayerChar {
  name: string;
  position: string;
  poss_fact: string;
  two_pt_fg_pct: string;
  ft_pct: string;
  pct_shot: string;
  three_pt_pct_shot: string;
  pct_fouled: string;
  pct_to: string;
  pct_pass: string;
  off_reb: string;
  def_reb: string;
  def_fg_pct: string;
  pct_pf: string;
  pct_st: string;
  pct_bs: string;
  year: string;
  team_code: string;
  height: string;
  deny_fact: string;
}

interface PlayerCharResponse {
  data: PlayerChar[];
}

interface PlayPredictResponse {
  data: PlayerChar[];
}


const GameSetup = () => {
  const { fetchWithAuth, isLoading } = useApi();
  const [leagues, setLeagues] = useState<League[]>([{ league_name: "dummy data league" }]);
  const [error, setError] = useState<string | null>(null);
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
  const [teams, setTeams] = useState<Teams[]>([{ teams: "dummy data teams 1" }, { teams: "dummy data teams 2" }]);
  const [selectedTeams1, setSelectedTeams1] = useState<Teams | null>(null);
  const [selectedTeams2, setSelectedTeams2] = useState<Teams | null>(null);
  const [playersTeam1, setPlayersTeam1] = useState<PlayerChar[]>([{
    name: "dummy data",
    position: "dummy data",
    poss_fact: "dummy data",
    two_pt_fg_pct: "dummy data",
    ft_pct: "dummy data",
    pct_shot: "dummy data",
    three_pt_pct_shot: "dummy data",
    pct_fouled: "dummy data",
    pct_to: "dummy data",
    pct_pass: "dummy data",
    off_reb: "dummy data",
    def_reb: "dummy data",
    def_fg_pct: "dummy data",
    pct_pf: "dummy data",
    pct_st: "dummy data",
    pct_bs: "dummy data",
    year: "dummy data",
    team_code: "dummy data",
    height: "dummy data",
    deny_fact: "dummy data",
  }]);
  const [playersTeam2, setPlayersTeam2] = useState<PlayerChar[]>([{
    name: "dummy data",
    position: "dummy data",
    poss_fact: "dummy data",
    two_pt_fg_pct: "dummy data",
    ft_pct: "dummy data",
    pct_shot: "dummy data",
    three_pt_pct_shot: "dummy data",
    pct_fouled: "dummy data",
    pct_to: "dummy data",
    pct_pass: "dummy data",
    off_reb: "dummy data",
    def_reb: "dummy data",
    def_fg_pct: "dummy data",
    pct_pf: "dummy data",
    pct_st: "dummy data",
    pct_bs: "dummy data",
    year: "dummy data",
    team_code: "dummy data",
    height: "dummy data",
    deny_fact: "dummy data",
  }]);
  const navigate = useNavigate();

  const handleFetchLeagues = async () => {
    setError(null);
    try {
      const response = await fetchWithAuth('http://api.bballsports.com/simulationAPI/get_leagues.php', 'POST');
      if (!response.ok) {
        const err: Message = await response.json();
        setError(`error: ${err.message}`);
        throw new Error('Failed to fetch leagues.');
      }
      const data: LeagueResponse = await response.json();
      setLeagues(data.data);
    } catch (err: any) {
      //console.log("error: ", err)
      setError(`${err}`);
    }
  };

  const handleFetchTeams = async () => {
    setError(null);
    try {
      const response = await fetchWithAuth('http://api.bballsports.com/simulationAPI/get_teams.php', 'POST', selectedLeague);
      if (!response.ok) {
        const err: Message = await response.json();
        setError(`error: ${err.message}`);
        throw new Error('Failed to fetch teams.');
      }
      const data: TeamsResponse = await response.json();
      setTeams(data.data);
    } catch (err: any) {
      //console.log("error: ", err)
      setError(`${err}`);
    }
  };

  const handleFetchPlayersTeam1 = async () => {
    setError(null);
    try {
      const response = await fetchWithAuth('http://api.bballsports.com/simulationAPI/get_players_chars.php', 'POST', { ...selectedLeague, team_name: selectedTeams1?.teams });
      if (!response.ok) {
        const err: Message = await response.json();
        setError(`error: ${err.message}`);
        throw new Error('Failed to fetch teams.');
      }
      const data: PlayerCharResponse = await response.json();
      setPlayersTeam1(data.data);
    } catch (err: any) {
      //console.log("error: ", err)
      setError(`${err}`);
    }
  };

  const handleFetchPlayersTeam2 = async () => {
    setError(null);
    try {
      const response = await fetchWithAuth('http://api.bballsports.com/simulationAPI/get_players_chars.php', 'POST', { ...selectedLeague, team_name: selectedTeams2?.teams });
      if (!response.ok) {
        const err: Message = await response.json();
        setError(`error: ${err.message}`);
        throw new Error('Failed to fetch teams.');
      }
      const data: PlayerCharResponse = await response.json();
      setPlayersTeam2(data.data);
    } catch (err: any) {
      //console.log("error: ", err)
      setError(`${err}`);
    }
  };

  const handleSingleGameInitial = async () => {
    setError(null);
    try {
      const response = await fetchWithAuth('http://api.bballsports.com/simulationAPI/playsinglegame_initial.php', 'POST', { homeaway: "away", awayleague_name: selectedLeague?.league_name, homeleague_name: selectedLeague?.league_name, hometeam: selectedTeams2?.teams, awayteam: selectedTeams1?.teams });
      if (!response.ok) {
        const err: Message = await response.json();
        setError(`error: ${err.message}`);
        throw new Error('Failed to fetch teams.');
      }
      const data: PlayerCharResponse = await response.json();
      console.log("play single game initial: ", data)
      setPlayersTeam2(data.data);
    } catch (err: any) {
      //console.log("error: ", err)
      setError(`${err}`);
    }
  };

  const goLoginPage = () => {
    navigate('/')
  }

  useEffect(() => {
    const loadTeams = async () => {
      const loadedTeams = await handleFetchTeams()
      return loadedTeams;
    }

    if (selectedLeague) {
      loadTeams()
    }
  }, [selectedLeague])

  useEffect(() => {
    const loadPlayers = async () => {
      const loadedData = await handleFetchPlayersTeam1()
      return loadedData;
    }

    if (selectedTeams1) {
      loadPlayers()
    }
  }, [selectedTeams1])

  useEffect(() => {
    const loadPlayers = async () => {
      const loadedData = await handleFetchPlayersTeam2()
      return loadedData;
    }

    if (selectedTeams2) {
      loadPlayers()
    }
  }, [selectedTeams2])

  useEffect(() => {
    const loadGameInitial = async () => {
      const loadedData = await handleSingleGameInitial()
      return loadedData;
    }

    if (selectedTeams1 && selectedTeams2) {
      loadGameInitial()
    }
  }, [selectedTeams1, selectedTeams2])

  return (
    <div className="p-4">
      <Button onClick={goLoginPage} disabled={isLoading}>
        Go to Login
      </Button>
      <h1 className="text-2xl font-bold mb-4">NBA Leagues Names</h1>
      <Button onClick={handleFetchLeagues} disabled={isLoading}>
        {isLoading ? 'Fetching...' : 'Fetch Leagues'}
      </Button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      <div className="flex flex-row gap-4 items-center">
        <label htmlFor="leagues-dropdown">Leagues</label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button id="leagues-dropdown" variant="outline" className="mt-4 ml-4" disabled={leagues.length === 0}>
              {selectedLeague ? selectedLeague.league_name : "Select a League"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent style={{ backgroundColor: 'var(--bg-color-component)' }} className="h-[200px] overflow-y-auto">
            {leagues && leagues.map((league, index) => (
              <DropdownMenuItem key={index} onSelect={() => setSelectedLeague(league)}>
                {league.league_name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <label htmlFor="teams-dropdown-1">Away Team</label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button id="teams-dropdown-1" variant="outline" className="mt-4 ml-4" disabled={leagues.length === 0}>
              {selectedLeague && selectedTeams1 ? selectedTeams1.teams : selectedLeague ? "Select a Team 1" : "Select a League first"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent style={{ backgroundColor: 'var(--bg-color-component)' }} className="h-[200px] overflow-y-auto">
            {teams && teams.map((item, index) => (
              <DropdownMenuItem key={index} onSelect={() => {
                if (selectedLeague) {
                  setSelectedTeams1(item)
                }
              }}>
                {item.teams}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <label htmlFor="teams-dropdown-2">Home Team</label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button id="teams-dropdown-2" variant="outline" className="mt-4 ml-4" disabled={leagues.length === 0}>
              {selectedLeague && selectedTeams2 ? selectedTeams2.teams : selectedLeague ? "Select a Team 2" : "Select a League first"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent style={{ backgroundColor: 'var(--bg-color-component)' }} className="h-[200px] overflow-y-auto">
            {teams && teams.map((item, index) => (
              <DropdownMenuItem key={index} onSelect={() => {
                if (selectedLeague) {
                  setSelectedTeams2(item)
                }
              }}>
                {item.teams}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-row gap-4">
        {playersTeam1.length > 0 && (
          <div className="w-1/2">
            <h2 className="text-xl font-bold mt-8 mb-4">{selectedTeams1?.teams}</h2>
            <Table className="border">
              <TableHeader>
                <TableRow>
                  <TableHead className="h-10">Name</TableHead>
                  <TableHead className="h-10">Position</TableHead>
                  <TableHead className="h-10">Poss Fact</TableHead>
                  <TableHead className="h-10">2pt FG Pct</TableHead>
                  <TableHead className="h-10">FT Pct</TableHead>
                  <TableHead className="h-10">Pct Shot</TableHead>
                  <TableHead className="h-10">3pt Pct Shot</TableHead>
                  <TableHead className="h-10">Pct Fouled</TableHead>
                  <TableHead className="h-10">Pct TO</TableHead>
                  <TableHead className="h-10">Pct Pass</TableHead>
                  <TableHead className="h-10">Off Reb</TableHead>
                  <TableHead className="h-10">Def Reb</TableHead>
                  <TableHead className="h-10">Def FG Pct</TableHead>
                  <TableHead className="h-10">Pct PF</TableHead>
                  <TableHead className="h-10">Pct ST</TableHead>
                  <TableHead className="h-10">Pct BS</TableHead>
                  <TableHead className="h-10">Year</TableHead>
                  <TableHead className="h-10">Team Code</TableHead>
                  <TableHead className="h-10">Height</TableHead>
                  <TableHead className="h-10">Deny Fact</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {playersTeam1.map((player, index) => (
                  <TableRow key={index}>
                    <TableCell className="h-10">{player.name}</TableCell>
                    <TableCell className="h-10">{player.position}</TableCell>
                    <TableCell className="h-10">{player.poss_fact}</TableCell>
                    <TableCell className="h-10">{player.two_pt_fg_pct}</TableCell>
                    <TableCell className="h-10">{player.ft_pct}</TableCell>
                    <TableCell className="h-10">{player.pct_shot}</TableCell>
                    <TableCell className="h-10">{player.three_pt_pct_shot}</TableCell>
                    <TableCell className="h-10">{player.pct_fouled}</TableCell>
                    <TableCell className="h-10">{player.pct_to}</TableCell>
                    <TableCell className="h-10">{player.pct_pass}</TableCell>
                    <TableCell className="h-10">{player.off_reb}</TableCell>
                    <TableCell className="h-10">{player.def_reb}</TableCell>
                    <TableCell className="h-10">{player.def_fg_pct}</TableCell>
                    <TableCell className="h-10">{player.pct_pf}</TableCell>
                    <TableCell className="h-10">{player.pct_st}</TableCell>
                    <TableCell className="h-10">{player.pct_bs}</TableCell>
                    <TableCell className="h-10">{player.year}</TableCell>
                    <TableCell className="h-10">{player.team_code}</TableCell>
                    <TableCell className="h-10">{player.height}</TableCell>
                    <TableCell className="h-10">{player.deny_fact}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {playersTeam2.length > 0 && (
          <div className="w-1/2">
            <h2 className="text-xl font-bold mt-8 mb-4">{selectedTeams2?.teams}</h2>
            <Table className="border">
              <TableHeader>
                <TableRow>
                  <TableHead className="h-10">Name</TableHead>
                  <TableHead className="h-10">Position</TableHead>
                  <TableHead className="h-10">Poss Fact</TableHead>
                  <TableHead className="h-10">2pt FG Pct</TableHead>
                  <TableHead className="h-10">FT Pct</TableHead>
                  <TableHead className="h-10">Pct Shot</TableHead>
                  <TableHead className="h-10">3pt Pct Shot</TableHead>
                  <TableHead className="h-10">Pct Fouled</TableHead>
                  <TableHead className="h-10">Pct TO</TableHead>
                  <TableHead className="h-10">Pct Pass</TableHead>
                  <TableHead className="h-10">Off Reb</TableHead>
                  <TableHead className="h-10">Def Reb</TableHead>
                  <TableHead className="h-10">Def FG Pct</TableHead>
                  <TableHead className="h-10">Pct PF</TableHead>
                  <TableHead className="h-10">Pct ST</TableHead>
                  <TableHead className="h-10">Pct BS</TableHead>
                  <TableHead className="h-10">Year</TableHead>
                  <TableHead className="h-10">Team Code</TableHead>
                  <TableHead className="h-10">Height</TableHead>
                  <TableHead className="h-10">Deny Fact</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {playersTeam2.map((player, index) => (
                  <TableRow key={index}>
                    <TableCell className="h-10">{player.name}</TableCell>
                    <TableCell className="h-10">{player.position}</TableCell>
                    <TableCell className="h-10">{player.poss_fact}</TableCell>
                    <TableCell className="h-10">{player.two_pt_fg_pct}</TableCell>
                    <TableCell className="h-10">{player.ft_pct}</TableCell>
                    <TableCell className="h-10">{player.pct_shot}</TableCell>
                    <TableCell className="h-10">{player.three_pt_pct_shot}</TableCell>
                    <TableCell className="h-10">{player.pct_fouled}</TableCell>
                    <TableCell className="h-10">{player.pct_to}</TableCell>
                    <TableCell className="h-10">{player.pct_pass}</TableCell>
                    <TableCell className="h-10">{player.off_reb}</TableCell>
                    <TableCell className="h-10">{player.def_reb}</TableCell>
                    <TableCell className="h-10">{player.def_fg_pct}</TableCell>
                    <TableCell className="h-10">{player.pct_pf}</TableCell>
                    <TableCell className="h-10">{player.pct_st}</TableCell>
                    <TableCell className="h-10">{player.pct_bs}</TableCell>
                    <TableCell className="h-10">{player.year}</TableCell>
                    <TableCell className="h-10">{player.team_code}</TableCell>
                    <TableCell className="h-10">{player.height}</TableCell>
                    <TableCell className="h-10">{player.deny_fact}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameSetup;
