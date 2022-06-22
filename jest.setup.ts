global.mockLinkTo = jest.fn()
global.captureSentryException = jest.fn()
global.console = {
  ...console,
  error: jest.fn(),
}

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native')
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      dispatch: jest.fn(),
      getState: jest.fn(() => ({
        routes: [{}],
        index: 0,
      })),
    }),
    useLinkTo: () => global.mockLinkTo,
  }
})

jest.mock('@sentry/react-native', () => ({
  captureException: global.captureSentryException,
}))

export default {}
