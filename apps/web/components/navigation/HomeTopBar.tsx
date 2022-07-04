import React from 'react'
import { StyleSheet, View, useWindowDimensions } from 'react-native'

import HeaderNotificationLink from '@holi/core/navigation/components/HeaderNotificationLink'
import HeaderProfileLink from '@holi/core/navigation/components/HeaderProfileLink'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme/theme'

const HomeTopBar: React.VoidFunctionComponent = () => {
  const { theme } = useTheme()
  const { width } = useWindowDimensions()
  const styles = getStyles(theme, width)

  return (
    <View
      style={styles.fullWidthContainer}
      accessible={true}
      accessibilityRole="navigation"
      accessibilityLabel="Top Navigation"
    >
      <View style={styles.buttonContainer}>
        <HeaderNotificationLink style={{ paddingHorizontal: 20, paddingVertical: 10 }} />

        <HeaderTitle style={{ paddingTop: 5 }} />

        <HeaderProfileLink style={{ paddingHorizontal: 20, paddingVertical: 10 }} />
      </View>
    </View>
  )
}

export default HomeTopBar

const getStyles = (theme: HoliTheme, screenWidth: number) =>
  StyleSheet.create({
    fullWidthContainer: {
      alignItems: 'center',
      backgroundColor: theme.colors.backgroundColorWhite,
      paddingHorizontal: screenWidth > theme.vars.breakpointL ? 20 : 10,
      height: theme.vars.bottomBarHeight,
    },
    buttonContainer: {
      flex: 1,
      alignItems: 'center',
      width: '100%',
      maxWidth: 1200,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  })
