import { useMutation } from '@apollo/client'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { useAuth } from '@holi/core/auth/helpers/useAuth'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { LinkType, useShareLink } from '@holi/core/hooks/useShareLink'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import {
  BookmarkInsightResponse,
  RemoveInsightBookmark,
  bookmarkInsightMutation,
  removeInsightBookmarkMutation,
} from '@holi/core/screens/insights/mutations'
import { insightById } from '@holi/core/screens/insights/queries'
import { Insight } from '@holi/core/screens/insights/types'
import { Bookmark3Line, BookmarkFill, BookmarkLine, Share } from '@holi/icons/src/generated'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
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
  const { openToast } = useToast()

  const { id, isBookmarked } = insight

  const [bookmarkInsight] = useMutation<BookmarkInsightResponse>(bookmarkInsightMutation, {
    onError: (error) =>
      displayError(error, 'Failed to bookmark insight', {
        location: 'InsightDrawer.bookmarkInsight',
        id,
      }),
    refetchQueries: [{ query: insightById, variables: { id } }, 'FavoriteInsights'],
  })

  const [removeInsightBookmark] = useMutation<RemoveInsightBookmark>(removeInsightBookmarkMutation, {
    onError: (error) =>
      displayError(error, 'Failed to remove insight bookmark', {
        location: 'InsightDrawer.removeInsightBookmark',
        id,
      }),
    refetchQueries: [{ query: insightById, variables: { id } }, 'FavoriteInsights'],
  })

  const bookmarkInsightActionHandler = async () => {
    if (isLoggedIn) {
      await bookmarkInsight({ variables: { insightId: id } })
      openToast(t('insights.insight.bookmark.success'), HoliToastType.SUCCESS)
    }
    navigate('/login')
  }

  const removeInsightBookmarkActionHandler = async () => {
    await removeInsightBookmark({ variables: { insightId: id } })
    openToast(t('insights.insight.remove.bookmark.success'), HoliToastType.SUCCESS)
  }

  const seeAllFavoritesActionHandler = async () => {
    navigate('/profile/settings/favorites')
  }

  const [, shareLink] = useShareLink({
    link: `/insights/${insight.id}`,
    linkType: LinkType.UNIVERSAL,
    message: `${t('insights.insight.share.message', {
      title: insight.title,
      interpolation: { escapeValue: false },
    })}`,
  })

  return (
    <HoliActionDrawer.Drawer
      label={t('global.moreOptions')}
      testID="btn-appointment-more-options"
      buttonElement={children}
    >
      <HoliActionDrawer.Action
        icon={Share}
        title={t('global.share')}
        testID="btn-share-insight"
        handleAction={shareLink}
      />
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
      {isLoggedIn && (
        <HoliActionDrawer.Action
          icon={Bookmark3Line}
          title={t('favorites.seeAll.button')}
          testID="btn-see-all-favorites"
          handleAction={seeAllFavoritesActionHandler}
        />
      )}
    </HoliActionDrawer.Drawer>
  )
}

export default InsightDrawer
