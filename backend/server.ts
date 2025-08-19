import app from '~/app';
import { ENV } from '~/config/env';

const PORT = ENV.PORT;

const server = app.listen(PORT, () => {
  console.log(`✅ X Clone started on port ${PORT}`);
});

// Handle exit server express with SIGINT signal (Ctrl + C)
process.on('SIGINT', () => {
  server.close(() => {
    console.log('⚠️ Exit Server Express');
    // notify.send( ping...)
  });
});
