import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import tinycolor from 'tinycolor2'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

export type HoliApp = {
  icon: string
  nameKey: string
  path: string
  testID: string
  hasUpdates: boolean
}

type AppTileProps = {
  app: HoliApp
}

const AppTile: React.FC<AppTileProps> = (props: AppTileProps) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const name = t(props.app.nameKey)

  return (
    <HoliButton
      label={name}
      inline
      transparent
      onPress={() => navigate(props.app.path)}
      style={[styles.appTile]}
      testID={props.app.testID}
    >
      <View style={styles.contentContainer}>
        {props.app.icon && <HoliIcon icon={props.app.icon} size={30} color={colors.fontColorBlack} />}
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
