import 'holi-bricks/libs/init'

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
)

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

if (typeof window !== 'undefined') {
  global.window = window
  global.document = document
}

global.setImmediate = ((callback: () => void) => {
  setTimeout(callback, 0)
}) as typeof setImmediate & { __promisify__?: typeof setTimeout }
