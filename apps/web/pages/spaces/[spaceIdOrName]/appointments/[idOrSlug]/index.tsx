import {
  NextPage,
  /*NextPageContext*/
} from 'next'
import React from 'react'

// import { appointmentByIdOrSlugQuery } from '@holi/core/screens/appointments/queries'
import AppointmentDetails from '@holi/core/screens/spaces/appointments/AppointmentDetails'

// import { createServerSideProps } from '@holi/web/helpers/createServerSideProps'

const AppointmentDetailsPage: NextPage = () => <AppointmentDetails />

// export const getServerSideProps = async (context: NextPageContext) => {
//   const { idOrSlug } = context.query

//   const queries = [
//     {
//       query: appointmentByIdOrSlugQuery,
//       variables: {
//         idOrSlug,
//       },
//       skip: !idOrSlug,
//     },
//   ]

//   return createServerSideProps(context, queries)
// }

export default AppointmentDetailsPage
