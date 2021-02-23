const Path = require('path');
const CircularDependencyPlugin = require('circular-dependency-plugin');

module.exports = {
    mode: 'production',
    devtool: 'inline-source-map',
    entry: {
        index: {
            import: './src/index.ts',
            filename: './index.js'
        },
        core: { 
            import: './src/core/index.ts', 
            filename: './core/index.js'
        },
        factories: { 
            import: './src/factories/index.ts', 
            filename: './factories/index.js'
        },
        injectors: { 
            import: './src/injectors/index.ts', 
            filename: './injectors/index.js'
        },
        namingConventions: { 
            import: './src/naming-conventions/index.ts', 
            filename: './naming-conventions/index.js'
        },
        serializers: { 
            import: './src/serializers/index.ts', 
            filename: './serializers/index.js'
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
                    configFile: 'tsconfig.webpack.json'
                }
            }],
            exclude: /node_modules/,
            include: [
                Path.resolve(__dirname, 'src')
            ],
        }]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    }
};
