import { NextPage } from 'next'
import React from 'react'

import SpaceAppointments from '@holi/core/screens/spaces/appointments/SpaceAppointments'

const SpaceAppointmentsPage: NextPage = () => (
  // @ts-ignore (to ignore ScreenProps parameters expected in Mobile)
  <SpaceAppointments />
)

export default SpaceAppointmentsPage
