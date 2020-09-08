const Path = require('path');
const utils = require('./utils');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// 生产模式压缩，覆盖默认的webpack压缩
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

// 局部安装
// npm i webpack webpack-cli --save-dev
// npm i -D style-loader css-loader
// npm i -D node-sass sass-loader / cnpm i -D node-sass sass-loader
// npm i -D html-webpack-plugin
// npm i clean-webpack-plugin -D / cnpm i clean-webpack-plugin -D
// npm i webpack-dev-server -D
// npm i -D webpack-bundle-analyzer
// npm i -D webpack-merge
// npm i -D typescript ts-loader
// npm install --save-dev mini-css-extract-plugin
// npm i -D copy-webpack-plugin
// npm install -D @babel/core @babel/cli @babel/preset-env
// npm install -D @babel/preset-react
// npm install -S @babel/polyfill
// npm i -S react react-dom

module.exports = {
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
    chunkFilename: '[name].[contenthash].js', // contenthash 根据内容的长期缓存
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
        // 提取所有的 CSS 到一个文件中
        styles: {
          test: /\.css$/,
          name: 'styles',
          chunks: 'all',
          enforce: true,
        },
      },
    },
    // 自定义压缩模式
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
  },
  module: {
    rules: [
      // 还有eslint等
      // {
      //   test: /\.js$/,
      //   use: ['babel-loader?cacheDirectory=true'], // babel
      //   // include: path.join(__dirname, 'src')
      // },
      // {
      //   test: /\.tsx?$/,
      //   use: 'ts-loader',
      //   exclude: /node_modules/,
      // },
      // {
      //   test: /\.(js|jsx)$/,
      //   include: util.resolve('../src'),
      //   use: [
      //     {
      //       loader: 'babel-loader',
      //       options: {
      //         presets: ['@babel/preset-react']
      //       }
      //     }
      //   ]
      // },
      {
        test: /\.css$/,
        use: [
          // 使用了MiniCssExtractPlugin，就不能用 style-loader
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // 启用 ES 模块语法,某些情况下对 module concatenation 和 tree shaking 有益
              esModule: true,
              // 仅在开发环境下使用
              // 模块热更新
              hmr: process.env.NODE_ENV === 'development',
              // 如果 hmr 不工作, 请开启强制选项
              reloadAll: true,
            },
          },
          // 这两个loader的顺序不能对调
          // webpack读取loader时,是从右到左
          // loader执行顺序是从右到左以管道方式链式调用
          // css-loader解析css文件,style-loader放到html文件
          // { // 将相关css注入自动创建的<stye>标签中
          //   loader: 'style-loader'
          // },
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
  // import 时无需加上下面的文件后缀名
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  plugins: [
    // 使用这个插件可以在编译出错的时候来跳过输出阶段，这样可以确保输出资源不会包含错误。
    new webpack.NoEmitOnErrorsPlugin(),
    // 生产模板，并将资源导入该index.html模板
    new HtmlWebpackPlugin({
      template: utils.resolve('../public/index.html'),
      filename:'index.html',   //指定生成的页面名称
      title: 'Output Management',
      inject: true // 将所有的静态文件都插入到body文件的末尾
    }),
    // 提取css为单独文件
    new MiniCssExtractPlugin({
      filename: process.env.NODE_ENV !== 'production' ? '[name].css' : '[name].[hash].css',
      chunkFilename: process.env.NODE_ENV !== 'production' ? '[id].css' : '[id].[hash].css',
    }),
    // 复制移动文件到目标文件，一般用于static目录
    // 打包时复制所有静态文件到目标目录
    // new CopyPlugin({
    //   patterns: [
    //     {
    //       from: Path.resolve(__dirname, '../static'),
    //       to: '../dist/static',
    //     }
    //   ],
    // }),
    // 允许创建一个在编译时可以配置的全局常量
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      },
      PRODUCTION: JSON.stringify(true),
      VERSION: JSON.stringify("5fa3b9"),
      BROWSER_SUPPORTS_HTML5: true,
      TWO: "1+1",
      "typeof window": JSON.stringify("object")
    })
  ],
};
