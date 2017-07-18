import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import path from 'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import errorDev from './middleware/errorDev';
import { getConfig } from './config';
import cardsApi from './api/cards';
import payApi from './api/pay';
import merchantApi from './api/merchant';

const app = express();
const config = getConfig();

mongoose.connect(config.db.MONGO_URI);
mongoose.connection.on('error', () => {
  console.error(
    'MongoDB Connection Error. Please make sure that MongoDB is running.'
  );
  process.exit(1);
});

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.disable('etag');

app.use(morgan('dev'));

// use cors everywhere
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// API endpoints
app.use('/api/cards', cardsApi);
app.use('/api/pay', payApi);
app.use('/api/merchant', merchantApi);

// development error handler
// will print stacktrace
if (app.get('env') === 'development' || app.get('env') === 'test') {
  app.use(errorDev);
}

process.on('SIGINT', () => {
  mongoose.connection.close(() => process.exit(0));
});
process.on('SIGTERM', () => {
  mongoose.connection.close(() => process.exit(0));
});

module.exports = app;
