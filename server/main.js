import WebpacDevServer from 'webpack-dev-server';
import webpack from 'webpack';

if(process.env.NODE_ENV === 'development'){
  console.log('Server is running. prosess mode is development');
  const config = require('../webpack.config.js');
  const comiler = webpack(config);
  const devServer = new WebpacDevServer(compiler, config.devServer);
  devServer.listen(devPort, ()=>{
    console.log('webpack-dev-server is listening on port', devPort);
  })
}