import React, { useCallback, useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleProp, StyleSheet, View, ViewStyle, useWindowDimensions } from 'react-native'

import ScrollBasedRender from '@holi/core/components/ScrollBasedRender'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useLoginModal } from '@holi/core/providers/LoginModalProvider'
import SpacesGroupSlider from '@holi/core/screens/spaces/discover/components/SpacesGroupSlider'
import { getDefaultTopics } from '@holi/core/screens/spaces/helpers/defaultFilters'
import { SpaceTermContext } from '@holi/core/screens/spaces/providers/SpaceTermContextProvider'
import { Skill, Topic } from '@holi/core/screens/userprofile/types'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ArrowRightS } from '@holi/icons/src/generated'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

interface DiscoverSpacesViewProps {
  style?: StyleProp<ViewStyle>
  userTopics: Topic[]
  userSkills: Skill[]
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

const DiscoverSpacesView: React.FC<DiscoverSpacesViewProps> = ({ style, userTopics, userSkills }) => {
  const { t } = useTranslation()
  const { isLoggedIn } = useLoggedInUser()
  const { navigate } = useRouting()
  const { openLoginModal } = useLoginModal()

  const { loadingTopics: loading, topics = [] } = useContext(SpaceTermContext)

  const defaultTopics = useMemo(
    () =>
      getDefaultTopics(
        topics,
        userTopics.map((t) => t.id)
      ),
    [topics, userTopics]
  )

  const handleCreateSpaceButtonPress = useCallback(() => {
    isLoggedIn ? navigate('/spaces/create') : openLoginModal()
  }, [isLoggedIn, navigate, openLoginModal])

  const { height, width } = useWindowDimensions()

  return (
    <View style={style} testID="spaces-container">
      <HoliHeading level="1" size="large" style={styles.headerTitle} testID="discover-spaces-header">
        {t('spaces.discover.welcome')}
      </HoliHeading>
      <HoliText style={styles.headerDescription} testID="discover-spaces-description">
        {t('spaces.discover.description')}
      </HoliText>
      <View style={styles.createSpaceButtonContainer}>
        <HoliButton
          label={t('spaces.discover.create.button')}
          onPress={handleCreateSpaceButtonPress}
          testID="discover-spaces-create-button"
          style={styles.createSpaceButton}
        >
          {t('spaces.discover.create.button')}
        </HoliButton>
      </View>
      <HoliButton
        label={t('spaces.discover.learnMore.button')}
        onPress={() => navigate('/spaces/learn')}
        testID="discover-spaces-learn-more-button"
        transparent
      >
        <View style={styles.compositionImageContainer}>
          <HoliLocalImage
            imageSource={require('@holi/ui/assets/img/spaces/discover_spaces_composition.png')}
            resizeMode="contain"
            width={Platform.OS === 'web' ? width : 324 * 1.15}
            height={Platform.OS === 'web' ? height : 188 * 1.15}
            style={styles.compositionImage}
            label={t('profile.loggedOut.image')}
          />

          <View style={styles.learnMoreDescription}>
            <HoliHeading level="3">Learn what Spaces can do for you</HoliHeading>
            <HoliIcon icon={ArrowRightS} color={colors.foreground30} />
          </View>
        </View>
      </HoliButton>

      <View style={styles.body}>
        {userTopics.map((userTopic, index) => {
          if (index < 2) {
            // render the first two topics without ScrollBasedRender, to avoid an empty list after login
            return (
              <SpacesGroupSlider
                key={index}
                topic={userTopic}
                pageSize={SPACES_GROUP_LIMIT}
                style={styles.spacesGroup}
                testID="discover-topics-slider-user-specific"
              />
            )
          }
          return (
            <ScrollBasedRender key={index}>
              <SpacesGroupSlider
                topic={userTopic}
                pageSize={SPACES_GROUP_LIMIT}
                style={styles.spacesGroup}
                testID="discover-topics-slider-user-specific"
              />
            </ScrollBasedRender>
          )
        })}

        {userSkills.map((userSkill, index) => {
          if (index < 2) {
            // render the first two skills without ScrollBasedRender, to avoid an empty list after login
            return (
              <SpacesGroupSlider
                key={index}
                skill={userSkill}
                pageSize={SPACES_GROUP_LIMIT}
                style={styles.spacesGroup}
                testID="discover-skills-slider-user-specific"
              />
            )
          }
          return (
            <ScrollBasedRender key={index}>
              <SpacesGroupSlider
                skill={userSkill}
                pageSize={SPACES_GROUP_LIMIT}
                style={styles.spacesGroup}
                testID="discover-skills-slider-user-specific"
              />
            </ScrollBasedRender>
          )
        })}

        {loading && <SpacesGroupSliderSkeletons />}

        {!loading && userTopics.length + userSkills.length > 0 && defaultTopics.length > 0 && (
          <HoliText style={styles.othersTitle} testID="discover-spaces-others">
            {t('spaces.discover.others')}
          </HoliText>
        )}

        {!loading &&
          defaultTopics.map((defaultTopic, index) => {
            // render the first two default topics without ScrollBasedRender, to avoid an empty list after login
            if (index < 2) {
              return (
                <SpacesGroupSlider
                  key={index}
                  topic={defaultTopic}
                  pageSize={SPACES_GROUP_LIMIT}
                  style={styles.spacesGroup}
                  testID="discover-topic-slider-others"
                />
              )
            }
            return (
              <ScrollBasedRender key={index}>
                <SpacesGroupSlider
                  topic={defaultTopic}
                  pageSize={SPACES_GROUP_LIMIT}
                  style={styles.spacesGroup}
                  testID="discover-topic-slider-others"
                />
              </ScrollBasedRender>
            )
          })}

        {/* Example how to do location based discovery: */}
        {/*<ScrollBasedRender>*/}
        {/*  <SpacesGroupSlider*/}
        {/*    locationId={DEFAULT_LOCATION_ID}*/}
        {/*    pageSize={SPACES_GROUP_LIMIT}*/}
        {/*    style={styles.spacesGroup}*/}
        {/*    testID="discover-spaces-slider-default-location"*/}
        {/*  />*/}
        {/*</ScrollBasedRender>*/}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  headerTitle: {
    fontWeight: '400',
  },
  headerDescription: {
    marginTop: 8,
    fontWeight: '400',
  },
  body: {
    marginTop: 32,
  },
  spacesGroup: {
    marginBottom: 30,
  },
  othersTitle: {
    marginTop: 18,
    marginBottom: 48,
  },
  createSpaceButtonContainer: {
    marginTop: 8,
    alignSelf: 'flex-start',
    marginBottom: 32,
  },
  createSpaceButton: {
    borderWidth: 1,
  },
  compositionImage: {
    aspectRatio: 324 / 188,
  },
  compositionImageContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: colors.background10,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 24,
    gap: 20,
    borderWidth: 1,
    borderColor: colors.background30,
  },
  learnMoreDescription: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 14,
    alignItems: 'center',
  },
})

export default DiscoverSpacesView
