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
    return (
      <div className="px-4 py-3 bg-white/5 border border-white/20 rounded-xl backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
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
                className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors font-medium"
              >
                Use This Rate
              </button>
            )}
            <button
              onClick={refetch}
              className="text-slate-400 hover:text-slate-200 text-sm transition-colors"
              title="Refresh rates"
            >
              🔄
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-xs">
          <span className="text-slate-400">
            Source: {source?.includes('fallback') ? 'Fallback data' : 'Mr. Cooper'}
          </span>
          <span className="text-slate-500">
            {lastUpdatedDate?.toLocaleTimeString() || 'Unknown time'}
          </span>
        </div>
        
        {error && (
          <div className="text-xs text-yellow-400 mt-2 flex items-center space-x-1">
            <span>⚠️</span>
            <span>Using fallback data - live rates unavailable</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="px-6 py-4 bg-white/5 border border-white/20 rounded-xl backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Current Mortgage Rates</h3>
          <div className="text-sm text-slate-400 mt-1">
            Source: {source} • {lastUpdatedDate?.toLocaleString() || 'Unknown time'}
          </div>
        </div>
        <button
          onClick={refetch}
          className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
          title="Refresh rates"
        >
          🔄 Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* 30-Year Fixed */}
        <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-slate-200 text-sm">30-Year Fixed</div>
              <div className="text-xl font-bold text-blue-400">
                {formatRate(rates['30-year-fixed'])}
              </div>
            </div>
            {onRateSelect && rates['30-year-fixed'] && (
              <button
                onClick={() => onRateSelect(rates['30-year-fixed']!)}
                className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
              >
                Use
              </button>
            )}
          </div>
        </div>

        {/* 15-Year Fixed */}
        <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-slate-200 text-sm">15-Year Fixed</div>
              <div className="text-xl font-bold text-green-400">
                {formatRate(rates['15-year-fixed'])}
              </div>
            </div>
            {onRateSelect && rates['15-year-fixed'] && (
              <button
                onClick={() => onRateSelect(rates['15-year-fixed']!)}
                className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors"
              >
                Use
              </button>
            )}
          </div>
        </div>

        {/* FHA 30-Year */}
        <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-slate-200 text-sm">FHA 30-Year</div>
              <div className="text-xl font-bold text-purple-400">
                {formatRate(rates['fha-30-year'])}
              </div>
            </div>
            {onRateSelect && rates['fha-30-year'] && (
              <button
                onClick={() => onRateSelect(rates['fha-30-year']!)}
                className="px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded transition-colors"
              >
                Use
              </button>
            )}
          </div>
        </div>

        {/* ARM 5/1 */}
        <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-slate-200 text-sm">5/1 ARM</div>
              <div className="text-xl font-bold text-orange-400">
                {formatRate(rates['arm-5-1'])}
              </div>
            </div>
            {onRateSelect && rates['arm-5-1'] && (
              <button
                onClick={() => onRateSelect(rates['arm-5-1']!)}
                className="px-2 py-1 bg-orange-600 hover:bg-orange-700 text-white text-xs rounded transition-colors"
              >
                Use
              </button>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 px-3 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <div className="text-yellow-300 text-sm flex items-center space-x-2">
            <span>⚠️</span>
            <span><strong>Note:</strong> {error}. Showing fallback rates for reference.</span>
          </div>
        </div>
      )}

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
