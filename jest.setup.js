import mockAsyncStorage from '@react-native-community/async-storage/jest/async-storage-mock'

jest.mock('@react-native-community/async-storage', () => mockAsyncStorage)

const mockedNavigate = jest.fn()
jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
      navigate: mockedNavigate,
    }),
  }
})

jest.mock('redux-persist', () => {
  const real = jest.requireActual('redux-persist')
  return {
    ...real,
    persistReducer: jest
      .fn()
      .mockImplementation((config, reducers) => reducers),
  }
})

// Mock any Native Modules
const NativeModules = {
  AudioSensor: {
    getCurrentVolume: jest.fn(),
    isHeadphonesConnected: jest.fn(),
    addVolumeListener: jest.fn(),
    addHeadphonesListener: jest.fn(),
  },
}

Object.keys(NativeModules).forEach((name) => {
  const shape = NativeModules[name]
  jest.doMock(name, () => shape, { virtual: true })
  require('react-native').NativeModules[name] = shape
})
