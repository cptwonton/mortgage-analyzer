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
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-blue-700 text-sm">Loading current rates...</span>
        </div>
      </div>
    );
  }

  if (error && !rates) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <span className="text-red-700 text-sm">Failed to load rates: {error}</span>
          <button
            onClick={refetch}
            className="text-red-600 hover:text-red-800 text-sm underline"
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
      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-green-800 font-medium text-sm">
              Current Rate: {formatRate(currentRate)}
            </span>
            {onRateSelect && currentRate && (
              <button
                onClick={() => onRateSelect(currentRate)}
                className="ml-2 text-green-600 hover:text-green-800 text-xs underline"
              >
                Use This Rate
              </button>
            )}
          </div>
          <div className="text-xs text-green-600">
            {source?.includes('fallback') ? '📊' : '🔄'}
          </div>
        </div>
        {error && (
          <div className="text-xs text-yellow-600 mt-1">
            ⚠️ Using fallback data
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Current Mortgage Rates</h3>
          <button
            onClick={refetch}
            className="text-blue-600 hover:text-blue-800 text-sm"
            title="Refresh rates"
          >
            🔄 Refresh
          </button>
        </div>
        <div className="text-sm text-gray-500 mt-1">
          Source: {source} • {lastUpdatedDate?.toLocaleString() || 'Unknown time'}
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 30-Year Fixed */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">30-Year Fixed</div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatRate(rates['30-year-fixed'])}
                </div>
              </div>
              {onRateSelect && rates['30-year-fixed'] && (
                <button
                  onClick={() => onRateSelect(rates['30-year-fixed']!)}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                >
                  Use Rate
                </button>
              )}
            </div>
          </div>

          {/* 15-Year Fixed */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">15-Year Fixed</div>
                <div className="text-2xl font-bold text-green-600">
                  {formatRate(rates['15-year-fixed'])}
                </div>
              </div>
              {onRateSelect && rates['15-year-fixed'] && (
                <button
                  onClick={() => onRateSelect(rates['15-year-fixed']!)}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                >
                  Use Rate
                </button>
              )}
            </div>
          </div>

          {/* FHA 30-Year */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">FHA 30-Year</div>
                <div className="text-2xl font-bold text-purple-600">
                  {formatRate(rates['fha-30-year'])}
                </div>
              </div>
              {onRateSelect && rates['fha-30-year'] && (
                <button
                  onClick={() => onRateSelect(rates['fha-30-year']!)}
                  className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
                >
                  Use Rate
                </button>
              )}
            </div>
          </div>

          {/* ARM 5/1 */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">5/1 ARM</div>
                <div className="text-2xl font-bold text-orange-600">
                  {formatRate(rates['arm-5-1'])}
                </div>
              </div>
              {onRateSelect && rates['arm-5-1'] && (
                <button
                  onClick={() => onRateSelect(rates['arm-5-1']!)}
                  className="bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-700"
                >
                  Use Rate
                </button>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="text-yellow-800 text-sm">
              ⚠️ <strong>Note:</strong> {error}. Showing fallback rates for reference.
            </div>
          </div>
        )}

        <div className="mt-4 text-xs text-gray-500">
          <p>
            * Rates are approximate and for informational purposes only. 
            Actual rates may vary based on credit score, loan amount, and other factors.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CurrentRatesDisplay;
