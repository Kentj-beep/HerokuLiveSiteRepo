// Modules for express server functionality
import createError from 'http-errors';
import express, { NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

// Modules for connecting to MongoDB
import mongoose, {mongo} from 'mongoose';

// Modiles for Authentication
import session from 'express-session';      // Use session
import passport from 'passport';            // Authenticaton
import passportLocal from 'passport-local'; // Auth Strategy
import flash from 'connect-flash';          // Auth messaging

// Modules for JWT support
import cors from 'cors';
import passportJWT from 'passport-jwt';

// Define JWT aliases
let JWTStrategy = passportJWT.Strategy;
let ExtractJWT = passportJWT.ExtractJwt;

// Auth objects
let localStrategy = passportLocal.Strategy;
// Import User Model
import User from '../Models/user';

// App Configuration
import indexRouter from '../Routes/index';
import authRouter from '../Routes/auth';
import contactListRouter from '../Routes/contact-list';

const app = express();

// DB configuration
import * as DBconfig from './db';
mongoose.connect(DBconfig.RemoteURI);

const db = mongoose.connection; // alias for mongoose connection
db.on('error', function()
{
  console.error('connection error');
});
db.once('open', function()
{
  console.log(`connected to MongoDB at: ${DBconfig.Host}`);
});

// view engine setup
app.set('views', path.join(__dirname, '../Views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../../Client')));
app.use(express.static(path.join(__dirname, '../../node_modules')));

app.use(cors()); // Adds CORS to the config

// Setup express session
app.use(session({
  secret: DBconfig.SessionSecret,
  saveUninitialized: false,
  resave: false
}));

// Initialize flash
app.use(flash());

// Initialize password
app.use(passport.initialize());
app.use(passport.session());

// Implement an Auth Strategy
passport.use(User.createStrategy());

// Serialize and deserialize user data
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Setup JWT Options
let jwtOptions = 
{
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: DBconfig.SessionSecret
}

// Setup JWT Strategy
let strategy = new JWTStrategy(jwtOptions, function(jwt_payload, done)
{
  User.findById(jwt_payload.id)
    .then(user => {
      return done(null, user);
    })
    .catch(err => {
      return done(err, false); 
    });
});

passport.use(strategy);

// Implement routing
app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/', contactListRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) 
{
  next(createError(404));
});

// error handler
app.use(function(err: createError.HttpError, req: express.Request, 
  res: express.Response, next: NextFunction) 
{
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
