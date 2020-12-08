module.exports = {
  preset: 'jest-expo',
  setupFiles: [
    './node_modules/react-native-gesture-handler/jestSetup.js',
    './jest.setup.js',
  ],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native-picker|@expo(nent)?/.*|expo-*|unimodules-*|@unimodules|@sentry)',
  ],
}
