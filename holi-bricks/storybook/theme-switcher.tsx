import type { Decorator } from '@storybook/react'
import { useBricks } from 'holi-bricks/hooks/useBricks'
import React, { type ReactNode, useEffect } from 'react'

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
  const { setActiveTheme, getActiveTheme } = useBricks()

  useEffect(() => {
    setActiveTheme(theme)
  }, [getActiveTheme, setActiveTheme, theme])

  return <div style={{ display: 'flex' }}>{children}</div>
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
