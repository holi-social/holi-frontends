import { EventDetailsScreen } from '@holi-apps/events/screens/EventDetails'
import type { GetServerSidePropsContext, NextPage } from 'next'
import React from 'react'
import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'
import { GetEventByIdDocument } from '@holi/api/graphql/graphql-codegen'

const EventDetailsPage: NextPage = () => <EventDetailsScreen />

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { eventId } = context.query

  const queries = [
    {
      query: GetEventByIdDocument,
      variables: {
        id: eventId,
      },
      skip: !eventId,
    },
  ]

  return createServerSideProps(context, queries)
}

export default EventDetailsPage
