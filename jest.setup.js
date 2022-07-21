import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock'

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage)

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

jest.mock('react-native-get-random-values', () => ({
  getRandomBase64: jest.fn(),
}))

const mockDispatch = jest.fn()
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: () => mockDispatch,
}))

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

jest.mock('@react-native-community/push-notification-ios', () => {
  return {
    addEventListener: jest.fn(),
    requestPermissions: jest.fn(() => Promise.resolve()),
    getInitialNotification: jest.fn(() => Promise.resolve()),
  }
})

jest.mock('react-airplay', () => ({
  showRoutePicker: jest.fn(),
  AirplayButton: jest.fn(),
}))
