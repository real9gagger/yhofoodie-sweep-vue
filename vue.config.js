/**
 * 配置该文件可以参考:
 * https://cli.vuejs.org/zh/config/#%E7%9B%AE%E6%A0%87%E6%B5%8F%E8%A7%88%E5%99%A8
 */
// 基础路径，发布前修改这里,当前配置打包出来的资源都是相对路径
module.exports = {
  publicPath: './',
  lintOnSave: true,
  productionSourceMap: false,
  css: {
    // 忽略 CSS order 顺序警告
    extract: { ignoreOrder: true }
  },
  // 配置转发代理
  devServer: {
    port: 8080,
    proxy: {
      '/yhoapi': {
        target: 'https://api.foodie.vc/interface.php',
        ws: true,
        pathRewrite: {
          '^/yhoapi': ''
        },
		changeOrigin: true
      }
    }
  }
}
