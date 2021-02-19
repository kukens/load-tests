module.exports = {
  pages: [
     '/',
     '/page1',
     '/page2'
  ],
  protocol: 'https',
  siteHostName: '',
  trafficManagerHostName: '',
  requestsPerSecond: 20,
  testDuration: 120,
  concurrency: 100,
  tresholds: {
    meanLatencyMs: [500, 1000],
    percentiles50: [400, 700],
    percentiles90: [700, 1200],
    percentiles95: [1000, 1500],
    percentiles99: [1300, 2000]
  } 
}