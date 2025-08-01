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


const GameSetup = () => {
  const { fetchWithAuth, isLoading } = useApi();
  const [leagues, setLeagues] = useState<League[]>([{league_name: "dummy data league"}]);
  const [error, setError] = useState<string | null>(null);
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
  const [teams, setTeams] = useState<Teams[]>([{teams: "dummy data teams 1"}, {teams: "dummy data teams 2"}]);
  const [selectedTeams1, setSelectedTeams1] = useState<Teams | null>(null);
  const [selectedTeams2, setSelectedTeams2] = useState<Teams | null>(null);
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
      const response = await fetchWithAuth('http://api.bballsports.com/simulationAPI/get_teams.php', 'POST', {league_name: selectedLeague});
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

  const goLoginPage = () => {
    navigate('/')
  }

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
        <DropdownMenuContent>
          {leagues.map((league, index) => (
            <DropdownMenuItem key={index} onSelect={() => setSelectedLeague(league)}>
              {league.league_name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="mt-4 ml-4" disabled={leagues.length === 0}>
            {selectedLeague && selectedTeams1? selectedTeams1.teams : selectedLeague? "Select a Team" : "Select a League first"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {teams.map((item, index) => (
            <DropdownMenuItem key={index} onSelect={() => setSelectedTeams1(item)}>
              {item.teams}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default GameSetup;