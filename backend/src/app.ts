import morgan from 'morgan';
import helmet from 'helmet';
import express from 'express';
import compression from 'compression';

import Database from '~/config/db';

const app = express();

// init middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan('dev'));
app.use(helmet());
app.use(compression());

// init db
Database.initialize().catch(console.error);

export default app;
