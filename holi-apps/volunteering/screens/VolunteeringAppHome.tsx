import React, { memo, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import DefaultLayout from '@holi/core/DefaultLayout'
import { useScrollYHandler } from '@holi/core/helpers'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { HoliHorizontalRow } from '@holi/ui/components/molecules/HoliHorizontalRow'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import VolunteeringListing from '@holi-apps/volunteering/components/VolunteeringListing'

type VolunteeringAppHomeProps = Record<string, never>

const VolunteeringAppHome: React.VFC<VolunteeringAppHomeProps> = () => {
  const { t } = useTranslation()
  const title = t('volunteering:app.name')
  const mixins = useStyleMixins()

  const onScreenScroll = useScrollYHandler()
  const { setOptions, navigate } = useUnifiedNavigation()

  useLayoutEffect(() => {
    setOptions({
      headerTitle: () => (
        <HoliHeading level="1" size="small">
          {title}
        </HoliHeading>
      ),
      headerTransparent: true,
      headerStyle: { backgroundColor: colors.backgroundColorWhite },
      headerLeft: () => (Platform.OS === 'web' ? null : <HeaderBackButton icon="arrow-down-s" />),
      headerRight: ({ tintColor }) =>
        Platform.OS === 'web' ? (
          <HoliHorizontalRow>
            <HeaderBackButton icon="close" tintColor={tintColor} />
          </HoliHorizontalRow>
        ) : undefined,
    })
  }, [setOptions, navigate, t, title])

  return (
    <DefaultLayout
      onScroll={onScreenScroll}
      scrollEventThrottle={200}
      style={{ backgroundColor: colors.backgroundColorGreyLight }}
    >
      <View style={[mixins.container]} testID="volunteering-list-container">
        <View style={styles.titleContainer}>
          <HoliText size={'extralarge'}>{t('volunteering:listing.headline')}</HoliText>
        </View>
        <VolunteeringListing />
      </View>
    </DefaultLayout>
  )
}

const styles = StyleSheet.create({
  titleContainer: {
    paddingTop: 24,
    paddingBottom: 32,
  },
})

export default memo(VolunteeringAppHome)
