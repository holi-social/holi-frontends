import { useMutation } from '@apollo/client'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { useAuth } from '@holi/core/auth/helpers/useAuth'
import { useErrorHandling } from '@holi/core/errors/hooks'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import {
  BookmarkInsightResponse,
  RemoveInsightBookmark,
  bookmarkInsightMutation,
  removeInsightBookmarkMutation,
} from '@holi/core/screens/insights/mutations'
import { insightById } from '@holi/core/screens/insights/queries'
import { Insight } from '@holi/core/screens/insights/types'
import { BookmarkFill, BookmarkLine } from '@holi/icons/src/generated'
import HoliActionDrawer from '@holi/ui/components/organisms/HoliActionDrawer'

type InsightDrawerProps = {
  insight: Insight
  children: React.ReactNode
}

const InsightDrawer: React.FC<InsightDrawerProps> = ({ insight, children }: InsightDrawerProps) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const { isLoggedIn } = useAuth()
  const { displayError } = useErrorHandling()

  const { id, isBookmarked } = insight

  const [bookmarkInsight] = useMutation<BookmarkInsightResponse>(bookmarkInsightMutation, {
    onError: (error) =>
      displayError(error, 'Failed to bookmark insight', {
        location: 'InsightDrawer.bookmarkInsight',
        id,
      }),
    refetchQueries: [{ query: insightById, variables: { id } }],
  })

  const [removeInsightBookmark] = useMutation<RemoveInsightBookmark>(removeInsightBookmarkMutation, {
    onError: (error) =>
      displayError(error, 'Failed to remove insight bookmark', {
        location: 'InsightDrawer.removeInsightBookmark',
        id,
      }),
    refetchQueries: [{ query: insightById, variables: { id } }],
  })

  const bookmarkInsightActionHandler = async () => {
    await bookmarkInsight({ variables: { insightId: id } })
  }

  const removeInsightBookmarkActionHandler = async () => {
    if (isLoggedIn) {
      await removeInsightBookmark({ variables: { insightId: id } })
    }
    navigate('/login')
  }

  return (
    <HoliActionDrawer.Drawer
      label={t('global.moreOptions')}
      testID="btn-appointment-more-options"
      buttonElement={children}
    >
      {isBookmarked ? (
        <HoliActionDrawer.Action
          icon={BookmarkFill}
          title={t('insights.insight.remove.bookmark.button')}
          testID="btn-remove-insight-bookmark"
          handleAction={removeInsightBookmarkActionHandler}
        />
      ) : (
        <HoliActionDrawer.Action
          icon={BookmarkLine}
          title={t('insights.insight.bookmark.button')}
          testID="btn-bookmark-insight"
          handleAction={bookmarkInsightActionHandler}
        />
      )}
    </HoliActionDrawer.Drawer>
  )
}

export default InsightDrawer
