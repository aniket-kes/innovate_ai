import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto'; // Import the Chart.js library
import 'chartjs-adapter-date-fns'; // Import the Date-Fns adapter for Chart.js


const LineGraph = ({ data }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (data && data.length > 0) {
      // Parse data and count queries per timestamp
      const formattedData = {};
      data.forEach((user) => {
        user.chats.forEach((chat) => {
          const timestamp = new Date(chat.timestamp).toLocaleDateString();
          if (formattedData[timestamp]) {
            formattedData[timestamp]++;
          } else {
            formattedData[timestamp] = 1;
          }
        });
      });

      // Convert data to arrays for Chart.js
      const labels = Object.keys(formattedData);
      const queryCounts = Object.values(formattedData);

      // Set chart data
      setChartData({
        labels,
        datasets: [
            {
              label: 'Number of Queries',
              data: queryCounts,
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1,
              pointRadius: 5, // Set the radius of the points
              pointBackgroundColor: 'rgba(75, 192, 192, 1)', // Set the background color of the points
            },
        ],
      });
    }
  }, [data]);

  return (
    <div>
      {chartData && (
        <Line
          data={chartData}
          options={{
            scales: {
              x: {
                type: 'time', // Change this to 'linear' if your data is not time-based
                time: {
                  unit: 'day',
                  displayFormats: {
                    day: 'MMM D',
                  },
                },
                title: {
                  display: true,
                  text: 'Date',
                },
              },
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Number of Queries',
                },
              },
            },
          }}
        />
      )}
    </div>
  );
};

export default LineGraph;
