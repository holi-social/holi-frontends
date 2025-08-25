import React, { useState } from 'react'
import { ScrollView } from 'react-native'
import Animated, { FadeInUp, runOnJS } from 'react-native-reanimated'

import { ButtonTracked } from '@holi/core/components/Trackable'
import { TrackingEvent } from '@holi/core/tracking'
import type { VolunteeringDetailsScreenData } from '@holi-apps/volunteering/hooks/useVolunteeringDetailsData/transformVolunteeringDetails.shared'
import { useTranslation } from 'react-i18next'
import HoliModal, { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { Stack } from 'holi-bricks/components/stack'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import { VolunteeringContactItem } from '@holi-apps/volunteering/components/VolunteeringContactItem'
import HoliLottie from '@holi/ui/components/atoms/HoliLottie'
import { VolunteeringProgressStepper } from '@holi-apps/volunteering/components/VolunteeringProgressCard/VolunteeringProgressStepper'
import { Text } from 'holi-bricks/components/text'
import {
  FavoritableType,
  Typesense_DocumentContactType,
  VolunteeringOpportunityStatusValue,
} from '@holi/api/graphql/graphql-codegen'
import { SaveForLaterButton } from '@holi/core/components/SaveForLaterButton'
import { useSafeAreaInsets } from '@holi/core/helpers/useSafeAreaInsets'
import { useFeatureFlag } from '@holi/core/featureFlags/hooks/useFeatureFlag'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'

const ANIMATION_DELAY = 500

interface VolunteeringContactProps {
  document: VolunteeringDetailsScreenData
  engagementId: string
  onModalDismiss?: () => void
  isFavorite?: boolean
  onFavoriteCompleted?: () => void
  onFavoriteError?: (error: Error) => void
}

export const VolunteeringContact = ({
  engagementId,
  document,
  onModalDismiss,
  isFavorite,
  onFavoriteCompleted,
  onFavoriteError,
}: VolunteeringContactProps) => {
  const { t } = useTranslation()
  const { bottom } = useSafeAreaInsets()
  const [rewardsPhaseTwoEnabled] = useFeatureFlag(FeatureFlagKey.REWARDS_PHASE_2)

  const [progressStatus, setProgressStatus] = useState<VolunteeringOpportunityStatusValue>(
    VolunteeringOpportunityStatusValue.WontDo
  )
  const { show: showContact, props: contactModalProps } = useModalState({ onDismiss: onModalDismiss })
  const { styles } = useStyles(stylesheet)
  const contactInfoDisplayed = document.contact?.map((contact) => contact.type)

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
        label={t('volunteering.engagementDetail.getInTouchDrawer')}
        onPress={showContact}
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
        <ScrollView contentContainerStyle={{ paddingBottom: bottom }}>
          <HoliContainer>
            <Stack gap="md">
              {rewardsPhaseTwoEnabled && (
                <Stack width="100%">
                  <HoliLottie animType="rocket" loop style={{ aspectRatio: 342 / 130, position: 'relative' }} />
                </Stack>
              )}

              <Animated.View
                entering={
                  rewardsPhaseTwoEnabled
                    ? FadeInUp.delay(ANIMATION_DELAY).withCallback((finished) => {
                        if (finished) runOnJS(setProgressStatus)(VolunteeringOpportunityStatusValue.ToDo)
                      })
                    : undefined
                }
              >
                <Stack gap="md">
                  <Stack gap="3xs">
                    {rewardsPhaseTwoEnabled && (
                      <Stack padding={{ bottom: 'sm', left: 'md', right: 'md' }}>
                        <VolunteeringProgressStepper status={progressStatus} />
                      </Stack>
                    )}

                    <Text size="3xl">{t('volunteer.progress.initiate.modal.title')}</Text>
                    <Text size="md">{t('volunteer.progress.initiate.modal.text')}</Text>
                  </Stack>

                  <Stack gap="4xs" margin={{ bottom: 'lg' }}>
                    {document.contact?.length ? (
                      document.contact?.map((contact, index) => (
                        <VolunteeringContactItem
                          key={contact.value + index}
                          contact={contact}
                          trackingEvent={TrackingEvent.Volunteering.contacted(engagementId, {
                            commitmentType: document.commitmentType,
                            source: document.source,
                            contact_info_displayed: contactInfoDisplayed,
                            contact_method_selected: contact.type,
                          })}
                        />
                      ))
                    ) : (
                      <VolunteeringContactItem
                        contact={
                          document.contact?.find(
                            (contact) => contact.type === Typesense_DocumentContactType.Website
                          ) ?? {
                            type: Typesense_DocumentContactType.Website,
                            value: document.externalUrl ?? '',
                          }
                        }
                        trackingEvent={TrackingEvent.Volunteering.contacted(engagementId, {
                          commitmentType: document.commitmentType,
                          source: document.source,
                          contact_info_displayed: contactInfoDisplayed,
                          contact_method_selected: Typesense_DocumentContactType.Website,
                        })}
                      />
                    )}
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
