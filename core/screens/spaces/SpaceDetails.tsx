import { useQuery } from '@apollo/client'
import React, { memo, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import MoreOptionItem from '@holi/core/components/MoreOptionItem'
import MoreOptionsButtonWithModal from '@holi/core/components/MoreOptionsButtonWithModal'
import ReportBlockOptionButton from '@holi/core/components/ReportBlockOptionButton'
import { logError } from '@holi/core/errors/helpers'
import { useScrollYHandler } from '@holi/core/helpers'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParam from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import { ContentType } from '@holi/core/queries'
import SpaceDashboardModal from '@holi/core/screens/spaces/components/SpaceDashboardModal'
import SpaceDetailView from '@holi/core/screens/spaces/components/SpaceDetailView'
import SpaceShare from '@holi/core/screens/spaces/components/SpaceShare'
import { SpaceByIdResponse, spaceByIdQuery } from '@holi/core/screens/spaces/queries'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import type { SpacesScreens } from '@holi/mobile/navigation/SpacesNavigator'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'

export type SpaceDetailsParams = {
  spaceId: string
}

const { useParam } = createParam<SpaceDetailsParams>()

type ScreenProps = NativeStackScreenProps<SpacesScreens>

const SpaceDetails: React.VFC<ScreenProps> = () => {
  const [spaceId] = useParam('spaceId')

  const { t } = useTranslation()
  const onScreenScroll = useScrollYHandler()
  const { navigate } = useRouting()

  const { setOptions } = useUnifiedNavigation()

  const { loading, error, data } = useQuery<SpaceByIdResponse>(spaceByIdQuery, {
    variables: { id: spaceId },
  })

  const space = data?.spaceById

  const isCreator = space?.connectionStatusToMyself?.includes(SpaceConnectionType.CREATOR)
  const isMember = space?.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBER)
  const isAdmin = space?.connectionStatusToMyself?.includes(SpaceConnectionType.ADMINISTRATOR)

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
          {isAdmin && (
            <MoreOptionItem
              icon="edit-2"
              label={t('global.edit')}
              onPress={() => {
                navigate(`/spaces/${spaceId}/edit`)
                hide()
              }}
              contentStyle={styles.editButton}
            />
          )}
          {Platform.OS !== 'web' && <SpaceShare space={space} />}

          <ReportBlockOptionButton
            action="report"
            objectId={spaceId || ''}
            contentType={ContentType.SPACE}
            style={styles.reportButton}
            confirmationModalProps={{
              title: t('spaces.spaceDetails.report.confirmation.title'),
              description: t('spaces.spaceDetails.report.confirmation.description'),
            }}
            successMessage={t('global.report.successMessage')}
            onConfirm={hide}
          />
        </MoreOptionsButtonWithModal>
      ),
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [hide, setOptions, show, t, visible, isAdmin, navigate, spaceId, space])

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
  editButton: {
    display: 'flex',
    justifyContent: 'center',
  },
  reportButton: {
    justifyContent: 'center',
    paddingVertical: 18,
  },
})

export default memo(SpaceDetails)
