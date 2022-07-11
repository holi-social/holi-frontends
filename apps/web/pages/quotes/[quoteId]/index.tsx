import { NextPage } from 'next'

import Quote, { QuoteType } from '@holi/core/screens/Quote'

const QuotesPage: NextPage = ({ data }) => <Quote ssr={true} data={data} />

// This gets called on every request
export const getServerSideProps = async ({ query }) => {
  // Fetch data from external API
  const res = await fetch('https://graphqlzero.almansi.me/api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `query {
      post(id: ${query.quoteId}) {
        id
        title
        body
      }
    }`,
    }),
  })
  const { data } = await res.json()
  console.log('SERVER SIDE DATA FETCHING =>', data)

  // Pass data to the page via props
  return { props: { data: data.post } }
}

// export async function getStaticPaths() {
//   return {
//     paths: [
//       {
//         params: {
//           quoteId: '1',
//         },
//       },
//       {
//         params: {
//           quoteId: '2',
//         },
//       },
//       {
//         params: {
//           quoteId: '3',
//         },
//       },
//       {
//         params: {
//           quoteId: '4',
//         },
//       },
//     ],
//     fallback: 'blocking',
//   }
// }

// export const getStaticProps = async ({ params }) => {
//   // Fetch data from external API
//   const res = await fetch(`https://dummyjson.com/quotes/${params.quoteId}`)
//   const data: QuoteType = await res.json()
//   console.log('SERVER SIDE DATA FETCHING =>', data)

//   // Pass data to the page via props
//   return { props: { data } }
// }

export default QuotesPage
