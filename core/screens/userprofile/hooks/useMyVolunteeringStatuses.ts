import { useTranslation } from 'react-i18next'
import { CheckmarkGreen, ProgressIndicator1Of3, ProgressIndicator2Of3 } from '@holi/icons/src/generated'
import { VolunteeringOpportunityStatusValue } from '@holi/api/graphql/graphql-codegen'
import type { ChipLabelProps } from 'holi-bricks/components/chips/ChipLabel'

export type MyVolunteeringStatusConfig = {
  name: string
  description: string
  chip: ChipLabelProps
}

export type MyVolunteeringStatuses = {
  volunteeringStatuses: MyVolunteeringStatusConfig[]
  getVolunteeringStatus: (status: VolunteeringOpportunityStatusValue) => MyVolunteeringStatusConfig | undefined
}

export const useMyVolunteeringStatuses = (): MyVolunteeringStatuses => {
  const { t } = useTranslation()
  const getStatusConfig = (status: VolunteeringOpportunityStatusValue): MyVolunteeringStatusConfig | undefined => {
    switch (status) {
      case VolunteeringOpportunityStatusValue.ToDo:
        return {
          description: t('profile.myVolunteer.modal.description.planned'),
          name: t('status.planned'),
          chip: {
            color: 'blue',
            size: 'md',
            iconLeading: ProgressIndicator1Of3,
            children: t('status.planned'),
          } as ChipLabelProps,
        }
      case VolunteeringOpportunityStatusValue.Contacted:
        return {
          name: t('status.connected'),
          description: t('profile.myVolunteer.modal.description.connected'),
          chip: {
            color: 'yellow',
            size: 'md',
            iconLeading: ProgressIndicator2Of3,
            children: t('status.connected'),
          },
        }
      case VolunteeringOpportunityStatusValue.Doing:
        return {
          description: t('profile.myVolunteer.modal.description.helping'),
          name: t('status.help'),
          chip: {
            color: 'green',
            size: 'md',
            iconLeading: CheckmarkGreen,
            children: t('status.help'),
          },
        }
      default:
        return undefined
    }
  }

  return {
    volunteeringStatuses: [
      VolunteeringOpportunityStatusValue.ToDo,
      VolunteeringOpportunityStatusValue.Contacted,
      VolunteeringOpportunityStatusValue.Doing,
    ].map(getStatusConfig) as MyVolunteeringStatusConfig[],
    getVolunteeringStatus: (status: VolunteeringOpportunityStatusValue): MyVolunteeringStatusConfig | undefined => {
      if (!Object.values(VolunteeringOpportunityStatusValue).includes(status)) {
        return undefined
      }
      return getStatusConfig(status)
    },
  }
}
