var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'dist/');
var APP_DIR = path.resolve(__dirname, 'src/');

var config = {
  entry: './src/js/index.jsx',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  resolve: {
    modules: ["node_modules", "./src"],
    extensions: ['.js', '.jsx']
},
plugins: [
  require('autoprefixer')
],
  module : {
    rules : [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [{
            loader: 'babel-loader',
            query: {
              presets: ['react', 'env', 'stage-3']
          }
        }]
    }, {
        test: /\.(css|scss)$/,
        use: [{
            loader: "style-loader"
        }, {
            loader: "css-loader"
        }, {
            loader: "sass-loader"
        }]
    },
      {
        test: /\.(jpg|png|svg)$/,
        use: {
          loader: "file-loader",
          options: {
            name: "[path][name].[hash].[ext]",
          },
        },
        use: {
          loader: "url-loader",
          options: {
            limit: 25000,
          },
        },
      },
    ]
  }
};

module.exports = config;
