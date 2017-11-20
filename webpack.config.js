const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV || 'development';
const publicPath = NODE_ENV === 'development' ? '/' : '/test-router/';

const htmlWebpack = new HtmlWebpackPlugin({
    template: './index.html',
    filename: 'index.html',
    inject: 'body'
});
const extractStyl = new ExtractTextPlugin('[name].css');
const definePlugin = new webpack.DefinePlugin({
    baseRoute: JSON.stringify(publicPath)
});

module.exports = {
    context: path.resolve(__dirname, 'src'),
    entry: ['babel-polyfill', './index.js'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath,
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader',
                include: path.resolve(__dirname, 'src')
            },
            {
                test: /\.styl$/,
                use: extractStyl.extract(['css-loader', 'stylus-loader']),
                include: path.resolve(__dirname, 'src')
            },
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: 'babel-loader'
                    },
                    {
                        loader: 'react-svg-loader',
                        options: {
                            jsx: true,
                            svgo: { floatPrecision: 2 }
                        }
                    }
                ]
            }
        ]
    },
    devServer: { historyApiFallback: true },
    plugins: [htmlWebpack, extractStyl, definePlugin]
};
