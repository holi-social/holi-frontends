import React from 'react'
import { Pressable, Platform } from 'react-native'
import useRouting from '@holi/ui/components/navigation/useRouting'

type PressableCallbackProps = {
  hovered: boolean
  active: boolean
  pressed: boolean
}

type LinkProps = {
  to: string
  children: React.ReactChild | (({ isActive }: { isActive: boolean } & PressableCallbackProps) => React.ReactElement)
}

export const Link: React.VoidFunctionComponent<LinkProps> = ({ to, children }) => {
  const { navigate, pathname, toggleDrawer } = useRouting()
  const isActive = React.useMemo(() => pathname === to, [pathname, to])

  const onPress = () => {
    if (Platform.OS === 'web') {
      // mobile toggling is handled by reactnavigation (would be duplicate though)
      toggleDrawer()
    }
    navigate(to)
  }

  return (
    <Pressable onPress={onPress}>
      {({ hovered, active, pressed }: PressableCallbackProps) =>
        typeof children === 'function' ? children({ isActive, hovered, active, pressed }) : children
      }
    </Pressable>
  )
}

