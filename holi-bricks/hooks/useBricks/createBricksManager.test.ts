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
    const { getActiveTheme } = createBricksManager(mockLibRuntime)
    const theme = getActiveTheme()

    expect(theme).toBe('light')
  })

  it('should update the themeName dynamically', () => {
    mockLibRuntime.themeName = 'dark'
    const { getActiveTheme } = createBricksManager(mockLibRuntime)

    expect(getActiveTheme()).toBe('dark')
  })
})
