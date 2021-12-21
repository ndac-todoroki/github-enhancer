import webpack from 'webpack';
import path from 'path';
import glob from 'glob';
import CopyPlugin from 'copy-webpack-plugin';
import DotEnv from 'dotenv-webpack';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

function getEnv<Value extends string>(
    env: Readonly<Record<string, unknown>>,
    key: string,
    possibleValues: readonly Value[],
): Value {
    const value = env[key];
    if (typeof value !== 'string' || !(possibleValues as readonly string[]).includes(value)) {
        throw new Error(`${key} shall be one of: ${possibleValues.join(', ')} (it was ${value}).`);
    }
    return value as Value;
}

export default (env: Readonly<Record<string, unknown>>): webpack.Configuration => {
    const browser = getEnv(env, 'browser', ['chrome', 'chrome-mv3', 'firefox', 'safari'] as const);
    const mode = getEnv(env, 'mode', ['development', 'production'] as const);
    const typecheck = getEnv(env, 'typecheck', ['notypecheck', 'typecheck'] as const);

    const target = [
        // Backward compatibility with v6.3.5
        'es2019',
        // The last 2 versions of Chrome (Sep 22, 2021)
        'chrome93',
        // The last 2 versions of Firefox and the latest Firefox ESR
        'firefox91',
        // The last 2 versions of Safari
        'safari14',
    ];

    return {
        entry: {
            ...Object.fromEntries(
                glob.sync('./**/*.json.ts', { cwd: 'src' }).map(name => [name.slice(0, -3), name]),
            ),
            // [browser === 'chrome-mv3' ? 'background' : 'scripts/background']: './scripts/background.ts',
            'scripts/content-script': './scripts/content-script.tsx',
            // 'scripts/options': './scripts/options.tsx',
            // 'scripts/popup': './scripts/popup.tsx',
        },

        mode,

        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: [
                        {
                            loader: 'esbuild-loader',
                            options: {
                                loader: 'tsx',
                                target,
                            },
                        },
                        {
                            loader: 'if-webpack-loader',
                            options: {
                                CHROME: browser === 'chrome' || browser === 'chrome-mv3',
                                CHROME_MV3: browser === 'chrome-mv3',
                                FIREFOX: browser === 'firefox',
                                SAFARI: browser === 'safari',
                                DEVELOPMENT: mode === 'development',
                                PRODUCTION: mode === 'production',
                            },
                        }
                    ]
                }
            ],
        },

        name: browser,

        context: path.resolve(__dirname, 'src'),

        output: {
            path: path.join(__dirname, 'dist', process.env.BROWSER || ""),
        },

        plugins: [
            new CopyPlugin({
                patterns: [
                    // './icons/*.png',
                    './scripts/*.js'
                ],
            }),

            new DotEnv({
                defaults: true,
                silent: true,
                systemvars: true,
            }),

            // ExportAsJSONPlugin: *.json.js -> *.json
            {
                apply(compiler: webpack.Compiler): void {
                    compiler.hooks.compilation.tap('ExportAsJSONPlugin', compilation => {
                        compilation.hooks.processAssets.tap(
                            {
                                name: 'ExportAsJSONPlugin',
                                stage: webpack.Compilation.PROCESS_ASSETS_STAGE_PRE_PROCESS,
                            },
                            assets => {
                                for (const [name, source] of Object.entries(assets)) {
                                    if (name.endsWith('.json.js')) {
                                        delete assets[name];
                                        const exportAsJSON = (filename: string, value: unknown): void => {
                                            assets[filename] = new webpack.sources.RawSource(
                                                JSON.stringify(value, null, mode === 'development' ? 2 : 0),
                                            );
                                        };
                                        // eslint-disable-next-line @typescript-eslint/no-implied-eval
                                        new Function('exportAsJSON', source.source().toString())(exportAsJSON);
                                    }
                                }
                            },
                        );
                    });
                },
            },

            ...(typecheck === 'typecheck'
                ? [
                    new ForkTsCheckerWebpackPlugin({
                        typescript: {
                            configFile: path.resolve(__dirname, 'tsconfig.json'),
                        },
                    }),
                ]
                : []),
        ],
        resolve: {
            alias: {
                react: 'preact/compat',
                'react-dom': 'preact/compat',
                'react/jsx-runtime': 'preact/jsx-runtime',
            },
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
    }
};
