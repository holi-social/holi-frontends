import React, { memo, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, SafeAreaView, StyleSheet, View } from 'react-native'

import DefaultLayout from '@holi/core/DefaultLayout'
import { useToastForNotAvailableFeature } from '@holi/core/helpers'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
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
  const showFeatureNotImplementedToast = useToastForNotAvailableFeature()

  useLayoutEffect(() => {
    const filterButton = (
      <HoliButton
        label={t('donations:search.heading')}
        inline
        transparent
        onPress={() => showFeatureNotImplementedToast()}
        testID="donations-search-button"
      >
        <HoliIcon icon="filter-3" size={24} />
      </HoliButton>
    )
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
            {filterButton}
            <HeaderBackButton icon="close" tintColor={tintColor} />
          </HoliHorizontalRow>
        ) : (
          filterButton
        ),
    })
  }, [setOptions, navigate, t, title, showFeatureNotImplementedToast])

  return (
    <DefaultLayout style={styles.defaultLayout} scrollView={false} headerOverlap>
      <View style={[mixins.container]} testID="volunteering-list-container">
        <SafeAreaView>
          <VolunteeringListing />
        </SafeAreaView>
      </View>
    </DefaultLayout>
  )
}

export default memo(VolunteeringAppHome)

const styles = StyleSheet.create({
  defaultLayout: {
    backgroundColor: colors.backgroundColorGreyLight,
    paddingBottom: 0,
  },
})
