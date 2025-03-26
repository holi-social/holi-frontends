import type { GetServerSidePropsContext } from 'next'
import React, { type ReactElement } from 'react'

import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'
import { AppLayout } from '@holi/web/layout/NavigationLayoutVolunteeringApp'
import type { NextPageWithLayout } from '@holi/web/pages/_app'

import { engagementByIdQuery } from '@holi-apps/volunteering/queries'
import VolunteeringEngagementDetail from '@holi-apps/volunteering/screens/VolunteeringEngagementDetail'

const VolunteeringEngagementDetailPage: NextPageWithLayout = () => <VolunteeringEngagementDetail />

VolunteeringEngagementDetailPage.getLayout = (page: ReactElement) => <AppLayout>{page}</AppLayout>

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { engagementId } = context.query

  const queries = [
    {
      query: engagementByIdQuery,
      variables: {
        id: engagementId,
      },
      skip: !engagementId,
    },
  ]

  return createServerSideProps(context, queries, {
    urls: {
      en: `/volunteering/${engagementId}`,
      de: `/ehrenamt/${engagementId}`,
    },
  })
}

export default VolunteeringEngagementDetailPage
