import React from 'react'
import { Pressable, View } from 'react-native'
import { DrawerActions } from '@react-navigation/native'
import useRouting from 'shared/navigation/useRouting'
import Holicon from 'shared/components/ui/holicon'

import { styleVars } from 'shared/styles/globalVars'

type CustomHeaderProps = {
  navigation: any // eslint-disable-line
  tintColor?: string
  pressColor?: string
  pressOpacity?: number
  labelVisible?: boolean
}

const CustomHeaderIcon: React.VoidFunctionComponent<CustomHeaderProps> = (props) => {
  // TODO: how to do it here ??????
  // const currentRouteName = props.navigation.getState().routeNames[props.navigation.getState().index]
  const { navigate, pathname } = useRouting()
  const isHome = pathname === '/'

  return (
    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      <Pressable
        onPress={() => props.navigation.dispatch(DrawerActions.toggleDrawer())}
        {...props}
        style={{ marginLeft: 13 }}
      >
        <Holicon icon="dashboard" size={20} color={styleVars.fontColor} />
      </Pressable>

      {/* Back link */}
      {!isHome && (
        <Pressable onPress={() => props.navigation.goBack()} {...props} style={{ marginLeft: 20 }}>
          <Holicon icon="arrow-back" size={30} color={styleVars.fontColor} />
        </Pressable>
      )}
    </View>
  )
}

export default CustomHeaderIcon
