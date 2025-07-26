import React, { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine
} from 'recharts';
import { AmortizationPayment } from '@/lib/mortgage-calculations';

interface AmortizationChartProps {
  schedule: AmortizationPayment[];
  mortgageType: 'fixed' | 'arm';
}

interface ChartDataPoint {
  year: number;
  month: number;
  principal: number;
  interest: number;
  totalPayment: number;
  remainingBalance: number;
  cumulativeInterest: number;
  cumulativePrincipal: number;
}

type ZoomLevel = 'full' | '5yr' | '10yr' | '15yr';

const AmortizationChart: React.FC<AmortizationChartProps> = ({ schedule, mortgageType }) => {
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('full');
  const [selectedPoint, setSelectedPoint] = useState<ChartDataPoint | null>(null);
  const [showMonthly, setShowMonthly] = useState(false);

  // Transform the schedule data for the chart
  const chartData: ChartDataPoint[] = useMemo(() => {
    const data: ChartDataPoint[] = [];
    
    if (showMonthly) {
      // Show monthly data (limited to first 5 years for performance)
      const monthsToShow = Math.min(schedule.length, 60);
      schedule.slice(0, monthsToShow).forEach(payment => {
        data.push({
          year: payment.year + (payment.month % 12) / 12,
          month: payment.month,
          principal: Math.round(payment.principal),
          interest: Math.round(payment.interest),
          totalPayment: Math.round(payment.payment),
          remainingBalance: Math.round(payment.remainingBalance),
          cumulativeInterest: Math.round(payment.cumulativeInterest),
          cumulativePrincipal: Math.round(payment.cumulativePrincipal)
        });
      });
    } else {
      // Show yearly data (December of each year or last month)
      const yearlyData: { [key: number]: AmortizationPayment } = {};
      
      schedule.forEach(payment => {
        if (!yearlyData[payment.year] || payment.month % 12 === 0) {
          yearlyData[payment.year] = payment;
        }
      });

      Object.values(yearlyData).forEach(payment => {
        data.push({
          year: payment.year,
          month: payment.month,
          principal: Math.round(payment.principal),
          interest: Math.round(payment.interest),
          totalPayment: Math.round(payment.payment),
          remainingBalance: Math.round(payment.remainingBalance),
          cumulativeInterest: Math.round(payment.cumulativeInterest),
          cumulativePrincipal: Math.round(payment.cumulativePrincipal)
        });
      });
    }

    return data;
  }, [schedule, showMonthly]);

  // Filter data based on zoom level
  const filteredData = useMemo(() => {
    switch (zoomLevel) {
      case '5yr':
        return chartData.filter(d => d.year <= 5);
      case '10yr':
        return chartData.filter(d => d.year <= 10);
      case '15yr':
        return chartData.filter(d => d.year <= 15);
      default:
        return chartData;
    }
  }, [chartData, zoomLevel]);

  // Find crossover point (where principal > interest)
  const crossoverPoint = useMemo(() => {
    return chartData.find(d => d.principal > d.interest);
  }, [chartData]);

  // Custom tooltip with enhanced information
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as ChartDataPoint;
      return (
        <div className="bg-slate-800/95 backdrop-blur-sm border border-white/20 rounded-lg p-4 shadow-xl min-w-64">
          <p className="text-white font-semibold mb-3">
            {showMonthly ? `Month ${data.month}` : `Year ${Math.floor(data.year)}`}
          </p>
          
          <div className="space-y-2 text-sm">
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
              <span className="text-slate-300">Monthly Payment:</span>
              <span className="text-white font-bold">${data.totalPayment.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Remaining Balance:</span>
              <span className="text-white font-medium">${data.remainingBalance.toLocaleString()}</span>
            </div>
            
            <div className="pt-2 border-t border-white/20 space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-blue-300">Total Interest Paid:</span>
                <span className="text-blue-200">${data.cumulativeInterest.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-green-300">Total Principal Paid:</span>
                <span className="text-green-200">${data.cumulativePrincipal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const handleChartClick = (data: any) => {
    if (data && data.activePayload && data.activePayload[0]) {
      setSelectedPoint(data.activePayload[0].payload);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Zoom Controls */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-300 mr-2">Zoom:</span>
          {(['full', '5yr', '10yr', '15yr'] as ZoomLevel[]).map((level) => (
            <button
              key={level}
              onClick={() => setZoomLevel(level)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 physical-button ${
                zoomLevel === level
                  ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300'
                  : 'bg-white/5 border border-white/20 text-slate-300 hover:bg-white/10'
              }`}
            >
              {level === 'full' ? 'Full Term' : level.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Monthly/Yearly Toggle */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-300">Detail:</span>
          <button
            onClick={() => setShowMonthly(!showMonthly)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 physical-button ${
              showMonthly
                ? 'bg-purple-500/20 border border-purple-500/40 text-purple-300'
                : 'bg-white/5 border border-white/20 text-slate-300 hover:bg-white/10'
            }`}
          >
            {showMonthly ? 'Monthly' : 'Yearly'}
          </button>
          {showMonthly && (
            <span className="text-xs text-slate-400">(First 5 years)</span>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-80 cursor-pointer">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={filteredData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
            onClick={handleChartClick}
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
              tickFormatter={(value) => showMonthly ? `${Math.floor(value)}.${Math.round((value % 1) * 12)}` : `${Math.floor(value)}`}
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

            {/* Crossover point reference line */}
            {crossoverPoint && zoomLevel === 'full' && (
              <ReferenceLine 
                x={crossoverPoint.year} 
                stroke="#06b6d4" 
                strokeDasharray="5 5"
                strokeOpacity={0.6}
                label={{ 
                  value: "Crossover Point", 
                  position: "top",
                  style: { fill: '#06b6d4', fontSize: '12px' }
                }}
              />
            )}
            
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

      {/* Selected Point Details */}
      {selectedPoint && (
        <div className="bg-white/5 border border-white/20 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white font-semibold">
              Selected: {showMonthly ? `Month ${selectedPoint.month}` : `Year ${Math.floor(selectedPoint.year)}`}
            </h4>
            <button
              onClick={() => setSelectedPoint(null)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-slate-400 mb-1">Monthly Payment</div>
              <div className="text-white font-bold">${selectedPoint.totalPayment.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-slate-400 mb-1">Remaining Balance</div>
              <div className="text-white font-bold">${selectedPoint.remainingBalance.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-slate-400 mb-1">Total Interest Paid</div>
              <div className="text-blue-300 font-bold">${selectedPoint.cumulativeInterest.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-slate-400 mb-1">Equity Built</div>
              <div className="text-green-300 font-bold">${selectedPoint.cumulativePrincipal.toLocaleString()}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AmortizationChart;
