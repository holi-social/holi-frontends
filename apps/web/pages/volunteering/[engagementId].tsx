import type { GetServerSidePropsContext } from 'next'
import React, { type ReactElement } from 'react'

import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'
import { AppLayout } from '@holi/web/layout/NavigationLayoutVolunteeringApp'
import type { NextPageWithLayout } from '@holi/web/pages/_app'

import VolunteeringEngagementDetail from '@holi-apps/volunteering/screens/VolunteeringEngagementDetail'

const VolunteeringEngagementDetailPage: NextPageWithLayout = () => <VolunteeringEngagementDetail />

VolunteeringEngagementDetailPage.getLayout = (page: ReactElement) => <AppLayout>{page}</AppLayout>

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { engagementId } = context.query

  // FIXME: properly handle 404 errors

  return createServerSideProps(context, [], {
    urls: {
      en: `/volunteering/${engagementId}`,
      de: `/ehrenamt/${engagementId}`,
    },
  })
}

export default VolunteeringEngagementDetailPage
