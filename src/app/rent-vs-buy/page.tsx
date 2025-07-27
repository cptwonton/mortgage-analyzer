'use client';

export default function RentVsBuyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Coming Soon Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-6">
              Rent vs Buy Calculator
            </h1>
            <div className="inline-flex items-center px-6 py-3 bg-orange-500/20 border border-orange-500/30 rounded-full mb-6">
              <span className="text-orange-300 font-medium">🚧 Coming Soon</span>
            </div>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              We're building a comprehensive rent vs buy analysis tool that will help you make the best housing decision based on your financial situation.
            </p>
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="text-lg font-semibold text-white mb-2">Break-Even Analysis</h3>
              <p className="text-slate-400 text-sm">
                Find the exact rent amount where buying becomes more advantageous than renting
              </p>
            </div>
            
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
              <div className="text-3xl mb-4">💰</div>
              <h3 className="text-lg font-semibold text-white mb-2">Total Cost Comparison</h3>
              <p className="text-slate-400 text-sm">
                Compare all costs including opportunity cost, maintenance, taxes, and appreciation
              </p>
            </div>
            
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="text-lg font-semibold text-white mb-2">Personalized Recommendations</h3>
              <p className="text-slate-400 text-sm">
                Get clear guidance based on your specific rent amount and local market conditions
              </p>
            </div>
          </div>

          {/* What's Coming */}
          <div className="bg-slate-800/30 border border-slate-700/30 rounded-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">What We're Building</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-blue-300">Smart Analysis</h3>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li>• Dynamic break-even calculations</li>
                  <li>• Opportunity cost analysis</li>
                  <li>• Tax benefit calculations</li>
                  <li>• Market appreciation modeling</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-green-300">Local Accuracy</h3>
                <ul className="space-y-2 text-slate-300 text-sm">
                  <li>• Zip code-specific property taxes</li>
                  <li>• Local insurance rates</li>
                  <li>• Regional market conditions</li>
                  <li>• HOA and maintenance costs</li>
                </ul>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <p className="text-slate-400 mb-6">
              In the meantime, check out our mortgage calculator to see what you could afford
            </p>
            <a 
              href="/mortgage-analyzer"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Try Mortgage Calculator
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
