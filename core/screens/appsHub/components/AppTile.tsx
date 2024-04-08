import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { FeatureToggleName, useFeatureToggle } from '@holi/core/helpers/useFeatureToggle'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { HoliIconType } from '@holi/icons/src/HoliIconType'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export interface HoliApp {
  id: string
  icon: HoliIconType
  translationKey: string
  featureToggleName?: FeatureToggleName
  hasUpdates: boolean
  path?: string
  active: boolean
}

export interface AppTileProps {
  appData: HoliApp
  onPress?: (appData: HoliApp) => void
  style?: StyleProp<ViewStyle>
}

const AppTile = ({ appData, onPress, style }: AppTileProps) => {
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const { colors } = theme

  const { t } = useTranslation()
  const name = t(appData.translationKey)
  const isActive = !!appData.path
  const { ftOff, ftMaintenance } = useFeatureToggle(appData.featureToggleName)

  const onTilePress = useCallback(() => {
    if (isActive) {
      onPress?.(appData)
    }
  }, [onPress, isActive, appData])

  if (ftOff) return null

  return (
    <HoliButton
      label={name}
      inline
      transparent
      onPress={onTilePress}
      disabled={!isActive || ftMaintenance}
      style={[styles.contentContainer, style]}
      testID={`app-tile-${appData.id}`}
    >
      <View style={styles.appTile}>
        {!!appData.icon && (
          <HoliIcon
            icon={appData.icon}
            size={24}
            color={isActive && !ftMaintenance ? colors.foreground30 : colors.foreground10}
          />
        )}
        {(!isActive || ftMaintenance) && (
          <View style={styles.inactiveContainer}>
            <HoliText size="extrasmall" color="white100">
              {ftMaintenance ? t('allTools.drawer.maintenance.label') : t('allTools.drawer.comingSoon.label')}
            </HoliText>
          </View>
        )}
      </View>

      <HoliText
        selectable
        bold
        style={[styles.appName, isActive && !ftMaintenance ? { color: colors.foreground30 } : { marginTop: 4 }]}
        size={'extrasmall'}
      >
        {name}
      </HoliText>
    </HoliButton>
  )
}

export default AppTile

const tileWidth = 72

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    contentContainer: {
      width: tileWidth + 2, // container width should be wider than the tileWidth to avoid the title text breaking
      overflow: 'hidden',
      padding: 0,
      ...Platform.select({
        web: {
          alignSelf: 'baseline',
          wordBreak: 'break-word',
        },
      }),
    },
    appTile: {
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.background10,
      borderColor: theme.colors.background30,
      borderRadius: 16,
      borderWidth: 1,
      width: tileWidth,
      height: tileWidth,
    },
    appName: {
      paddingTop: 8,
      alignSelf: 'center',
      textAlign: 'center',
      color: theme.colors.foreground20,
    },
    inactiveContainer: {
      position: 'absolute',
      bottom: -6,
      height: 16,
      paddingHorizontal: 4,
      borderRadius: 500,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.foreground10,
    },
  })
