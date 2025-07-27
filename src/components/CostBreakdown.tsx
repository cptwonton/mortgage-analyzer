'use client';

import { CostProjection } from '@/lib/rentVsBuyCalculations';
import Card from '@/components/ui/Card';

interface CostBreakdownProps {
  projections: CostProjection[];
  monthlyRent: number;
  housePrice: number;
  downPayment: number;
}

export default function CostBreakdown({ projections, monthlyRent, housePrice, downPayment }: CostBreakdownProps) {
  const firstYear = projections[0];
  const lastYear = projections[projections.length - 1];
  
  // Calculate monthly breakdown for first year
  const downPaymentAmount = housePrice * downPayment;
  const loanAmount = housePrice - downPaymentAmount;
  const interestRate = 0.0725;
  const monthlyRate = interestRate / 12;
  const loanTermMonths = 30 * 12;
  
  const monthlyPI = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, loanTermMonths)) / 
                   (Math.pow(1 + monthlyRate, loanTermMonths) - 1);
  
  const monthlyPropertyTax = (housePrice * 0.012) / 12;
  const monthlyInsurance = (housePrice * 0.004) / 12;
  const monthlyPMI = downPayment < 0.20 ? (housePrice * 0.005) / 12 : 0;
  const monthlyMaintenance = (housePrice * 0.02) / 12;
  const monthlyTaxSavings = firstYear.taxSavings / 12;
  
  const totalMonthlyOwnership = monthlyPI + monthlyPropertyTax + monthlyInsurance + 
                               monthlyPMI + monthlyMaintenance - monthlyTaxSavings;

  return (
    <div className="space-y-6">
      {/* Monthly Cost Comparison */}
      <Card variant="section">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Monthly Cost Breakdown (Year 1)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Renting Costs */}
            <div className="space-y-3">
              <h4 className="text-md font-medium text-blue-300 flex items-center">
                <span className="mr-2">🏢</span>
                Renting
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Monthly Rent:</span>
                  <span className="text-white font-medium">${monthlyRent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Renter's Insurance:</span>
                  <span className="text-white font-medium">$25</span>
                </div>
                <div className="border-t border-slate-600 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-300 font-medium">Total Monthly:</span>
                    <span className="text-blue-300 font-bold">${(monthlyRent + 25).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Buying Costs */}
            <div className="space-y-3">
              <h4 className="text-md font-medium text-green-300 flex items-center">
                <span className="mr-2">🏠</span>
                Buying
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Mortgage P&I:</span>
                  <span className="text-white font-medium">${Math.round(monthlyPI).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Property Tax:</span>
                  <span className="text-white font-medium">${Math.round(monthlyPropertyTax).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Insurance:</span>
                  <span className="text-white font-medium">${Math.round(monthlyInsurance).toLocaleString()}</span>
                </div>
                {monthlyPMI > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">PMI:</span>
                    <span className="text-white font-medium">${Math.round(monthlyPMI).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Maintenance:</span>
                  <span className="text-white font-medium">${Math.round(monthlyMaintenance).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-400">Tax Savings:</span>
                  <span className="text-green-400 font-medium">-${Math.round(monthlyTaxSavings).toLocaleString()}</span>
                </div>
                <div className="border-t border-slate-600 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-green-300 font-medium">Total Monthly:</span>
                    <span className="text-green-300 font-bold">${Math.round(totalMonthlyOwnership).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Difference */}
          <div className="mt-6 p-4 bg-slate-700/30 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Monthly Difference (Year 1):</span>
              <span className={`font-bold ${
                totalMonthlyOwnership > (monthlyRent + 25) ? 'text-red-400' : 'text-green-400'
              }`}>
                {totalMonthlyOwnership > (monthlyRent + 25) ? '+' : ''}
                ${Math.round(totalMonthlyOwnership - (monthlyRent + 25)).toLocaleString()}
                {totalMonthlyOwnership > (monthlyRent + 25) ? ' more to buy' : ' less to buy'}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Upfront Costs */}
      <Card variant="section">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Upfront Investment Required</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Down Payment ({(downPayment * 100).toFixed(0)}%):</span>
              <span className="text-white font-medium">${downPaymentAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Closing Costs (2%):</span>
              <span className="text-white font-medium">${(housePrice * 0.02).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Moving & Misc:</span>
              <span className="text-white font-medium">${(housePrice * 0.005).toLocaleString()}</span>
            </div>
            <div className="border-t border-slate-600 pt-2">
              <div className="flex justify-between items-center">
                <span className="text-orange-300 font-medium">Total Upfront:</span>
                <span className="text-orange-300 font-bold">
                  ${(downPaymentAmount + housePrice * 0.025).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
            <p className="text-sm text-orange-200">
              <strong>Opportunity Cost:</strong> This ${(downPaymentAmount + housePrice * 0.025).toLocaleString()} could earn 
              ~${Math.round((downPaymentAmount + housePrice * 0.025) * 0.07).toLocaleString()}/year 
              if invested in the stock market (7% return).
            </p>
          </div>
        </div>
      </Card>

      {/* Year-by-Year Breakdown */}
      <Card variant="section">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Year-by-Year Analysis</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-600">
                  <th className="text-left py-2 text-slate-300">Year</th>
                  <th className="text-right py-2 text-slate-300">Rent Cost</th>
                  <th className="text-right py-2 text-slate-300">Buy Cost</th>
                  <th className="text-right py-2 text-slate-300">Home Value</th>
                  <th className="text-right py-2 text-slate-300">Equity</th>
                  <th className="text-right py-2 text-slate-300">Net Difference</th>
                </tr>
              </thead>
              <tbody>
                {projections.map((projection, index) => (
                  <tr key={projection.year} className="border-b border-slate-700/50">
                    <td className="py-2 text-white">{projection.year}</td>
                    <td className="py-2 text-right text-blue-300">
                      ${projection.rentCost.toLocaleString()}
                    </td>
                    <td className="py-2 text-right text-green-300">
                      ${projection.buyCost.toLocaleString()}
                    </td>
                    <td className="py-2 text-right text-purple-300">
                      ${projection.homeValue.toLocaleString()}
                    </td>
                    <td className="py-2 text-right text-yellow-300">
                      ${projection.equity.toLocaleString()}
                    </td>
                    <td className={`py-2 text-right font-medium ${
                      projection.difference > 0 ? 'text-red-400' : 'text-green-400'
                    }`}>
                      {projection.difference > 0 ? '+' : ''}${projection.difference.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-xs text-slate-400 space-y-1">
            <p><strong>Rent Cost:</strong> Annual rent with 3% increases</p>
            <p><strong>Buy Cost:</strong> Annual ownership costs (mortgage, taxes, insurance, maintenance) minus tax savings</p>
            <p><strong>Home Value:</strong> Appreciated value at 3% annually</p>
            <p><strong>Equity:</strong> Home value minus remaining mortgage balance</p>
            <p><strong>Net Difference:</strong> Cumulative cost difference including opportunity cost (positive = renting saves money)</p>
          </div>
        </div>
      </Card>

      {/* Assumptions */}
      <Card variant="section">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Our Assumptions</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium text-slate-300">Market Assumptions:</h4>
              <ul className="space-y-1 text-slate-400">
                <li>• Home appreciation: 3% annually</li>
                <li>• Rent increases: 3% annually</li>
                <li>• Stock market return: 7% annually</li>
                <li>• Mortgage rate: 7.25% APR</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-slate-300">Cost Assumptions:</h4>
              <ul className="space-y-1 text-slate-400">
                <li>• Property tax: 1.2% annually</li>
                <li>• Insurance: 0.4% annually</li>
                <li>• Maintenance: 2% of home value</li>
                <li>• Transaction costs: 8% total</li>
                <li>• Tax bracket: 24% marginal rate</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-sm text-blue-200">
              <strong>Future Enhancement:</strong> We plan to make these estimates more accurate by incorporating 
              your specific zip code or state to get precise property tax rates, insurance costs, and local market conditions.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
