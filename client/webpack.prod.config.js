const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

module.exports = {
  entry: {
    bundle: './app.js',
  },
  output: {
    path: path.join(__dirname, '../backend/public'),
    filename: '[name].js',
    chunkFilename: '[name].js',
  },
  resolve: {
    // We can now require('file') instead of require('file.jsx')
    extensions: ['.js', '.jsx', '.scss', '.less'],
  },
  module: {
    rules: [
      {
        test: /.jsx?$/,
        exclude: [/node_modules/, /front.style.js/, /styles.js/],
        // exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'react', 'stage-0'],
            retainLines: true,
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /.less$/,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: "css-loader!less-loader",
        }),
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
        'ENV': JSON.stringify('production'),
      },
    }),
    new ExtractTextPlugin('./[name].css'),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress: {
        warnings: false,
      },
    }),
    // new webpack.SourceMapDevToolPlugin({
    //   // Match assets just like for loaders.
    //   test: /\.js$/,
    //
    //   // `exclude` matches file names, not package names!
    //   exclude: '/node_modules/',
    //
    //   // If filename is set, output to this file.
    //   // See `sourceMapFileName`.
    //   filename: '[file].map',
    //
    //   // This line is appended to the original asset processed. For
    //   // instance '[url]' would get replaced with an url to the
    //   // sourcemap.
    //   append: false,
    //
    //   module: true, // If false, separate sourcemaps aren't generated.
    //
    //   // Use simpler line to line mappings for the matched modules.
    //   // lineToLine: bool | {test, include, exclude}
    // }),
  ],
};
