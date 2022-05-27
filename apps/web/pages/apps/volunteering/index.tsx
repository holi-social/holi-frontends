import { NextPage } from 'next'
import { ReactElement } from 'react'

import { AppLayout } from '@holi/web/layout/AppLayout'
import { VolunteeringAppHomeScreen } from '@holi-apps/volunteering/screens/VolunteeringAppHomeScreen'

const VolunteeringAppHomePage: NextPage = () => <VolunteeringAppHomeScreen />

VolunteeringAppHomePage.getLayout = (page: ReactElement) => <AppLayout>{page}</AppLayout>

export default VolunteeringAppHomePage

