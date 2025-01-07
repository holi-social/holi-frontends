import type React from 'react'
import { useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import ScrollBasedRender from '@holi/core/components/ScrollBasedRender'
import type { Skill, Topic } from '@holi/core/domain/shared/types'
import { useClientWindowDimensions } from '@holi/core/helpers/useClientWindowDimensions'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import SpacesGroupSlider from '@holi/core/screens/spaces/discover/components/SpacesGroupSlider'
import { getDefaultTopics } from '@holi/core/screens/spaces/helpers/defaultFilters'
import { SpaceTermContext } from '@holi/core/screens/spaces/providers/SpaceTermContextProvider'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { ArrowRightS } from '@holi/icons/src/generated'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { dimensions } from '@holi/ui/styles/globalVars'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import useAuthRequiredNavigation from '@holi/core/navigation/hooks/useAuthRequiredNavigation'

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
  const { t } = useTranslation()
  const { isLoggedIn } = useLoggedInUser()
  const { navigate } = useRouting()
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])
  const { width: screenWidth } = useClientWindowDimensions()
  const { navigateWithAuth } = useAuthRequiredNavigation()

  const { topics = [] } = useContext(SpaceTermContext)

  const defaultTopics = useMemo(
    () =>
      getDefaultTopics(
        topics,
        userTopics.map((t) => t.id)
      ),
    [topics, userTopics]
  )

  const aspectRatio = 188 / 324

  return (
    <View testID="spaces-container">
      <HoliGap />
      <HoliHeading level="2" size="l" testID="discover-spaces-header">
        {t('spaces.discover.welcome')}
      </HoliHeading>
      <HoliText style={styles.headerDescription} testID="discover-spaces-description">
        {t('spaces.discover.description')}
      </HoliText>
      <View style={styles.createSpaceButtonContainer}>
        <HoliButton
          label={t('spaces.discover.create.button')}
          onPress={() =>
            navigateWithAuth('/spaces/create', {
              description: t('spaces.create.loginRedirect.text'),
              trackTrigger: 'CREATE_SPACE',
            })
          }
          testID="discover-spaces-create-button"
          style={styles.createSpaceButton}
        >
          {t('spaces.discover.create.button')}
        </HoliButton>
      </View>
      <HoliButton
        label={t('spaces.about.banner.button.title')}
        onPress={() => navigate('/about-spaces/')}
        testID="discover-spaces-about-button"
        transparent
      >
        <View
          style={
            screenWidth > dimensions.breakpointS ? styles.compositionImageContainerL : styles.compositionImageContainer
          }
        >
          <HoliLocalImage
            imageSource={require('@holi/ui/assets/img/spaces/discover_spaces_composition.png')}
            resizeMode="contain"
            width={Platform.OS === 'web' && screenWidth < dimensions.breakpointM ? screenWidth : 324}
            height={Platform.OS === 'web' && screenWidth < dimensions.breakpointM ? aspectRatio * screenWidth : 188}
            style={styles.compositionImage}
            label=""
          />
          <View style={styles.learnMoreDescriptionContainer}>
            {screenWidth > dimensions.breakpointS && (
              <>
                <HoliHeading level="2">{t('spaces.about.banner.title')}</HoliHeading>
                <HoliText style={{ color: colors.foreground20, lineHeight: 23.68 }}>
                  {t('spaces.about.banner.description')}
                </HoliText>
              </>
            )}
            <View
              style={screenWidth > dimensions.breakpointS ? styles.learnMoreDescription : styles.learnMoreDescriptionS}
            >
              <HoliText bold style={{ paddingRight: 8 }}>
                {t('spaces.about.banner.button.title')}
              </HoliText>
              <HoliIcon icon={ArrowRightS} color={colors.foreground30} />
            </View>
          </View>
        </View>
      </HoliButton>

      <View style={styles.body}>
        {isLoggedIn && userGeolocationId && (
          <ScrollBasedRender>
            <SpacesGroupSlider
              locationId={userGeolocationId}
              pageSize={SPACES_GROUP_LIMIT}
              style={styles.spacesGroup}
              testID="discover-spaces-slider-default-location"
            />
          </ScrollBasedRender>
        )}

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

        {!topics.length && <SpacesGroupSliderSkeletons />}

        {userTopics.length + userSkills.length > 0 && defaultTopics.length > 0 && (
          <HoliText style={styles.othersTitle} testID="discover-spaces-others">
            {t('spaces.discover.others')}
          </HoliText>
        )}

        {defaultTopics.map((defaultTopic, index) => {
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
      </View>
    </View>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    headerDescription: {
      paddingVertical: 12,
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
      flex: 1,
      alignSelf: 'center',
    },
    compositionImageContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignContent: 'center',
      alignSelf: 'stretch',
      backgroundColor: theme.colors.background10,
      borderRadius: 16,
      paddingHorizontal: 10,
      paddingVertical: 24,
      gap: 20,
      borderWidth: 1,
      borderColor: theme.colors.background30,
    },
    compositionImageContainerL: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'stretch',
      backgroundColor: theme.colors.background10,
      borderRadius: 16,
      paddingHorizontal: 14,
      paddingVertical: 24,
      gap: 32,
      borderWidth: 1,
      borderColor: theme.colors.background30,
    },
    learnMoreDescription: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    learnMoreDescriptionS: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    learnMoreDescriptionContainer: {
      flex: 1,
      paddingHorizontal: 14,
      gap: 16,
    },
  })

export default DiscoverSpacesView
