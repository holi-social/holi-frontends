import React from 'react'
import { Platform, ViewStyle } from 'react-native'

import HoliButton from '@holi/ui/components/HoliButton'
import useRouting from '@holi/ui/components/navigation/useRouting'

export type NaviItemProps = {
  style?: ViewStyle
  routeName: string
  label: string
}

const NaviItem: React.VoidFunctionComponent<NaviItemProps> = (props) => {
  const { navigate, pathname, toggleDrawer } = useRouting()
  const isActive = React.useMemo(() => pathname === props.routeName, [pathname, props.routeName])
  const onPress = () => {
    if (Platform.OS === 'web') {
      // mobile toggling is handled by reactnavigation (would be duplicate though)
      toggleDrawer()
    }
    navigate(props.routeName)
  }

  return (
    <HoliButton label="" active={isActive} onPress={onPress} style={[props.style]}>
      {props.label}
    </HoliButton>
  )
}

export default NaviItem
