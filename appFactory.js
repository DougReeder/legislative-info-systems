import createError from 'http-errors';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import indexRouter from './routes/index.js';
import legislatorsRouter from './routes/legislator.js';

async function appFactory({injectLegislators}) {
  const app = express();

// view engine setup
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'pug');

  app.locals.appTitle = 'Legislative Info Systems';

  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

  app.use('/', injectLegislators, indexRouter);
  app.use('/legislator', injectLegislators, legislatorsRouter);

// catch 404 and forward to error handler
  app.use(function(req, res, next) {
    next(createError(404, "Sorry, we couldn't find that page"));
  });

// error handler
  app.use(function(err, req, res, next) {
    // renders the error page, only providing error in development
    res.status(err.status || 500);
    res.render('error', {
      heading: err.message,
      error: req.app.get('env') === 'development' ? err : {}
    });
  });

  return app;
};


export default appFactory;
