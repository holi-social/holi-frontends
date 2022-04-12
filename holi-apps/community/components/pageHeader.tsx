import React from 'react'
import { View, ViewStyle, Text, Pressable, Platform, StyleSheet } from 'react-native'
import useRouting from '@holi/ui/components/navigation/useRouting'
import Holicon from '@holi/ui/components/holicon'
import theme from '@holi/ui/styles/theme'

type PageHeaderProps = {
  style?: ViewStyle
}

const PageHeader: React.VoidFunctionComponent<PageHeaderProps> = (props) => {
  const { navigate } = useRouting()

  return (
    <View style={[headerStyles.container, props.style]}>
      <Pressable onPress={() => navigate('/')}>
        <Holicon icon="dashboard" size={20} color={theme.colors.text} />
      </Pressable>

      <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Community</Text>

      <View style={headerStyles.right}>
        <Holicon icon="notification" size={23} />
        {Platform.OS === 'web' && <Holicon icon="settings" size={23} />}
      </View>
    </View>
  )
}

const headerStyles = StyleSheet.create({
  container: {
    ...Platform.select({
      web: {
        alignItems: 'center',
      },
    }),
    paddingVertical: 8,
    paddingHorizontal: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 12,
    width: '100%',
    // height: jsVars.CSS_HEADER_Height,
  },
  right: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  imageWithText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})

export { PageHeader }
