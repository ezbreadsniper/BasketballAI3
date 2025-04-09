import { useEffect, useRef } from "react";
import { Chart, RadarController, RadialLinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js";

// Register Chart.js components
Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Tooltip, Legend);

interface SkillsRadarChartProps {
  playerData: number[];
  positionAverage: number[];
}

const SkillsRadarChart = ({ playerData, positionAverage }: SkillsRadarChartProps) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // If chart already exists, destroy it before creating a new one
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Shooting', 'Passing', 'Dribbling', 'Defense', 'Basketball IQ', 'Athleticism'],
        datasets: [
          {
            label: 'Your Skills',
            data: playerData,
            backgroundColor: 'rgba(255, 87, 34, 0.2)',
            borderColor: 'rgba(255, 87, 34, 1)',
            pointBackgroundColor: 'rgba(255, 87, 34, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(255, 87, 34, 1)'
          },
          {
            label: 'Position Average',
            data: positionAverage,
            backgroundColor: 'rgba(63, 81, 181, 0.2)',
            borderColor: 'rgba(63, 81, 181, 1)',
            pointBackgroundColor: 'rgba(63, 81, 181, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(63, 81, 181, 1)'
          }
        ]
      },
      options: {
        scales: {
          r: {
            angleLines: {
              display: true
            },
            suggestedMin: 0,
            suggestedMax: 100
          }
        },
        elements: {
          line: {
            borderWidth: 2
          }
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 12,
              font: {
                size: 10
              }
            }
          }
        },
        responsive: true,
        maintainAspectRatio: false
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [playerData, positionAverage]);

  return <canvas ref={chartRef}></canvas>;
};

export default SkillsRadarChart;
