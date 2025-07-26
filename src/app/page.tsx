'use client';

import { useState } from 'react';
import { calculateBreakevenAnalysis, MortgageInputs, validateMortgageInputs } from '@/lib/mortgage-calculations';

export default function Home() {
  const [inputs, setInputs] = useState<MortgageInputs>({
    purchasePrice: 0,
    downPaymentPercent: 20,
    interestRate: 7.5,
    loanTermYears: 30,
    propertyTaxRate: 1.2,
    monthlyInsurance: 150,
    monthlyMaintenance: 200,
    monthlyCapEx: 150,
    vacancyRate: 8,
    propertyManagementRate: 10,
    monthlyHOA: 0
  });

  const [errors, setErrors] = useState<string[]>([]);

  const handleInputChange = (field: keyof MortgageInputs, value: string) => {
    // Convert string to number, but handle empty strings
    const numericValue = value === '' ? 0 : Number(value);
    const newInputs = { ...inputs, [field]: numericValue };
    setInputs(newInputs);
    
    // Validate inputs
    const validationErrors = validateMortgageInputs(newInputs);
    setErrors(validationErrors);
  };

  const analysis = errors.length === 0 ? calculateBreakevenAnalysis(inputs) : null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🏠 Home Mortgage Analyzer
          </h1>
          <p className="text-lg text-gray-600">
            Investment Property Evaluator - Find the rental income you need
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Property Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purchase Price
                </label>
                <input
                  type="number"
                  value={inputs.purchasePrice === 0 ? '' : inputs.purchasePrice}
                  onChange={(e) => handleInputChange('purchasePrice', e.target.value)}
                  placeholder="Enter purchase price"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Down Payment (%)
                </label>
                <input
                  type="number"
                  value={inputs.downPaymentPercent === 0 ? '' : inputs.downPaymentPercent}
                  onChange={(e) => handleInputChange('downPaymentPercent', e.target.value)}
                  placeholder="e.g., 20"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interest Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={inputs.interestRate === 0 ? '' : inputs.interestRate}
                  onChange={(e) => handleInputChange('interestRate', e.target.value)}
                  placeholder="e.g., 7.5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Tax Rate (% annually)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={inputs.propertyTaxRate === 0 ? '' : inputs.propertyTaxRate}
                  onChange={(e) => handleInputChange('propertyTaxRate', e.target.value)}
                  placeholder="e.g., 1.2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Insurance
                </label>
                <input
                  type="number"
                  value={inputs.monthlyInsurance === 0 ? '' : inputs.monthlyInsurance}
                  onChange={(e) => handleInputChange('monthlyInsurance', e.target.value)}
                  placeholder="e.g., 150"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly Maintenance
                </label>
                <input
                  type="number"
                  value={inputs.monthlyMaintenance === 0 ? '' : inputs.monthlyMaintenance}
                  onChange={(e) => handleInputChange('monthlyMaintenance', e.target.value)}
                  placeholder="e.g., 200"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monthly CapEx Reserve
                </label>
                <input
                  type="number"
                  value={inputs.monthlyCapEx === 0 ? '' : inputs.monthlyCapEx}
                  onChange={(e) => handleInputChange('monthlyCapEx', e.target.value)}
                  placeholder="e.g., 150"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vacancy Rate (%)
                </label>
                <input
                  type="number"
                  value={inputs.vacancyRate === 0 ? '' : inputs.vacancyRate}
                  onChange={(e) => handleInputChange('vacancyRate', e.target.value)}
                  placeholder="e.g., 8"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>

            {errors.length > 0 && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <h3 className="text-sm font-medium text-red-800">Validation Errors:</h3>
                <ul className="mt-1 text-sm text-red-700">
                  {errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Results Panel */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Required Rental Income</h2>
            
            {analysis ? (
              <div className="space-y-6">
                {/* Breakeven Points */}
                <div className="space-y-3">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                    <h3 className="font-medium text-red-800">💰 Burned Money Breakeven</h3>
                    <p className="text-2xl font-bold text-red-900">
                      ${analysis.burnedMoneyBreakeven.toLocaleString()}/month
                    </p>
                    <p className="text-sm text-red-700">Covers carrying costs (non-equity expenses)</p>
                  </div>

                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                    <h3 className="font-medium text-yellow-800">💰 Full Breakeven</h3>
                    <p className="text-2xl font-bold text-yellow-900">
                      ${analysis.fullBreakeven.toLocaleString()}/month
                    </p>
                    <p className="text-sm text-yellow-700">Covers all expenses including principal</p>
                  </div>

                  <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                    <h3 className="font-medium text-green-800">💰 Investment Viable</h3>
                    <p className="text-2xl font-bold text-green-900">
                      ${analysis.investmentViableBreakeven.toLocaleString()}/month
                    </p>
                    <p className="text-sm text-green-700">Accounts for vacancy & property management</p>
                  </div>
                </div>

                {/* Expense Breakdown */}
                <div>
                  <h3 className="font-medium text-gray-800 mb-3">Monthly Expense Breakdown</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Principal (equity building):</span>
                      <span className="font-medium text-green-600">
                        ${analysis.breakdown.principal.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Interest:</span>
                      <span className="font-medium text-red-600">
                        ${analysis.breakdown.interest.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Property Tax:</span>
                      <span className="font-medium text-red-600">
                        ${analysis.breakdown.propertyTax.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">Insurance:</span>
                      <span className="font-medium text-red-600">
                        ${analysis.breakdown.insurance.toLocaleString()}
                      </span>
                    </div>
                    {analysis.breakdown.pmi > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-700">PMI:</span>
                        <span className="font-medium text-red-600">
                          ${analysis.breakdown.pmi.toLocaleString()}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-700">Maintenance:</span>
                      <span className="font-medium text-red-600">
                        ${analysis.breakdown.maintenance.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700">CapEx Reserve:</span>
                      <span className="font-medium text-red-600">
                        ${analysis.breakdown.capEx.toLocaleString()}
                      </span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-medium">
                      <span className="text-gray-800">Total Monthly Expenses:</span>
                      <span className="text-gray-800">${analysis.breakdown.totalMonthlyExpenses.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p>Fix validation errors to see analysis</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
