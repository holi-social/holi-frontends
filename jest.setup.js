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
  }
})
