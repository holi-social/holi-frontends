import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import PlacesAutocomplete from '@holi/core/geolocation/components/PlacesAutocomplete'
import { SpaceTermContext } from '@holi/core/screens/spaces/providers/SpaceTermContextProvider'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Close } from '@holi/icons/src/generated'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import HoliSelect, { HoliSelectOption } from '@holi/ui/components/molecules/HoliSelect'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import { SpaceFilter } from './types'
import { getSpaceFilterInitialState, useSpaceFilterReducer } from './useSpaceFilterReducer'

interface Props extends Pick<Partial<SpaceFilter>, 'location' | 'skillSlugs' | 'topicSlugs'> {
  onSubmit: (filter: SpaceFilter) => void
}

const SpaceFilterForm = ({ onSubmit, ...initValues }: Props) => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()

  const {
    filterState,
    resetAllFilters,
    updateLocation,
    updateLocationSearchQuery,
    updateSkillSlugs,
    updateTopicSlugs,
  } = useSpaceFilterReducer(
    getSpaceFilterInitialState({ ...initValues, locationSearchQuery: initValues.location?.label })
  )

  const { loadingTopics, failedTopics, loadingSkills, failedSkills, topics, skills } = useContext(SpaceTermContext)

  const submit = () => {
    onSubmit(filterState)
  }

  const topicOptions: HoliSelectOption[] = topics.map((topic) => ({
    id: topic.slug,
    title: topic.title,
    selected: filterState.topicSlugs.includes(topic.slug),
  }))

  const skillOptions: HoliSelectOption[] = skills.map((skill) => ({
    id: skill.slug,
    title: skill.title,
    selected: filterState.skillSlugs.includes(skill.slug),
  }))

  // Error state just hides the component
  if (failedTopics || failedSkills) {
    return <></>
  }

  return (
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
          <HoliButton
            label={t('global.reset')}
            inline
            onPress={() => resetAllFilters()}
            type="secondary"
            variant="small"
          >
            <HoliText>{t('global.reset')}</HoliText>
            <HoliIcon icon={Close} size={20} style={styles.clearFilters} />
          </HoliButton>
        </View>

        <PlacesAutocomplete
          label={t('spaces.filter.location.label')}
          placeholder={t('spaces.filter.location.placeholder')}
          value={filterState.location?.label}
          id="spaces-filter-location"
          testID="spaces-filter-location"
          selected={filterState.location}
          onClose={updateLocation}
          onChangeText={updateLocationSearchQuery}
          style={[styles.filterOption, { zIndex: 2 }]}
          inputProps={{ autoFocus: true }}
          fetchDetailsOnClose
          helperText={filterState.location ? undefined : t('profile.location.validation.helper')}
        />
        <HoliSelect
          options={topicOptions}
          inputLabel={t('spaces.filter.topics.label')}
          aria-label={t('spaces.filter.topics.label')}
          placeholder={t('spaces.filter.topics.placeholder')}
          style={[styles.filterOption, { zIndex: 1 }]}
          onChange={({ id }) => updateTopicSlugs(id)}
          multiSelect
          id="spaces-filter-interests"
          testID="spaces-filter-interests"
        />
        <HoliSelect
          options={skillOptions}
          inputLabel={t('spaces.filter.skills.label')}
          aria-label={t('spaces.filter.skills.label')}
          placeholder={t('spaces.filter.skills.placeholder')}
          style={[styles.filterOption, { zIndex: 0 }]}
          onChange={({ id }) => updateSkillSlugs(id)}
          id="spaces-filter-skills"
          testID="spaces-filter-skills"
          multiSelect={true}
          multiSelectionLabel={t('spaces.filter.skills.multiSelectionLabel')}
        />
      </View>
    </HoliModalContentWrapper>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clearFilters: {
    paddingLeft: 3,
  },
  filterOption: {
    marginTop: 24,
  },
  container: {
    height: '100%',
    paddingTop: 32,
  },
  modalWrapper: {
    flex: 1,
  },
})

export default SpaceFilterForm
