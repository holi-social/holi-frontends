import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, useWindowDimensions } from 'react-native'

import HeaderLeft from '@holi/core/navigation/components/HeaderLeft'
import HeaderRight from '@holi/core/navigation/components/HeaderRight'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import { colors, vars } from '@holi/ui/styles/globalVars'

const HomeTopBar: React.VoidFunctionComponent = () => {
  const { width } = useWindowDimensions()
  const { t } = useTranslation()
  const styles = getStyles(width)

  return (
    <View
      style={styles.fullWidthContainer}
      accessible={true}
      accessibilityRole="navigation"
      accessibilityLabel={t('navigation.topNavigation')}
    >
      <View style={styles.buttonContainer}>
        <HeaderLeft style={styles.leftItem} />

        <HeaderTitle style={{ paddingTop: 5 }} />

        <HeaderRight style={styles.rightItem} />
      </View>
    </View>
  )
}

export default HomeTopBar

const getStyles = (screenWidth: number) =>
  StyleSheet.create({
    fullWidthContainer: {
      alignItems: 'center',
      backgroundColor: colors.backgroundColorWhite,
      paddingHorizontal: screenWidth > +vars.breakpointL ? 20 : 10,
      height: vars.topBarHeight,
      maxHeight: vars.topBarHeight,
    },
    buttonContainer: {
      flex: 1,
      alignItems: 'center',
      width: '100%',
      maxWidth: vars.maxScreenWidth,
      justifyContent: 'center',
      position: 'relative',
    },
    leftItem: {
      position: 'absolute',
      left: 0,
      top: 5,
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    rightItem: {
      position: 'absolute',
      right: 0,
      top: 5,
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
  })
