import { NextPage } from 'next'

import SpaceDetails from '@holi/core/screens/spaces/SpaceDetails'

const SpaceDetailsPage: NextPage = () => <SpaceDetails />

SpaceDetailsPage.defaultProps = {
  hideFooter: true,
}

export default SpaceDetailsPage
