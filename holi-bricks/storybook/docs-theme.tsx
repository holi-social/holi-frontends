import React, { useState } from 'react'
import { DARK_MODE_EVENT_NAME } from 'storybook-dark-mode'
import { addons } from '@storybook/preview-api'
import { DocsContainer, type DocsContainerProps } from '@storybook/addon-docs'
import { themes } from '@storybook/theming'

const channel = addons.getChannel()

export function DocsTheme(props: DocsContainerProps) {
  const [isDark, setDark] = useState()

  React.useEffect(() => {
    channel.on(DARK_MODE_EVENT_NAME, setDark)
    return () => channel.removeListener(DARK_MODE_EVENT_NAME, setDark)
  }, [setDark])

  return <DocsContainer {...props} theme={isDark ? themes.dark : themes.light} />
}
