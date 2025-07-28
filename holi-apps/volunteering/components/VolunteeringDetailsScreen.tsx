import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, Platform } from 'react-native'

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
import { DetailsScreen, type VolunteeringEngagementStatus } from '@holi/core/layout/DetailsScreen'
import { useVolunteeringDetailsData } from '@holi-apps/volunteering/hooks/useVolunteeringDetailsData'
import { VolunteeringSimilarRecos } from '@holi-apps/volunteering/components/VolunteeringSimilarRecos'
import { Text } from 'holi-bricks/components/text'
import { Button, ButtonIcon } from 'holi-bricks/components/button'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import { Image } from 'holi-bricks/components/image'
import { logError } from '@holi/core/errors/helpers'
import { ProgressStepper, type StepStatus } from 'holi-bricks/components/progressStepper/ProgressStepper'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import {
  ProgressCardContact,
  ProgressCardDoing,
  ProgressCardFinished,
} from '@holi-apps/volunteering/components/ProgressCard'
import { ContactConfirmation } from '@holi-apps/volunteering/components/ContactConfirmation'
import { HoliTransition } from '@holi/ui/components/atoms/HoliTransition'

const isIos = Platform.OS === 'ios'

interface Step {
  label: 'plan' | 'contact' | 'do'
  status: StepStatus
}

const stepsPhaseTwo: Step[] = [
  { label: 'plan', status: 'done' },
  { label: 'contact', status: 'active' },
  { label: 'do', status: 'upcoming' },
]

const stepsPhaseThree: Step[] = [
  { label: 'plan', status: 'done' },
  { label: 'contact', status: 'done' },
  { label: 'do', status: 'active' },
]

export const VolunteeringDetailsScreen = ({ engagementId }: { engagementId: string }) => {
  const { t } = useTranslation()
  const { isLoading, document } = useVolunteeringDetailsData(engagementId)
  const { theme } = useTheme()
  const { show, props: modalProps } = useModalState()
  const commitmentModal = useModalState()
  const {
    show: showContactConfirmationModal,
    hide: hideContactConfirmationModal,
    props: contactConfirmationModalProps,
  } = useModalState()
  const { styles } = useStyles(stylesheet)

  const email = 'test.email@gmail.com' // todo: document?.email
  const phoneNumber = '0152' // todo: document?.phonenumber
  const website = document?.externalUrl

  const [status, setStatus] = useState<VolunteeringEngagementStatus | undefined>(undefined)

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
        status == undefined ? (
          <>
            <Stack
              padding={{ left: 'md', right: 'md', bottom: 'lg' }}
              alignItems="center"
              justifyContent="center"
              alignSelf="center"
              width="100%"
              gap="xxs"
            >
              <ButtonTracked
                trackingEvent={TrackingEvent.Volunteering.wantToDoIt(engagementId, {
                  commitmentType: document?.commitmentType,
                  locationType: document?.locationType,
                  source: document?.source,
                })}
                label={'I want to do it'} // todo: localazy
                onPress={commitmentModal.show}
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

            {/* Contact organization modal */}
            <HoliModal
              shown={commitmentModal.visible}
              onDismiss={() => {
                commitmentModal.hide()
                showContactConfirmationModal()
                setStatus('planned')
                // todo: update status in backend
              }}
              autoHeight
              label="I want to do it"
              backgroundColor={styles.modalBackground.backgroundColor}
            >
              <HoliContainer>
                <Stack padding="md" gap="md">
                  <Stack alignItems="center">
                    <Image
                      source={require('@holi/ui/assets/img/volunteering/rocket animation.gif')}
                      width={0}
                      height={0}
                      alt={'rocket animation'}
                    />
                  </Stack>

                  <Stack direction="row" alignSelf="center">
                    {stepsPhaseTwo.map((step, index) => (
                      <ProgressStepper
                        key={index}
                        step={index + 1}
                        status={step.status as StepStatus}
                        hasNextStep={index < stepsPhaseTwo.length - 1}
                      />
                    ))}
                  </Stack>

                  <Stack gap="3xs">
                    {/* todo: localazy */}
                    <Text size="3xl">Ready? Let’s go!</Text>
                    {/* todo: localazy */}
                    <Text size="md">
                      Take the first step and reach out to the contact person to exchange on how you can support:
                    </Text>
                  </Stack>

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
                                navigator.clipboard
                                  .writeText(email)
                                  .then(() => alert('Copied!'))
                                  .catch((err) =>
                                    logError(err, 'Failed to copy', {
                                      location: 'VolunteeringDetailsScreen.sendMail',
                                    })
                                  )
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
                                navigator.clipboard
                                  .writeText(phoneNumber)
                                  .then(() => alert('Copied!'))
                                  .catch((err) =>
                                    logError(err, 'Failed to copy', {
                                      location: 'VolunteeringDetailsScreen.sendMail',
                                    })
                                  )
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
              </HoliContainer>
            </HoliModal>
          </>
        ) : undefined
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
        progressCard={
          <HoliTransition.FadeDownSwitch animKey={status ?? ''}>
            {status === 'planned' && (
              <ProgressCardContact
                steps={stepsPhaseTwo}
                email={email}
                phoneNumber={phoneNumber}
                engagementId={engagementId}
                document={document}
              />
            )}

            {status === 'contacted' && (
              <ProgressCardDoing
                steps={stepsPhaseThree}
                onCommit={() => {
                  setStatus('doing')
                }}
                onCancel={() => {
                  setStatus(undefined)
                }}
              />
            )}

            {status === 'doing' && <ProgressCardFinished />}
          </HoliTransition.FadeDownSwitch>
        }
        status={status}
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

      {/* Contact confirmation modal */}
      <HoliModal
        label="Did you reach out?"
        autoHeight
        {...contactConfirmationModalProps}
        backgroundColor={styles.modalBackground.backgroundColor}
      >
        <ContactConfirmation
          steps={stepsPhaseTwo}
          onCommit={() => {
            setStatus('contacted')
            hideContactConfirmationModal()
          }}
          onCancel={hideContactConfirmationModal}
          trackingEvent={TrackingEvent.Volunteering.reachedOut(engagementId, {
            commitmentType: document?.commitmentType,
            locationType: document?.locationType,
            source: document?.source,
          })}
        />
      </HoliModal>
    </Screen>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  modalBackground: {
    backgroundColor: theme.colors.bg.main,
  },
}))
