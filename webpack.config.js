const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { listFiles } = require('fs-directory');

const siteSources = path.join(__dirname, 'src', 'site');
const siteOutput = path.join(__dirname, 'output', 'site');
const templatesDirectory = path.join(__dirname, 'output', 'templates');

const indexFiles = listFiles(templatesDirectory, {
    fileFilter: (entry) => entry.name === 'index.html',
    directoryFilter: () => true,
});

const htmlPlugins = indexFiles.map((template) => {
    const filename = template.replace(`${templatesDirectory}/`, '');
    return new HtmlWebpackPlugin({
        template,
        filename,
    });
});

module.exports = {
    mode: 'development',
    entry: {
        site: path.resolve(siteSources, 'index.tsx'),
    },
    target: 'web',
    resolve: {
        extensions: ['.tsx', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: '/node_modules/',
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                    },
                ],
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    output: {
        filename: '[name].js',
        path: siteOutput,
        publicPath: '/',
    },
    plugins: [...htmlPlugins],
    devServer: {
        static: {
            directory: siteOutput,
        },
        client: {
            progress: true,
        },
        compress: true,
        port: 9000,
    },
};
