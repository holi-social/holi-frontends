import React from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, Platform } from 'react-native'

import { Screen } from '@holi/core/components/Screen'
import { Stack } from 'holi-bricks/components/stack'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { white } from 'holi-bricks/foundations'
import { ExternalLink, MailLine, PhoneLine } from '@holi/icons/src/generated'
import HoliWebView from '@holi/core/components/HoliWebView'
import { useTheme } from '@holi/ui/styles/theme'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { ButtonTracked } from '@holi/core/components/Trackable'
import { TrackingEvent } from '@holi/core/tracking'
import { DetailsScreen } from '@holi/core/layout/DetailsScreen'
import { useVolunteeringDetailsData } from '@holi-apps/volunteering/hooks/useVolunteeringDetailsData'
import { VolunteeringSimilarRecos } from '@holi-apps/volunteering/components/VolunteeringSimilarRecos'
import { Text } from 'holi-bricks/components/text'
import { ButtonIcon } from 'holi-bricks/components/button'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import { Image } from 'holi-bricks/components/image'

const isIos = Platform.OS === 'ios'

export const VolunteeringDetailsScreen = ({ engagementId }: { engagementId: string }) => {
  const { t } = useTranslation()
  const { isLoading, document } = useVolunteeringDetailsData(engagementId)
  const { theme } = useTheme()
  const { show, props: modalProps } = useModalState()
  const modalState = useModalState()
  const { styles } = useStyles(stylesheet)

  return (
    <Screen
      preset="auto"
      headerOptions={{
        animation: 'slide_from_left',
        headerBackVisible: false,
        headerTitleAlign: 'center',
        ...Platform.select({
          native: {
            headerTintColor: white,
            title: '',
            headerTransparent: true,
          },
        }),
        headerLeft: ({ tintColor }) => <HeaderBackButton tintColor={tintColor} />,
        navigationCustomOptions: {
          footerShown: false,
        },
      }}
      statusBarProps={{ translucent: isIos, barStyle: isIos ? 'light-content' : 'dark-content' }}
      StickyBottomComponent={
        <>
          <Stack
            padding={{ left: 'md', right: 'md', bottom: 'lg' }}
            alignItems="center"
            justifyContent="center"
            alignSelf="center"
            width="100%"
            gap="xxs"
          >
            <ButtonTracked // todo: add tracking event in posthog
              trackingEvent={TrackingEvent.Volunteering.wantToDoIt(engagementId, {
                commitmentType: document?.commitmentType,
                locationType: document?.locationType,
                source: document?.source,
              })}
              label={'I want to do it'} // todo: localazy
              onPress={modalState.show}
              testID="volunteering-engagement-want-to-do-it-btn"
            />
            <ButtonTracked
              trackingEvent={TrackingEvent.Volunteering.pressed(engagementId, {
                commitmentType: document?.commitmentType,
                locationType: document?.locationType,
                source: document?.source,
              })}
              icon={ExternalLink}
              variant="secondary"
              label={t('volunteering.engagementDetail.getInTouch')} // todo: change in localazy to "Visit partner's page"
              onPress={() => {
                if (document?.externalUrl) {
                  if (Platform.OS === 'web') {
                    Linking.openURL(document?.externalUrl)
                  } else {
                    show()
                  }
                }
              }}
              testID="volunteering-engagement-get-in-touch-btn"
            />
          </Stack>
          <HoliModal
            shown={modalState.visible}
            onDismiss={modalState.hide}
            autoHeight
            label="I want to do it"
            backgroundColor={styles.modalBackground.backgroundColor}
          >
            <Stack padding="md" gap="md">
              {/* rocket image */}
              <Stack alignItems="center">
                {/* todo: animate */}
                <Image
                  source={require('@holi/ui/assets/img/volunteering/rocket-animation-loop.svg')}
                  width={0}
                  height={0}
                  alt={'rocket animation'}
                />
              </Stack>

              {/* heading */}
              <Stack gap="3xs">
                {/* todo: localazy */}
                <Text size="3xl">Ready? Let’s go!</Text>
                <Text size="md">
                  Take the first step and reach out to the contact person to exchange on how you can support:
                </Text>
              </Stack>

              {/* contact information */}
              <Stack gap="3xs">
                {/* email */}
                <Stack
                  borderColor="default"
                  borderRadius="xs"
                  borderStyle="solid"
                  borderWidth="sm"
                  padding="xs"
                  direction="row"
                  justifyContent="space-between"
                  gap="xs"
                  backgroundColor="support"
                >
                  <Stack gap="4xs" flexShrink={1}>
                    <Text size="xs" color="support">
                      Email
                    </Text>
                    {/* todo: use contactData from VO */}
                    <Text size="md">fullName.test@gmail.com</Text>
                  </Stack>
                  {/* todo: open email */}
                  <ButtonIcon icon={MailLine} label="email" variant="secondary" />
                </Stack>

                {/* phone number */}
                <Stack
                  borderColor="default"
                  borderRadius="xs"
                  borderStyle="solid"
                  borderWidth="sm"
                  padding="xs"
                  direction="row"
                  justifyContent="space-between"
                  gap="xs"
                  backgroundColor="support"
                >
                  <Stack gap="4xs" flexShrink={1}>
                    <Text size="xs" color="support">
                      Phone number
                    </Text>
                    {/* todo: use contactData from VO */}
                    <Text size="md">+49 123 4567890</Text>
                  </Stack>
                  {/* todo: open phone */}
                  <ButtonIcon icon={PhoneLine} label="email" variant="secondary" />
                </Stack>
              </Stack>
            </Stack>
          </HoliModal>
        </>
      }
      testID="volunteering-detailview-container"
    >
      <DetailsScreen
        loading={isLoading}
        coverImage={document?.coverImage}
        title={document?.title ?? ''}
        infoList={document?.infoList}
        bodyContent={document?.bodyContent}
        author={document?.author}
        chips={document?.chips}
        // TODO Stefano: Move inside the layout and remove _footer prop
        _footer={<VolunteeringSimilarRecos documentId={`volunteering_${engagementId}`} />}
        placeholderImage={document?.placeholderImage}
      />
      {document?.externalUrl && Platform.OS !== 'web' && (
        <HoliModal
          label="modal"
          animationType="slide"
          style={{ width: '100%', height: '100%', flex: 1 }}
          shown={modalProps.shown}
          onDismiss={modalProps.onDismiss}
          testID={'volunteering-external-url-modal'}
        >
          <HoliWebView
            theme={theme}
            style={{ flex: 1, height: '100%', width: '100%' }}
            webViewProps={{ setSupportMultipleWindows: false, source: { uri: document?.externalUrl } }}
          />
        </HoliModal>
      )}
    </Screen>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  modalBackground: {
    backgroundColor: theme.colors.bg.main,
  },
}))
