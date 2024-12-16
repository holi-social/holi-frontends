import React from 'react'
import { useTranslation } from 'react-i18next'

import type { CreateAppointmentInput } from '@holi/api/graphql/graphql-codegen'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'

import AppointmentCreateEditForm from './components/AppointmentCreateEditForm'
import { appointmentToCreateAppointmentInput } from './helpers/functions'
import { useUpdateAppointment } from './helpers/mutations'
import { useAppointmentById, useSpaceByIdOrName } from './helpers/queries'

export type EditAppointmentParams = {
  spaceIdOrName: string
  idOrSlug: string
}

const { useParam } = createParamHooks<EditAppointmentParams>()

const EditAppointment = () => {
  const { t } = useTranslation()
  const [spaceIdOrName] = useParam('spaceIdOrName')
  const [appointmentIdOrSlug] = useParam('idOrSlug')
  const { navigateBack } = useRouting()

  const {
    data: { spaceById: space } = {},
    error: errorSpace,
    loading: loadingSpace,
  } = useSpaceByIdOrName(spaceIdOrName)

  const {
    data: { appointment } = {},
    error: errorAppointment,
    loading: loadingAppointment,
  } = useAppointmentById(appointmentIdOrSlug)

  const updateAppointment = useUpdateAppointment(spaceIdOrName)

  // Exclude spaceId
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmit = async ({ spaceId, ...appointmentState }: CreateAppointmentInput) => {
    await updateAppointment({
      variables: {
        input: {
          appointmentId: appointment?.id,
          ...appointmentState,
        },
      },
      onCompleted: () => navigateBack(),
    })
  }

  if (loadingSpace || loadingAppointment) {
    return <HoliLoader />
  } else if (errorSpace || !space || errorAppointment || !appointment) {
    return null
  }

  return (
    <AppointmentCreateEditForm
      initialAppointment={appointmentToCreateAppointmentInput(appointment, space.id)}
      space={space}
      headerTitle={t('spaces.appointments.edit.button.label')}
      onSubmit={onSubmit}
    />
  )
}

export default EditAppointment
