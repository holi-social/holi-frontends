import React from 'react'
import { Pressable } from 'react-native'
import useRouting from 'shared/navigation/useRouting'

type LinkProps = {
  to: string
  children: React.ReactChild | (({ isActive }: { isActive: boolean }) => React.ReactElement)
}

export const Link: React.VoidFunctionComponent<LinkProps> = ({ to, children }) => {
  const { navigate, pathname } = useRouting()
  const isActive = React.useMemo(() => pathname === to, [pathname, to])
  return (
    <Pressable onPress={() => navigate(to)}>
      {typeof children === 'function' ? children({ isActive }) : children}
    </Pressable>
  )
}
