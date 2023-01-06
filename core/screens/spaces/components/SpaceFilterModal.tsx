import React, { useCallback, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import PlacesAutocomplete from '@holi/core/location/components/PlacesAutocomplete'
import { SpaceTermContext } from '@holi/core/screens/spaces/components/SpaceTermContextProvider'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import HoliSelect, { HoliSelectOption } from '@holi/ui/components/molecules/HoliSelect'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type SpaceFilter = {
  topicSlug?: string
  location?: string
  skillSlugs?: string[]
}

type SpaceFilterModalProps = {
  filters?: SpaceFilter
  applyFilters: (filter: SpaceFilter) => void
}

const SpaceFilterModal: React.VFC<SpaceFilterModalProps> = ({ filters = {}, applyFilters }) => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const [topicSlug, setTopicSlug] = useState(filters.topicSlug)
  const [location, setLocation] = useState(filters.location)
  const [skillSlugs, setSkillSlugs] = useState(filters.skillSlugs)

  const { loading, loadingFailed, topics, skills } = useContext(SpaceTermContext)

  const [showFilterModal, setShowFilterModal] = useState(false)
  const closeModal = useCallback(() => {
    setShowFilterModal(false)
  }, [setShowFilterModal])
  const openModal = useCallback(() => {
    setTopicSlug(filters.topicSlug)
    setLocation(filters.location)
    setSkillSlugs(filters.skillSlugs)
    setShowFilterModal(true)
  }, [setShowFilterModal, setTopicSlug, setLocation, setSkillSlugs, filters])
  const submit = useCallback(() => {
    applyFilters({
      topicSlug,
      location,
      skillSlugs,
    })
    setShowFilterModal(false)
  }, [topicSlug, location, skillSlugs, applyFilters, setShowFilterModal])

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

  // Error state just hides the component
  if (loadingFailed) {
    return <></>
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
        relativeHeight={1}
        autoHeight={false}
        heading={t('spaces.filter.heading')}
      >
        <HoliModalContentWrapper
          actionButtonText={t('spaces.filter.submit')}
          onActionButtonPress={submit}
          style={styles.modalWrapper}
          scrollable={false}
          loading={loading}
        >
          <View style={[mixins.container, styles.container]}>
            <PlacesAutocomplete
              label={t('spaces.filter.location.label')}
              placeholder={t('spaces.filter.location.placeholder')}
              value={location}
              id="spaces-filter-location"
              testID="spaces-filter-location"
              onChange={setLocation}
              onSubmit={setLocation}
              style={[styles.filterOption, { zIndex: 2 }]}
              inputProps={{ autoFocus: true }}
            />
            <HoliSelect
              options={topicOptions}
              inputLabel={t('spaces.filter.topics.label')}
              accessibilityLabel={t('spaces.filter.topics.label')}
              placeholder={t('spaces.filter.topics.placeholder')}
              style={[styles.filterOption, { zIndex: 1 }]}
              onChange={toggleTopicSelection}
              id="spaces-filter-interests"
              testID="spaces-filter-interests"
            />
            <HoliSelect
              options={skillOptions}
              inputLabel={t('spaces.filter.skills.label')}
              accessibilityLabel={t('spaces.filter.skills.label')}
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
  container: {
    height: '100%',
  },
  modalWrapper: {
    flex: 1,
  },
})

export default SpaceFilterModal
