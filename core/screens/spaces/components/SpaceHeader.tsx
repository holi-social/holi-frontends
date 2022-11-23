import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import SpaceAvatar from '@holi/core/screens/spaces/components/SpaceAvatar'
import { Space } from '@holi/core/screens/spaces/types'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'

type SpaceHeaderProps = {
  space: Space
  style?: StyleProp<ViewStyle>
}

const SpaceHeader: React.VFC<SpaceHeaderProps> = ({ space, style }) => {
  const { t } = useTranslation()

  const creator = space.creator

  return (
    <View style={[styles.container, style]} testID="space-header">
      <SpaceAvatar label={space.title} imageSrc={space.avatar} />
      <HoliHeading level="1" size="medium" style={styles.title}>
        {space.title}
      </HoliHeading>
      <HoliText style={{ paddingTop: 10 }}>
        <Trans
          i18nKey="spaces.spaceDetails.creator"
          values={{ name: creator.fullName || t('user.profileView.anonymous') }}
        />
      </HoliText>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    top: 0,
  },
  title: {
    paddingTop: 24,
  },
})

export default SpaceHeader
