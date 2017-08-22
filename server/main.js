import WebpacDevServer from 'webpack-dev-server';
import webpack from 'webpack';

import express from 'express';
import session from 'express-session';
import path from 'path';
import morgan from 'morgan';
import bodyParser from 'body-parser';

import api from './routes';

const app = express();
const port = 3000;

// temp setting
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

// error handler
// throw error 가 실행되면 얘가 실행됨.
app.use(function(error, req, res, next){
  console.error(error.stack);
  res.status(500).send('Something borke!');
});

// initialize session
app.use(session({
  secret:'12ZXdf$^!@a',
  resave:false,
  saveUninitialized: true
}));


// static path
app.use('/', express.static(path.join(__dirname, './../public')));

// default route
app.use('/api', api);         //  ~url~/api/routename
app.get('/', (req, res)=>{
  return res.send('Hello nodejs');
});

// listening
app.listen(port, ()=>{
  console.log('Express is listening on port', port);
});

if(process.env.NODE_ENV === 'development'){
  console.log('Server is running. prosess mode is development');
  const config = require('../webpack.config.js');
  const comiler = webpack(config);
  const devServer = new WebpacDevServer(compiler, config.devServer);
  devServer.listen(devPort, ()=>{
    console.log('webpack-dev-server is listening on port', devPort);
  })
}

import mongoose from 'mongoose';

const db = mongoose.connection;
db.on('error', console.error);
db.once('open', ()=>{console.log('Connected to mongodb server');});
mongoose.connect('mongodb://localhost/heo');
