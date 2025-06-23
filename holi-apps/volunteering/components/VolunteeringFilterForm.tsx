import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import PlacesAutocomplete, { type GeolocationSuggestion } from '@holi/core/geolocation/components/PlacesAutocomplete'
import { Close } from '@holi/icons/src/generated'
import { Text } from 'holi-bricks/components/text'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import HoliSelect, { type HoliSelectOption } from '@holi/ui/components/molecules/HoliSelect'

import type { VolunteeringFilters } from '@holi-apps/volunteering/types'
import { Button } from 'holi-bricks/components/button'
import { useSortedTerms } from '@holi/core/domain/shared/useSortedTerms'

export type VolunteeringFilterFormProps = {
  filters: VolunteeringFilters
  onSubmit: (filters?: VolunteeringFilters) => void
  clearFilters?: () => void
}

export const VolunteeringFilterForm = ({ filters, onSubmit, clearFilters }: VolunteeringFilterFormProps) => {
  const { t } = useTranslation()
  const [selectedTopics, setSelectedTopics] = useState(filters.topics || [])
  const [selectedSkills, setSelectedSkills] = useState(filters.skills || [])
  const [selectedLocation, setSelectedLocation] = useState<GeolocationSuggestion | undefined>(filters.location)
  const sortedTopics = useSortedTerms('topic')
  const sortedSkills = useSortedTerms('skill')

  const topicOptions: HoliSelectOption[] = sortedTopics.map((topic) => ({
    id: topic.term,
    title: topic.label,
    selected: selectedTopics.includes(topic.term),
  }))

  const skillOptions: HoliSelectOption[] = sortedSkills.map((skill) => ({
    id: skill.term,
    title: skill.label,
    selected: selectedSkills.includes(skill.term),
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
      actionButtonText={t('volunteering.filter.submitButton')}
      onActionButtonPress={submit}
      style={styles.modalWrapper}
      testID="volunteering-filter-modal"
      keyboardShouldPersistTaps="handled"
      scrollable={false}
      hideFooterWhenKeyboardIsOpen={true}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text size="3xl">{t('volunteering.filter.heading')}</Text>
          <Button label={t('global.reset')} inline onPress={resetForm} variant="secondary" size="sm" icon={Close} />
        </View>
        <PlacesAutocomplete
          label={t('volunteering.filter.location.label')}
          placeholder={t('volunteering.filter.location.placeholder')}
          selected={selectedLocation}
          id="volunteering-filter-location"
          testID="volunteering-filter-location"
          onChange={setSelectedLocation}
          style={[styles.filterOption, { zIndex: 2 }]}
          inputProps={{ autoFocus: true }}
        />
        <HoliSelect
          options={topicOptions}
          inputLabel={t('volunteering.filter.topics.label')}
          aria-label={t('volunteering.filter.topics.label')}
          placeholder={t('volunteering.filter.topics.placeholder')}
          style={[styles.filterOption, { zIndex: 1 }]}
          onChange={toggleTopicSelection}
          id="volunteering-filter-topics"
          testID="volunteering-filter-topics"
          multiSelect
          multiSelectionLabel={t('volunteering.filter.topics.multiSelectionLabel')}
          virtualized={true}
        />
        <HoliSelect
          options={skillOptions}
          inputLabel={t('volunteering.filter.skills.label')}
          aria-label={t('volunteering.filter.skills.label')}
          placeholder={t('volunteering.filter.skills.placeholder')}
          style={[styles.filterOption, { zIndex: 0 }]}
          onChange={toggleSkillSelection}
          id="volunteering-filter-skills"
          testID="volunteering-filter-skills"
          multiSelect
          multiSelectionLabel={t('volunteering.filter.skills.multiSelectionLabel')}
          virtualized={true}
        />
      </View>
    </HoliModalContentWrapper>
  )
}

const styles = StyleSheet.create({
  filterOption: {
    marginTop: 24,
  },
  container: {
    flexShrink: 1,
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
