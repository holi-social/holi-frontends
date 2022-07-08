import { NextPage } from 'next'

import Quote, { QuoteType } from '@holi/core/screens/Quote'

const QuotesPage: NextPage = ({ data }) => <Quote ssr={true} data={data} />

// This gets called on every request
export const getServerSideProps = async ({ query }) => {
  // Fetch data from external API
  const res = await fetch(`https://dummyjson.com/quotes/${query.quoteId}`)
  const data: QuoteType = await res.json()
  console.log('SERVER SIDE DATA FETCHING =>', data)

  // Pass data to the page via props
  return { props: { data } }
}

export default QuotesPage
