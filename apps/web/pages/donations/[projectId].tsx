import type { GetServerSidePropsContext } from 'next'
import React, { type ReactElement } from 'react'

import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'
import { AppLayout } from '@holi/web/layout/NavigationLayoutDonationsApp'
import type { NextPageWithLayout } from '@holi/web/pages/_app'

import { donationProjectByIdQuery } from '@holi-apps/donations/queries'
import DonationsAppProjectDetail from '@holi-apps/donations/screens/DonationsAppProjectDetail'

const DonationsAppProjectDetailPage: NextPageWithLayout = () => <DonationsAppProjectDetail />

DonationsAppProjectDetailPage.getLayout = (page: ReactElement) => <AppLayout>{page}</AppLayout>

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { projectId } = context.query

  const queries = [
    {
      query: donationProjectByIdQuery,
      variables: {
        id: Number(projectId),
      },
      skip: !projectId,
    },
  ]

  return createServerSideProps(context, queries, {
    urls: {
      en: `/donations/${projectId}`,
      de: `/spenden/${projectId}`,
    },
  })
}

export default DonationsAppProjectDetailPage
