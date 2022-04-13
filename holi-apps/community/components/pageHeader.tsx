import React from 'react'
import { View, ViewStyle, Text, Pressable, Platform, StyleSheet } from 'react-native'
import useRouting from '@holi/ui/components/navigation/useRouting'
import Holicon from '@holi/ui/components/holicon'
import theme from '@holi/ui/styles/theme'
import { jsVars } from '@holi/ui/styles/globalVars'

type PageHeaderProps = {
  style?: ViewStyle
}

const PageHeader: React.VoidFunctionComponent<PageHeaderProps> = (props) => {
  const { navigate } = useRouting()

  return (
    <View style={[headerStyles.container, headerStyles.horizontalElements, props.style]}>
      <Pressable onPress={() => navigate('/')}>
        <Holicon icon="dashboard" size={20} color={theme.colors.text} />
      </Pressable>

      <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Community</Text>

      <View style={headerStyles.horizontalElements}>
        <Holicon icon="notification" size={26} />
        {Platform.OS === 'web' && <Holicon icon="settings" size={26} />}
      </View>
    </View>
  )
}

const headerStyles = StyleSheet.create({
  container: {
    width: '100%',
    height: jsVars.CSS_HEADER_Height,
    paddingTop: 10,
    paddingHorizontal: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  horizontalElements: {
    flexDirection: 'row',
  },
})

export { PageHeader }
