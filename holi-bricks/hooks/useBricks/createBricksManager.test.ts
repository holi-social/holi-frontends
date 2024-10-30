import { createBricksManager } from 'holi-bricks/hooks/useBricks/createBricksManager'

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
    setActiveTheme('dark')

    expect(mockLibRuntime.setTheme).toHaveBeenCalledWith('dark')
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
