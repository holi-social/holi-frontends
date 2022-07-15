import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, useWindowDimensions } from 'react-native'

import HeaderLeft from '@holi/core/navigation/components/HeaderLeft'
import HeaderRight from '@holi/core/navigation/components/HeaderRight'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme/theme'

const HomeTopBar: React.VoidFunctionComponent = () => {
  const { theme } = useTheme()
  const { width } = useWindowDimensions()
  const { t } = useTranslation()
  const styles = getStyles(theme, width)

  return (
    <View
      style={styles.fullWidthContainer}
      accessible={true}
      accessibilityRole="navigation"
      accessibilityLabel={t('navigation.topNavigation')}
    >
      <View style={styles.buttonContainer}>
        <HeaderLeft style={{ paddingHorizontal: 20, paddingVertical: 10 }} />

        <HeaderTitle style={{ paddingTop: 5 }} />

        <HeaderRight style={{ paddingHorizontal: 20, paddingVertical: 10 }} />
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
      maxHeight: `${theme.vars.topBarHeight}px`,
    },
    buttonContainer: {
      flex: 1,
      alignItems: 'center',
      width: '100%',
      maxWidth: `${theme.vars.maxScreenwidth}px`,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  })
