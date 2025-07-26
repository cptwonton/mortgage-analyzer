import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { AmortizationPayment } from '@/lib/mortgage-calculations';

interface AmortizationChartProps {
  schedule: AmortizationPayment[];
  mortgageType: 'fixed' | 'arm';
}

interface ChartDataPoint {
  year: number;
  principal: number;
  interest: number;
  totalPayment: number;
}

const AmortizationChart: React.FC<AmortizationChartProps> = ({ schedule, mortgageType }) => {
  // Transform the schedule data for the chart
  // Group by year and take the last month of each year for cleaner visualization
  const chartData: ChartDataPoint[] = [];
  const yearlyData: { [key: number]: AmortizationPayment } = {};
  
  // Group payments by year (take December of each year, or last month if loan ends mid-year)
  schedule.forEach(payment => {
    if (!yearlyData[payment.year] || payment.month % 12 === 0) {
      yearlyData[payment.year] = payment;
    }
  });

  // Convert to chart format
  Object.values(yearlyData).forEach(payment => {
    chartData.push({
      year: payment.year,
      principal: Math.round(payment.principal),
      interest: Math.round(payment.interest),
      totalPayment: Math.round(payment.payment)
    });
  });

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-800/95 backdrop-blur-sm border border-white/20 rounded-lg p-4 shadow-xl">
          <p className="text-white font-semibold mb-2">Year {label}</p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-green-300 flex items-center">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                Principal:
              </span>
              <span className="text-white font-medium">${data.principal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-red-300 flex items-center">
                <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
                Interest:
              </span>
              <span className="text-white font-medium">${data.interest.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-white/20">
              <span className="text-slate-300">Total Payment:</span>
              <span className="text-white font-bold">${data.totalPayment.toLocaleString()}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <defs>
            <linearGradient id="principalGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.2}/>
            </linearGradient>
            <linearGradient id="interestGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.2}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          
          <XAxis 
            dataKey="year" 
            stroke="rgba(255,255,255,0.6)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          
          <YAxis 
            stroke="rgba(255,255,255,0.6)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          <Legend 
            wrapperStyle={{ 
              paddingTop: '20px',
              fontSize: '14px'
            }}
            iconType="circle"
          />
          
          <Area
            type="monotone"
            dataKey="interest"
            stackId="1"
            stroke="#ef4444"
            fill="url(#interestGradient)"
            name="Interest Payment"
            strokeWidth={2}
          />
          
          <Area
            type="monotone"
            dataKey="principal"
            stackId="1"
            stroke="#10b981"
            fill="url(#principalGradient)"
            name="Principal Payment"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AmortizationChart;
