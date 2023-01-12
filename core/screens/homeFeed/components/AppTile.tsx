import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import tinycolor from 'tinycolor2'

import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

export type HoliApp = {
  id: string
  icon: string
  translationKey: string
  path?: string
  hasUpdates: boolean
}

type AppTileProps = {
  appData: HoliApp
  onPress?: (appData: HoliApp) => void
  style?: StyleProp<ViewStyle>
}

const AppTile: React.FC<AppTileProps> = ({ appData, onPress, style }: AppTileProps) => {
  const { t } = useTranslation()
  const name = t(appData.translationKey)
  const isActive = !!appData.path

  const onTilePress = useCallback(() => {
    if (isActive) {
      onPress?.(appData)
    }
  }, [onPress, isActive, appData])

  return (
    <HoliButton
      label={name}
      inline
      transparent
      onPress={onTilePress}
      disabled={!isActive}
      style={[styles.appTile, style]}
      testID={`app-tile-${appData.id}`}
    >
      <View style={[styles.contentContainer, isActive && { backgroundColor: colors.backgroundColorGreyLight }]}>
        {appData.icon && (
          <HoliIcon
            icon={appData.icon}
            size={30}
            color={isActive ? colors.fontColorBlack : colors.fontColorBlackDisabled}
          />
        )}
      </View>

      <HoliText selectable={false} style={styles.appName} size={'extrasmall'}>
        {name}
      </HoliText>
    </HoliButton>
  )
}

export default AppTile

const tileWidth = 72

const styles = StyleSheet.create({
  appTile: {
    width: tileWidth,
    overflow: 'hidden',
    wordBreak: 'break-word',
    padding: 0,
  },
  contentContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
    borderColor: tinycolor(colors.borderColorGrey).darken(5).toString(),
    borderWidth: 2,
    width: tileWidth,
    height: tileWidth,
  },
  appName: {
    paddingTop: 4,
    alignSelf: 'center',
    textAlign: 'center',
  },
})
