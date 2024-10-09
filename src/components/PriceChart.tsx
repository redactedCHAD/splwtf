import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PriceChart = ({ tokenAddress }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        const response = await axios.get(`https://public-api.birdeye.so/public/price_history`, {
          params: {
            address: tokenAddress,
            type: '7d',
          },
          headers: {
            'X-API-KEY': '6bfd2021f76a403c9827fd943959c1f2',
          },
        });

        const data = response.data.data;
        const labels = data.map(item => new Date(item.unixTime * 1000).toLocaleDateString());
        const prices = data.map(item => item.value);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Price',
              data: prices,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching price data:', error);
      }
    };

    fetchPriceData();
  }, [tokenAddress]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '7-Day Price History',
      },
    },
  };

  return chartData ? (
    <Line options={options} data={chartData} />
  ) : (
    <div>Loading chart data...</div>
  );
};

export default PriceChart;