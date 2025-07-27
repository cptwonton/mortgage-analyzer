import React from 'react';
import { useCurrentRates, formatRate, getRateByType } from '@/hooks/useCurrentRates';

interface CurrentRatesDisplayProps {
  mortgageType?: 'fixed' | 'arm';
  loanTermYears?: number;
  onRateSelect?: (rate: number) => void;
  compact?: boolean;
}

const CurrentRatesDisplay: React.FC<CurrentRatesDisplayProps> = ({
  mortgageType = 'fixed',
  loanTermYears = 30,
  onRateSelect,
  compact = false
}) => {
  const { rates, loading, error, source, lastUpdated, refetch } = useCurrentRates();

  if (loading) {
    return (
      <div className="px-4 py-3 bg-white/5 border border-white/20 rounded-xl backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400"></div>
          <span className="text-slate-300 text-sm">Loading current rates...</span>
        </div>
      </div>
    );
  }

  if (error && !rates) {
    return (
      <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <span className="text-red-300 text-sm">Failed to load rates: {error}</span>
          <button
            onClick={refetch}
            className="text-red-400 hover:text-red-200 text-sm underline transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!rates) {
    return null;
  }

  const currentRate = getRateByType(rates, mortgageType, loanTermYears);
  const lastUpdatedDate = lastUpdated ? new Date(lastUpdated) : null;

  if (compact) {
    // Determine status color based on data source and errors
    const getStatusColor = () => {
      if (error) return 'bg-yellow-400'; // Any error means fallback data
      return 'bg-green-400'; // No error means successfully pulled
    };

    const getSourceText = () => {
      if (error || source?.includes('fallback') || source?.includes('Fallback')) {
        return 'Fallback rates';
      }
      return 'Mr. Cooper';
    };

    return (
      <div className="px-4 py-3 bg-white/5 border border-white/20 rounded-xl backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 ${getStatusColor()} rounded-full animate-pulse`}></div>
              <span className="text-slate-300 text-sm font-medium">
                Current Market Rate
              </span>
            </div>
            <span className="text-white font-bold text-lg">
              {formatRate(currentRate)}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {onRateSelect && currentRate && (
              <button
                onClick={() => onRateSelect(currentRate)}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-purple-400/30 hover:border-purple-300/50 text-purple-200 hover:text-purple-100 text-sm rounded-lg backdrop-blur-sm transition-all duration-200 font-medium flex items-center space-x-1.5"
              >
                <span className="text-xs">✨</span>
                <span>Use This Rate</span>
              </button>
            )}
            <button
              onClick={refetch}
              className="p-1.5 bg-white/5 hover:bg-white/10 border border-slate-600/30 hover:border-slate-500/50 text-slate-400 hover:text-slate-200 rounded-lg backdrop-blur-sm transition-all duration-200"
              title="Refresh rates"
            >
              🔄
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-xs">
          <span className="text-slate-400">
            Source: {getSourceText()}
          </span>
          <span className="text-slate-500">
            {lastUpdatedDate?.toLocaleTimeString() || 'Unknown time'}
          </span>
        </div>
      </div>
    );
  }

  const getStatusColor = () => {
    if (error) return 'bg-yellow-400'; // Any error means fallback data
    return 'bg-green-400'; // No error means successfully pulled
  };

  const getSourceText = () => {
    if (error || source?.includes('fallback') || source?.includes('Fallback')) {
      return 'Fallback rates';
    }
    return 'Mr. Cooper';
  };

  return (
    <div className="px-6 py-4 bg-white/5 border border-white/20 rounded-xl backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-2 h-2 ${getStatusColor()} rounded-full animate-pulse`}></div>
          <div>
            <h3 className="text-lg font-semibold text-white">Current Mortgage Rates</h3>
            <div className="text-sm text-slate-400 mt-1">
              Source: {getSourceText()} • {lastUpdatedDate?.toLocaleString() || 'Unknown time'}
            </div>
          </div>
        </div>
        <button
          onClick={refetch}
          className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-slate-600/30 hover:border-slate-500/50 text-slate-400 hover:text-slate-200 rounded-lg backdrop-blur-sm transition-all duration-200 text-sm flex items-center space-x-1.5"
          title="Refresh rates"
        >
          <span>🔄</span>
          <span>Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* 30-Year Fixed */}
        <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="font-medium text-slate-200 text-sm">30-Year Fixed</div>
              <div className="text-xl font-bold text-blue-400">
                {formatRate(rates['30-year-fixed'])}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Min. down: <span className="text-blue-300 font-medium">20%</span>
              </div>
            </div>
            {onRateSelect && rates['30-year-fixed'] && (
              <button
                onClick={() => onRateSelect(rates['30-year-fixed']!)}
                className="px-2 py-1 bg-white/10 hover:bg-white/20 border border-blue-400/30 hover:border-blue-300/50 text-blue-200 hover:text-blue-100 text-xs rounded backdrop-blur-sm transition-all duration-200"
              >
                Use
              </button>
            )}
          </div>
        </div>

        {/* 15-Year Fixed */}
        <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="font-medium text-slate-200 text-sm">15-Year Fixed</div>
              <div className="text-xl font-bold text-green-400">
                {formatRate(rates['15-year-fixed'])}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Min. down: <span className="text-green-300 font-medium">20%</span>
              </div>
            </div>
            {onRateSelect && rates['15-year-fixed'] && (
              <button
                onClick={() => onRateSelect(rates['15-year-fixed']!)}
                className="px-2 py-1 bg-white/10 hover:bg-white/20 border border-green-400/30 hover:border-green-300/50 text-green-200 hover:text-green-100 text-xs rounded backdrop-blur-sm transition-all duration-200"
              >
                Use
              </button>
            )}
          </div>
        </div>

        {/* FHA 30-Year */}
        <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="font-medium text-slate-200 text-sm">FHA 30-Year</div>
              <div className="text-xl font-bold text-purple-400">
                {formatRate(rates['fha-30-year'])}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Min. down: <span className="text-purple-300 font-medium">3.5%</span>
              </div>
            </div>
            {onRateSelect && rates['fha-30-year'] && (
              <button
                onClick={() => onRateSelect(rates['fha-30-year']!)}
                className="px-2 py-1 bg-white/10 hover:bg-white/20 border border-purple-400/30 hover:border-purple-300/50 text-purple-200 hover:text-purple-100 text-xs rounded backdrop-blur-sm transition-all duration-200"
              >
                Use
              </button>
            )}
          </div>
        </div>

        {/* ARM 5/1 */}
        <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="font-medium text-slate-200 text-sm">5/1 ARM</div>
              <div className="text-xl font-bold text-orange-400">
                {formatRate(rates['arm-5-1'])}
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Min. down: <span className="text-orange-300 font-medium">5%</span>
              </div>
            </div>
            {onRateSelect && rates['arm-5-1'] && (
              <button
                onClick={() => onRateSelect(rates['arm-5-1']!)}
                className="px-2 py-1 bg-white/10 hover:bg-white/20 border border-orange-400/30 hover:border-orange-300/50 text-orange-200 hover:text-orange-100 text-xs rounded backdrop-blur-sm transition-all duration-200"
              >
                Use
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-slate-500">
        <p>
          * Rates are approximate and for informational purposes only. 
          Actual rates may vary based on credit score, loan amount, and other factors.
        </p>
      </div>
    </div>
  );
};

export default CurrentRatesDisplay;
