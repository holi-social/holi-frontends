import React from 'react'
import { useTranslation } from 'react-i18next'

import { Stack } from 'holi-bricks/components/stack'
import { ProgressStepper, type ProgressStepperStep } from 'holi-bricks/components/progressStepper/ProgressStepper'
import { VolunteeringOpportunityStatusValue } from '@holi/api/graphql/graphql-codegen'
import { GoodDeedsIcon, GoodDeedsIconFilled } from '@holi/icons/src/generated'
export interface VolunteeringProgressStepperProps {
  status?: VolunteeringOpportunityStatusValue
}

export const VolunteeringProgressStepper = ({
  status = VolunteeringOpportunityStatusValue.ToDo,
}: VolunteeringProgressStepperProps) => {
  const { t } = useTranslation()

  const volunteeringProgressSteps: ProgressStepperStep<VolunteeringOpportunityStatusValue>[] = [
    {
      key: VolunteeringOpportunityStatusValue.WontDo,
      label: t('volunteer.progress.progressBar.plan'),
    },
    {
      key: VolunteeringOpportunityStatusValue.ToDo,
      label: t('volunteer.progress.progressBar.connect'),
    },
    {
      key: VolunteeringOpportunityStatusValue.Contacted,
      label: t('volunteer.progress.progressBar.act'),
      icon: {
        inactive: GoodDeedsIcon,
        active: GoodDeedsIconFilled,
      },
    },
  ]

  return (
    <Stack
      direction="row"
      alignSelf="center"
      width="100%"
      aria-label={
        status === VolunteeringOpportunityStatusValue.Contacted
          ? t('volunteer.progress.progressBar.connectActive.ariaLabel')
          : status === VolunteeringOpportunityStatusValue.Doing
            ? t('volunteer.progress.progressBar.actActive.ariaLabel')
            : undefined
      }
    >
      <ProgressStepper
        steps={volunteeringProgressSteps}
        activeStepKey={
          status !== VolunteeringOpportunityStatusValue.Doing ? status : VolunteeringOpportunityStatusValue.Contacted
        }
      />
    </Stack>
  )
}
