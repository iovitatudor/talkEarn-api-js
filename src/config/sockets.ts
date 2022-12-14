export const CORS = {
  credentials: true,
  methods: ['GET', 'POST'],
  origin: [
    'http://localhost:8080',
    'http://localhost:63342',
    'https://dashboard.talkearn.app',
    'https://instaservice.io',
  ],
};

export const Transports = ['polling', 'websocket'];
