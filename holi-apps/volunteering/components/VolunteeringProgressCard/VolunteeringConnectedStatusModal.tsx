import React, { useState } from 'react'
import { ScrollView } from 'react-native'
import Animated, { FadeInUp, runOnJS } from 'react-native-reanimated'

import HoliModal, { type HoliModalProps } from '@holi/ui/components/molecules/HoliModal'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { Stack } from 'holi-bricks/components/stack'
import HoliLottie from '@holi/ui/components/atoms/HoliLottie'
import { VolunteeringProgressStepper } from '@holi-apps/volunteering/components/VolunteeringProgressCard/VolunteeringProgressStepper'
import { useTranslation } from 'react-i18next'
import { Text } from 'holi-bricks/components/text'
import { VolunteeringOpportunityStatusValue } from '@holi/api/graphql/graphql-codegen'
import { useSafeAreaInsets } from '@holi/core/helpers/useSafeAreaInsets'
import { useLottieContainerSize } from '@holi-apps/volunteering/hooks/useLottieContainerSize'
import { ButtonTracked } from '@holi/core/components/Trackable'
import { TrackingEvent } from '@holi/core/tracking'

const ANIMATION_DELAY = 3300
const LOTTIE_ASPECT_RATIO = 342 / 130
const LOTTIE_MAX_HEIGHT = 160

export const VolunteeringConnectedStatusModal = (props: HoliModalProps) => {
  const { t } = useTranslation()
  const { bottom } = useSafeAreaInsets()

  const [volunteeringProgressStatus, setVolunteeringProgressStatus] = useState<VolunteeringOpportunityStatusValue>(
    VolunteeringOpportunityStatusValue.ToDo
  )
  const {
    onLayout: onLayoutLottieContainer,
    height: lottieHeight,
    width: lottieWidth,
  } = useLottieContainerSize({
    aspectRatio: LOTTIE_ASPECT_RATIO,
    maxHeight: LOTTIE_MAX_HEIGHT,
  })

  return (
    <HoliModal {...props} label={t('volunteerProgress.connected.modal')}>
      <ScrollView contentContainerStyle={{ paddingBottom: bottom }}>
        <HoliContainer>
          <Stack gap="md" padding={{ bottom: 'md' }}>
            <Stack width="100%" onLayout={onLayoutLottieContainer} alignItems="center">
              <Stack width={lottieWidth} height={lottieHeight}>
                <HoliLottie
                  animType="contactedSuccess"
                  loop={false}
                  style={{ aspectRatio: LOTTIE_ASPECT_RATIO, position: 'relative' }}
                />
              </Stack>
            </Stack>

            <Animated.View
              entering={FadeInUp.delay(ANIMATION_DELAY).withCallback((finished) => {
                if (finished) runOnJS(setVolunteeringProgressStatus)(VolunteeringOpportunityStatusValue.Doing)
              })}
            >
              <Stack gap="3xs" padding={{ bottom: 'md' }}>
                <Stack padding={{ bottom: 'sm', left: 'md', right: 'md' }}>
                  <VolunteeringProgressStepper status={volunteeringProgressStatus} />
                </Stack>

                <Text size="3xl">{t('volunteer.progress.contactConfirmed.modal.title')}</Text>

                <Text>{t('volunteer.progress.contactConfirmed.modal.text')}</Text>
              </Stack>

              <Stack padding={{ top: 'xxs', bottom: 'xxs' }}>
                <ButtonTracked
                  label={t('volunteering.progress.button.contactSuccess')}
                  onPress={props.onDismiss}
                  trackingEvent={TrackingEvent.Task.CTAButton.letsMoveOn()}
                />
              </Stack>
            </Animated.View>
          </Stack>
        </HoliContainer>
      </ScrollView>
    </HoliModal>
  )
}
