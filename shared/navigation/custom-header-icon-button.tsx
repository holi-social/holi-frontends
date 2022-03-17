import React from 'react'
import { View, Pressable } from 'react-native'

import Holicon from '../components/ui/holicon'
import { useTheme } from '../styles/theme'

type CustomHeaderIconProps = {
  onPress: () => void
}

export const CustomHeaderIconButton: React.VoidFunctionComponent<CustomHeaderIconProps> = ({ onPress, ...props }) => {
  const { theme } = useTheme()
  return (
    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      <Pressable onPress={onPress} {...props} style={{ marginLeft: 12 }}>
        <Holicon icon="dashboard" size={20} color={theme.colors.text} />
      </Pressable>
    </View>
  )
}
