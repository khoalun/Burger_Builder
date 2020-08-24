const express = require('express');
const dotenv = require('dotenv');
var bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middlewares/error');

const connDB = require('./config/db');
// Load env vars
dotenv.config({
  path: './config/config.env',
});

// connect DB
connDB();

const bootcamps = require('./routes/bootcamps');
const register = require('./routes/auth');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());

//Cookie parser
app.use(cookieParser());

const middleware = (req, res, next) => {
  req.hello = 'Duc Phan hello';
  next();
};
if (process.env.NODE_ENV === 'development') app.use(middleware);

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/auth', register);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {});

// hadle unhandled rejection
process.on('unhandledRejection', (err, promise) => {
  console.error(err.message);
  console.error(promise);
  server.close(() => process.exit(1));
});
