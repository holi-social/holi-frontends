import { useQuery } from '@apollo/client'
import React, { memo, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StatusBar, StyleSheet } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import MoreOptionsButtonWithModal from '@holi/core/components/MoreOptionsButtonWithModal'
import ReportBlockOptionButton from '@holi/core/components/ReportBlockOptionButton'
import { logError } from '@holi/core/errors/helpers'
import { useScrollYHandler } from '@holi/core/helpers'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParam from '@holi/core/navigation/hooks/useParam'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import { ContentType } from '@holi/core/queries'
import SpaceDashboardModal from '@holi/core/screens/spaces/components/SpaceDashboardModal'
import SpaceDetailView from '@holi/core/screens/spaces/components/SpaceDetailView'
import { SpaceByIdResponse, spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import type { BottomTabsScreens } from '@holi/mobile/navigation/RootNavigator'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'

export type SpaceDetailsParams = {
  spaceId: string
}

const { useParam } = createParam<SpaceDetailsParams>()

type ScreenProps = NativeStackScreenProps<BottomTabsScreens>

const SpaceDetails: React.VFC<ScreenProps> = () => {
  const [spaceId] = useParam('spaceId')

  const { t } = useTranslation()
  const onScreenScroll = useScrollYHandler()

  const { setOptions } = useUnifiedNavigation()

  const { loading, error, data } = useQuery<SpaceByIdResponse>(spaceByIdQuery, {
    variables: { id: spaceId },
  })

  const space = data?.spaceById

  const isCreator = space?.connectionStatusToMyself?.includes(SpaceConnectionType.CREATOR)
  const isMember = space?.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBER)

  const { visible, show, hide } = useModalState()

  useLayoutEffect(() => {
    setOptions({
      animation: 'slide_from_bottom',
      headerTransparent: true,
      headerStyle: { backgroundColor: 'transparent' },
      headerTitle: () => null,
      headerLeft: () =>
        Platform.OS === 'web' ? <HeaderBackButton icon="arrow-left" /> : <HeaderBackButton icon="arrow-down-s" />,
      headerRight: ({ tintColor }) => (
        <MoreOptionsButtonWithModal
          label={t('insights.post.preview.more')}
          showOptions={visible}
          onPress={show}
          onModalDismiss={hide}
          tintColor={tintColor}
        >
          <ReportBlockOptionButton
            action="report"
            objectId={space?.id || ''}
            contentType={ContentType.SPACE}
            style={styles.moreOptionItem}
            confirmationModalProps={{
              title: t('spaces.spaceDetails.report.confirmation.title'),
              description: t('spaces.spaceDetails.report.confirmation.description'),
            }}
            onConfirm={hide}
          />
        </MoreOptionsButtonWithModal>
      ),
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [hide, setOptions, show, space?.id, t, visible])

  if (error) {
    logError(error, `[SpaceDetails.tsx] ${error.message}`)
  }

  // Error and loading states are handled the same way and just hide the component
  if (loading || error) {
    return <></>
  }

  if (!space) return <HoliText>{t('spaces.spaceDetails.notFound', { spaceId })}</HoliText>

  return (
    <>
      <DefaultLayout
        onScroll={onScreenScroll}
        scrollEventThrottle={200}
        style={styles.defaultLayout}
        contentStyle={styles.contentStyle}
      >
        <SpaceDetailView style={styles.spaceDetailView} space={space} />
      </DefaultLayout>
      {(isCreator || isMember) && <SpaceDashboardModal />}
    </>
  )
}

const styles = StyleSheet.create({
  defaultLayout: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 8,
    paddingBottom: 0,
    ...Platform.select({
      web: {
        minHeight: '100vh',
      },
    }),
  },
  contentStyle: {
    paddingBottom: 0,
    ...Platform.select({
      web: {
        minHeight: '100vh',
      },
    }),
  },
  spaceDetailView: {
    flex: 1,
    paddingTop: 0,
    ...Platform.select({
      web: {
        paddingTop: 12,
      },
    }),
  },
  moreOptionItem: {
    justifyContent: 'center',
    paddingVertical: 18,
  },
})

export default memo(SpaceDetails)
