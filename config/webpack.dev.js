const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');

// module.exports = (env) => {
//   console.log(env.NODE_ENV == 'prod')
//   console.log(env.NODE_ENV == 'dev')

//   return merge(common, {
//     // 生产模式
//     mode: 'development',
//     // 定义sourcemap 的模式,只在开发模式下开启，在生产模式下无需开启
//     devtool: 'inline-source-map',
//     // 提供了一个简单的 web 服务器，并且能够实时重新加载(live reloading)
//     devServer: {
//       port: 9000,
//       compress: true,
//       hot: true,
//       open: true,
//       proxy: {}
//     },
//     plugins: [
//       // 启用热替换模块，记住，我们永远不要再生产环境中使用hmr
//       new webpack.HotModuleReplacementPlugin(),
//       // 这个插件的主要作用就是在热加载的时候直接返回更新文件的名称，而不是文件的id
//       // 当开启 HMR 的时候使用该插件会显示模块的相对路径，建议用于开发环境。
//       new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
//     ],
//   })
// };

module.exports = merge(common, {
    // 生产模式
    mode: 'development',
    // 定义sourcemap 的模式,只在开发模式下开启，在生产模式下无需开启
    devtool: 'inline-source-map',
    // 提供了一个简单的 web 服务器，并且能够实时重新加载(live reloading)
    devServer: {
      port: 9000,
      compress: true,
      hot: true,
      open: true,
      proxy: {}
    },
    plugins: [
      // 启用热替换模块，记住，我们永远不要再生产环境中使用hmr
      new webpack.HotModuleReplacementPlugin(),
      // 这个插件的主要作用就是在热加载的时候直接返回更新文件的名称，而不是文件的id
      // 当开启 HMR 的时候使用该插件会显示模块的相对路径，建议用于开发环境。
      new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    ],
  });

