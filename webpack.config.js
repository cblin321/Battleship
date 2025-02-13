const path = require("path")
const HtmlPlugin = require("html-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
    mode: "production", 
    entry: "./src/index.js",
    output: {
        filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
    }, 
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html"
        })
    ], 
    devServer: {
        watchFiles: ["./src/index.html"],
      },
    module: {
        rules: [
          {
            test: /\.css$/i,
            use: ["style-loader", "css-loader"],
          },
          {
            test: /\.(woff|woff2|ttf)$/,
            type: "asset/resource"
            
          }
        ],
      },
}