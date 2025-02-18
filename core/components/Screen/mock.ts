jest.mock('react-native-safe-area-context', () => {
  const mock = jest.requireActual('react-native-safe-area-context/jest/mock')
  return {
    ...mock.default,
  }
})

jest.mock('react-native-keyboard-controller', () => ({
  ...require('react-native-keyboard-controller/jest'),
  useReanimatedKeyboardAnimation: () => ({ height: 0 }),
}))
