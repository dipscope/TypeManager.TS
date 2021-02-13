const Path = require('path');
const CircularDependencyPlugin = require('circular-dependency-plugin');

module.exports = {
    mode: 'production',
    devtool: 'inline-source-map',
    entry: {
        index: {
            import: './src/index.ts',
            filename: 'index.js'
        },
        helpers: { 
            import: './src/helpers/index.ts', 
            filename: 'helpers.js',
            dependOn: ['index']
        }
    },
    output: {
        path: Path.resolve(__dirname, 'dist'),
        library: ['TypeManager', '[name]'],
        libraryTarget: 'umd'
    },
    plugins: [
        new CircularDependencyPlugin({
            exclude: /node_modules/,
            include: /src/,
            failOnError: true,
            allowAsyncCycles: false,
            cwd: process.cwd()
        })
    ],
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: [{
                loader: 'ts-loader',
                options: {
                    configFile: "tsconfig.webpack.json"
                }
            }],
            exclude: /node_modules/,
            include: [
                Path.resolve(__dirname, "src")
            ],
        }]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    }
};
