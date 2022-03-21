import React from 'react'
import { Pressable } from 'react-native'
import useRouting from 'shared/navigation/useRouting'

type LinkProps = {
  to: string
  children: React.ReactChild | (({ isActive }: { isActive: boolean }) => React.ReactElement)
}

export const Link: React.VoidFunctionComponent<LinkProps> = ({ to, children }) => {
  console.log('🚀 ~ file: index.tsx ~ line 11 ~ to', to)
  const { navigate, pathname } = useRouting()
  console.log('🚀 ~ file: index.tsx ~ line 14 ~ pathname', pathname)
  const isActive = React.useMemo(() => pathname === to, [pathname, to])
  console.log('🚀 ~ file: index.tsx ~ line 13 ~ isActive', isActive)
  return (
    <Pressable onPress={() => navigate(to)}>
      {typeof children === 'function' ? children({ isActive }) : children}
    </Pressable>
  )
}
