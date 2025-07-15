import React from 'react'
import { useTranslation } from 'react-i18next'
import { Alert, Linking, Platform } from 'react-native'

import { Screen } from '@holi/core/components/Screen'
import { Stack } from 'holi-bricks/components/stack'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { white } from 'holi-bricks/foundations'
import { ExternalLink, FileCopy, MailLine, PhoneLine } from '@holi/icons/src/generated'
import HoliWebView from '@holi/core/components/HoliWebView'
import { useTheme } from '@holi/ui/styles/theme'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { ButtonIconTracked, ButtonTracked } from '@holi/core/components/Trackable'
import { TrackingEvent } from '@holi/core/tracking'
import { DetailsScreen } from '@holi/core/layout/DetailsScreen'
import { useVolunteeringDetailsData } from '@holi-apps/volunteering/hooks/useVolunteeringDetailsData'
import { VolunteeringSimilarRecos } from '@holi-apps/volunteering/components/VolunteeringSimilarRecos'
import { Text } from 'holi-bricks/components/text'
import { Button, ButtonIcon } from 'holi-bricks/components/button'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import { Image } from 'holi-bricks/components/image'
import Clipboard from '@react-native-clipboard/clipboard'
import { logError } from '@holi/core/errors/helpers'

const isIos = Platform.OS === 'ios'

export const VolunteeringDetailsScreen = ({ engagementId }: { engagementId: string }) => {
  const { t } = useTranslation()
  const { isLoading, document } = useVolunteeringDetailsData(engagementId)
  const { theme } = useTheme()
  const { show, props: modalProps } = useModalState()
  const modalState = useModalState()
  const { styles } = useStyles(stylesheet)

  const email = 'test.email@gmail.com' // todo: document?.email
  const phoneNumber = '0152' // todo: document?.phonenumber
  const website = document?.externalUrl

  const sendEmail = () => {
    const mailtoUrl = `mailto:${email}`
    Linking.openURL(mailtoUrl).catch((err) => {
      logError(err, 'Error opening mail app on ' + Platform.OS, {
        location: 'VolunteeringDetailsScreen.sendMail',
        email,
      })
    })
  }

  const callNumber = () => {
    const telUrl = `tel:${phoneNumber}`
    Linking.openURL(telUrl).catch((err) => {
      logError(err, 'Error opening phone dialer on ' + Platform.OS, {
        location: 'VolunteeringDetailsScreen.callNumber',
        phoneNumber,
      })
    })
  }

  const openWebsite = () => {
    if (document?.externalUrl) {
      if (Platform.OS === 'web') {
        Linking.openURL(document?.externalUrl)
      } else {
        show()
      }
    }
  }

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
              label="Visit partner’s page" // todo: localazy
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
                {email && (
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
                        {/* localazy */}
                        Email
                      </Text>
                      <Text size="md">{email}</Text>
                    </Stack>
                    {Platform.OS === 'web' ? (
                      <Stack flexShrink={1}>
                        <Button
                          icon={FileCopy}
                          label="Copy"
                          variant="secondary"
                          onPress={() => {
                            Clipboard.setString(email)
                            Alert.alert('Copied', `${email} has been copied to the clipboard.`)
                          }}
                        />
                      </Stack>
                    ) : (
                      <ButtonIcon icon={MailLine} label="email" variant="secondary" onPress={sendEmail} />
                    )}
                  </Stack>
                )}

                {phoneNumber && (
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
                        {/* localazy */}
                        Phone number
                      </Text>
                      <Text size="md">{phoneNumber}</Text>
                    </Stack>
                    {Platform.OS === 'web' ? (
                      <Stack flexShrink={1}>
                        <Button
                          icon={FileCopy}
                          label="Copy"
                          variant="secondary"
                          onPress={() => {
                            Clipboard.setString(phoneNumber)
                            Alert.alert('Copied', `${phoneNumber} has been copied to the clipboard.`)
                          }}
                        />
                      </Stack>
                    ) : (
                      <ButtonIcon icon={PhoneLine} label="phone number" variant="secondary" onPress={callNumber} />
                    )}
                  </Stack>
                )}

                {website && (
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
                        {/* localazy */}
                        Website
                      </Text>
                      <Text size="md">{document?.externalUrl}</Text>
                    </Stack>
                    <ButtonIconTracked
                      trackingEvent={TrackingEvent.Volunteering.pressed(engagementId, {
                        commitmentType: document?.commitmentType,
                        locationType: document?.locationType,
                        source: document?.source,
                      })}
                      variant="secondary"
                      icon={ExternalLink}
                      label={t('volunteering.engagementDetail.getInTouch')}
                      onPress={openWebsite}
                      testID="volunteering-engagement-get-in-touch-btn"
                    />
                  </Stack>
                )}
              </Stack>

              {/* todo: remove unused code */}
              {/* button */}
              {/* {website && (
                <ButtonTracked
                  trackingEvent={TrackingEvent.Volunteering.pressed(engagementId, {
                    commitmentType: document?.commitmentType,
                    locationType: document?.locationType,
                    source: document?.source,
                  })}
                  size="lg"
                  icon={ExternalLink}
                  label={t('volunteering.engagementDetail.getInTouch')}
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
              )}
              {email && !website && (
                <Button label="Write e-mail to the initiator" size="lg" icon={ExternalLink} onPress={sendEmail} />
              )} */}
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
