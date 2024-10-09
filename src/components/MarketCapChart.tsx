import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const MarketCapChart = ({ tokens }) => {
  const topTokens = tokens.slice(0, 5);
  const otherTokens = tokens.slice(5);

  const data = {
    labels: [...topTokens.map(token => token.symbol), 'Others'],
    datasets: [
      {
        data: [
          ...topTokens.map(token => token.mc),
          otherTokens.reduce((sum, token) => sum + token.mc, 0)
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== undefined) {
              label += '$' + context.parsed.toLocaleString();
            }
            return label;
          }
        }
      }
    },
  };

  return <Pie data={data} options={options} />;
};

export default MarketCapChart;