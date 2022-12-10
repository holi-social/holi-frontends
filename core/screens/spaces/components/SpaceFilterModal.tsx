import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import PlacesAutocomplete from '@holi/core/location/components/PlacesAutocomplete'
import { Topic } from '@holi/core/screens/userprofile/types'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import HoliSelect, { HoliSelectOption } from '@holi/ui/components/molecules/HoliSelect'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type SpaceFilterParams = {
  topicId?: string
  location?: string
}

type SpaceFilterModalProps = {
  filters?: SpaceFilterParams
  applyFilters: (filter: SpaceFilterParams) => void
  topics: Topic[]
}

const SpaceFilterModal: React.VFC<SpaceFilterModalProps> = ({ filters = {}, applyFilters, topics }) => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const [topicOptions, setTopicOptions] = useState<HoliSelectOption[]>([])

  const [topicId, setTopicId] = useState(filters.topicId)
  const [location, setLocation] = useState(filters.location)

  const [showFilterModal, setShowFilterModal] = useState(false)
  const closeModal = useCallback(() => {
    setTopicId(filters.topicId)
    setLocation(filters.location)
    setShowFilterModal(false)
  }, [setShowFilterModal, setTopicId, setLocation, filters])
  const openModal = useCallback(() => {
    setShowFilterModal(true)
  }, [setShowFilterModal])
  const submit = useCallback(() => {
    closeModal()
    applyFilters({
      // TODO: once we start filtering for multiple topics, we should applyFilters with list of topics with selected === true
      topicId,
      location,
    })
  }, [topicId, location, applyFilters, closeModal])

  useEffect(
    () =>
      setTopicOptions(
        topics.map((topic) => ({
          id: topic.id,
          title: topic.title,
          // TODO: once we start filtering for multiple topics, this check should be updated for all current active filters by topicId
          selected: filters.topicId === topic.id,
        }))
      ),
    [topics, filters]
  )

  const toggleTopicSelection = (topic: HoliSelectOption) => {
    setTopicOptions((options) =>
      options.map((option) => (option.id === topic.id ? { ...option, selected: !option.selected } : option))
    )
  }

  return (
    <>
      {/* Floating filter button */}
      <HoliButton
        label={t('spaces.filter.button.label')}
        testID="btn-filter-spaces"
        inline
        style={styles.overlayButton}
        onPress={openModal}
      >
        <HoliText size="small" bold>
          {t('spaces.filter.button.text')}
        </HoliText>
        <HoliIcon icon="filter-3" size={16} color={colors.fontColorBlack} style={styles.icon} />
      </HoliButton>

      {/* Filter modal */}
      <HoliModal
        label={t('spaces.filter.heading')}
        show={showFilterModal}
        onDismiss={closeModal}
        testID="space-filter-modal"
        autoHeight={false}
      >
        <HoliModalContentWrapper
          actionButtonText={t('spaces.filter.submit')}
          onActionButtonPress={submit}
          style={styles.modalWrapper}
          scrollable={false}
        >
          <View style={[mixins.container]}>
            <HoliHeading level="2">{t('spaces.filter.heading')}</HoliHeading>
            <PlacesAutocomplete
              label={t('spaces.filter.location.label')}
              placeholder={t('spaces.filter.location.placeholder')}
              value={location}
              id="spaces-filter-location"
              onChange={setLocation}
              onSubmit={setLocation}
              style={styles.filterOption}
              inputProps={{ autoFocus: true }}
            />
            <HoliSelect
              options={topicOptions}
              inputLabel={t('spaces.filter.topics.label')}
              accessibilityLabel={t('spaces.filter.topics.label')}
              placeholder={t('spaces.filter.topics.placeholder')}
              style={styles.filterOption}
              onChange={toggleTopicSelection}
              id="spaces-filter-interests"
            />
          </View>
        </HoliModalContentWrapper>
      </HoliModal>
    </>
  )
}

const styles = StyleSheet.create({
  overlayButton: {
    position: Platform.OS === 'web' ? 'fixed' : 'absolute',
    bottom: (Platform.OS === 'web' ? +vars.bottomBarHeight : 0) + 16,
    right: 16,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  icon: {
    marginLeft: 6,
    marginBottom: 2,
  },
  filterOption: {
    marginTop: 24,
  },
  modalWrapper: {
    height: '100%',
  },
})

export default SpaceFilterModal
