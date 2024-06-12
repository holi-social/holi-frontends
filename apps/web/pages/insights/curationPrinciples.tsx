import { NextPage } from 'next'
import React from 'react'

import CurationPrinciplesPage from '@holi/core/screens/insights/CurationPrinciplesPage'
import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'

const CurationPrinciples: NextPage = () => <CurationPrinciplesPage />

export const getServerSideProps = createServerSideProps

export default CurationPrinciples
