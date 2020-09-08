const Path = require('path');
const utils = require('./utils');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// 局部安装
// npm i webpack webpack-cli --save-dev
// npm i -D style-loader css-loader
// npm i -D node-sass sass-loader / cnpm i -D node-sass sass-loader
// npm i -D html-webpack-plugin
// npm i clean-webpack-plugin -D / cnpm i clean-webpack-plugin -D
// npm i webpack-dev-server -D
// npm i -D webpack-bundle-analyzer
// npm i -D webpack-merge

module.exports = (env) => {
  console.log(env.NODE_ENV == 'prod')
  console.log(env.NODE_ENV == 'dev')
  return {
    // 开发模式还是生产模式
    mode: "production",
    // mode: 'development',
    // 指定入口文件，多个用[]
    entry: {
      app: [
        // 'babel-polyfill',
        utils.resolve('../src/main.js')
      ],
      // vendor: ['lodash'] // 把第三方库生成打包到vendor.hash.js里面去。同下面的cacheGroups
    },
    // 指定打包后的输出目录，publicPath为所有静态资源的公共目录
    output: {
      filename: '[name].[hash].js',
      chunkFilename: '[name].[chunkhash].js',
      path: utils.resolve('../dist'),
      publicPath: '/', // publicPath将影响devServer的运行
    },
    optimization: {
      // 摇树配置
      usedExports: true,
      // 为 single 来为所有 chunk 创建一个 runtime bundle，会创建一个在所有生成 chunk 之间共享的运行时文件
      runtimeChunk: 'single',
      // 保证不论是否添加任何新的本地依赖，对于前后两次构建，vendor hash 都应该保持一致
      moduleIds: 'hashed',
      // node_modules中的第三方库单独打包为 vendors，以此形成浏览器缓存
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    },
    // 定义sourcemap 的模式,只在开发模式下开启，在生产模式下无需开启
    // devtool: 'inline-source-map',
    // 提供了一个简单的 web 服务器，并且能够实时重新加载(live reloading)
    devServer: {
      port: 9000,
      compress: true,
      hot: true,
      open: true,
      proxy: {}
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            // 这两个loader的顺序不能对调
            { // 将相关css注入自动创建的<stye>标签中
              loader: 'style-loader'
            },
            { // 允许在js来import一个css文件。解析@import 和 url()语法。
              loader: 'css-loader'
            }
          ]
        },
        {
          test: /\.scss$/,
          use: [
            {
              loader: "style-loader"
            },
            {
              loader: "css-loader"
            },
            { // 解析sass为css
              loader: "sass-loader"
            }
          ]
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: [
            { // 对文件进行打包
              loader: 'file-loader'
            },
          ]
        },
        {
          test: /\.(png|jpe?g|svg|jpg|gif)$/,
          use: [
            { // 类似于 file-loader,但会在一定情况下转为dataUrl
              loader: 'url-loader',
              options: {
                name: '[name].[hash].[ext]', // 解析后的文件目录和名字
                // limit: 1024 // 文件小于该值则为dataurl
              }
            },
          ]
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          loader: 'url-loader',
          options: {
              limit: 10000
              // name: utils.assetsPath('media/[name].[hash:7].[ext]')
          }
        }
      ]
    },
    plugins: [
      // 启用热替换模块，记住，我们永远不要再生产环境中使用hmr
      new webpack.HotModuleReplacementPlugin(),
      // 这个插件的主要作用就是在热加载的时候直接返回更新文件的名称，而不是文件的id
      // 当开启 HMR 的时候使用该插件会显示模块的相对路径，建议用于开发环境。
      new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
      // bundle 分析插件
      new BundleAnalyzerPlugin(),
      // 清理dist文件夹
      new CleanWebpackPlugin(),
      // 生产模板，并将资源导入该index.html模板
      new HtmlWebpackPlugin({
        template: utils.resolve('../public/index.html'),
        filename:'index.html',   //指定生成的页面名称
        title: 'Output Management',
        inject: true
      })
    ],
  }
}
