import { ReactElement } from 'react'

import { AppLayout } from '@holi/web/layout/NavigationLayoutVolunteeringApp'
import type { NextPageWithLayout } from '@holi/web/pages/_app'

import VolunteeringAppHome from '@holi-apps/volunteering/screens/VolunteeringAppHome'

const VolunteeringAppHomePage: NextPageWithLayout = () => <VolunteeringAppHome />

VolunteeringAppHomePage.getLayout = (page: ReactElement) => <AppLayout>{page}</AppLayout>

export default VolunteeringAppHomePage
