import { useTranslation } from 'react-i18next'
import { CheckmarkGreen, ProgressIndicator1Of3 } from '@holi/icons/src/generated'
import type { ChipLabelProps } from 'holi-bricks/components/chips/ChipLabel'
import { VolunteeringOpportunityStatusValue } from '@holi/api/graphql/graphql-codegen'

export type PetitionStatusConfig = {
  name: string
  description: string
  chip: ChipLabelProps
}

export type PetitionStatuses = {
  petitionStatuses: PetitionStatusConfig[]
  getPetitionStatus: (status: VolunteeringOpportunityStatusValue) => PetitionStatusConfig | undefined
}

export const usePetitionStatuses = (): PetitionStatuses => {
  const { t } = useTranslation()
  const getStatusConfig = (status: VolunteeringOpportunityStatusValue): PetitionStatusConfig | undefined => {
    switch (status) {
      case VolunteeringOpportunityStatusValue.ToDo:
        return {
          description: t('profile.myVolunteer.modal.description.toSign'),
          name: t('status.toSign'),
          chip: {
            color: 'blue',
            size: 'md',
            iconLeading: ProgressIndicator1Of3, // todo: add ProgressIndicator1Of2 icon
            children: t('status.toSign'),
          },
        }
      case VolunteeringOpportunityStatusValue.Done:
        return {
          name: t('status.done'),
          description: t('profile.myVolunteer.modal.description.done'),
          chip: {
            color: 'green',
            size: 'md',
            iconLeading: CheckmarkGreen,
            children: t('status.done'),
          },
        }
      default:
        return undefined
    }
  }

  return {
    petitionStatuses: [VolunteeringOpportunityStatusValue.ToDo, VolunteeringOpportunityStatusValue.Done].map(
      getStatusConfig
    ) as PetitionStatusConfig[],
    getPetitionStatus: (status: VolunteeringOpportunityStatusValue): PetitionStatusConfig | undefined => {
      if (!Object.values(VolunteeringOpportunityStatusValue).includes(status)) {
        return undefined
      }
      return getStatusConfig(status)
    },
  }
}
