import React, { useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import DefaultLayout from '@holi/core/DefaultLayout'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import CreateSpaceCoverImage from '@holi/core/screens/spaces/components/CreateSpaceCoverImage'
import CreateSpaceName from '@holi/core/screens/spaces/components/CreateSpaceName'
import CreateSpaceTopics from '@holi/core/screens/spaces/components/CreateSpaceTopics'
import SpaceTermContextProvider from '@holi/core/screens/spaces/components/SpaceTermContextProvider'
import { Topic } from '@holi/core/screens/userprofile/types'
import HoliWizard from '@holi/ui/components/organisms/HoliWizard/HoliWizard'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const CreateSpace: React.VFC = () => {
  const { setOptions } = useUnifiedNavigation()
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const [spaceName, setSpaceName] = useState<string>('')
  const [spaceGoal, setSpaceGoal] = useState<string>('')
  const [spaceTopics, setSpaceTopics] = useState<Topic[]>([])

  useLayoutEffect(
    () =>
      setOptions({
        animation: 'slide_from_bottom',
        title: t('spaces.create.space.title'),
        headerStyle: { backgroundColor: colors.backgroundColorGreyLight },
        headerTransparent: true,
        headerLeft: () => <HeaderBackButton icon="close" />,
        navigationCustomOptions: {
          footerShown: false,
        },
      }),
    [setOptions, t]
  )

  const handleNextButtonPress = () => {
    console.log('handle Next Button Press')
  }

  const handleSubmitButtonPress = () => {
    console.log('handle Submit Button Press')
  }

  const handleSpaceNameChange = (value: string) => {
    setSpaceName(value)
  }
  const handleSpaceGoalChange = (value: string) => {
    setSpaceGoal(value)
  }

  const handleSpaceTopicsSelection = (topics: Topic[]) => {
    setSpaceTopics(topics)
    console.log(spaceTopics.length)
  }

  return (
    <SpaceTermContextProvider>
      <View style={styles.wrapper}>
        <DefaultLayout style={styles.defaultLayout} scrollView={false} headerOverlap>
          <View style={[mixins.container, styles.container]}>
            <HoliWizard
              isBackButtonAvailable={true}
              submitButtonLabel={t('spaces.create.space.button')}
              onNextPress={() => handleNextButtonPress()}
              onSubmit={() => handleSubmitButtonPress()}
            >
              <CreateSpaceName
                onChangeSpaceName={(value: string) => {
                  handleSpaceNameChange(value)
                }}
                onChangeSpaceGoal={(value: string) => {
                  handleSpaceGoalChange(value)
                }}
                spaceName={spaceName}
                spaceGoal={spaceGoal}
              />
              <CreateSpaceTopics onSelectSpaceTopics={handleSpaceTopicsSelection} selectedTopics={spaceTopics} />
              <CreateSpaceCoverImage />
            </HoliWizard>
          </View>
        </DefaultLayout>
      </View>
    </SpaceTermContextProvider>
  )
}

export default CreateSpace

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', flex: 1, backgroundColor: colors.backgroundColorGreyLight },
  defaultLayout: {
    backgroundColor: colors.backgroundColorGreyLight,
    paddingBottom: 0,
    width: '100%',
    minHeight: Platform.OS === 'web' ? '100vh' : '100%',
  },
  container: {
    paddingBottom: 132,
    flex: 1,
    paddingTop: Platform.OS === 'web' ? 0 : vars.topBarHeight,
    width: '100%',
    paddingHorizontal: 0,
    ...Platform.select({
      native: {
        maxWidth: '100%',
      },
    }),
  },
})
