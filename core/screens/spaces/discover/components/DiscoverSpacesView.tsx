import type React from 'react'
import { useContext, useMemo } from 'react'
import { ScrollView, View } from 'react-native'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import type { Skill, Topic } from '@holi/core/domain/shared/types'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import SpaceFilterForm from '@holi/core/screens/spaces/components/SpaceFilterForm'
import type { SpaceFilter } from '@holi/core/screens/spaces/components/SpaceFilterForm/types'
import SpacesGroupSlider from '@holi/core/screens/spaces/discover/components/SpacesGroupSlider'
import { getDefaultTopics } from '@holi/core/screens/spaces/helpers/defaultFilters'
import { SpaceTermContext } from '@holi/core/screens/spaces/providers/SpaceTermContextProvider'
import { ArrowLeft, Filter3 } from '@holi/icons/src/generated'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { ButtonIcon } from 'holi-bricks/components/button/ButtonIcon'
import { Text } from 'holi-bricks/components/text'
import { useStyles } from 'holi-bricks/hooks'
import { Spacing } from 'holi-bricks/tokens'
import { createStyleSheet } from 'holi-bricks/utils'
import { useTranslation } from 'react-i18next'

interface DiscoverSpacesViewProps {
  userTopics: Topic[]
  userSkills: Skill[]
  userGeolocationId?: string
}

/**
 * DiscoverSpaces are not paginated but may contain a limit of items in each list of spaces.
 * This means that the offset variable is omitted in our query, but we may add a limit variable.
 */
export const SPACES_GROUP_LIMIT = 5

export const SPACES_SLIDER_SKELETONS = 3

const SpacesGroupSliderSkeletons: React.FC = () => {
  return (
    <View testID={'spaces-group-slider-skeletons'}>
      {new Array(SPACES_SLIDER_SKELETONS).fill(1).map((_, idx) => {
        return <SpacesGroupSlider key={idx} loading={true} pageSize={SPACES_GROUP_LIMIT} />
      })}
    </View>
  )
}

const DiscoverSpacesView: React.FC<DiscoverSpacesViewProps> = ({ userTopics, userSkills, userGeolocationId }) => {
  const { isLoggedIn } = useLoggedInUser()
  const { styles, theme } = useStyles(getStyles)

  const { topics = [] } = useContext(SpaceTermContext)

  const defaultTopics = useMemo(
    () =>
      getDefaultTopics(
        topics,
        userTopics.map((t) => t.id)
      ),
    [topics, userTopics]
  )

  const { t } = useTranslation()
  const setScreenOptions = useSetScreenOptions()
  const { visible: isFilterModalShown, show: openFilterModal, hide: closeFilterModal } = useModalState()
  const { navigate } = useRouting()

  const onSubmit = (filters: SpaceFilter) => {
    applyFilters(filters)
    closeFilterModal()
  }
  const applyFilters = (filters: SpaceFilter) => {
    const params = new URLSearchParams()

    if (filters.location?.id) {
      params.set('location', filters.location.id)
    }

    filters.topicSlugs?.forEach((topic) => {
      params.append('topic', topic)
    })

    filters.skillSlugs?.forEach((skill) => {
      params.append('skill', skill)
    })
    const paramsString = params.toString()
    paramsString && navigate('/spaces/filter?' + paramsString)
  }

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      headerStyle: {
        backgroundColor: theme.colors.bg.page,
      },
      headerTitle: () => (
        <Text headingLevel="1" size="md">
          {t('spaces.discover.explore')}
        </Text>
      ),
      headerTransparent: false,
      headerBackVisible: false,
      headerTitleAlign: 'center',
      headerLeft: () => <HeaderBackButton icon={ArrowLeft} />,
      headerRight: () => (
        <ButtonIcon icon={Filter3} label="filter-modal--open-icon-btn" variant="tertiary" onPress={openFilterModal} />
      ),
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [setScreenOptions, t, openFilterModal, theme])

  return (
    <>
      <ScrollView>
        <View testID="spaces-container" style={styles.body}>
          <HoliContainer noPadding>
            {isLoggedIn && userGeolocationId && (
              <SpacesGroupSlider
                locationId={userGeolocationId}
                pageSize={SPACES_GROUP_LIMIT}
                testID="discover-spaces-slider-default-location"
              />
            )}

            {userTopics.map((userTopic, index) => {
              return (
                <SpacesGroupSlider
                  key={index}
                  topic={userTopic}
                  pageSize={SPACES_GROUP_LIMIT}
                  style={styles.spacesGroup}
                  testID="discover-topics-slider-user-specific"
                />
              )
            })}

            {userSkills.map((userSkill, index) => {
              return (
                <SpacesGroupSlider
                  key={index}
                  skill={userSkill}
                  pageSize={SPACES_GROUP_LIMIT}
                  style={styles.spacesGroup}
                  testID="discover-skills-slider-user-specific"
                />
              )
            })}

            {!topics.length && <SpacesGroupSliderSkeletons />}

            {defaultTopics.map((defaultTopic, index) => {
              return (
                <SpacesGroupSlider
                  key={index}
                  topic={defaultTopic}
                  pageSize={SPACES_GROUP_LIMIT}
                  style={styles.spacesGroup}
                  testID="discover-topic-slider-others"
                />
              )
            })}
          </HoliContainer>
        </View>
      </ScrollView>
      <HoliModal
        relativeHeight={1}
        autoHeight={false}
        testID={'filter-modal'}
        label={t('spaces.filter.heading')}
        shown={isFilterModalShown}
        onDismiss={closeFilterModal}
      >
        <SpaceFilterForm onSubmit={onSubmit} />
      </HoliModal>
    </>
  )
}

const getStyles = createStyleSheet((theme) => ({
  body: {
    paddingTop: Spacing.lg, // + header height
    backgroundColor: theme.colors.bg.page,
    gap: Spacing.lg,
  },
  header: {
    backgroundColor: theme.colors.bg.page,
  },
  spacesGroup: {
    marginBottom: 30,
  },
}))

export default DiscoverSpacesView
