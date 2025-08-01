import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '@/contexts/ApiContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface League {
  league_name: string;
}

interface ApiResponse {
  data: League[];
}

const GameSetup = () => {
  const { fetchWithAuth, isLoading } = useApi();
  const [leagues, setLeagues] = useState<League[]>([{league_name: "dummy data"}]);
  const [error, setError] = useState<string | null>(null);
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
  const navigate = useNavigate();

  const handleFetchLeagues = async () => {
    setError(null);
    try {
      const response = await fetchWithAuth('http://api.bballsports.com/simulationAPI/get_leagues.php', 'POST');
      if (!response.ok) {
        throw new Error('Failed to fetch leagues.');
      }
      const data: ApiResponse = await response.json();
      setLeagues(data.data);
    } catch (err: any) {
      setError(err.message);
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
    </div>
  );
};

export default GameSetup;