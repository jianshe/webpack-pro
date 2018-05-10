const path = require('path');
const glob = require('glob'); //一起来扫描文件时需要用到
const webpack = require('webpack');
const uglify = require('uglifyjs-webpack-plugin');
const htmlPlugin = require('html-webpack-plugin');
const extractTextPlugin = require('extract-text-webpack-plugin');
//const purifyCssPlugin = require('purifycss-webpack');
const PurifyCSSPlugin = require("purifycss-webpack"); //打包时消除没有使用的css
const entry = require('./webpack_config/entry_webpack'); //引入项目的入口文件
const copyWebpackPlugin = require("copy-webpack-plugin");


//console.log(encodeURIComponent(process.env.type));
if (process.env.type == "build") {
    var website = {
        publicPath: "http://jianshe.com"
    }
} else {
    var website = {
        publicPath: "http://172.30.67.118:1717/"
    }
}

module.exports = {
    devtool: 'eval-source-map',
    //entry: entry.path,
    //抽离第三方引入库的方法：1.修改入口文件。2.引入插件（CommonsChunkPlugins）
    entry: {
        entry: './src/entry.js',
        jquery: 'jquery',
        vue: 'vue'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        publicPath: website.publicPath //解决公用地址打包后路径出错的问题，如img、css引用
    },
    module: {
        rules: [{
                test: /\.css$/,
                // use: ['style-loader', 'css-loader']  //每一种引用方式
                // use: [{
                //     loader: "style-loader"
                // }, {
                //     loader: "css-loader"
                // }] //第二种引用方式
                use: extractTextPlugin.extract({ //css分离需要改写css处理方式
                    fallback: "style-loader",
                    //use: "css-loader"//一种简单的使用方式，缺点不方便添加其它配置参数
                    use: [{
                        loader: "css-loader",
                        options: {
                            importLoaders: 1
                        }
                    }, {
                        loader: "postcss-loader"
                    }]
                })
            }, {
                test: /\.(png|jpg|gif)/,
                use: [{
                    loader: "url-loader",
                    options: {
                        limit: 50,
                        outputPath: 'images/'
                    }
                }]
            }, {
                test: /\.(htm|html)$/i,
                use: [{ loader: "html-withimg-loader" }]
            }, {
                test: /\.less$/,
                //use: [{ loader: "style-loader" }, { loader: "css-loader" }, { loader: "less-loader" }]//不分离，直接将less文件打包到entry.js文件中
                //分离less文件到指定的css文件下
                use: extractTextPlugin.extract({
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "less-loader"
                    }],
                    // use style-loader in development
                    fallback: "style-loader"
                })

            },
            {
                test: /\.scss$/,
                // use: [{
                //         loader: "style-loader"
                //     }, {
                //         loader: "css-loader"
                //     }, {
                //         loader: "sass-loader"
                //     }]//不分离，直接将less文件打包到entry.js文件中
                //分离scss文件到指定的css文件下
                use: extractTextPlugin.extract({
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "sass-loader"
                    }],
                    fallback: "style-loader"
                })

            }, {
                test: /\.(jsx|js)$/,
                use: [{
                    loader: "babel-loader"
                        // options: {
                        //     presets: ["es2015", "react"]
                        // }
                }],
                exclude: /node_modules/
            }

        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({ //抽离第三方引入库的插件
            name: ['jquery', 'vue'],
            filename: 'assets/js/[name].js',
            minChunks: 2
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            "vue": "vue"
        }),
        //new uglify()
        new htmlPlugin({
            minify: {
                removeAttributeQuotes: true
            },
            hash: true,
            template: './src/index.html'
        }),
        new extractTextPlugin("css/index.css"), //注意点：前面如果多添加一个/，打包引入的样式路径，会有两个反斜杠。
        new PurifyCSSPlugin({
            // Give paths to parse for rules. These should be absolute!
            paths: glob.sync(path.join(__dirname, 'src/*.html')),
        }),
        new webpack.BannerPlugin('jianshe 版权所有'),
        new copyWebpackPlugin([{
            from: __dirname + '/src/public',
            to: './public'
        }]),
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        //设置基本目录结构
        contentBase: path.resolve(__dirname, 'dist'),
        host: '172.30.67.118',
        compress: true,
        port: 1717
    },
    watchOptions: {
        poll: 1000, //监测修改的时间以毫秒为单位
        aggregateTimeout: 500, //ageregeatetimeout
        ignored: /node_modules/
    }
}