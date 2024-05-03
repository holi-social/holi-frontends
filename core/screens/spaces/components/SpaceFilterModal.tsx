import React, { useContext, useReducer, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import { HoliError } from '@holi/core/errors/classes/HoliError'
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
  locationSearchQuery?: string
  location?: GeolocationSuggestion
  topicSlugs: string[]
  skillSlugs: string[]
}

type SpaceFilterModalProps = {
  filters?: SpaceFilter
  initialLocationSelection?: GeolocationSuggestion
  applyFilters: (filter: SpaceFilter) => void
}

export const getSpaceFilterInitialState = (initFilter: Partial<SpaceFilter> = {}): SpaceFilter => ({
  locationSearchQuery: undefined,
  location: undefined,
  topicSlugs: [],
  skillSlugs: [],
  ...initFilter,
})

interface SpaceFilterResetAction {
  type: 'RESET'
  initState?: Partial<SpaceFilter>
}

interface SpaceFilterLocationSearchQueryUpdateAction {
  type: 'LOCATION_SEARCH_QUERY_UPDATE'
  value: string | undefined
}

interface SpaceFilterLocationUpdateAction {
  type: 'LOCATION_UPDATE'
  value: GeolocationSuggestion | undefined
}

interface SpaceFilterSlugUpdateAction {
  type: 'TOPIC_SLUG_UPDATE' | 'SKILL_SLUG_UPDATE'
  value: string
}

type SpaceFilterAction =
  | SpaceFilterResetAction
  | SpaceFilterLocationSearchQueryUpdateAction
  | SpaceFilterLocationUpdateAction
  | SpaceFilterSlugUpdateAction

const spaceFilterReducer = (state: SpaceFilter, action: SpaceFilterAction): SpaceFilter => {
  switch (action.type) {
    case 'RESET':
      return getSpaceFilterInitialState()

    case 'LOCATION_SEARCH_QUERY_UPDATE':
      return {
        ...state,
        locationSearchQuery: action.value,
      }

    case 'LOCATION_UPDATE':
      return {
        ...state,
        location: action.value,
      }

    case 'SKILL_SLUG_UPDATE':
      return {
        ...state,
        skillSlugs: state.skillSlugs.includes(action.value)
          ? state.skillSlugs.filter((slugId) => slugId !== action.value)
          : [...state.skillSlugs, action.value],
      }

    case 'TOPIC_SLUG_UPDATE':
      return {
        ...state,
        topicSlugs: state.topicSlugs.includes(action.value)
          ? state.topicSlugs.filter((slugId) => slugId !== action.value)
          : [...state.topicSlugs, action.value],
      }

    default:
      throw new HoliError('Incorect action type used for SpaceFilterAction in spaceFilterReducer')
  }
}

const useSpaceFilterReducer = (initFilterState = getSpaceFilterInitialState()) => {
  const [filterState, dispatch] = useReducer(spaceFilterReducer, initFilterState)

  const resetFilter = (initState?: Partial<SpaceFilter>) => dispatch({ type: 'RESET', initState })

  const updateLocationSearchQuery = (locationSearchQuery?: string) =>
    dispatch({ type: 'LOCATION_SEARCH_QUERY_UPDATE', value: locationSearchQuery })

  const updateLocation = (location?: GeolocationSuggestion) => dispatch({ type: 'LOCATION_UPDATE', value: location })

  const updateSkillSlugs = (skillSlug: string) => dispatch({ type: 'SKILL_SLUG_UPDATE', value: skillSlug })

  const updateTopicSlugs = (topicSlug: string) => dispatch({ type: 'TOPIC_SLUG_UPDATE', value: topicSlug })

  return {
    filterState,
    resetFilter,
    updateLocationSearchQuery,
    updateLocation,
    updateSkillSlugs,
    updateTopicSlugs,
  }
}

const SpaceFilterModal: React.FC<SpaceFilterModalProps> = ({ filters, initialLocationSelection, applyFilters }) => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { theme } = useTheme()
  const { colors } = theme

  const { filterState, resetFilter, updateLocation, updateLocationSearchQuery, updateSkillSlugs, updateTopicSlugs } =
    useSpaceFilterReducer(filters ?? getSpaceFilterInitialState())

  const { loadingTopics, failedTopics, loadingSkills, failedSkills, topics, skills } = useContext(SpaceTermContext)

  const [showFilterModal, setShowFilterModal] = useState(false)

  const closeModal = () => {
    setShowFilterModal(false)
  }

  const openModal = () => {
    resetFilter({ locationSearchQuery: initialLocationSelection?.label, location: initialLocationSelection })
    setShowFilterModal(true)
  }

  const submit = () => {
    applyFilters(filterState)
    setShowFilterModal(false)
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
              <HoliButton
                label={t('global.reset')}
                inline
                onPress={() => resetFilter()}
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
