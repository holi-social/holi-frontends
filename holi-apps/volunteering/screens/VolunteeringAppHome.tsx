import React, { memo, useCallback, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import DefaultLayout from '@holi/core/DefaultLayout'
import { useScrollYHandler } from '@holi/core/helpers'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParam, { singleParamConfig } from '@holi/core/navigation/hooks/useParam'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import SafeArea from '@holi/ui/components/atoms/SafeArea'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliHorizontalRow } from '@holi/ui/components/molecules/HoliHorizontalRow'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import { colors } from '@holi/ui/styles/globalVars'

import VolunteeringFilterForm from '@holi-apps/volunteering/components/VolunteeringFilterForm'
import VolunteeringListing from '@holi-apps/volunteering/components/VolunteeringListing'
import { VolunteeringFilters } from '@holi-apps/volunteering/types'

type VolunteeringAppHomeProps = Record<string, never>

const { useParam, useUpdateParams } = createParam<VolunteeringFilters>()

const VolunteeringAppHome: React.VFC<VolunteeringAppHomeProps> = () => {
  const { t } = useTranslation()
  const title = t('volunteering:app.name')
  const onScreenScroll = useScrollYHandler()

  const [showFilterModal, setShowFilterModal] = useState(false)

  const [location] = useParam('location', singleParamConfig)
  const [category] = useParam('category', singleParamConfig)

  const updateParams = useUpdateParams()

  const closeModal = useCallback(() => {
    setShowFilterModal(false)
  }, [])

  const submit = useCallback(
    (filters) => {
      updateParams({ location: filters.location, category: filters.category })
      closeModal()
    },
    [updateParams, closeModal]
  )

  const clearFilters = useCallback(
    () =>
      updateParams({
        location: undefined,
        category: undefined,
      }),
    [updateParams]
  )

  const { setOptions, navigate } = useUnifiedNavigation()
  const filters: VolunteeringFilters = { location, category }
  const isFiltering = !!(location || category)

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
        {isFiltering && <View style={styles.dot} />}
      </HoliButton>
    )
    setOptions({
      headerTitle: () => (
        <HoliHeading level="1" size="small">
          {title}
        </HoliHeading>
      ),
      headerTransparent: true,
      headerStyle: { backgroundColor: colors.background10 },
      headerLeft: ({ tintColor }) => <HeaderBackButton icon="arrow-down-s" tintColor={tintColor} />,
      headerRight: () => (Platform.OS === 'web' ? <HoliHorizontalRow>{filterButton}</HoliHorizontalRow> : filterButton),
    })
  }, [setOptions, navigate, t, title, isFiltering])

  return (
    <DefaultLayout
      style={styles.defaultLayout}
      scrollEnabled={false}
      headerOverlap
      testID={'volunteering-list-container'}
      keyboardShouldPersistTaps="handled"
      hasFooterTabBar={false}
    >
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

      <SafeArea style={{ backgroundColor: colors.background10 }}>
        <VolunteeringListing filters={filters} clearFilters={clearFilters} onScroll={onScreenScroll} />
      </SafeArea>
    </DefaultLayout>
  )
}

export default memo(VolunteeringAppHome)

const styles = StyleSheet.create({
  defaultLayout: {
    backgroundColor: colors.background30,
    paddingBottom: 0,
    minHeight: Platform.OS === 'web' ? '100vh' : '100%',
  },
  dot: {
    backgroundColor: colors.brandColorB30,
    height: 12,
    width: 12,
    borderRadius: 6,
    position: 'absolute',
    top: -2,
    right: -2,
    borderColor: colors.background10,
    borderWidth: 2,
  },
})
