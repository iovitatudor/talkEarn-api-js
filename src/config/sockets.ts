export const CORS = {
  credentials: true,
  methods: ['GET', 'POST'],
  origin: [
    'http://localhost:5001',
    'http://localhost:3021',
    'http://localhost:8080',
    'http://localhost:8081',
    'http://localhost:8082',
    'http://localhost:3000',
    'http://localhost:63342',
    'https://dashboard.instantexpert.online',
    'https://instaservice.io',
    'https://instantexpert.online',
  ],
};

export const Transports = ['polling', 'websocket'];
