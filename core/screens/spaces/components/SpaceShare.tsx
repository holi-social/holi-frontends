import * as Linking from 'expo-linking'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, Share, StyleProp, StyleSheet, ViewStyle } from 'react-native'

import type { Space } from '@holi/core/screens/spaces/types'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

type SpaceShareProps = {
  space: Space
  style?: StyleProp<ViewStyle>
}

const SpaceShare: React.VFC<SpaceShareProps> = ({ space, style }: SpaceShareProps) => {
  const { t } = useTranslation()
  const prefix = Linking.createURL(`/spaces/${space.id}`)

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: space.title,
        title: space.title,
        url: prefix,
      })
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message)
    }
  }

  return (
    <>
      <HoliButton
        label={t('spaces:spaces.share')}
        style={style}
        contentStyle={styles.buttonContent}
        transparent
        inline
        onPress={onShare}
      >
        <HoliIcon icon="share" size={24} />
        <HoliText style={styles.shareText}>{t('spaces:spaces.share')}</HoliText>
      </HoliButton>
    </>
  )
}

export default SpaceShare

const styles = StyleSheet.create({
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  shareText: {
    marginLeft: 11,
  },
})
