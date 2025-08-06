import React, { useState, useEffect } from 'react';
import { useApi } from '@/contexts/ApiContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FullSeasonVersion from './FullSeasonVersion';
import SingleGameVersion from './SingleGameVersion';
import Instructions from './Instructions';

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
  const [leagues, setLeagues] = useState<League[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
  const [teams, setTeams] = useState<Teams[]>([{ teams: "dummy data teams 1" }, { teams: "dummy data teams 2" }]);
  const [selectedTeams1, setSelectedTeams1] = useState<Teams | null>(null);
  const [selectedTeams2, setSelectedTeams2] = useState<Teams | null>(null);

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
      setError(`${err}`);
    }
  };

  useEffect(() => {
    if (leagues.length == 0) {
      handleFetchLeagues()
    }
  }, [])

  useEffect(() => {
    const loadTeams = async () => {
      await handleFetchTeams();
    }

    if (selectedLeague) {
      loadTeams();
    }
  }, [selectedLeague]);

  return (
    <div className="p-4 bg-background text-foreground">
      <h1 className="text-xl font-bold mb-2">NBA Game Simulation</h1>

      <Tabs defaultValue="full-season">
        <TabsList>
          <TabsTrigger value="full-season">Full Season Version</TabsTrigger>
          <TabsTrigger value="single-game">Single Game Version</TabsTrigger>
          <TabsTrigger value="instructions">Instructions</TabsTrigger>
        </TabsList>
        <TabsContent value="full-season">
          <FullSeasonVersion leagues={leagues} selectedLeague={selectedLeague} setSelectedLeague={setSelectedLeague} teams={teams} selectedTeams1={selectedTeams1} setSelectedTeams1={setSelectedTeams1} selectedTeams2={selectedTeams2} setSelectedTeams2={setSelectedTeams2} error={error} />
        </TabsContent>
        <TabsContent value="single-game">
          <SingleGameVersion />
        </TabsContent>
        <TabsContent value="instructions">
          <Instructions />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GameSetup;
