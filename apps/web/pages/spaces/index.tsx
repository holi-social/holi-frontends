import type { NextPage, GetServerSidePropsContext } from 'next'
import React from 'react'

import Spaces from '@holi/core/screens/spaces/discover/Spaces'
import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'

const SpacesPage: NextPage = () => <Spaces />

export const getServerSideProps = async (context: GetServerSidePropsContext) =>
  createServerSideProps(context, [], { seoTitle: 'seo.h1.spaces' })

export default SpacesPage
