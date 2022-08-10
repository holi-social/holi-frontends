import * as React from 'react'
import { GestureResponderEvent, ScrollView, StyleSheet, View, ViewStyle, useWindowDimensions } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors, vars } from '@holi/ui/styles/globalVars'

export type HoliApp = {
  icon?: string
  name: string
  label?: string
  onPress?: null | ((event: GestureResponderEvent) => void)
  testID?: string
  hasUpdates: boolean
  backgroundColor: string
}

const getStyles = (screenWidth: number) =>
  StyleSheet.create({
    container: {
      width: '100%',
    },
    containerContent: {
      width: screenWidth > +vars.breakpointS ? '100%' : 'auto',
      justifyContent: 'center',
      paddingRight: 8,
      paddingLeft: 8,
    },
    tile: {
      minWidth: 80,
      maxWidth: 80,
      overflow: 'hidden',
      wordBreak: 'break-word',
    },
    iconContainer: {
      alignSelf: 'center',
      width: 64,
      height: 64,
      padding: 2,
      borderWidth: 2,
      borderRadius: 16,
      borderColor: colors.softblackTransparent,
    },
    icon: {
      width: '100%',
      height: '100%',
      borderRadius: 13,
    },
    iconWithUpdates: {
      borderColor: colors.positivepurple,
    },
    appName: {
      paddingTop: 4,
      alignSelf: 'center',
      textAlign: 'center',
    },
    moreApps: {
      marginLeft: 8,
      marginRight: 8,
    },
    moreAppsContainer: {
      width: 'auto',
      padding: 16,
      justifyContent: 'center',
    },
    moreAppsLabel: {
      color: colors.positivepurple,
    },
  })

type HoliAppSwiperProps = {
  apps: HoliApp[]
  style?: (ViewStyle | Record<string, unknown>) | (ViewStyle | Record<string, unknown>)[]
  onPressMoreApps?: null | ((event: GestureResponderEvent) => void)
  moreAppsLabel: string
}

const HoliAppSwiper: React.VFC<HoliAppSwiperProps> = ({ apps, style, onPressMoreApps, moreAppsLabel }) => {
  const { width } = useWindowDimensions()
  const styles = getStyles(width)

  return (
    <ScrollView horizontal={true} contentContainerStyle={styles.containerContent} style={[styles.container, style]}>
      {apps.map((app, index) => (
        <HoliButton
          key={index}
          label={app.label || app.name}
          inline
          transparent
          onPress={app.onPress}
          style={[styles.tile]}
          testID={app.testID}
        >
          <View style={[styles.iconContainer, app.hasUpdates && styles.iconWithUpdates]}>
            <View style={[styles.icon, { backgroundColor: app.backgroundColor }]} />
          </View>
          <HoliText selectable={false} style={styles.appName} size={'extrasmall'}>
            {app.name}
          </HoliText>
        </HoliButton>
      ))}
      <HoliButton inline transparent label={moreAppsLabel} style={[styles.moreApps]} onPress={onPressMoreApps}>
        <View style={[styles.iconContainer, styles.moreAppsContainer]}>
          <HoliText selectable={false} style={styles.moreAppsLabel} bold={true} size={'small'}>
            {moreAppsLabel}
          </HoliText>
        </View>
      </HoliButton>
    </ScrollView>
  )
}

export default HoliAppSwiper
