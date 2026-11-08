const fs = require('fs');
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Enable modern package exports
config.resolver.unstable_enablePackageExports = true;

// Exclude duplicate extracted archive folder from module scanning
config.resolver.blockList = [
  /riyadah-elite-—-competitive-gaming-&-playtesting-ecosystem[\\\/].*/,
];

// Ensure source extensions include mjs, cjs, tsx, ts, jsx, js, json
const defaultSourceExts = config.resolver.sourceExts || [
  'tsx',
  'ts',
  'jsx',
  'js',
  'json',
];

config.resolver.sourceExts = Array.from(
  new Set([...defaultSourceExts, 'mjs', 'cjs'])
);

const lucidePath = path.resolve(__dirname, 'node_modules/lucide-react/dist/cjs/lucide-react.js');
const motionReactPath = path.resolve(__dirname, 'node_modules/motion/dist/cjs/react.js');
const motionPath = path.resolve(__dirname, 'node_modules/motion/dist/cjs/index.js');
const universalMotionPath = path.resolve(__dirname, 'src/components/universalMotion.tsx');

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'lucide-react') {
    return {
      filePath: lucidePath,
      type: 'sourceFile',
    };
  }
  if (moduleName === 'motion/react') {
    return {
      filePath: platform === 'web' ? motionReactPath : universalMotionPath,
      type: 'sourceFile',
    };
  }
  if (moduleName === 'motion') {
    return {
      filePath: motionPath,
      type: 'sourceFile',
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

// Custom Static Asset Interception Middleware
config.server = {
  ...config.server,
  enhanceMiddleware: (metroMiddleware) => {
    return (req, res, next) => {
      const urlPath = req.url.split('?')[0];
      if (urlPath.startsWith('/assets/')) {
        const relativeAssetPath = urlPath.replace(/^\/assets\//, '');
        const candidatePaths = [
          path.join(__dirname, 'public', 'assets', relativeAssetPath),
          path.join(__dirname, 'public', relativeAssetPath),
          path.join(__dirname, 'assets', relativeAssetPath),
          path.join(__dirname, relativeAssetPath),
        ];

        for (const filePath of candidatePaths) {
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            const ext = path.extname(filePath).toLowerCase();
            const mimeTypes = {
              '.svg': 'image/svg+xml',
              '.png': 'image/png',
              '.jpg': 'image/jpeg',
              '.jpeg': 'image/jpeg',
              '.webp': 'image/webp',
              '.gif': 'image/gif',
              '.ico': 'image/x-icon',
              '.css': 'text/css',
              '.js': 'application/javascript',
              '.json': 'application/json',
              '.woff': 'font/woff',
              '.woff2': 'font/woff2',
              '.ttf': 'font/ttf',
              '.md': 'text/markdown',
            };
            const contentType = mimeTypes[ext] || 'application/octet-stream';
            res.setHeader('Content-Type', contentType);
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
            res.writeHead(200);
            return fs.createReadStream(filePath).pipe(res);
          }
        }
      }
      return metroMiddleware(req, res, next);
    };
  },
};

module.exports = config;
