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
  armInitialPeriod?: number; // For ARM visualization
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
  isArmAdjustmentPeriod?: boolean; // New field for ARM visualization
}

type ZoomLevel = 'full' | '5yr' | '10yr' | '15yr';

const AmortizationChart: React.FC<AmortizationChartProps> = ({ 
  schedule, 
  mortgageType, 
  armInitialPeriod = 5 
}) => {
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('full');
  const [selectedPoint, setSelectedPoint] = useState<ChartDataPoint | null>(null);
  const [showMonthly, setShowMonthly] = useState(false);

  // Transform the schedule data for the chart
  const chartData: ChartDataPoint[] = useMemo(() => {
    const data: ChartDataPoint[] = [];
    
    if (showMonthly) {
      // Show monthly data - respect zoom level but limit for performance
      let monthsToShow: number;
      switch (zoomLevel) {
        case '5yr':
          monthsToShow = Math.min(schedule.length, 60); // 5 years
          break;
        case '10yr':
          monthsToShow = Math.min(schedule.length, 120); // 10 years
          break;
        case '15yr':
          monthsToShow = Math.min(schedule.length, 180); // 15 years
          break;
        case 'full':
          // For performance, limit monthly full view to 30 years max
          monthsToShow = Math.min(schedule.length, 360);
          break;
        default:
          monthsToShow = Math.min(schedule.length, 60);
      }
      
      schedule.slice(0, monthsToShow).forEach(payment => {
        const isArmAdjustmentPeriod = mortgageType === 'arm' && payment.year > armInitialPeriod;
        
        data.push({
          year: payment.year + (payment.month % 12) / 12,
          month: payment.month,
          principal: Math.round(payment.principal),
          interest: Math.round(payment.interest),
          totalPayment: Math.round(payment.payment),
          remainingBalance: Math.round(payment.remainingBalance),
          cumulativeInterest: Math.round(payment.cumulativeInterest),
          cumulativePrincipal: Math.round(payment.cumulativePrincipal),
          isArmAdjustmentPeriod
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
        const isArmAdjustmentPeriod = mortgageType === 'arm' && payment.year > armInitialPeriod;
        
        data.push({
          year: payment.year,
          month: payment.month,
          principal: Math.round(payment.principal),
          interest: Math.round(payment.interest),
          totalPayment: Math.round(payment.payment),
          remainingBalance: Math.round(payment.remainingBalance),
          cumulativeInterest: Math.round(payment.cumulativeInterest),
          cumulativePrincipal: Math.round(payment.cumulativePrincipal),
          isArmAdjustmentPeriod
        });
      });
    }

    return data;
  }, [schedule, showMonthly, zoomLevel, mortgageType, armInitialPeriod]);

  // Auto-adjust zoom when switching to monthly if current zoom is incompatible
  const handleMonthlyToggle = () => {
    setShowMonthly(!showMonthly);
    // Remove auto-adjustment - let controls be independent
  };

  // Get available zoom levels - always show all options for independent control
  const getAvailableZoomLevels = (): ZoomLevel[] => {
    // Always show all zoom levels - let the chart handle data appropriately
    return ['5yr', '10yr', '15yr', 'full'];
  };

  const availableZoomLevels = getAvailableZoomLevels();

  // Remove auto-adjustment - let user control both settings independently

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

  // Check if crossover happens before chart starts (financially smart scenario)
  const crossoverBeforeChart = useMemo(() => {
    if (!crossoverPoint) return false;
    const chartStartYear = filteredData.length > 0 ? filteredData[0].year : 1;
    return crossoverPoint.year <= chartStartYear;
  }, [crossoverPoint, filteredData]);

  // Custom tooltip with enhanced information and ARM awareness
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as ChartDataPoint;
      const isArmPeriod = data.isArmAdjustmentPeriod;
      
      return (
        <div 
          className="bg-slate-800/95 backdrop-blur-sm border border-white/20 rounded-lg p-4 shadow-xl min-w-64"
          style={{ 
            zIndex: 1000,
            position: 'relative'
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-white font-semibold">
              {showMonthly ? `Month ${data.month}` : `Year ${Math.floor(data.year)}`}
            </p>
            {mortgageType === 'arm' && (
              <div className={`px-2 py-1 rounded text-xs font-medium ${
                isArmPeriod 
                  ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
              }`}>
                {isArmPeriod ? 'Adjustable Period' : 'Fixed Period'}
              </div>
            )}
          </div>
          
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

            {/* ARM-specific warning */}
            {mortgageType === 'arm' && isArmPeriod && (
              <div className="pt-2 border-t border-orange-500/30">
                <div className="flex items-center space-x-1 text-orange-300">
                  <span className="text-xs">⚠️</span>
                  <span className="text-xs font-medium">Rate Adjustment Period</span>
                </div>
                <p className="text-xs text-orange-200 mt-1">
                  Payments shown are based on initial rate. Actual payments may vary with rate adjustments.
                </p>
              </div>
            )}
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
          {availableZoomLevels.map((level) => (
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
            onClick={handleMonthlyToggle}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 physical-button ${
              showMonthly
                ? 'bg-purple-500/20 border border-purple-500/40 text-purple-300'
                : 'bg-white/5 border border-white/20 text-slate-300 hover:bg-white/10'
            }`}
          >
            {showMonthly ? 'Monthly' : 'Yearly'}
          </button>
        </div>
      </div>

      {/* Smart Financial Choice Celebration */}
      {crossoverBeforeChart && (
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">🎉</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="text-green-300 font-bold text-sm">Excellent Financial Choice!</h4>
                <div className="flex space-x-1">
                  <span className="text-yellow-400">⭐</span>
                  <span className="text-yellow-400">⭐</span>
                  <span className="text-yellow-400">⭐</span>
                </div>
              </div>
              <p className="text-green-200 text-xs">
                Your loan terms are so favorable that you&apos;re building more equity than paying interest from day one! 
                {mortgageType === 'fixed' && inputs.loanTermYears <= 20 && (
                  <> Your {inputs.loanTermYears}-year term is paying off big time.</>
                )}
                {mortgageType === 'arm' && (
                  <> Even with an ARM, your initial terms are fantastic.</>
                )}
              </p>
            </div>
            <div className="flex-shrink-0 text-right">
              <div className="text-green-300 font-bold text-xs">SMART MONEY</div>
              <div className="text-green-400 text-xs">💰 Building Equity Fast</div>
            </div>
          </div>
        </div>
      )}

      {/* Data Range Indicator - Always Present */}
      <div className="bg-white/5 border border-white/20 rounded-lg p-3">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${showMonthly ? 'bg-purple-400' : 'bg-cyan-400'}`}></div>
          <span className={`text-sm font-medium ${showMonthly ? 'text-purple-300' : 'text-cyan-300'}`}>
            {showMonthly ? 'Monthly Detail View' : 'Yearly Overview'}
          </span>
          {mortgageType === 'arm' && (
            <div className="flex items-center space-x-1 ml-2">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <span className="text-xs text-orange-300 font-medium">ARM</span>
            </div>
          )}
        </div>
        <p className="text-xs text-slate-300 mt-1">
          {showMonthly ? (
            <>
              Showing month-by-month data for {
                zoomLevel === 'full' ? 'the entire loan term (up to 30 years for performance)' :
                zoomLevel === '5yr' ? 'the first 5 years (60 months)' :
                zoomLevel === '10yr' ? 'the first 10 years (120 months)' :
                'the first 15 years (180 months)'
              }. Switch to "Yearly" for full loan overview.
              {mortgageType === 'arm' && (
                <> <strong className="text-orange-300">ARM Note:</strong> Rate adjustments begin after year {armInitialPeriod}.</>
              )}
            </>
          ) : (
            <>
              Showing year-end data points for {
                zoomLevel === 'full' ? 'the entire loan term' :
                zoomLevel === '5yr' ? 'the first 5 years' :
                zoomLevel === '10yr' ? 'the first 10 years' :
                'the first 15 years'
              }. Switch to "Monthly" for detailed month-by-month analysis.
              {mortgageType === 'arm' && (
                <> <strong className="text-orange-300">ARM Note:</strong> Orange line marks when rate adjustments begin (year {armInitialPeriod}).</>
              )}
            </>
          )}
        </p>
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
              {/* Fixed Rate Gradients */}
              <linearGradient id="principalGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.2}/>
              </linearGradient>
              <linearGradient id="interestGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.2}/>
              </linearGradient>
              
              {/* ARM Adjustment Period Gradients (More Vibrant/Warning Colors) */}
              <linearGradient id="principalGradientArm" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.3}/>
              </linearGradient>
              <linearGradient id="interestGradientArm" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#dc2626" stopOpacity={0.9}/>
                <stop offset="95%" stopColor="#dc2626" stopOpacity={0.3}/>
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
            
            <Tooltip 
              content={<CustomTooltip />} 
              wrapperStyle={{ zIndex: 1000 }}
              allowEscapeViewBox={{ x: false, y: true }}
              position={{ x: undefined, y: undefined }}
            />
            
            <Legend 
              wrapperStyle={{ 
                paddingTop: '30px',
                fontSize: '14px',
                zIndex: 1
              }}
              iconType="circle"
            />

            {/* Crossover point reference line - only show if crossover is visible in chart */}
            {crossoverPoint && zoomLevel === 'full' && !crossoverBeforeChart && (
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

            {/* ARM Rate Adjustment Period Reference Line */}
            {mortgageType === 'arm' && (
              <ReferenceLine 
                x={armInitialPeriod} 
                stroke="#f59e0b" 
                strokeDasharray="8 4"
                strokeOpacity={0.8}
                strokeWidth={2}
                label={{ 
                  value: "Rate Adjustments Begin", 
                  position: "topLeft",
                  style: { fill: '#f59e0b', fontSize: '12px', fontWeight: 'bold' }
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
