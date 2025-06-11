import type { lightTheme } from './light'
import type { darkTheme } from './dark'

export type LightTheme = typeof lightTheme
export type DarkTheme = typeof darkTheme

export type ThemeColors = {
  focus: string
  bg: Record<string, string>
  fill: Record<string, string>
  border: Record<string, string>
  decorative: Record<string, string>
}

// Create a mapped type to check for matching keys
type CheckMatchingKeys<T, U> = keyof T extends keyof U ? (keyof U extends keyof T ? T : never) : never

type VerifiedFoundationLightColors = CheckMatchingKeys<LightTheme, DarkTheme>
type VerifiedFoundationDarkColors = CheckMatchingKeys<DarkTheme, LightTheme>

// Verify that both theme colors have the same structure
type VerifiedLightColors = CheckMatchingKeys<LightTheme['colors'], DarkTheme['colors']>
type VerifiedDarkColors = CheckMatchingKeys<DarkTheme['colors'], LightTheme['colors']>

// Verify color categories have matching keys
type VerifiedFill = CheckMatchingKeys<LightTheme['colors']['fill'], DarkTheme['colors']['fill']>
type VerifiedBg = CheckMatchingKeys<LightTheme['colors']['bg'], DarkTheme['colors']['bg']>
type VerifiedBorder = CheckMatchingKeys<LightTheme['colors']['border'], DarkTheme['colors']['border']>
type VerifiedDecorative = CheckMatchingKeys<LightTheme['colors']['decorative'], DarkTheme['colors']['decorative']>
type VerifiedFocus = CheckMatchingKeys<LightTheme['colors']['focus'], DarkTheme['colors']['focus']>

// This will error if the themes don't have matching structures
export type Theme = VerifiedLightColors | VerifiedDarkColors

export type FillColors = keyof VerifiedFill
export type DecorativeColors = keyof VerifiedDecorative
export type BorderColors = keyof VerifiedBorder
export type FocusColors = keyof VerifiedFocus
export type BackgroundColors = keyof VerifiedBg

export type ElevationLevel = 200 // we will add more | 100| 300 | 400 and so on

export type FoundationTheme = VerifiedFoundationLightColors | VerifiedFoundationDarkColors
