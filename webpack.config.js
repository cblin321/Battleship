const path = require("path")
const HtmlPlugin = require("html-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
    mode: "development", 
    entry: "./src/index.js",
    output: {
        filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
    }, 
    plugins: [
        new HtmlWebpackPlugin({
            template: "./dist/index.html"
        })
    ], 
    devServer: {
        watchFiles: ["./dist/index.html"],
      },
    module: {
        rules: [
          {
            test: /\.css$/i,
            use: ["style-loader", "css-loader"],
          },
        ],
      },
}