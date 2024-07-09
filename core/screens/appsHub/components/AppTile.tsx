import React, { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { HoliIconType } from '@holi/icons/src/HoliIconType'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export interface HoliApp {
  id: string
  icon: HoliIconType
  translationKey: string
  inMaintenance?: boolean
  path?: string
}

export interface AppTileProps {
  app: HoliApp
  onPress?: (app: HoliApp) => void
}

const AppTile = ({ app, onPress }: AppTileProps) => {
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const { colors } = theme

  const { t } = useTranslation()
  const name = t(app.translationKey)

  const onTilePress = useCallback(() => {
    onPress?.(app)
  }, [onPress, app])

  return (
    <HoliButton
      label={name}
      inline
      transparent
      onPress={onTilePress}
      disabled={app.inMaintenance}
      style={[styles.contentContainer]}
      testID={`app-tile-${app.id}`}
    >
      <View style={styles.appTile}>
        {!!app.icon && (
          <HoliIcon icon={app.icon} size={24} color={!app.inMaintenance ? colors.foreground30 : colors.foreground10} />
        )}
        {app.inMaintenance && (
          <View style={styles.inactiveContainer}>
            <HoliText size="extrasmall" color="white100">
              {t('allTools.drawer.maintenance.label')}
            </HoliText>
          </View>
        )}
      </View>

      <HoliText
        selectable
        bold
        style={[styles.appName, !app.inMaintenance ? { color: colors.foreground30 } : { marginTop: 4 }]}
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
