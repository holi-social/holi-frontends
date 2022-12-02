import { NextPage } from 'next'

import InsightDetailPage from '@holi/core/screens/insights/InsightDetailPage'

const InsightPage: NextPage = () => <InsightDetailPage />

InsightPage.defaultProps = {
  hideFooter: true,
}

export default InsightPage
