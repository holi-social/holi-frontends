import React, { ReactElement } from 'react'

import { AppLayout } from '@holi/web/layout/NavigationLayoutVolunteeringApp'
import type { NextPageWithLayout } from '@holi/web/pages/_app'

import VolunteeringEngagementDetail from '@holi-apps/volunteering/screens/VolunteeringEngagementDetail'

const VolunteeringEngagementDetailPage: NextPageWithLayout = () => <VolunteeringEngagementDetail />

VolunteeringEngagementDetailPage.getLayout = (page: ReactElement) => <AppLayout>{page}</AppLayout>

export default VolunteeringEngagementDetailPage
