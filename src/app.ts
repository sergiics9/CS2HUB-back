import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import createDebug from 'debug';
import { errorMiddleware } from './middlewares/error.js';
import { usersRouter } from './routers/users.router.js';
import { skinsRouter } from './routers/skins.router.js';

const debug = createDebug('CS2HUB:app');

export const app = express();
debug('Starting');

app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.static('public'));

app.use('/users', usersRouter);
app.use('/skins', skinsRouter);

app.use(errorMiddleware);
