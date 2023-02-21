import * as Linking from 'expo-linking'
import React from 'react'
import { Alert, Share, StyleProp, StyleSheet, ViewStyle } from 'react-native'

import type { Space } from '@holi/core/screens/spaces/types'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

type SpaceShareProps = {
  space: Space
  style?: StyleProp<ViewStyle>
}

const SpaceShare: React.VFC<SpaceShareProps> = ({ space, style }: SpaceShareProps) => {
  const prefix = Linking.createURL(`/spaces/${space.id}`)

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: space.title,
        url: /* Platform.OS === 'web' ? webPrefix : */ prefix,
        // url: 'https://www.theguardian.com/world/2023/feb/20/turkey-new-6-point-4-magnitude-earthquake-hatay',
        // url: `https://staging.web.project-holi.org//spaces/${space.id}`,
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
        label={'label'}
        style={style}
        contentStyle={styles.buttonContent}
        transparent
        inline
        onPress={onShare}
      >
        <HoliIcon icon="share" size={24} style={styles.shareIcon} />
        <HoliText style={styles.shareText}>Share</HoliText>
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
  shareIcon: {
    marginRight: 10,
    color: colors.foreground20,
  },
  shareText: {
    color: colors.foreground20,
  },
})
