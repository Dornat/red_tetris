const path = require('path');

const music = path.resolve(__dirname, 'music');

module.exports = {
    mode: 'production',
    entry: './index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '../dist/resources/js')
    },
    node: {
        fs: 'empty'
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.(ogg|mp3|wav|mpe?g)$/i,
                include: music,
                loader: 'file-loader',
                options: {
                    outputPath: 'music'
                }
            }
        ]
    }
};