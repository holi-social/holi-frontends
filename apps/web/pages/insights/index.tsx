import { NextPage } from 'next'
import React from 'react'

import InsightsPage from '@holi/core/screens/insights/InsightsPage'
import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'

const Insights: NextPage = () => <InsightsPage />

export const getServerSideProps = createServerSideProps

export default Insights
