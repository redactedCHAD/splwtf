import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TokenList from '@/components/TokenList';
import VolumeChart from '@/components/VolumeChart';
import MarketCapChart from '@/components/MarketCapChart';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

// Fallback data in case the API fails
const fallbackTokens = [
  {
    address: "So11111111111111111111111111111111111111112",
    decimals: 9,
    lastTradeUnixTime: 1728461367,
    liquidity: 2627726.920422704,
    logoURI: "https://img.fotofolio.xyz/?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsolana-labs%2Ftoken-list%2Fmain%2Fassets%2Fmainnet%2FSo11111111111111111111111111111111111111112%2Flogo.png",
    mc: 83855758354.3748,
    name: "Wrapped SOL",
    symbol: "SOL",
    v24hChangePercent: -13.211552356189152,
    v24hUSD: 1550049693.6705303
  },
  // Add more fallback tokens here...
];

const CACHE_KEY = 'solanaTokenData';
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

export default function Home() {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showStablecoins, setShowStablecoins] = useState(false);

  const fetchTokens = async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first if not forcing refresh
      if (!forceRefresh) {
        const cachedData = localStorage.getItem(CACHE_KEY);
        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData);
          if (Date.now() - timestamp < CACHE_EXPIRY) {
            setTokens(data);
            setLoading(false);
            return;
          }
        }
      }

      const response = await axios.get('https://public-api.birdeye.so/defi/tokenlist', {
        params: {
          sort_by: 'v24hUSD',
          sort_type: 'desc',
          offset: '0',
          limit: '100',
          min_liquidity: '100'
        },
        headers: {
          accept: 'application/json',
          'X-API-KEY': '6bfd2021f76a403c9827fd943959c1f2'
        },
        timeout: 10000 // Set a timeout of 10 seconds
      });
      
      if (response.data && response.data.data && Array.isArray(response.data.data.tokens)) {
        const newTokens = response.data.data.tokens;
        setTokens(newTokens);
        // Cache the new data
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          data: newTokens,
          timestamp: Date.now()
        }));
      } else {
        throw new Error('Invalid data structure received from API');
      }
    } catch (err) {
      console.error('Error fetching token data:', err.message);
      if (axios.isAxiosError(err)) {
        if (err.response) {
          setError(`API Error: ${err.response.status} - ${err.response.data.message || 'Unknown error'}`);
        } else if (err.request) {
          setError('No response received from server. Please check your internet connection.');
        } else {
          setError(`Request Error: ${err.message}`);
        }
      } else {
        setError(`Unexpected Error: ${err.message}`);
      }
      // Use cached data if available, otherwise use fallback
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        const { data } = JSON.parse(cachedData);
        setTokens(data);
      } else {
        setTokens(fallbackTokens);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokens();
    const interval = setInterval(() => fetchTokens(true), 5 * 60 * 1000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const filteredTokens = tokens.filter(token => {
    if (!showStablecoins) {
      return !['USDT', 'USDC', 'SOL'].includes(token.symbol);
    }
    return true;
  });

  if (loading && tokens.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Solana Token Dashboard</h1>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="flex items-center space-x-2 mb-4">
        <Switch
          id="show-stablecoins"
          checked={showStablecoins}
          onCheckedChange={setShowStablecoins}
        />
        <Label htmlFor="show-stablecoins">Show USDT, USDC, and SOL</Label>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Tokens</CardTitle>
          </CardHeader>
          <CardContent>
            <TokenList tokens={filteredTokens} />
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>24h Volume Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <VolumeChart tokens={filteredTokens} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Market Cap Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <MarketCapChart tokens={filteredTokens} />
            </CardContent>
          </Card>
        </div>
      </div>
      <Button onClick={() => fetchTokens(true)} className="mt-4">Refresh Data</Button>
      {loading && <p className="mt-2 text-sm text-gray-500">Refreshing data...</p>}
    </div>
  );
}