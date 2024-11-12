import type { Decorator } from '@storybook/react'
import { useBricks } from 'holi-bricks/hooks/useBricks'
import React, { type ReactNode, useEffect, useState } from 'react'
import { View } from 'react-native'
import { addons } from '@storybook/preview-api'
import { DARK_MODE_EVENT_NAME } from 'storybook-dark-mode'

type ThemeWrapperProps = {
  children?: ReactNode
  theme: AvailableThemes
}
const channel = addons.getChannel()

const ThemeWrapper = ({ children }: ThemeWrapperProps) => {
  const { setActiveTheme } = useBricks()
  const [isDark, setDark] = useState(false)

  useEffect(() => {
    setActiveTheme(isDark ? 'dark' : 'light')
  }, [isDark, setActiveTheme])

  useEffect(() => {
    // listen to DARK_MODE event
    channel.on(DARK_MODE_EVENT_NAME, setDark)
    return () => channel.off(DARK_MODE_EVENT_NAME, setDark)
  }, [setDark])

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
