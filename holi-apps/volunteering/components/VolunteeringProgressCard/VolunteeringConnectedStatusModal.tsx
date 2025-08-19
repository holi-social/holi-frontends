import React, { useState } from 'react'
import Animated, { FadeInUp, runOnJS } from 'react-native-reanimated'

import HoliModal, { type HoliModalProps } from '@holi/ui/components/molecules/HoliModal'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { Stack } from 'holi-bricks/components/stack'
import HoliLottie from '@holi/ui/components/atoms/HoliLottie'
import { VolunteeringProgressStepper } from '@holi-apps/volunteering/components/VolunteeringProgressCard/VolunteeringProgressStepper'
import { useTranslation } from 'react-i18next'
import { Text } from 'holi-bricks/components/text'
import { Button } from 'holi-bricks/components/button'
import SafeArea from '@holi/ui/components/atoms/SafeArea'
import { VolunteeringOpportunityStatusValue } from '@holi/api/graphql/graphql-codegen'

const ANIMATION_DELAY = 3300

export const VolunteeringConnectedStatusModal = (props: HoliModalProps) => {
  const { t } = useTranslation()

  const [volunteeringProgressStatus, setVolunteeringProgressStatus] = useState<VolunteeringOpportunityStatusValue>(
    VolunteeringOpportunityStatusValue.ToDo
  )

  return (
    <HoliModal {...props} label={t('volunteerProgress.connected.modal')}>
      <SafeArea>
        <HoliContainer>
          <Stack gap="md" padding={{ bottom: 'md' }}>
            <Stack width="100%">
              <HoliLottie
                animType="contactedSuccess"
                loop={false}
                style={{ aspectRatio: 342 / 130, position: 'relative' }}
              />
            </Stack>

            <Animated.View
              entering={FadeInUp.delay(ANIMATION_DELAY).withCallback((finished) => {
                if (finished) runOnJS(setVolunteeringProgressStatus)(VolunteeringOpportunityStatusValue.Doing)
              })}
            >
              <Stack gap="3xs" padding={{ bottom: 'md' }}>
                <Stack padding={{ bottom: 'sm', left: 'md', right: 'xs' }}>
                  <VolunteeringProgressStepper status={volunteeringProgressStatus} />
                </Stack>

                <Text size="3xl">{t('volunteer.progress.contactConfirmed.modal.title')}</Text>

                <Text size="md">{t('volunteer.progress.contactConfirmed.modal.text')}</Text>
              </Stack>

              <Stack padding={{ top: 'xxs', bottom: 'xxs' }}>
                <Button label={t('volunteering.progress.button.contactSuccess')} onPress={props.onDismiss} />
              </Stack>
            </Animated.View>
          </Stack>
        </HoliContainer>
      </SafeArea>
    </HoliModal>
  )
}
