import { useLazyQuery } from '@apollo/client'
import React, { memo } from 'react'
import { Platform, StyleSheet, Text, View, useWindowDimensions } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import { useScrollYHandler } from '@holi/core/helpers'
import type { BottomTabsScreens } from '@holi/mobile/navigation/RootNavigator'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import { AppDonationsProjectByIdResponse, projectByIdQuery } from '@holi-apps/donations/queries'

export type VolunteeringEngagementDetailParams = {
  projectId: string
}

type VolunteeringEngagementDetailProps = NativeStackScreenProps<BottomTabsScreens>

const VolunteeringEngagementDetail: React.VFC<VolunteeringEngagementDetailProps> = () => {
  //   const [projectId] = useParam('projectId')
  //   const { t } = useTranslation()
  //   const { setOptions } = useUnifiedNavigation()
  const onScreenScroll = useScrollYHandler()
  //   useLayoutEffect(() => setOptions({ title: t('donations:app.name') }), [setOptions, t])

  const mixins = useStyleMixins()

  const { height: deviceHeight } = useWindowDimensions()

  const [fetchProjectById, { loading, data, error }] = useLazyQuery<AppDonationsProjectByIdResponse>(projectByIdQuery)
  console.log('loading data error ', loading, data, error, fetchProjectById)

  return (
    <View style={{ alignItems: 'center', flex: 1, backgroundColor: colors.backgroundColorGreyLight }}>
      <DefaultLayout
        onScroll={onScreenScroll}
        scrollEventThrottle={200}
        style={{ backgroundColor: colors.backgroundColorGreyLight }}
      >
        <View style={[mixins.container, styles.container, { minHeight: deviceHeight }]}>
          <Text>volunteering</Text>
        </View>
      </DefaultLayout>
    </View>
  )
}

export default memo(VolunteeringEngagementDetail)

const styles = StyleSheet.create({
  messageContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  container: {
    paddingBottom: 132,
    paddingHorizontal: 0,
    ...Platform.select({
      native: {
        maxWidth: '100%',
      },
    }),
  },
})
