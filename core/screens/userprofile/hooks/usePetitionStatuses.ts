import { useTranslation } from 'react-i18next'
import { CheckmarkGreen, ProgressIndicator1Of2 } from '@holi/icons/src/generated'
import type { ChipLabelProps } from 'holi-bricks/components/chips/ChipLabel'
import { PetitionStatusValue } from '@holi/api/graphql/graphql-codegen'

export type PetitionStatusConfig = {
  name: string
  description: string
  chip: ChipLabelProps
}

export type PetitionStatuses = {
  petitionStatuses: PetitionStatusConfig[]
  getPetitionStatus: (status: PetitionStatusValue) => PetitionStatusConfig | undefined
}

export const usePetitionStatuses = (): PetitionStatuses => {
  const { t } = useTranslation()
  const getStatusConfig = (status: PetitionStatusValue): PetitionStatusConfig | undefined => {
    switch (status) {
      case PetitionStatusValue.Planned:
        return {
          description: t('profile.myVolunteer.modal.description.toSign'),
          name: t('status.toSign'),
          chip: {
            color: 'blue',
            size: 'md',
            iconLeading: ProgressIndicator1Of2,
            children: t('status.toSign'),
          },
        }
      case PetitionStatusValue.Signed:
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
    petitionStatuses: [PetitionStatusValue.Planned, PetitionStatusValue.Signed].map(
      getStatusConfig
    ) as PetitionStatusConfig[],
    getPetitionStatus: (status: PetitionStatusValue): PetitionStatusConfig | undefined => {
      if (!Object.values(PetitionStatusValue).includes(status)) {
        return undefined
      }
      return getStatusConfig(status)
    },
  }
}
