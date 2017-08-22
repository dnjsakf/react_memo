var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './src/index.js',

  output: {
      path: __dirname + '/public/',
      filename: 'bundle.js'
  },

  module: {
      loaders: [
          {
              test: /\.js$/,
              loaders: ['babel?' + JSON.stringify({
                  cacheDirectory: true,
                  presets: ['es2015', 'react']
              })],
              exclude: /node_modules/,
          }
      ]
  }
};

// module.exports = {
//   entry:[
//     './src/index.js',
//     './src/style.css',
//     'babel-polyfill'
//   ],
//   output:{
//     path: __dirname + '/public',
//     filename: 'bundle.js'
//   },
//   module:{
//     lodear:[
//       {
//         test: /\.js$/,
//         loaders: ['babel?' + JSON.stringify({
//           cacheDirectory: true,
//           presets: ['es2015', 'react']
//         })],
//         exclude: /node_modules/
//       },
//       {
//         test: /\.css$/,
//         loader: 'stylecss-loader'
//       }
//     ]
//   },
//   resolve:{
//     root: path.resolve('./src')
//   },
//   plugin:[
//     new webpack.DefinePlugin({
//       'process.env':{
//         'NODE_ENV': JSON.stringify('roduction')
//       }
//     }),
//     new webpack.optimize.UglifysPlugin({
//       compress:{
//         warnings: true
//       }
//     })
//   ]
// }