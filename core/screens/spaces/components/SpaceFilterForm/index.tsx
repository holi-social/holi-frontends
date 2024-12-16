import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import PlacesAutocomplete from '@holi/core/geolocation/components/PlacesAutocomplete'
import { SpaceTermContext } from '@holi/core/screens/spaces/providers/SpaceTermContextProvider'
import { Close } from '@holi/icons/src/generated'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliModalContentWrapper from '@holi/ui/components/molecules/HoliModalContentWrapper'
import HoliSelect, {
  type HoliSelectOption,
  LIST_ITEMS_COUNT,
  LIST_ITEM_HEIGHT,
} from '@holi/ui/components/molecules/HoliSelect'
import HoliKeyboardSaveView from '@holi/ui/components/organisms/HoliKeyboardSaveView'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import { type SpaceFilter, isSpaceFilterEmpty } from './types'
import { getSpaceFilterInitialState, useSpaceFilterReducer } from './useSpaceFilterReducer'
import { Button } from 'holi-bricks/components/button'

interface Props extends Pick<Partial<SpaceFilter>, 'location' | 'skillSlugs' | 'topicSlugs'> {
  onSubmit: (filter: SpaceFilter) => void
}

const SpaceFilterForm = ({ onSubmit, ...initValues }: Props) => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()

  const { filterState, resetAllFilters, updateLocation, updateSkillSlugs, updateTopicSlugs } = useSpaceFilterReducer(
    getSpaceFilterInitialState(initValues)
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
    <HoliKeyboardSaveView>
      <HoliModalContentWrapper
        actionButtonText={t('spaces.filter.submit')}
        actionButtonDisabled={isSpaceFilterEmpty(filterState)}
        onActionButtonPress={submit}
        style={styles.modalWrapper}
        loading={loadingTopics || loadingSkills}
        hideFooterWhenKeyboardIsOpen={true}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[mixins.container, styles.container]}>
          <View style={styles.header}>
            <HoliHeading>{t('spaces.filter.heading')}</HoliHeading>
            <Button
              label={t('global.reset')}
              inline
              onPress={() => resetAllFilters()}
              variant="secondary"
              size="sm"
              icon={Close}
            />
          </View>

          <PlacesAutocomplete
            label={t('spaces.filter.location.label')}
            placeholder={t('spaces.filter.location.placeholder')}
            id="spaces-filter-location"
            testID="spaces-filter-location"
            selected={filterState.location}
            onChange={updateLocation}
            style={[styles.filterOption, { zIndex: 2 }]}
            inputProps={{ autoFocus: true }}
            enhanceWithDetails
            helperText={t('profile.location.validation.helper')}
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
            virtualized={false}
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
            virtualized={false}
          />
        </View>
      </HoliModalContentWrapper>
    </HoliKeyboardSaveView>
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
    paddingBottom: LIST_ITEMS_COUNT * LIST_ITEM_HEIGHT,
  },
  modalWrapper: {
    flex: 1,
  },
})

export default SpaceFilterForm
