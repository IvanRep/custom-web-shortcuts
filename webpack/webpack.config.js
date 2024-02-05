const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
module.exports = {
    mode: 'production',
    entry: {
        'background/background': path.resolve(__dirname, '..', 'src','background', 'background.ts'),
        'content/content': path.resolve(__dirname, '..', 'src', 'content', 'content.ts'),
        'popup/popup': path.resolve(__dirname, '..', 'src', 'popup', 'popup.ts')
    },
    output: {
        path: path.resolve(__dirname, '..', 'dist'),
        filename: '[name].js',
        clean: true,
    },
    devtool: 'inline-source-map',
    resolve: {
        extensions: ['.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.(ts)x?$/,
                exclude: /node_modules|\.d\.ts$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        compilerOptions: {
                            noEmit: false,
                        }
                    }
                }
            },
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: '.', to: '.', context: 'public' },
                {
                    from: path.resolve(__dirname, '..', 'src', 'styles'),
                    to: path.resolve(__dirname, '..', 'dist', 'styles'),
                    context: 'public',
                },
                {
                    from: path.resolve(__dirname, '..', '_locales'),
                    to: path.resolve(__dirname, '..', 'dist', '_locales'),
                    context: 'public',
                },
                {
                    from: path.resolve(__dirname, '..', 'src', 'icons'),
                    to: path.resolve(__dirname, '..', 'dist', 'icons'),
                    context: 'public',
                },
                {
                    from: path.resolve(__dirname, '..', 'src', 'popup', 'popup.html'),
                    to: path.resolve(__dirname, '..', 'dist', 'popup', 'popup.html'),
                }
            ]
        })
    ]
}