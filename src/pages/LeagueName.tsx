import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '@/contexts/ApiContext';
import { Button } from '@/components/ui/button';

interface League {
  league_name: string;
}

interface ApiResponse {
  data: League[];
}

const LeagueName = () => {
  const { fetchWithAuth, isLoading } = useApi();
  const [leagues, setLeagues] = useState<League[]>([]);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleFetchTables = async () => {
    setError(null);
    try {
      const response = await fetchWithAuth('https://www.qlx.com/tables', 'POST');
      if (!response.ok) {
        throw new Error('Failed to fetch tables.');
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
      <h1 className="text-2xl font-bold mb-4">NBA Leagues</h1>
      <Button onClick={handleFetchTables} disabled={isLoading}>
        {isLoading ? 'Fetching...' : 'Fetch Tables'}
      </Button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {leagues.length > 0 && (
        <ul className="mt-4 list-disc list-inside">
          {leagues.map((league, index) => (
            <li key={index}>{league.league_name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LeagueName;
