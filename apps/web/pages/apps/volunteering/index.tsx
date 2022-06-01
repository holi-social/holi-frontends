import { ReactElement } from 'react'

import { AppLayout } from '@holi/web/layout/AppLayout'
import type { NextPageWithLayout } from '@holi/web/pages/_app'

import { VolunteeringAppHomeScreen } from '@holi-apps/volunteering/screens/VolunteeringAppHomeScreen'

const VolunteeringAppHomePage: NextPageWithLayout = () => <VolunteeringAppHomeScreen />

VolunteeringAppHomePage.getLayout = (page: ReactElement) => <AppLayout>{page}</AppLayout>

export default VolunteeringAppHomePage
