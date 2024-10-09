import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import PriceChart from '@/components/PriceChart';

const TokenDetails = ({ token, onClose }) => {
  return (
    <Card className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-white dark:bg-gray-800 md:inset-auto md:left-1/2 md:top-1/2 md:w-full md:max-w-lg md:-translate-x-1/2 md:-translate-y-1/2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">{token.name} ({token.symbol})</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="overflow-auto">
        <div className="grid gap-4">
          <div className="flex items-center space-x-4">
            <img src={token.logoURI} alt={token.name} className="h-12 w-12" />
            <div>
              <p className="text-sm font-medium">Price: ${token.price ? token.price.toFixed(4) : 'N/A'}</p>
              <p className="text-sm text-gray-500">Market Cap: ${token.mc.toLocaleString()}</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold">Price Chart (7 days)</h3>
            <PriceChart tokenAddress={token.address} />
          </div>
          <div>
            <h3 className="font-semibold">Additional Information</h3>
            <p className="text-sm">24h Volume: ${token.v24hUSD.toLocaleString()}</p>
            <p className="text-sm">24h Change: {token.v24hChangePercent.toFixed(2)}%</p>
            <p className="text-sm">7d Change: {token.v7dChangePercent.toFixed(2)}%</p>
            <p className="text-sm">Liquidity: ${token.liquidity.toLocaleString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenDetails;