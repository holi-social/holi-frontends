import Default from '@holi/core/components/ScrollHeaderLayout/Default'
import { withRefreshControl } from '@holi/core/components/ScrollHeaderLayout/withRefreshControl'

const Refreshable = withRefreshControl(Default)

Refreshable.displayName = 'ScrollHeaderLayout.Refreshable'

export default Refreshable
