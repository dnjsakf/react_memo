var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry:[
    'babel-polyfill',
    './src/index.js',
    './src/style.css',
    'webpack-dev-server/client?http://0.0.0.0:4000',
    'webpack/hot/only-dev-server'
  ],
  output:{
    path: '/',
    filename: 'bundle.js'
  },
  devServer:{
    hot: true,
    filename: 'bundle.js',
    publicPath: '/',
    historyApiFallback: true,
    contentBase: './public',
    proxy:{
      '*':'http://localhost:3000'
    },
    status:{
      assets: false,
      colors: true,
      version: false,
      hash: false,
      timings: false,
      chunks: false,
      chunkMouldes: false
    }
  },
  module:{
    loader:[
      {
        test: /\.js$/,
        loaders: ['react-hot', 'bebel?' + JSON.stringify({
          cacheDirectory: true,
          presets: ['es2015', 'react']
        })],
        exclude: /node_moduels/,
      },
      {
        test: /\.css$/,
        loader: 'stylecss-loader'
      }
    ]
  },
  resolve:{
    root: path.resolve('./src')
  },
  plugin:[
    new webpack.HotModuleReplacementPlugin()
  ]
}