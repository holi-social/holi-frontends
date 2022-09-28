import { ReactElement } from 'react'

import { AppLayout } from '@holi/web/layout/NavigationLayoutDonationsApp'
import type { NextPageWithLayout } from '@holi/web/pages/_app'

import DonationsAppProjectDetail from '@holi-apps/donations/screens/DonationsAppProjectDetail'

const DonationsAppProjectDetailPage: NextPageWithLayout = () => <DonationsAppProjectDetail />

DonationsAppProjectDetailPage.getLayout = (page: ReactElement) => <AppLayout>{page}</AppLayout>

export default DonationsAppProjectDetailPage
