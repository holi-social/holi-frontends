import React, { type ReactElement } from 'react'

import { AppLayout } from '@holi/web/layout/NavigationLayoutVolunteeringApp'
import type { NextPageWithLayout } from '@holi/web/pages/_app'
import { PetitionList } from '@holi/core/screens/act/petitions/PetitionList'

const PetitionsPage: NextPageWithLayout = () => <PetitionList />

PetitionsPage.getLayout = (page: ReactElement) => <AppLayout>{page}</AppLayout>

export default PetitionsPage
