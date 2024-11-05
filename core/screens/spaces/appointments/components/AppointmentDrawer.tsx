import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import useDeleteAppointment from '@holi/core/hooks/spaces/useDeleteAppointment'
import useAuthRequiredNavigation from '@holi/core/navigation/hooks/useAuthRequiredNavigation'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { ContentType, ContentType3K } from '@holi/core/queries'
import { Appointment } from '@holi/core/screens/appointments/types'
import { Space } from '@holi/core/screens/spaces/types'
import { Delete, Edit2, Flag } from '@holi/icons/src/generated'
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
  const { navigateWithAuth } = useAuthRequiredNavigation()
  const loginState = useLoggedInUser()

  const [isLoadingDeleteAppointment, deleteAppointment] = useDeleteAppointment({
    id: appointment.id,
    spaceId: space.id,
    successMsg: t('appointment.delete.success'),
    handleDelete,
  })

  const isAppointmentCreator = loginState.isLoggedIn && appointment?.creator?.id === loginState.user.id

  const shouldDisplayModificationActions = isAdmin || isAppointmentCreator
  const shouldDisplayReportAction = loginState.isLoggedIn && !isAppointmentCreator

  if (!shouldDisplayModificationActions && !shouldDisplayReportAction) {
    return <></>
  }

  return (
    <HoliActionDrawer.Drawer
      label={t('global.moreOptions')}
      testID="btn-appointment-more-options"
      buttonElement={children}
    >
      {shouldDisplayModificationActions && (
        <>
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
        </>
      )}
      {shouldDisplayReportAction && (
        <HoliActionDrawer.Action
          icon={Flag}
          title={t('global.report')}
          testID="btn-report-appointment"
          handleAction={() =>
            navigateWithAuth(
              `/report/${appointment?.id}/${ContentType.SPACE_APPOINTMENT}/${ContentType3K.SPACE_APPOINTMENT}`
            )
          }
        />
      )}
    </HoliActionDrawer.Drawer>
  )
}

export default memo(AppointmentDrawer)
