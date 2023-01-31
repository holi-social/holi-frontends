import React, { useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, SafeAreaView, StyleSheet, View } from 'react-native'

import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import CreateSpaceCoverImage from '@holi/core/screens/spaces/components/CreateSpaceCoverImage'
import CreateSpaceName from '@holi/core/screens/spaces/components/CreateSpaceName'
import CreateSpaceTopics from '@holi/core/screens/spaces/components/CreateSpaceTopics'
import HoliWizard from '@holi/ui/components/molecules/HoliWizard'
import { colors, vars } from '@holi/ui/styles/globalVars'

const CreateSpace: React.VFC = () => {
  const { setOptions } = useUnifiedNavigation()
  const { t } = useTranslation()
  const [isNextButtonEnabled, setIsNextButtonEnabled] = useState<boolean>(false)

  useLayoutEffect(
    () =>
      setOptions({
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

  const handleNextButtonStatus = (isButtonEnable: boolean) => {
    setIsNextButtonEnabled(isButtonEnable)
  }

  const handleNextButtonPress = () => {
    console.log('handle Next Button Press')
  }

  const handleSubmitButtonPress = () => {
    console.log('handle Submit Button Press')
  }

  return (
    <SafeAreaView style={styles.contentWrapper}>
      <View style={styles.container}>
        <HoliWizard
          isNextButtonDisabled={!isNextButtonEnabled}
          isBackButtonAvailable={true}
          buttonLabel={t('spaces.create.space.button')}
          onNextPress={() => handleNextButtonPress()}
          onSubmit={() => handleSubmitButtonPress()}
        >
          <CreateSpaceName key={0} onChangeNextButtonStatus={(buttonStatus) => handleNextButtonStatus(buttonStatus)} />
          <CreateSpaceTopics
            key={1}
            onChangeNextButtonStatus={(buttonStatus) => handleNextButtonStatus(buttonStatus)}
          />
          <CreateSpaceCoverImage
            key={2}
            onChangeNextButtonStatus={(buttonStatus) => handleNextButtonStatus(buttonStatus)}
          />
        </HoliWizard>
      </View>
    </SafeAreaView>
  )
}

export default CreateSpace

const styles = StyleSheet.create({
  contentWrapper: {
    height: '100%',
    ...Platform.select({
      web: {
        minHeight: '100vh',
      },
    }),
    backgroundColor: colors.backgroundColorGreyLight,
  },
  container: {
    top: vars.topBarHeight,
    paddingBottom: 0,
  },
})
