import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';
import { Tooltip } from '@/components/ui/tooltip';
import TokenDetails from '@/components/TokenDetails';

const TokenList = ({ tokens }) => {
  const [sortColumn, setSortColumn] = useState('v24hUSD');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedToken, setSelectedToken] = useState(null);
  const itemsPerPage = 10;

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const filteredTokens = tokens.filter(
    (token) =>
      token.name.toLowerCase().includes(filter.toLowerCase()) ||
      token.symbol.toLowerCase().includes(filter.toLowerCase())
  );

  const sortedTokens = filteredTokens.sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedTokens.length / itemsPerPage);
  const paginatedTokens = sortedTokens.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const SortIcon = ({ column }) => {
    if (column !== sortColumn) return null;
    return sortDirection === 'asc' ? <ChevronUp className="inline" /> : <ChevronDown className="inline" />;
  };

  const formatPercentage = (value) => {
    if (value === null || value === undefined) return 'N/A';
    return `${value.toFixed(2)}%`;
  };

  return (
    <div>
      <Input
        type="text"
        placeholder="Filter tokens..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="mb-4"
      />
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Logo</TableHead>
              <TableHead onClick={() => handleSort('name')} className="cursor-pointer">
                Name <SortIcon column="name" />
              </TableHead>
              <TableHead onClick={() => handleSort('symbol')} className="cursor-pointer">
                Symbol <SortIcon column="symbol" />
              </TableHead>
              <TableHead onClick={() => handleSort('price')} className="cursor-pointer">
                Price <SortIcon column="price" />
              </TableHead>
              <TableHead onClick={() => handleSort('v24hUSD')} className="cursor-pointer">
                24h Volume <SortIcon column="v24hUSD" />
              </TableHead>
              <TableHead onClick={() => handleSort('v24hChangePercent')} className="cursor-pointer">
                24h Change <SortIcon column="v24hChangePercent" />
              </TableHead>
              <TableHead onClick={() => handleSort('v7dChangePercent')} className="cursor-pointer">
                7d Change <SortIcon column="v7dChangePercent" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTokens.map((token) => (
              <TableRow key={token.address} onClick={() => setSelectedToken(token)} className="cursor-pointer hover:bg-gray-100">
                <TableCell>
                  <Image src={token.logoURI} alt={token.name} width={24} height={24} />
                </TableCell>
                <TableCell>
                  <Tooltip content={<TokenDetails token={token} />}>
                    <span>{token.name}</span>
                  </Tooltip>
                </TableCell>
                <TableCell>{token.symbol}</TableCell>
                <TableCell>${token.price ? token.price.toFixed(4) : 'N/A'}</TableCell>
                <TableCell>${token.v24hUSD.toLocaleString()}</TableCell>
                <TableCell className={token.v24hChangePercent > 0 ? 'text-green-600' : 'text-red-600'}>
                  {formatPercentage(token.v24hChangePercent)}
                </TableCell>
                <TableCell className={token.v7dChangePercent > 0 ? 'text-green-600' : 'text-red-600'}>
                  {formatPercentage(token.v7dChangePercent)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
      {selectedToken && (
        <TokenDetails token={selectedToken} onClose={() => setSelectedToken(null)} />
      )}
    </div>
  );
};

export default TokenList;