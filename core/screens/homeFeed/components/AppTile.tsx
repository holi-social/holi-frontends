import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import tinycolor from 'tinycolor2'

import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

export type HoliApp = {
  id: string
  icon: string
  translationKey: string
  path: string
  hasUpdates: boolean
}

type AppTileProps = {
  appData: HoliApp
  onPress?: (appData: HoliApp) => void
}

const AppTile: React.FC<AppTileProps> = (props: AppTileProps) => {
  const { t } = useTranslation()
  const name = t(props.appData.translationKey)

  const onPress = useCallback(() => {
    if (props.onPress) props.onPress(props.appData)
  }, [props])

  return (
    <HoliButton
      label={name}
      inline
      transparent
      onPress={onPress}
      style={[styles.appTile]}
      testID={`app-tile-${props.appData.id}`}
    >
      <View style={styles.contentContainer}>
        {props.appData.icon && <HoliIcon icon={props.appData.icon} size={30} color={colors.fontColorBlack} />}
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
    marginRight: 15,
    padding: 0,
  },
  contentContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundColorGreyLight,
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
