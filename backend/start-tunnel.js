const localtunnel = require('localtunnel');
(async () => {
  try {
    const tunnel = await localtunnel({ port: 3000 });
    console.log('\n========================================================');
    console.log('PUBLIC TUNNEL URL: ' + tunnel.url);
    console.log('========================================================\n');
    tunnel.on('close', () => {
      console.log('Tunnel closed');
      process.exit(1);
    });
    tunnel.on('error', (err) => {
      console.error('Tunnel error:', err);
      process.exit(1);
    });
  } catch (err) {
    console.error('Failed to start tunnel:', err);
    process.exit(1);
  }
})();
