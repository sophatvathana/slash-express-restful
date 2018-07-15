var webpack = require('webpack');
var path = require('path');
var fs = require('fs');


export default function (webpackConfig) {
  var nodeModules = {};
  fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

  webpackConfig.externals = nodeModules

  // webpackConfig.module.rules.push({
  //     test: /\.js$/,
  //     // exclude: /(node_modules|bower_components)/,
  //     include: /node_modules/,
  //     use: {
  //       loader: 'babel-loader',
  //       options: {
  //         presets: ['@babel/preset-env']
  //       }
  //     }
  // })

  webpackConfig.module.rules.push({
    test: /\.svg$/i,
    use: [
      {
        loader: require.resolve('svg-sprite-loader'),
      },
    ],
  })
  return webpackConfig
};
