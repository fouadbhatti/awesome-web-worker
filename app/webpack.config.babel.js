import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export default {
  entry: path.join(__dirname, './src/app.js'),
  output: {
    path: path.join(__dirname, '../public'),
    filename: 'app.bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Awesome Web worker',
    })
  ],
  stats: {
    colors: true
  },
  devtool: 'source-map'
};