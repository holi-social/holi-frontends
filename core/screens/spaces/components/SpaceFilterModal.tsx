import React, { useCallback, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import PlacesAutocomplete, { GeolocationSuggestion } from '@holi/core/geolocation/components/PlacesAutocomplete'
import { SpaceTermContext } from '@holi/core/screens/spaces/providers/SpaceTermContextProvider'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Close, Filter3 } from '@holi/icons/src/generated'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import HoliSelect, { HoliSelectOption } from '@holi/ui/components/molecules/HoliSelect'
import { dimensions } from '@holi/ui/styles/globalVars'
import { useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type SpaceFilter = {
  topicSlug?: string
  locationId?: string
  skillSlugs?: string[]
}

type SpaceFilterModalProps = {
  filters?: SpaceFilter
  initialLocationSelection?: GeolocationSuggestion
  applyFilters: (filter: SpaceFilter) => void
}

const SpaceFilterModal: React.VFC<SpaceFilterModalProps> = ({
  filters = {},
  initialLocationSelection,
  applyFilters,
}) => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { theme } = useTheme()
  const { colors } = theme
  const [topicSlug, setTopicSlug] = useState(filters.topicSlug)
  const [skillSlugs, setSkillSlugs] = useState(filters.skillSlugs)
  const [locationQuery, setLocationQuery] = useState(initialLocationSelection?.label || '')
  const [selectedLocation, setSelectedLocation] = useState<GeolocationSuggestion | undefined>(initialLocationSelection)

  const { loadingTopics, failedTopics, loadingSkills, failedSkills, topics, skills } = useContext(SpaceTermContext)

  const [showFilterModal, setShowFilterModal] = useState(false)
  const closeModal = useCallback(() => {
    setShowFilterModal(false)
  }, [setShowFilterModal])
  const openModal = useCallback(() => {
    setTopicSlug(filters.topicSlug)
    setLocationQuery(initialLocationSelection?.label || '')
    setSelectedLocation(initialLocationSelection)
    setSkillSlugs(filters.skillSlugs)
    setShowFilterModal(true)
  }, [filters.topicSlug, filters.skillSlugs, initialLocationSelection])
  const submit = useCallback(() => {
    applyFilters({
      topicSlug,
      locationId: selectedLocation?.id,
      skillSlugs,
    })
    setShowFilterModal(false)
  }, [topicSlug, selectedLocation, skillSlugs, applyFilters, setShowFilterModal])

  const topicOptions: HoliSelectOption[] = topics.map((topic) => ({
    id: topic.slug,
    title: topic.title,
    selected: topicSlug === topic.slug,
  }))
  const toggleTopicSelection = useCallback(
    (option: HoliSelectOption) => setTopicSlug(option.selected ? undefined : option.id),
    [setTopicSlug]
  )
  const skillOptions: HoliSelectOption[] = skills.map((skill) => ({
    id: skill.slug,
    title: skill.title,
    selected: skillSlugs?.includes(skill.slug),
  }))

  const toggleSkillSelection = useCallback(
    (option: HoliSelectOption) =>
      setSkillSlugs((list = []) => {
        const index = list.indexOf(option.id)
        if (index < 0 && !option.selected) {
          list.push(option.id)
        } else if (index >= 0 && option.selected) {
          list.splice(index, 1)
        }
        // create new object to enforce rerender
        return [...list]
      }),
    [setSkillSlugs]
  )

  const clearFilters = useCallback(() => {
    setTopicSlug(undefined)
    setLocationQuery('')
    setSelectedLocation(undefined)
    setSkillSlugs(undefined)
  }, [setTopicSlug, setLocationQuery, setSelectedLocation, setSkillSlugs])

  // Error state just hides the component
  if (failedTopics || failedSkills) {
    return <></>
  }

  return (
    <View>
      {/* Floating filter button */}
      <View style={[mixins.container, styles.overlayButtonWrapper]}>
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
          <HoliIcon icon={Filter3} size={16} color={colors.foreground30} style={styles.icon} />
        </HoliButton>
      </View>

      {/* Filter modal */}
      <HoliModal
        label={t('spaces.filter.heading')}
        show={showFilterModal}
        onDismiss={closeModal}
        testID="spaces-filter-modal"
        relativeHeight={1}
        autoHeight={false}
      >
        <HoliModalContentWrapper
          actionButtonText={t('spaces.filter.submit')}
          onActionButtonPress={submit}
          style={styles.modalWrapper}
          scrollable={false}
          loading={loadingTopics || loadingSkills}
          hideFooterWhenKeyboardIsOpen={true}
        >
          <View style={[mixins.container, styles.container]}>
            <View style={styles.header}>
              <HoliHeading>{t('spaces.filter.heading')}</HoliHeading>
              <HoliButton label={t('global.reset')} inline onPress={clearFilters} type="secondary" variant="small">
                <HoliText>{t('global.reset')}</HoliText>
                <HoliIcon icon={Close} size={20} style={styles.clearFilters} />
              </HoliButton>
            </View>

            <PlacesAutocomplete
              label={t('spaces.filter.location.label')}
              placeholder={t('spaces.filter.location.placeholder')}
              value={locationQuery}
              id="spaces-filter-location"
              testID="spaces-filter-location"
              selected={selectedLocation}
              onClose={setSelectedLocation}
              onChangeText={setLocationQuery}
              style={[styles.filterOption, { zIndex: 2 }]}
              inputProps={{ autoFocus: true }}
              fetchDetailsOnClose
              helperText={selectedLocation ? undefined : t('profile.location.validation.helper')}
            />
            <HoliSelect
              options={topicOptions}
              inputLabel={t('spaces.filter.topics.label')}
              aria-label={t('spaces.filter.topics.label')}
              placeholder={t('spaces.filter.topics.placeholder')}
              style={[styles.filterOption, { zIndex: 1 }]}
              onChange={toggleTopicSelection}
              id="spaces-filter-interests"
              testID="spaces-filter-interests"
            />
            <HoliSelect
              options={skillOptions}
              inputLabel={t('spaces.filter.skills.label')}
              aria-label={t('spaces.filter.skills.label')}
              placeholder={t('spaces.filter.skills.placeholder')}
              style={[styles.filterOption, { zIndex: 0 }]}
              onChange={toggleSkillSelection}
              id="spaces-filter-skills"
              testID="spaces-filter-skills"
              multiSelect={true}
              multiSelectionLabel={t('spaces.filter.skills.multiSelectionLabel')}
            />
          </View>
        </HoliModalContentWrapper>
      </HoliModal>
    </View>
  )
}

const styles = StyleSheet.create({
  overlayButtonWrapper: {
    position: Platform.OS === 'web' ? 'fixed' : 'absolute',
    bottom: 0,
  },
  overlayButton: {
    position: 'absolute',
    bottom: (Platform.OS === 'web' ? dimensions.bottomBarHeight : 0) + 16,
    right: 16,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clearFilters: {
    paddingLeft: 3,
  },
  icon: {
    marginLeft: 6,
    marginBottom: 2,
  },
  filterOption: {
    marginTop: 24,
  },
  container: {
    height: '100%',
  },
  modalWrapper: {
    flex: 1,
  },
})

export default SpaceFilterModal
