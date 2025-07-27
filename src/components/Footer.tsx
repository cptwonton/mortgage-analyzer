import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-slate-900/30 backdrop-blur-sm border-t border-white/10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
              <span className="mr-2">🏠</span>
              Open Source Tool
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              A free, educational mortgage analysis tool designed to help users understand 
              the true costs of homeownership and make informed financial decisions.
            </p>
          </div>

          {/* Links Section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
              <span className="mr-2">🔗</span>
              Resources
            </h3>
            <div className="space-y-2">
              <a
                href="https://github.com/cptwonton/mortgage-analyzer"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-slate-300 hover:text-blue-300 transition-colors text-sm"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                </svg>
                <span>View Source Code</span>
              </a>
              <a
                href="https://github.com/cptwonton/mortgage-analyzer/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-slate-300 hover:text-green-300 transition-colors text-sm"
              >
                <span className="text-green-400">💡</span>
                <span>Report Issues / Suggestions</span>
              </a>
            </div>
          </div>

          {/* Tech & Legal Section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
              <span className="mr-2">⚖️</span>
              Legal & Tech
            </h3>
            <div className="space-y-2 text-sm text-slate-400">
              <p className="flex items-start space-x-2">
                <span className="text-amber-400 mt-0.5">⚠️</span>
                <span>Educational purposes only - not financial advice</span>
              </p>
              <p className="flex items-start space-x-2">
                <span className="text-blue-400 mt-0.5">📊</span>
                <span>Rate data from Mr. Cooper API</span>
              </p>
              <p className="flex items-start space-x-2">
                <span className="text-purple-400 mt-0.5">🔧</span>
                <span>Built with Next.js, TypeScript, Tailwind CSS</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm">
            © {currentYear} Mortgage Analyzer - Open Source Financial Education Tool
          </p>
          <p className="text-slate-500 text-xs mt-2 sm:mt-0">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
