import { EventList } from '@holi-apps/events/screens/EventList'
import React, { type ReactElement } from 'react'

import { AppLayout } from '@holi/web/layout/NavigationLayoutVolunteeringApp'
import type { NextPageWithLayout } from '@holi/web/pages/_app'

const EventsPage: NextPageWithLayout = () => <EventList />

EventsPage.getLayout = (page: ReactElement) => <AppLayout>{page}</AppLayout>

export default EventsPage
