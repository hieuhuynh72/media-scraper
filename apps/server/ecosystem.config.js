module.exports = {
  apps: [
    {
      name: 'media-scraper-1',
      script: 'node',
      args: 'dist/main.js',
      env: {
        PORT: 3001,
        QUEUE_NAME: 'media-scraper-1',
      },
    },
    {
      name: 'media-scraper-2',
      script: 'node',
      args: 'dist/main.js',
      env: {
        PORT: 3002,
      },
      QUEUE_NAME: 'scrapingQueue-2',
    },
    {
      name: 'media-scraper-3',
      script: 'node',
      args: 'dist/main.js',
      env: {
        PORT: 3003,
        QUEUE_NAME: 'scrapingQueue-3',
      },
    },
    {
      name: 'load-balancer',
      script: './proxy.js',
    },
  ],
};
