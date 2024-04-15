import { NextPage } from 'next'
import React from 'react'

import CreateAppointment from '@holi/core/screens/spaces/appointments/CreateAppointment'

const CreateAppointmentPage: NextPage = () => (
  // @ts-ignore (to ignore ScreenProps parameters expected in Mobile)
  <CreateAppointment />
)

export default CreateAppointmentPage
