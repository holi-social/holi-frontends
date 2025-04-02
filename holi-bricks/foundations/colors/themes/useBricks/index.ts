import { UnistylesRuntime } from 'react-native-unistyles'
import { createBricksManager } from './createBricksManager'

/**
 * Custom hook to manage/read the Holi Bricks component library functionality.
 *
 * This hook uses the `UnistylesRuntime` dependency by default, making it easier
 * to interact with the Holi Bricks component library without manual setup.
 *
 * @returns {Object} The functions for managing the library (e.g., setting and getting the active theme).
 *
 * @example
 * const { setActiveTheme, getActiveTheme } = useBricks();
 * setActiveTheme('dark');
 * console.log(getActiveTheme()); // Outputs: 'dark'
 */
export const useBricks = () => createBricksManager(UnistylesRuntime)
