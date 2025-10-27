import type { Themes } from 'holi-bricks/main'

interface RuntimeType {
  setTheme: (theme: AvailableThemes) => void
  themeName: string
}

/**
 * Creates an instance of the Holi Bricks library manager.
 *
 * This function accepts `UnistylesRuntime` as a dependency to improve flexibility
 * and testability. By injecting this dependency, we can easily mock or swap it
 * during testing or future changes without directly coupling the logic to the external library.
 *
 * @param {UnistylesRuntimeType} styleRuntime - The runtime responsible for managing themes.
 * @returns {Object} The functions for managing the library (e.g., setting and getting the active theme, etc.).
 *
 */
export const createBricksManager = <T extends RuntimeType>(styleRuntime: T) => {
  /**
   * Sets the active theme.
   *
   * @param {AvailableThemes} theme - The theme to set (e.g., 'light', 'dark').
   * @returns {void}
   */
  const setActiveTheme = (theme: AvailableThemes) => {
    return styleRuntime.setTheme(theme)
  }

  /**
   * Gets the current active theme.
   *
   * @returns {string} The current active theme name.
   */
  const getActiveThemeName = () => {
    return styleRuntime.themeName as keyof Themes
  }

  return {
    getActiveThemeName,
    setActiveTheme,
  }
}
