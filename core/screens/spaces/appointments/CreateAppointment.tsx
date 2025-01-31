import React from 'react'
import { useTranslation } from 'react-i18next'

import type { CreateAppointmentInput } from '@holi/api/graphql/graphql-codegen'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import AppointmentCreateEditForm from '@holi/core/screens/spaces/appointments/components/AppointmentCreateEditForm'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'

import { useCreateAppointment } from './helpers/mutations'
import { useSpaceByIdOrName } from './helpers/queries'

export type CreateAppointmentParams = {
  spaceIdOrName: string
}

const { useParam } = createParamHooks<CreateAppointmentParams>()

const CreateAppointment = () => {
  const { t } = useTranslation()
  const spaceIdOrName = useParam('spaceIdOrName')

  const {
    data: { spaceById: space } = {},
    error: errorSpace,
    loading: loadingSpace,
  } = useSpaceByIdOrName(spaceIdOrName)

  const createAppointment = useCreateAppointment(space?.id)
  const onSubmit = async (appointmentState: CreateAppointmentInput) => {
    await createAppointment({
      variables: {
        input: {
          ...appointmentState,
        },
      },
    })
  }

  if (loadingSpace) {
    return <HoliLoader />
  } else if (errorSpace || !space) {
    return null
  }

  return (
    <AppointmentCreateEditForm
      space={space}
      headerTitle={t('spaces.appointments.add.button.label')}
      onSubmit={onSubmit}
    />
  )
}

export default CreateAppointment
