import { useMutation } from '@apollo/client/react'
import { useTranslation } from 'react-i18next'

import { isMaliciousUrlError } from '@holi/core/errors/helpers'
import { useErrorHandling } from '@holi/core/errors/hooks'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import {
  type CreateAppointmentResponse,
  type UpdateAppointmentResponse,
  createAppointmentMutation,
  updateAppointmentMutation,
} from '@holi/core/screens/appointments/mutations'
import { APPOINTMENT_STATUS_TYPE, appointmentsBySpaceIdQuery } from '@holi/core/screens/appointments/queries'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'

export const useCreateAppointment = (spaceId?: string) => {
  const { openToast } = useToast()
  const { displayError } = useErrorHandling()
  const { navigateBack } = useRouting()
  const { t } = useTranslation()

  const [createAppointment] = useMutation<CreateAppointmentResponse>(createAppointmentMutation, {
    onCompleted: () => navigateBack(),
    onError: (error) => {
      if (isMaliciousUrlError(error)) {
        openToast(t('global.maliciousUrl.error'), HoliToastType.ERROR)
      } else {
        displayError(error, 'Failed to create appointment', {
          location: 'CreateAppointment.createAppointment',
          spaceIdOrName: spaceId,
        })
      }
    },
    refetchQueries: [
      {
        query: appointmentsBySpaceIdQuery,
        variables: { spaceId, statusType: APPOINTMENT_STATUS_TYPE.UPCOMING },
      },
    ],
  })

  return createAppointment
}

export const useUpdateAppointment = (spaceId?: string) => {
  const { openToast } = useToast()
  const { displayError } = useErrorHandling()
  const { t } = useTranslation()

  const [updateAppointment] = useMutation<UpdateAppointmentResponse>(updateAppointmentMutation, {
    onError: (error) => {
      if (isMaliciousUrlError(error)) {
        openToast(t('global.maliciousUrl.error'), HoliToastType.ERROR)
      } else {
        displayError(error, 'Failed to update the appointment', {
          location: 'EditAppointment.updateAppointment',
          spaceIdOrName: spaceId,
        })
      }
    },
    refetchQueries: ['Appointments'],
  })

  return updateAppointment
}
