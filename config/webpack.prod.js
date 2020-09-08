const Path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// module.exports = (env) => {
//   return merge(common, {
//     // 生产模式
//     mode: 'production',
//     plugins: [
//       // bundle 分析插件
//       new BundleAnalyzerPlugin(),
//       // 清理dist文件夹
//       new CleanWebpackPlugin(),
//     ],
//   })
// };

module.exports = merge(common, {
  // 生产模式
  mode: 'production',
  plugins: [
    // bundle 分析插件
    new BundleAnalyzerPlugin(),
    // 清理dist文件夹
    new CleanWebpackPlugin(),
  ],
});
