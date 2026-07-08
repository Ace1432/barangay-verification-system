require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const express = require('express');
const session = require('express-session');
const path = require('path');

const { router: authRouter } = require('./routes/auth');
const residentsRouter = require('./routes/residents');
const requestsRouter = require('./routes/requests');

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Required behind Railway/Render's reverse proxy so secure cookies work correctly
if (isProduction) {
  app.set('trust proxy', 1);
}

app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-only-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 4, // 4 hours
    secure: isProduction,        // only send cookie over HTTPS in production
    sameSite: 'lax',
  }
}));

app.use('/api/auth', authRouter);
app.use('/api/residents', residentsRouter);
app.use('/api/requests', requestsRouter);

const { initializeDatabase } = require('./db/database');

// Serve the built React app
const clientDist = path.join(__dirname, 'client', 'dist');
app.use(express.static(clientDist));

// Client-side routing fallback (must come after API routes and static files)
app.use((req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Barangay Verification System running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize the database:', err);
    process.exit(1);
  });
