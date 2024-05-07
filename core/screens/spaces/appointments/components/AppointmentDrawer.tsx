import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import { useAuth } from '@holi/core/auth/helpers/useAuth'
import useDeleteAppointment from '@holi/core/hooks/spaces/useDeleteAppointment'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { Appointment } from '@holi/core/screens/appointments/types'
import { Space } from '@holi/core/screens/spaces/types'
import { Delete, Edit2 } from '@holi/icons/src/generated'
import HoliActionDrawer from '@holi/ui/components/organisms/HoliActionDrawer'

type AppointmentDrawerProps = {
  appointment: Appointment
  space: Space
  isAdmin?: boolean
  handleDelete?: () => void
  children: React.ReactNode
}

const AppointmentDrawer: React.FC<AppointmentDrawerProps> = ({
  appointment,
  space,
  isAdmin,
  handleDelete,
  children,
}: AppointmentDrawerProps) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const loginState = useAuth()
  const [isLoadingDeleteAppointment, deleteAppointment] = useDeleteAppointment({
    id: appointment.id,
    spaceId: space.id,
    successMsg: t('appointment.delete.success'),
    handleDelete,
  })

  const isAppointmentCreator = loginState.isLoggedIn && appointment?.creator?.id === loginState.userId

  return (
    (isAdmin || isAppointmentCreator) && (
      <HoliActionDrawer.Drawer
        label={t('global.moreOptions')}
        testID="btn-appointment-more-options"
        buttonElement={children}
      >
        <HoliActionDrawer.Action
          icon={Edit2}
          title={t('global.edit')}
          testID="btn-to-edit-appointment"
          handleAction={() => navigate(`/spaces/${space.name}/appointments/${appointment.id}/edit`)}
        />
        <HoliActionDrawer.Action
          isLoading={isLoadingDeleteAppointment}
          icon={Delete}
          title={t('global.delete')}
          variant="danger"
          testID="btn-to-delete-appointment"
          showConfirmation
        >
          <HoliActionDrawer.Confirmation
            title={t('appointment.delete.confirmation.title')}
            description={t('appointment.delete.confirmation.description')}
            testID="appointment-delete"
            handleConfirmation={deleteAppointment}
            buttonType="warning"
            hasDismissBtn
            requireLogin
          />
        </HoliActionDrawer.Action>
      </HoliActionDrawer.Drawer>
    )
  )
}

export default memo(AppointmentDrawer)
