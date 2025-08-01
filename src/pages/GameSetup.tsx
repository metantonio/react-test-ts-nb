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
      const response = await fetchWithAuth('http://api.bballsports.com/simulationAPI/get_players_chars.php', 'POST', {...selectedLeague, team_name: selectedTeams1?.teams});
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
      const response = await fetchWithAuth('http://api.bballsports.com/simulationAPI/get_players_chars.php', 'POST', {...selectedLeague, team_name: selectedTeams2?.teams});
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

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="mt-4 ml-4" disabled={leagues.length === 0}>
            {selectedLeague ? selectedLeague.league_name : "Select a League"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="h-[200px] overflow-y-auto">
          {leagues && leagues.map((league, index) => (
            <DropdownMenuItem key={index} onSelect={() => setSelectedLeague(league)}>
              {league.league_name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="mt-4 ml-4" disabled={leagues.length === 0}>
            {selectedLeague && selectedTeams1 ? selectedTeams1.teams : selectedLeague ? "Select a Team 1" : "Select a League first"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="h-[200px] overflow-y-auto">
          {teams && teams.map((item, index) => (
            <DropdownMenuItem key={index} onSelect={() => setSelectedTeams1(item)}>
              {item.teams}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="mt-4 ml-4" disabled={leagues.length === 0}>
            {selectedLeague && selectedTeams2 ? selectedTeams2.teams : selectedLeague ? "Select a Team 2" : "Select a League first"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="h-[200px] overflow-y-auto">
          {teams && teams.map((item, index) => (
            <DropdownMenuItem key={index} onSelect={() => setSelectedTeams2(item)}>
              {item.teams}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {playersTeam1.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mt-8 mb-4">{selectedTeams1?.teams}</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Poss Fact</TableHead>
                <TableHead>2pt FG Pct</TableHead>
                <TableHead>FT Pct</TableHead>
                <TableHead>Pct Shot</TableHead>
                <TableHead>3pt Pct Shot</TableHead>
                <TableHead>Pct Fouled</TableHead>
                <TableHead>Pct TO</TableHead>
                <TableHead>Pct Pass</TableHead>
                <TableHead>Off Reb</TableHead>
                <TableHead>Def Reb</TableHead>
                <TableHead>Def FG Pct</TableHead>
                <TableHead>Pct PF</TableHead>
                <TableHead>Pct ST</TableHead>
                <TableHead>Pct BS</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Team Code</TableHead>
                <TableHead>Height</TableHead>
                <TableHead>Deny Fact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {playersTeam1.map((player, index) => (
                <TableRow key={index}>
                  <TableCell>{player.name}</TableCell>
                  <TableCell>{player.position}</TableCell>
                  <TableCell>{player.poss_fact}</TableCell>
                  <TableCell>{player.two_pt_fg_pct}</TableCell>
                  <TableCell>{player.ft_pct}</TableCell>
                  <TableCell>{player.pct_shot}</TableCell>
                  <TableCell>{player.three_pt_pct_shot}</TableCell>
                  <TableCell>{player.pct_fouled}</TableCell>
                  <TableCell>{player.pct_to}</TableCell>
                  <TableCell>{player.pct_pass}</TableCell>
                  <TableCell>{player.off_reb}</TableCell>
                  <TableCell>{player.def_reb}</TableCell>
                  <TableCell>{player.def_fg_pct}</TableCell>
                  <TableCell>{player.pct_pf}</TableCell>
                  <TableCell>{player.pct_st}</TableCell>
                  <TableCell>{player.pct_bs}</TableCell>
                  <TableCell>{player.year}</TableCell>
                  <TableCell>{player.team_code}</TableCell>
                  <TableCell>{player.height}</TableCell>
                  <TableCell>{player.deny_fact}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {playersTeam2.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mt-8 mb-4">{selectedTeams2?.teams}</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Poss Fact</TableHead>
                <TableHead>2pt FG Pct</TableHead>
                <TableHead>FT Pct</TableHead>
                <TableHead>Pct Shot</TableHead>
                <TableHead>3pt Pct Shot</TableHead>
                <TableHead>Pct Fouled</TableHead>
                <TableHead>Pct TO</TableHead>
                <TableHead>Pct Pass</TableHead>
                <TableHead>Off Reb</TableHead>
                <TableHead>Def Reb</TableHead>
                <TableHead>Def FG Pct</TableHead>
                <TableHead>Pct PF</TableHead>
                <TableHead>Pct ST</TableHead>
                <TableHead>Pct BS</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Team Code</TableHead>
                <TableHead>Height</TableHead>
                <TableHead>Deny Fact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {playersTeam2.map((player, index) => (
                <TableRow key={index}>
                  <TableCell>{player.name}</TableCell>
                  <TableCell>{player.position}</TableCell>
                  <TableCell>{player.poss_fact}</TableCell>
                  <TableCell>{player.two_pt_fg_pct}</TableCell>
                  <TableCell>{player.ft_pct}</TableCell>
                  <TableCell>{player.pct_shot}</TableCell>
                  <TableCell>{player.three_pt_pct_shot}</TableCell>
                  <TableCell>{player.pct_fouled}</TableCell>
                  <TableCell>{player.pct_to}</TableCell>
                  <TableCell>{player.pct_pass}</TableCell>
                  <TableCell>{player.off_reb}</TableCell>
                  <TableCell>{player.def_reb}</TableCell>
                  <TableCell>{player.def_fg_pct}</TableCell>
                  <TableCell>{player.pct_pf}</TableCell>
                  <TableCell>{player.pct_st}</TableCell>
                  <TableCell>{player.pct_bs}</TableCell>
                  <TableCell>{player.year}</TableCell>
                  <TableCell>{player.team_code}</TableCell>
                  <TableCell>{player.height}</TableCell>
                  <TableCell>{player.deny_fact}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default GameSetup;
