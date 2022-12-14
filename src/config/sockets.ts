export const CORS = {
  credentials: true,
  methods: ['GET', 'POST'],
  origin: [
    'http://localhost:8080',
    'http://localhost:8081',
    'http://localhost:8082',
    'http://localhost:3000',
    'http://localhost:63342',
    'https://dashboard.talkearn.app',
    'https://instaservice.io',
  ],
};

export const Transports = ['polling', 'websocket'];
