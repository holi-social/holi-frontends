import type { Decorator } from '@storybook/react'
import { useBricks } from 'holi-bricks/hooks/useBricks'
import React, { type ReactNode, useEffect } from 'react'
import { View } from 'react-native'

export const storybookThemeConfig = {
  theme: {
    name: 'Theme',
    defaultValue: 'light',
    toolbar: {
      icon: 'mirror',
      items: ['light', 'dark'],
      dynamicTitle: true,
    },
  },
}

type ThemeWrapperProps = {
  children?: ReactNode
  theme: AvailableThemes
}

const ThemeWrapper = ({ children, theme = 'light' }: ThemeWrapperProps) => {
  const { setActiveTheme, getActiveThemeName } = useBricks()

  useEffect(() => {
    setActiveTheme(theme)
  }, [getActiveThemeName, setActiveTheme, theme])

  return <View style={{ display: 'flex', flexDirection: 'row' }}>{children}</View>
}

export const withTheme: Decorator = (Story, { globals: { theme } }) => {
  return (
    <ThemeWrapper theme={theme}>
      <Story />
    </ThemeWrapper>
  )
}

export const withThemeReactNative: Decorator = (Story, { args }) => {
  return (
    <ThemeWrapper theme={args?.theme as AvailableThemes}>
      <Story />
    </ThemeWrapper>
  )
}
