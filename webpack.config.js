const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? 'js/[name].[contenthash].js' : 'js/[name].js',
      publicPath: '/e-invoice/',
      clean: true,
    },
    devtool: isProduction ? 'source-map' : 'eval-source-map',
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react']
            }
          }
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'images/[hash][ext][query]'
          }
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[hash][ext][query]'
          }
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx']
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html',
        minify: isProduction
      })
    ],
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
    },
    devServer: {
      static: {
        directory: path.join(__dirname, 'public'),
        publicPath: '/e-invoice/'
      },
      port: 3000,
      hot: true,
      historyApiFallback: {
        index: '/e-invoice/'
      },
      proxy: [
        {
          context: ['/api'],
          target: 'http://localhost:3003',
          changeOrigin: true,
        }
      ]
    }
  };
}; 