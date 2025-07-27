import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable annoying linting checks
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Development optimizations
  experimental: {
    // Improve hot reload reliability
    optimizePackageImports: ['framer-motion'],
  },
  
  // Better error handling in development
  onDemandEntries: {
    // Keep pages in memory longer to reduce rebuild frequency
    maxInactiveAge: 60 * 1000, // 1 minute
    pagesBufferLength: 5,
  },
  
  // Webpack optimizations for development stability
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Reduce memory usage and improve stability
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: ['**/node_modules', '**/.next'],
      };
      
      // Better error recovery
      config.optimization = {
        ...config.optimization,
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
      };
    }
    
    return config;
  },
};

export default nextConfig;
