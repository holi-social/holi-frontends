import { ReactElement } from 'react'

import { AppLayout } from '@holi/web/layout/NavigationLayoutGoodNewsApp'
import type { NextPageWithLayout } from '@holi/web/pages/_app'

import GoodNewsAppHome from '@holi-apps/goodnews/screens/GoodNewsAppHome'

const GoodNewsAppHomePage: NextPageWithLayout = () => <GoodNewsAppHome />

GoodNewsAppHomePage.getLayout = (page: ReactElement) => <AppLayout>{page}</AppLayout>

export default GoodNewsAppHomePage
