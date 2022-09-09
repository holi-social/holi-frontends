import { ReactElement } from 'react'

import { AppLayout } from '@holi/web/layout/NavigationLayoutDonationsApp'
import type { NextPageWithLayout } from '@holi/web/pages/_app'

import DonationsAppHome from '@holi-apps/donations/screens/DonationsAppHome'

const DonationsAppHomePage: NextPageWithLayout = () => <DonationsAppHome />

DonationsAppHomePage.getLayout = (page: ReactElement) => <AppLayout>{page}</AppLayout>

export default DonationsAppHomePage
