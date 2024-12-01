import type { DocumentNode } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import React, { type ReactNode } from 'react'

import type { PaginationQueryHookOptions } from '@holi/core/pagination/usePaginationQuery'
import ContentListResults from '@holi/core/screens/homeFeed/components/ContentListResults'
import SpaceTermContextProvider from '@holi/core/screens/spaces/providers/SpaceTermContextProvider'
import { feedQuery } from '@holi/core/screens/homeFeed/queries'

type ContentListProps = {
  paginationOptions: PaginationQueryHookOptions
  postsQuery: DocumentNode
  emptyMessage?: ReactNode
  showVisibilityBadge?: boolean
}

const ContentList = ({ emptyMessage, showVisibilityBadge = false }: ContentListProps) => {
  return (
    <SpaceTermContextProvider>
      <ContentListResults emptyMessage={emptyMessage} showVisibilityBadge={showVisibilityBadge} />
    </SpaceTermContextProvider>
  )
}

export default withProfiler(ContentList, { name: 'ContentList' })
