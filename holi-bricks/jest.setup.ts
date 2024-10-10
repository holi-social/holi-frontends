jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
)

if (typeof window !== 'undefined') {
  global.window = window
  global.document = document
}
