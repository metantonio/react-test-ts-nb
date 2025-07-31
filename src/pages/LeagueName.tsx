import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '@/contexts/ApiContext';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

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
      const response = await fetchWithAuth('http://api.bballsports.com/simulationAPI/get_leagues.php', 'POST');
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
      <h1 className="text-2xl font-bold mb-4">NBA Leagues Names</h1>
      <Button onClick={handleFetchTables} disabled={isLoading}>
        {isLoading ? 'Fetching...' : 'Fetch Tables'}
      </Button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {leagues.length > 0 && (
        <Table className="mt-4">
          <TableHeader>
            <TableRow>
              <TableHead>League Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leagues.map((league, index) => (
              <TableRow key={index}>
                <TableCell>{league.league_name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default LeagueName;