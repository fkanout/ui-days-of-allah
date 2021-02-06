const { createPortal } = require("react-dom")

module.exports = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Note: we provide webpack above so you should not `require` it
    // Perform customizations to webpack config
    config.plugins.push(new webpack.IgnorePlugin(/\/__tests__\//))
    config.module.noParse = /sql.js/
    // config.module.rules.push({
    //   test: /\.wasm$/,
    //   loaders: ['base64-loader'],
    //   type: 'javascript/auto',
    // });
    // Important: return the modified config
    return config
  },
}