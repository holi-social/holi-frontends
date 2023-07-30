import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import ScrollBasedRender from '@holi/core/components/ScrollBasedRender'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useLoginModal } from '@holi/core/provider/LoginModalProvider'
import SpacesGroupSlider from '@holi/core/screens/spaces/discover/components/SpacesGroupSlider'
import { DiscoverSpacesGroup } from '@holi/core/screens/spaces/discover/queries'
import { Skill, Topic, User } from '@holi/core/screens/userprofile/types'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

interface DiscoverSpacesViewProps {
  loading?: boolean
  user?: User
  style?: StyleProp<ViewStyle>
  spacesGroupLimit: number
  userSpecificSpacesGroups: DiscoverSpacesGroup[]
  defaultSpacesGroups: DiscoverSpacesGroup[]
  userTopics: Topic[]
  userSkills: Skill[]
  defaultTopics: Topic[]
}

const SpacesGroupSliderSkeletons: React.FC = () => {
  return (
    <View testID={'spaces-group-slider-skeletons'}>
      {new Array(3).fill(1).map((_, idx) => {
        return <SpacesGroupSlider key={idx} loading={true} />
      })}
    </View>
  )
}

const SPACES_SLIDER_HEIGHT_ESTIMATE = Platform.OS == 'web' ? 355 : 400

const DiscoverSpacesView: React.FC<DiscoverSpacesViewProps> = ({
  loading = false,
  style,
  spacesGroupLimit,
  userTopics,
  userSkills,
  defaultTopics,
}) => {
  const { t } = useTranslation()
  const { isLoggedIn } = useLoggedInUser()
  const { navigate } = useRouting()
  const { openLoginModal } = useLoginModal()

  const handleCreateSpaceButtonPress = useCallback(() => {
    isLoggedIn ? navigate('/spaces/create') : openLoginModal()
  }, [isLoggedIn, navigate, openLoginModal])

  return (
    <View style={style} testID="spaces-container">
      <HoliHeading level="1" size="large" style={styles.headerTitle} testID="discover-spaces-header">
        {t('spaces.discover.welcome')}
      </HoliHeading>
      <HoliText style={styles.headerDescription} testID="discover-spaces-description">
        {t('spaces.discover.description')}
      </HoliText>
      <View style={styles.createSpaceButtonContainer}>
        <HoliButton label={t('spaces.discover.create.button')} onPress={handleCreateSpaceButtonPress}>
          {t('spaces.discover.create.button')}
        </HoliButton>
      </View>

      <View style={styles.body}>
        {loading && <SpacesGroupSliderSkeletons />}

        {!loading &&
          userTopics.map((userTopic, index) => (
            <ScrollBasedRender key={index} placeholderHeight={SPACES_SLIDER_HEIGHT_ESTIMATE}>
              <SpacesGroupSlider
                topic={userTopic}
                pageSize={spacesGroupLimit}
                style={styles.spacesGroup}
                testID="discover-spaces-slider-user-specific"
              />
            </ScrollBasedRender>
          ))}

        {!loading &&
          userSkills.map((userSkill, index) => (
            <ScrollBasedRender key={index} placeholderHeight={SPACES_SLIDER_HEIGHT_ESTIMATE}>
              <SpacesGroupSlider
                skill={userSkill}
                pageSize={spacesGroupLimit}
                style={styles.spacesGroup}
                testID="discover-spaces-slider-user-specific"
              />
            </ScrollBasedRender>
          ))}

        {!loading && userTopics.length + userSkills.length > 0 && defaultTopics.length > 0 && (
          <HoliText style={styles.othersTitle} testID="discover-spaces-others">
            {t('spaces.discover.others')}
          </HoliText>
        )}

        {!loading &&
          defaultTopics.map((defaultTopic, index) => (
            <ScrollBasedRender key={index} placeholderHeight={SPACES_SLIDER_HEIGHT_ESTIMATE}>
              <SpacesGroupSlider
                topic={defaultTopic}
                pageSize={spacesGroupLimit}
                style={styles.spacesGroup}
                testID="discover-spaces-slider-others"
              />
            </ScrollBasedRender>
          ))}

        {/* TODO Cleanup */}
        {/*/!* User specific spaces suggestions *!/*/}
        {/*{!loading &&*/}
        {/*  userSpecificSpacesGroups.map((group, index) => (*/}
        {/*    <SpacesGroupSlider*/}
        {/*      key={index}*/}
        {/*      group={group}*/}
        {/*      pageSize={spacesGroupLimit}*/}
        {/*      style={styles.spacesGroup}*/}
        {/*      testID="discover-spaces-slider-user-specific"*/}
        {/*    />*/}
        {/*  ))}*/}

        {/*{!loading && hasUserSpecificTiers && hasDefaultTiers && (*/}
        {/*  <HoliText style={styles.othersTitle} testID="discover-spaces-others">*/}
        {/*    {t('spaces.discover.others')}*/}
        {/*  </HoliText>*/}
        {/*)}*/}

        {/*/!* Default spaces suggestions *!/*/}
        {/*{!loading &&*/}
        {/*  defaultSpacesGroups.map((group, index) => (*/}
        {/*    <SpacesGroupSlider*/}
        {/*      key={index}*/}
        {/*      group={group}*/}
        {/*      pageSize={spacesGroupLimit}*/}
        {/*      style={styles.spacesGroup}*/}
        {/*      testID="discover-spaces-slider-others"*/}
        {/*    />*/}
        {/*  ))}*/}
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
    marginTop: 37,
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
  },
})

export default DiscoverSpacesView
