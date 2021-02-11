const Path = require('path');
const CircularDependencyPlugin = require('circular-dependency-plugin');

module.exports = {
    mode: 'production',
    entry: {
        index: { 
            import: './src/index.ts',
            filename: 'index.js'
        },
        factories: { 
            import: './src/factories/index.ts', 
            filename: 'factories/index.js'
        },
        helpers: { 
            import: './src/helpers/index.ts', 
            filename: 'helpers/index.js'
        },
        injectors: { 
            import: './src/injectors/index.ts', 
            filename: 'injectors/index.js'
        },
        serializers: { 
            import: './src/serializers/index.ts', 
            filename: 'serializers/index.js'
        },
        utils: { 
            import: './src/utils/index.ts', 
            filename: 'utils/index.js'
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
        library: ["typeManager", "[name]"],
        libraryTarget: 'umd'
    }
};
