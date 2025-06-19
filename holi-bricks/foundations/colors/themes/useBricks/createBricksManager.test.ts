import { createBricksManager } from './createBricksManager'

describe('useBricks', () => {
  let mockLibRuntime: { setTheme: jest.Mock; themeName: string }

  beforeEach(() => {
    mockLibRuntime = {
      setTheme: jest.fn(),
      themeName: 'light',
    }
  })

  it('should set the active theme', () => {
    const { setActiveTheme } = createBricksManager(mockLibRuntime)
    setActiveTheme('light')

    expect(mockLibRuntime.setTheme).toHaveBeenCalledWith('light')
  })

  it('should get the active theme', () => {
    const { getActiveThemeName } = createBricksManager(mockLibRuntime)
    const theme = getActiveThemeName()

    expect(theme).toBe('light')
  })

  it('should update the themeName dynamically', () => {
    mockLibRuntime.themeName = 'dark'
    const { getActiveThemeName } = createBricksManager(mockLibRuntime)

    expect(getActiveThemeName()).toBe('dark')
  })
})
