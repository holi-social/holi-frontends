import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import PlacesAutocomplete from '@holi/core/geolocation/components/PlacesAutocomplete'
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
import { useSortedTerms } from '@holi/core/domain/shared/useSortedTerms'

interface Props extends Pick<Partial<SpaceFilter>, 'location' | 'skillSlugs' | 'topicSlugs'> {
  onSubmit: (filter: SpaceFilter) => void
}

const SpaceFilterForm = ({ onSubmit, ...initValues }: Props) => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()

  const { filterState, resetAllFilters, updateLocation, updateSkillSlugs, updateTopicSlugs } = useSpaceFilterReducer(
    getSpaceFilterInitialState(initValues)
  )

  const topics = useSortedTerms('topic')
  const skills = useSortedTerms('skill')

  const submit = () => {
    onSubmit(filterState)
  }

  const topicOptions: HoliSelectOption[] = topics.map((topic) => ({
    id: topic.term,
    title: topic.label,
    selected: filterState.topicSlugs.includes(topic.term),
  }))

  const skillOptions: HoliSelectOption[] = skills.map((skill) => ({
    id: skill.term,
    title: skill.label,
    selected: filterState.skillSlugs.includes(skill.term),
  }))

  return (
    <HoliKeyboardSaveView>
      <HoliModalContentWrapper
        actionButtonText={t('spaces.filter.submit')}
        actionButtonDisabled={isSpaceFilterEmpty(filterState)}
        onActionButtonPress={submit}
        style={styles.modalWrapper}
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
