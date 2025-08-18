import 'dotenv/config';

import app from './src/app';

const PORT = +(process.env.PORT ?? 5001);

const server = app.listen(PORT, () => {
  console.log(`X Clone started on port ${PORT}`);
});

// Handle exit server express with SIGINT signal (Ctrl + C)
process.on('SIGINT', () => {
  server.close(() => {
    console.log('Exit Server Express');
    // notify.send( ping...)
  });
});
