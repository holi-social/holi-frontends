import React from 'react'
import { Pressable } from 'react-native'
import useRouting from '@holi/ui/navigation/useRouting'

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
  const { navigate, pathname } = useRouting()
  const isActive = React.useMemo(() => pathname === to, [pathname, to])
  return (
    <Pressable onPress={() => navigate(to)}>
      {({ hovered, active, pressed }: PressableCallbackProps) =>
        typeof children === 'function' ? children({ isActive, hovered, active, pressed }) : children
      }
    </Pressable>
  )
}
