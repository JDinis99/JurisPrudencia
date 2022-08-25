const webpack = require("webpack")

module.exports = {
  webpack: function override (config, env) {


    // let loaders = config.resolve
    // loaders.fallback = {
    //   "fs": false,
    //   "tls": false,
    //   "net": false,
    //   "http": require.resolve("stream-http"),
    //   "https": false,
    //   "zlib": require.resolve("browserify-zlib") ,
    //   "path": require.resolve("path-browserify"),
    //   "stream": require.resolve("stream-browserify"),
    //   "util": require.resolve("util/"),
    //   "crypto": require.resolve("crypto-browserify"),
    //   "assert": require.resolve("assert/"),
    //   "constants": require.resolve("constants-browserify"),
    //   "os": require.resolve("os-browserify/browser"),
    // }
    
    return config
  }
}