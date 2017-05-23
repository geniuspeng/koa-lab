'use strict';

let path = require('path'),
    fs = require('fs'),
    webpack = require('webpack'),
    precss = require('precss'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    devServerHost = '127.0.0.1', 
    devServerPort = 9999,
    node_modules = path.resolve(__dirname + '/node_modules'),
    srcPath = path.resolve(__dirname + '/public/static/home');
    
module.exports = {
  entry: {
    app: [  // 热加载配置
        'webpack-dev-server/client?http://127.0.0.1:9999',
        'webpack/hot/only-dev-server',
        srcPath + '/index.js'
    ],
    // 'index': srcPath + '/index.js'
    // 'login': [srcPath + '/login.js', srcPath + '/login.css'],
    // 'detail': [srcPath + '/detail.js', srcPath + '/detail.styl']
  },

  output: {
    path: __dirname + '/public/static/home/build',
    publicPath: '/',
    filename: '[name].js'
  },

  resolve: {
    extensions: ['.js', '.vue', '.css', '.scss', 'styl', '*'],
    alias: {
      'lib': path.resolve(srcPath + '/scripts/lib'),
      'vue': path.resolve(node_modules + '/vue/dist/vue.js'),
      'd3': path.resolve(node_modules + '/d3/build/d3.min.js'),
      //'yidian': path.resolve(srcPath + '/scripts/lib/util.js'),
      'main.styl': path.resolve(srcPath + '/main.styl')
    }
  },

  // resolveLoader: {
  //   root: [node_modules]
  // },

  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },

      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [srcPath],
        exclude: [node_modules]
      },

      {
        test: /\.styl$/,
        use: [
          'style-loader',
          'css-loader',
          'stylus-loader'
        ]
      },

      {
        test: /\.css/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader'
          ]
        })
      },

      {
        test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 20000,

          //大图片和字体文件放在单独的assets文件夹
          name: 'assets/[name].[ext]'

          //图片打包为相对context的路径
          //context: path.resolve(srcPath + '/scripts')
        }
      }
    ]
  },

  // 引入的css文件使用precss来解析
  // postcss: function() {
  //   return [precss]
  // },

  // babel: {
  //   'presets': ['es2015'],
  //   'plugins': ['transform-runtime']
  // },

  // vue: {
  //   postcss: [precss()],
  //   autoprefixer: false,
  //   loaders: {
  //     css: process.env.NODE_ENV === 'production'
  //       ? ExtractTextPlugin.extract('style', 'css!sass')
  //       : 'vue-style!css!sass'
  //   }
  // },

  devServer: {
    historyApiFallback: true,
    noInfo: true,
    inline: true,
    publicPath: '/',
    host: devServerHost,
    port: devServerPort
    // proxy: {
    //   '*': {
    //      target: 'http://127.0.0.1:9999',
    //      changeOrigin: true,
    //      secure: false
    //    }
    // }
  },

  plugins: [

    //提供全局变量
    new webpack.ProvidePlugin({
      Vue: 'vue'
      // d3: 'd3'
    }),
    new webpack.HotModuleReplacementPlugin(),
    // 把公用文件单独打包
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      filename: 'common.js',
      minChunks: Infinity
    })
  ]
};