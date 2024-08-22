import dynamic from 'next/dynamic'
import React, { ReactElement } from 'react'

import { AppLayout } from '@holi/web/layout/NavigationLayoutGoodNewsApp'
import type { NextPageWithLayout } from '@holi/web/pages/_app'

const GoodNewsAppHome = dynamic(() => import('@holi-apps/goodnews/screens/GoodNewsAppHome'), {
  ssr: false,
})

const GoodNewsAppHomePage: NextPageWithLayout = () => <GoodNewsAppHome />

GoodNewsAppHomePage.getLayout = (page: ReactElement) => <AppLayout>{page}</AppLayout>

export default GoodNewsAppHomePage
