import React, { memo, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import DefaultLayout from '@holi/core/DefaultLayout'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import { HoliHorizontalRow } from '@holi/ui/components/molecules/HoliHorizontalRow'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import VolunteeringListing from '@holi-apps/volunteering/components/VolunteeringListing'

type VolunteeringAppHomeProps = Record<string, never>

const VolunteeringAppHome: React.VFC<VolunteeringAppHomeProps> = () => {
  const { t } = useTranslation()
  const title = t('volunteering:app.name')
  const mixins = useStyleMixins()

  const { setOptions, navigate } = useUnifiedNavigation()

  useLayoutEffect(() => {
    setOptions({
      headerTitle: () => (
        <HoliHeading level="1" size="small">
          {title}
        </HoliHeading>
      ),
      // headerTransparent: true,
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
    <DefaultLayout style={{ backgroundColor: colors.backgroundColorGreyLight }} scrollView={false} headerOverlap>
      <View style={[mixins.container]} testID="volunteering-list-container">
        <HoliHeading level="1" style={styles.titleContainer}>
          {t('volunteering:listing.headline')}
        </HoliHeading>

        <VolunteeringListing />
      </View>
    </DefaultLayout>
  )
}

const styles = StyleSheet.create({
  titleContainer: {
    paddingTop: 24,
    paddingBottom: 32,
    fontWeight: '400',
  },
})

export default memo(VolunteeringAppHome)
