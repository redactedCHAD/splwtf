import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const VolumeChart = ({ tokens }) => {
  const data = {
    labels: tokens.slice(0, 10).map(token => token.symbol),
    datasets: [
      {
        label: '24h Volume (USD)',
        data: tokens.slice(0, 10).map(token => token.v24hUSD),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      }
    }
  };

  return <Bar data={data} options={options} />;
};

export default VolumeChart;