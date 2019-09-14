const path = require('path');
const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PurgeCssPlugin = require('purgecss-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

const PATHS = {
    src: path.join(__dirname, 'src')
};

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                            // options...
                        }
                    }
                ]
            },
            {
                test: /\.js$/,
                exclude: '/node_modules/',
                use: {
                    loader: "babel-loader",
                    options: {
                        //presets: ['@babel/env'],
                        plugins: ['@babel/plugin-syntax-bigint', '@babel/plugin-proposal-class-properties']
                    }
                }
            },
            {
                test: /\.html$/,
                use: ['file-loader?name=[name].[ext]', 'extract-loader', 'html-loader'],
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'css/[name].bundle.css'
        }),
        new PurgeCssPlugin({
            paths: glob.sync(`${PATHS.src}/**/*`,  { nodir: true }),
            whitelist: []
        }),
        new WorkboxPlugin.GenerateSW({
            clientsClaim: true,
            skipWaiting: true
     })
    ]
};
