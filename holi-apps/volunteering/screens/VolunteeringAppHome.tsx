import React, { memo, useCallback, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, SafeAreaView, StyleSheet, View } from 'react-native'

import DefaultLayout from '@holi/core/DefaultLayout'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParam from '@holi/core/navigation/hooks/useParam'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliHorizontalRow } from '@holi/ui/components/molecules/HoliHorizontalRow'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import VolunteeringFilterForm, { VolunteeringFilters } from '@holi-apps/volunteering/components/VolunteeringFilterForm'
import VolunteeringListing from '@holi-apps/volunteering/components/VolunteeringListing'

type VolunteeringAppHomeProps = Record<string, never>

export type VolunteeringAppHomeParams = {
  location?: string
}

const { useParam } = createParam<VolunteeringAppHomeParams>()

const VolunteeringAppHome: React.VFC<VolunteeringAppHomeProps> = () => {
  const { t } = useTranslation()
  const title = t('volunteering:app.name')
  const mixins = useStyleMixins()

  const [showFilterModal, setShowFilterModal] = useState(false)

  const [location, setLocation] = useParam('location')

  const filters: VolunteeringFilters = { location }

  const closeModal = useCallback(() => {
    setShowFilterModal(false)
  }, [])

  const submit = useCallback(
    (location) => {
      setLocation(location)
      closeModal()
    },
    [setLocation, closeModal]
  )

  const { setOptions, navigate } = useUnifiedNavigation()

  useLayoutEffect(() => {
    const filterButton = (
      <HoliButton
        label={t('volunteering:filter.heading')}
        inline
        transparent
        onPress={() => setShowFilterModal(true)}
        testID="btn-to-volunteering-filter"
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
      headerLeft: ({ tintColor }) => <HeaderBackButton icon="arrow-down-s" tintColor={tintColor} />,
      headerRight: () => (Platform.OS === 'web' ? <HoliHorizontalRow>{filterButton}</HoliHorizontalRow> : filterButton),
    })
  }, [setOptions, navigate, t, title])

  return (
    <DefaultLayout style={styles.defaultLayout} scrollView={false} headerOverlap testID={'volunteering-list-container'}>
      <HoliModal
        show={showFilterModal}
        onDismiss={closeModal}
        testID="volunteering-filter"
        label={t('volunteering:filter.heading')}
        autoHeight={false}
        relativeHeight={1}
      >
        <VolunteeringFilterForm onSubmit={submit} filters={filters} />
      </HoliModal>

      <View style={[mixins.container]} testID="volunteering-app-home">
        <SafeAreaView>
          <VolunteeringListing filters={filters} />
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
