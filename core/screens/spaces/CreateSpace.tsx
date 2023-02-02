import React, { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native'

import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import CreateSpaceCoverImage from '@holi/core/screens/spaces/components/CreateSpaceCoverImage'
import CreateSpaceName from '@holi/core/screens/spaces/components/CreateSpaceName'
import CreateSpaceTopics from '@holi/core/screens/spaces/components/CreateSpaceTopics'
import HoliWizard from '@holi/ui/components/organisms/HoliWizard/HoliWizard'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const CreateSpace: React.VFC = () => {
  const { setOptions } = useUnifiedNavigation()
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { height: deviceHeight } = useWindowDimensions()

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

  return (
    <View style={styles.wrapper}>
      <View style={[mixins.container, styles.container, { minHeight: deviceHeight }]}>
        <HoliWizard
          isBackButtonAvailable={true}
          submitButtonLabel={t('spaces.create.space.button')}
          onNextPress={() => handleNextButtonPress()}
          onSubmit={() => handleSubmitButtonPress()}
        >
          <CreateSpaceName />
          <CreateSpaceTopics />
          <CreateSpaceCoverImage />
        </HoliWizard>
      </View>
    </View>
  )
}

export default CreateSpace

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', display: 'flex', flex: 1, backgroundColor: colors.backgroundColorGreyLight },
  container: {
    paddingBottom: 132,
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
