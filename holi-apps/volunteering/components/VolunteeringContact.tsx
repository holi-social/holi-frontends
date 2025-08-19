import React, { useCallback, useState } from 'react'
import { ScrollView } from 'react-native'
import Animated, { FadeInUp, runOnJS } from 'react-native-reanimated'

import { ButtonTracked } from '@holi/core/components/Trackable'
import { TrackingEvent } from '@holi/core/tracking'
import type { VolunteeringDetailsScreenData } from '@holi-apps/volunteering/hooks/useVolunteeringDetailsData/transformVolunteeringDetails.shared'
import { ExternalLink } from '@holi/icons/src/generated'
import { useTranslation } from 'react-i18next'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { Stack } from 'holi-bricks/components/stack'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import { VolunteeringContactItem } from '@holi-apps/volunteering/components/VolunteeringContactItem'
import HoliLottie from '@holi/ui/components/atoms/HoliLottie'
import { VolunteeringProgressStepper } from '@holi-apps/volunteering/components/VolunteeringProgressCard/VolunteeringProgressStepper'
import { Text } from 'holi-bricks/components/text'
import { FavoritableType, VolunteeringOpportunityStatusValue } from '@holi/api/graphql/graphql-codegen'
import { SaveForLaterButton } from '@holi/core/components/SaveForLaterButton'

const ANIMATION_DELAY = 500

interface VolunteeringContactProps {
  document: VolunteeringDetailsScreenData
  engagementId: string
  onOpenLink: (url?: string) => void
  onModalDismiss?: () => void
  isFavorite?: boolean
  onFavoriteCompleted?: () => void
  onFavoriteError?: (error: Error) => void
}

export const VolunteeringContact = ({
  engagementId,
  document,
  onOpenLink,
  onModalDismiss,
  isFavorite,
  onFavoriteCompleted,
  onFavoriteError,
}: VolunteeringContactProps) => {
  const { t } = useTranslation()

  const [progressStatus, setProgressStatus] = useState<VolunteeringOpportunityStatusValue>(
    VolunteeringOpportunityStatusValue.WontDo
  )
  const {
    show: showContact,
    hide: hideContact,
    props: contactModalProps,
  } = useModalState({ onDismiss: onModalDismiss })
  const hasContactInfo = document.contact?.some(
    (contact) => contact.type !== 'website' || contact.value !== document.externalUrl
  )
  const { styles } = useStyles(stylesheet)
  const contactInfoDisplayed = document.contact?.map((contact) => contact.type)

  const onGetInTouch = useCallback(() => {
    if (hasContactInfo) {
      return showContact()
    }
    onOpenLink(document.externalUrl)
  }, [document.externalUrl, hasContactInfo, onOpenLink, showContact])

  return (
    <Stack
      padding={{ left: 'md', right: 'md', bottom: 'lg' }}
      alignItems="center"
      justifyContent="center"
      alignSelf="center"
      width="100%"
      gap="xxs"
    >
      <ButtonTracked
        trackingEvent={TrackingEvent.Volunteering.pressed(engagementId, {
          commitmentType: document.commitmentType,
          locationType: document.locationType,
          source: document.source,
          contact_info_displayed: contactInfoDisplayed,
        })}
        icon={hasContactInfo ? undefined : ExternalLink}
        label={
          hasContactInfo
            ? t('volunteering.engagementDetail.getInTouchDrawer')
            : t('volunteering.engagementDetail.getInTouch')
        }
        onPress={onGetInTouch}
        testID="volunteering-engagement-get-in-touch-btn"
      />

      <SaveForLaterButton
        favoritableId={engagementId}
        favoritableType={FavoritableType.ExternalVolunteeringOpportunity}
        __typename={'Typesense_Document'}
        isFavorite={isFavorite}
        onCompleted={onFavoriteCompleted}
        onError={onFavoriteError}
      />

      <HoliModal
        label="modal"
        animationType="slide"
        shown={contactModalProps.shown}
        onDismiss={contactModalProps.onDismiss}
        autoHeight={true}
        testID="volunteering-contact-modal"
        backgroundColor={styles.modal.backgroundColor}
      >
        <ScrollView>
          <HoliContainer>
            <Stack gap="md">
              <Stack width="100%">
                <HoliLottie animType="rocket" loop style={{ aspectRatio: 342 / 130, position: 'relative' }} />
              </Stack>

              <Animated.View
                entering={FadeInUp.delay(ANIMATION_DELAY).withCallback((finished) => {
                  if (finished) runOnJS(setProgressStatus)(VolunteeringOpportunityStatusValue.ToDo)
                })}
              >
                <Stack gap="md">
                  <Stack gap="3xs">
                    <Stack padding={{ bottom: 'sm', left: 'md', right: 'xs' }}>
                      <VolunteeringProgressStepper status={progressStatus} />
                    </Stack>

                    <Text size="3xl">{t('volunteer.progress.initiate.modal.title')}</Text>
                    <Text size="md">{t('volunteer.progress.initiate.modal.text')}</Text>
                  </Stack>

                  <Stack gap="4xs" margin={{ bottom: 'lg' }}>
                    {document.contact?.map((contact, index) => (
                      <VolunteeringContactItem
                        key={contact.value + index}
                        contact={contact}
                        trackingEvent={TrackingEvent.Volunteering.contacted(engagementId, {
                          commitmentType: document.commitmentType,
                          source: document.source,
                          contact_info_displayed: contactInfoDisplayed,
                          contact_method_selected: contact.type,
                        })}
                        onWebViewOpen={hideContact}
                      />
                    ))}
                  </Stack>
                </Stack>
              </Animated.View>
            </Stack>
          </HoliContainer>
        </ScrollView>
      </HoliModal>
    </Stack>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  modal: {
    backgroundColor: theme.colors.bg.main,
  },
}))
