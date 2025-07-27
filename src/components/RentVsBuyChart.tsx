'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  TooltipItem,
} from 'chart.js';
import { CostProjection } from '@/lib/rentVsBuyCalculations';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface RentVsBuyChartProps {
  projections: CostProjection[];
  breakEvenMonths: number;
}

export default function RentVsBuyChart({ projections, breakEvenMonths }: RentVsBuyChartProps) {
  const years = projections.map(p => `Year ${p.year}`);
  
  // Cumulative costs over time
  let cumulativeRentCost = 0;
  let cumulativeBuyCost = 0;
  
  const rentCosts = projections.map(p => {
    cumulativeRentCost += p.rentCost;
    return cumulativeRentCost;
  });
  
  const buyCosts = projections.map(p => {
    cumulativeBuyCost += p.buyCost;
    return cumulativeBuyCost;
  });
  
  // Net position (including opportunity cost and equity)
  const netPositions = projections.map(p => p.difference);
  
  const data = {
    labels: years,
    datasets: [
      {
        label: 'Cumulative Rent Cost',
        data: rentCosts,
        borderColor: 'rgb(59, 130, 246)', // Blue
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1,
        fill: false,
      },
      {
        label: 'Cumulative Buy Cost (with opportunity cost)',
        data: buyCosts.map((cost, index) => cost + projections[index].opportunityCost),
        borderColor: 'rgb(239, 68, 68)', // Red
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.1,
        fill: false,
      },
      {
        label: 'Net Difference (Positive = Renting Saves Money)',
        data: netPositions,
        borderColor: 'rgb(16, 185, 129)', // Green
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.1,
        fill: true,
        yAxisID: 'y1',
      }
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'rgb(203, 213, 225)', // slate-300
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: 'Rent vs Buy Cost Analysis Over Time',
        color: 'rgb(248, 250, 252)', // slate-50
        font: {
          size: 16,
          weight: 'bold',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)', // slate-900
        titleColor: 'rgb(248, 250, 252)',
        bodyColor: 'rgb(203, 213, 225)',
        borderColor: 'rgb(71, 85, 105)',
        borderWidth: 1,
        callbacks: {
          label: function(context: TooltipItem<'line'>) {
            const value = context.parsed.y;
            return `${context.dataset.label}: $${Math.abs(value).toLocaleString()}${value < 0 ? ' (Buying Saves)' : ''}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(71, 85, 105, 0.3)',
        },
        ticks: {
          color: 'rgb(148, 163, 184)', // slate-400
        },
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        grid: {
          color: 'rgba(71, 85, 105, 0.3)',
        },
        ticks: {
          color: 'rgb(148, 163, 184)',
          callback: function(tickValue: string | number) {
            return '$' + Number(tickValue).toLocaleString();
          }
        },
        title: {
          display: true,
          text: 'Cumulative Cost ($)',
          color: 'rgb(203, 213, 225)',
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: 'rgb(148, 163, 184)',
          callback: function(tickValue: string | number) {
            return '$' + Number(tickValue).toLocaleString();
          }
        },
        title: {
          display: true,
          text: 'Net Difference ($)',
          color: 'rgb(203, 213, 225)',
        }
      },
    },
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-white">Cost Analysis Over Time</h3>
          <div className="text-sm text-slate-400">
            Break-even: {(breakEvenMonths / 12).toFixed(1)} years
          </div>
        </div>
        <p className="text-sm text-slate-400">
          This chart shows how costs accumulate over time and when buying becomes financially advantageous.
        </p>
      </div>
      
      <div className="h-96">
        <Line data={data} options={options} />
      </div>
      
      {/* Break-even explanation */}
      <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <h4 className="text-sm font-medium text-blue-300 mb-2">How Break-Even is Calculated:</h4>
        <p className="text-sm text-slate-300">
          Break-even occurs when the green line crosses zero. At this point, the total cost of buying 
          (including opportunity cost of your down payment) equals the total cost of renting. 
          Before this point, renting is cheaper. After this point, buying saves money.
        </p>
      </div>
    </div>
  );
}
