module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module:react-native-dotenv'],
      [
        '@babel/plugin-transform-react-jsx',
        {
          runtime: 'automatic',
        },
      ],
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@screens': './src/screens',
            '@components': './src/components',
            '@controllers': './src/controllers',
            '@utils': './src/utils',
            '@redux': './src/redux',
          },
          extensions: [
            '.ios.ts',
            '.android.ts',
            '.ts',
            '.ios.tsx',
            '.android.tsx',
            '.tsx',
            '.jsx',
            '.js',
            '.json',
          ],
        },
      ],
    ],
  }
}
