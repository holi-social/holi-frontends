import { NextPageContext } from 'next'
import React, { ReactElement } from 'react'

import { featureTogglesQuery } from '@holi/core/screens/homeFeed/queries'
import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'
import { AppLayout } from '@holi/web/layout/NavigationLayoutDonationsApp'
import type { NextPageWithLayout } from '@holi/web/pages/_app'

import { donationProjectByIdQuery } from '@holi-apps/donations/queries'
import DonationsAppProjectDetail from '@holi-apps/donations/screens/DonationsAppProjectDetail'

const DonationsAppProjectDetailPage: NextPageWithLayout = () => <DonationsAppProjectDetail />

DonationsAppProjectDetailPage.getLayout = (page: ReactElement) => <AppLayout>{page}</AppLayout>

export const getServerSideProps = async (context: NextPageContext) => {
  const { projectId } = context.query

  const queries = [
    {
      query: featureTogglesQuery,
    },
    {
      query: donationProjectByIdQuery,
      variables: {
        id: Number(projectId),
      },
      skip: !projectId,
    },
  ]

  return createServerSideProps(context, queries)
}

export default DonationsAppProjectDetailPage
