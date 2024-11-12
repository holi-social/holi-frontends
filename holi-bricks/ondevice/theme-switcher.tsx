import type { Decorator } from '@storybook/react'
import { useBricks } from 'holi-bricks/hooks/useBricks'
import React, { type ReactNode, useEffect } from 'react'
import { View } from 'react-native'

type ThemeWrapperProps = {
  children?: ReactNode
  theme: AvailableThemes
}

const ThemeWrapperReactNative = ({ children, theme = 'light' }: ThemeWrapperProps) => {
  const { setActiveTheme } = useBricks()

  useEffect(() => {
    setActiveTheme(theme)
  }, [setActiveTheme, theme])

  return <View style={{ display: 'flex', flexDirection: 'row' }}>{children}</View>
}

export const withThemeReactNative: Decorator = (Story, { args }) => {
  return (
    <ThemeWrapperReactNative theme={args?.theme as AvailableThemes}>
      <Story />
    </ThemeWrapperReactNative>
  )
}
