import useLink from '@holi/core/navigation/hooks/useLink'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { renderHook, waitFor } from '@testing-library/react-native'
import { Linking, Platform } from 'react-native'

const mockUseRouting = jest.mocked(useRouting)
jest.mock('@holi/core/navigation/hooks/useRouting', () => jest.fn())

describe('useLink', () => {
  const testEvent = {} as React.SyntheticEvent
  const mockNavigate = jest.fn()
  const mockNavigateBack = jest.fn()

  beforeEach(() => {
    const routingMocks: ReturnType<typeof useRouting> = {
      navigate: mockNavigate,
      navigateBack: mockNavigateBack,
      replaceRoute: jest.fn(),
      replaceHistory: jest.fn(),
      setParams: jest.fn(),
    }
    mockUseRouting.mockReturnValue(routingMocks)
  })

  it('should call onPress if given', () => {
    const onPress = jest.fn()
    const { result } = renderHook(() => useLink({ href: '/', onPress }))

    result.current(testEvent)

    expect(onPress).toHaveBeenCalled()
  })

  it('should stop event propagation', () => {
    const onPress = jest.fn().mockReturnValue(false)
    const { result } = renderHook(() => useLink({ href: '/', onPress }))

    result.current(testEvent)

    expect(onPress).toHaveBeenCalled()
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('should not await async onPress callback before deciding on event propagation', async () => {
    const onPress = jest.fn().mockResolvedValue(false)
    const { result } = renderHook(() => useLink({ href: '/', onPress }))

    result.current(testEvent)

    expect(onPress).toHaveBeenCalled()
    await waitFor(() => expect(mockNavigate).toHaveBeenCalled())
  })

  it('should propagate event if not stopped', async () => {
    const onPress = jest.fn()
    const { result } = renderHook(() => useLink({ href: '/', onPress }))

    result.current(testEvent)

    expect(onPress).toHaveBeenCalled()
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('//'))
  })

  it('should navigate to href', () => {
    const { result } = renderHook(() => useLink({ href: '/' }))

    result.current(testEvent)

    expect(mockNavigate).toHaveBeenCalledWith('//')
  })

  it('should open external url', () => {
    const mockOpenURL = jest.spyOn(Linking, 'openURL')
    const { result } = renderHook(() => useLink({ href: '/', external: true }))

    result.current(testEvent)

    expect(mockNavigate).not.toHaveBeenCalled()
    expect(mockOpenURL).toHaveBeenCalledWith('/')
  })

  it('should navigate back first on mobile', async () => {
    const { result } = renderHook(() => useLink({ href: '/spaces', mobileNavigateBackFirst: true }))

    result.current(testEvent)

    expect(mockNavigateBack).toHaveBeenCalled()
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('//spaces'))
  })

  it('should ignore domain and locale path param on mobile', () => {
    const originalPlatform = Platform.OS
    Platform.OS = 'android'

    const { result } = renderHook(() => useLink({ href: 'https://app.holi.social/en/spaces' }))

    result.current(testEvent)

    expect(mockNavigate).toHaveBeenCalledWith('/spaces')

    // Clean up
    Platform.OS = originalPlatform
  })
})
