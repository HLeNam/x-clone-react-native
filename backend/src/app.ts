import './alias';

import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import express from 'express';
import compression from 'compression';

import routes from '~/routes';
import Database from '~/config/db';
import { defaultErrorHandler } from '~/middlewares/error.middlewares';

const app = express();

// init middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(compression());

app.disable('x-powered-by');

// init routes
app.use('/api', routes);

// handle error
app.use((_req, _res, next) => {
  const error = new Error('Not Found');

  (error as Error & { status?: number }).status = 404;

  next(error);
});

app.use(defaultErrorHandler);

const init = async () => {
  try {
    // init db
    await Database.initialize();
  } catch (error) {
    console.log('🚀 ~ init ~ error:', error);
    process.exit(1);
  }
};

init();

export default app;
