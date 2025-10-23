import { useMutation } from '@apollo/client/react'
import type { ApolloLink } from '@apollo/client'
import { useTranslation } from 'react-i18next'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { type DeleteAppointmentResponse, deleteAppointmentMutation } from '@holi/core/screens/appointments/mutations'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'

export type UseDeleteAppointment = [
  boolean,
  (options?: useMutation.MutationFunctionOptions) => Promise<ApolloLink.Result>,
]

interface UseDeleteAppointmentProps {
  id: string
  spaceId: string
  successMsg: string
  handleDelete?: () => void
}

const useDeleteAppointment = ({
  id,
  spaceId,
  successMsg,
  handleDelete,
}: UseDeleteAppointmentProps): UseDeleteAppointment => {
  const { t } = useTranslation()
  const { openToast } = useToast()
  const { displayError } = useErrorHandling()

  const [deleteAppointment, { loading: isLoadingDeleteAppointment }] = useMutation<DeleteAppointmentResponse>(
    deleteAppointmentMutation,
    {
      variables: { appointmentId: id },
      onCompleted: () => {
        openToast(successMsg, HoliToastType.SUCCESS)
        handleDelete?.()
      },
      onError: (error) =>
        displayError(error, 'Failed to delete appointment', {
          displayMessage: t('appointment.delete.error'),
          location: 'useDeleteAppointment',
          appointmentId: id,
          spaceId,
        }),
      refetchQueries: ['Appointments'],
    }
  )

  return [isLoadingDeleteAppointment, deleteAppointment]
}

export default useDeleteAppointment
