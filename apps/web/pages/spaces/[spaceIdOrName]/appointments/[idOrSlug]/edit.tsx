import { NextPage } from 'next'
import React from 'react'

import EditAppointment from '@holi/core/screens/spaces/appointments/EditAppointment'

const EditAppointmentPage: NextPage = () => (
  // @ts-ignore (to ignore ScreenProps parameters expected in Mobile)
  <EditAppointment />
)

export default EditAppointmentPage
