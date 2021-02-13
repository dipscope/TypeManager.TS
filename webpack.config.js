const Path = require('path');
const CircularDependencyPlugin = require('circular-dependency-plugin');

module.exports = {
    mode: 'production',
    entry: {
        index: {
            import: './src/index.ts',
            filename: 'index.js'
        },
        helpers: { 
            import: './src/helpers/index.ts', 
            filename: 'helpers/index.js',
            dependOn: ['index']
        }
    },
    devtool: 'inline-source-map',
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
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: "tsconfig.webpack.json"
                        }
                    }
                ],
                exclude: /node_modules/,
                include: [
                    Path.resolve(__dirname, "src")
                ],
            },
        ],
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
    },
    output: {
        path: Path.resolve(__dirname, 'dist'),
        library: ['typeManager', '[name]'],
        libraryTarget: 'umd'
    }
};
