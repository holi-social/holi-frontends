import React, { useCallback, useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import PlacesAutocomplete, { GeolocationSuggestion } from '@holi/core/geolocation/components/PlacesAutocomplete'
import SpaceTermContextProvider, {
  SpaceTermContext,
} from '@holi/core/screens/spaces/providers/SpaceTermContextProvider'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Close } from '@holi/icons/src/generated'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import HoliSelect, { HoliSelectOption } from '@holi/ui/components/molecules/HoliSelect'

import { VolunteeringFilters } from '@holi-apps/volunteering/types'

export type VolunteeringFilterFormProps = {
  filters: VolunteeringFilters
  onSubmit: (filters?: VolunteeringFilters) => void
  clearFilters?: () => void
}

const VolunteeringFilterForm = ({ filters, onSubmit, clearFilters }: VolunteeringFilterFormProps) => {
  const { t } = useTranslation()
  const { topics, skills, loadingTopics, loadingSkills } = useContext(SpaceTermContext)
  const [selectedTopics, setSelectedTopics] = useState(filters.topics || [])
  const [selectedSkills, setSelectedSkills] = useState(filters.skills || [])
  const [selectedLocation, setSelectedLocation] = useState<GeolocationSuggestion | undefined>(filters.location)

  const topicOptions: HoliSelectOption[] = topics.map((topic) => ({
    id: topic.slug,
    title: topic.title,
    selected: selectedTopics.includes(topic.slug),
  }))

  const skillOptions: HoliSelectOption[] = skills.map((skill) => ({
    id: skill.slug,
    title: skill.title,
    selected: selectedSkills.includes(skill.slug),
  }))

  const toggleTopicSelection = useCallback(
    (option: HoliSelectOption) =>
      setSelectedTopics(
        option.selected
          ? selectedTopics.filter((topicSlug) => topicSlug !== option.id)
          : [...(selectedTopics || []), option.id]
      ),
    [selectedTopics]
  )

  const toggleSkillSelection = useCallback(
    (option: HoliSelectOption) =>
      setSelectedSkills(
        option.selected
          ? selectedSkills.filter((skillSlug) => skillSlug !== option.id)
          : [...(selectedSkills || []), option.id]
      ),
    [selectedSkills]
  )

  const submit = useCallback(
    () =>
      onSubmit({
        location: selectedLocation,
        topics: selectedTopics,
        skills: selectedSkills,
      }),
    [onSubmit, selectedLocation, selectedTopics, selectedSkills]
  )

  const resetForm = useCallback(() => {
    setSelectedLocation(undefined)
    setSelectedTopics([])
    setSelectedSkills([])
    clearFilters?.()
  }, [clearFilters])

  return (
    <HoliModalContentWrapper
      actionButtonText={t('volunteering:filter.submitButton')}
      onActionButtonPress={submit}
      style={styles.modalWrapper}
      testID="volunteering-filter-modal"
      keyboardShouldPersistTaps="handled"
      scrollable={false}
      loading={loadingTopics || loadingSkills}
      hideFooterWhenKeyboardIsOpen={true}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <HoliHeading testID="volunteering-filter-heading">{t('volunteering:filter.heading')}</HoliHeading>
          <HoliButton label={t('global.reset')} inline onPress={resetForm} type="secondary" variant="small">
            <HoliText>{t('global.reset')}</HoliText>
            <HoliIcon icon={Close} size={20} style={styles.clearFilters} />
          </HoliButton>
        </View>
        <PlacesAutocomplete
          label={t('volunteering:filter.location.label')}
          placeholder={t('volunteering:filter.location.placeholder')}
          selected={selectedLocation}
          id="volunteering-filter-location"
          testID="volunteering-filter-location"
          onChange={setSelectedLocation}
          style={[styles.filterOption, { zIndex: 2 }]}
          inputProps={{ autoFocus: true }}
        />
        <HoliSelect
          options={topicOptions}
          inputLabel={t('volunteering:filter.topics.label')}
          aria-label={t('volunteering:filter.topics.label')}
          placeholder={t('volunteering:filter.topics.placeholder')}
          style={[styles.filterOption, { zIndex: 1 }]}
          onChange={toggleTopicSelection}
          id="volunteering-filter-topics"
          testID="volunteering-filter-topics"
          multiSelect
          multiSelectionLabel={t('volunteering:filter.topics.multiSelectionLabel')}
          virtualized={true}
        />
        <HoliSelect
          options={skillOptions}
          inputLabel={t('volunteering:filter.skills.label')}
          aria-label={t('volunteering:filter.skills.label')}
          placeholder={t('volunteering:filter.skills.placeholder')}
          style={[styles.filterOption, { zIndex: 0 }]}
          onChange={toggleSkillSelection}
          id="volunteering-filter-skills"
          testID="volunteering-filter-skills"
          multiSelect
          multiSelectionLabel={t('volunteering:filter.skills.multiSelectionLabel')}
          virtualized={true}
        />
      </View>
    </HoliModalContentWrapper>
  )
}

const WrappedFilterForm = (props: VolunteeringFilterFormProps) => (
  <SpaceTermContextProvider>
    <VolunteeringFilterForm {...props} />
  </SpaceTermContextProvider>
)

export default WrappedFilterForm

const styles = StyleSheet.create({
  filterOption: {
    marginTop: 24,
  },
  container: {
    height: '100%',
    marginHorizontal: 16,
    paddingTop: 32,
  },
  modalWrapper: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clearFilters: {
    paddingLeft: 3,
  },
})
