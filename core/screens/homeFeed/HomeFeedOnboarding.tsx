import { withProfiler } from '@sentry/react'
import React, { memo } from 'react'

import HomeFeed, { HomeFeedProps } from '@holi/core/screens/homeFeed/HomeFeed'

const HomeFeedOnboarding = (props: HomeFeedProps) => <HomeFeed {...props} />

export default withProfiler(memo(HomeFeedOnboarding), { name: 'HomeFeedOnboarding' })
