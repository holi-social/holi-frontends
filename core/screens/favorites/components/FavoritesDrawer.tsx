import { useMutation } from '@apollo/client'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, ViewStyle } from 'react-native'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { LinkType, useShareLink } from '@holi/core/hooks/useShareLink'
import { UnbookmarkResponse, unbookmarkMutation } from '@holi/core/screens/insights/mutations'
import { favoritesQuery, insightById } from '@holi/core/screens/insights/queries'
import { Insight, UserFavorite } from '@holi/core/screens/insights/types'
import { Bookmark2Line, Share } from '@holi/icons/src/generated'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import HoliActionDrawer from '@holi/ui/components/organisms/HoliActionDrawer'

type FavoriteDrawerProps = {
  item: UserFavorite
  children: React.ReactNode
  style?: StyleProp<ViewStyle>
}

const FavoriteDrawer: React.FC<FavoriteDrawerProps> = ({ item, children }: FavoriteDrawerProps) => {
  const { t } = useTranslation()
  const { displayError } = useErrorHandling()
  const { openToast } = useToast()

  const [, shareInsightLink] = useShareLink({
    link: `/insights/${item.bookmarkId}`,
    linkType: LinkType.UNIVERSAL,
    message: `${t('insights.insight.share.message', {
      title: (item.bookmarkItem as Insight).title,
      interpolation: { escapeValue: false },
    })}`,
  })

  const [unbookmark] = useMutation<UnbookmarkResponse>(unbookmarkMutation, {
    onError: (error) =>
      displayError(error, 'Failed to remove bookmark', {
        location: 'FavoriteDrawer.unbookmark',
      }),
    refetchQueries: [
      favoritesQuery,
      {
        query: insightById,
        variables: {
          id: item.bookmarkId,
        },
      },
    ],
  })

  const removeInsightBookmarkActionHandler = async () => {
    await unbookmark({ variables: { bookmarkId: item.bookmarkId, bookmarkType: item.bookmarkType } })
    openToast(t('insights.insight.remove.bookmark.success'), HoliToastType.SUCCESS)
  }

  const shareInsightActionHandler = async () => {
    if ('INSIGHT' === item.bookmarkType) {
      await shareInsightLink()
    }
  }

  return (
    <HoliActionDrawer.Drawer
      label={t('global.moreOptions')}
      testID="btn-favorites-more-options"
      buttonElement={children}
    >
      {'INSIGHT' === item.bookmarkType && (
        <HoliActionDrawer.Action
          icon={Share}
          title={t('global.share')}
          testID="btn-share-favorite"
          handleAction={shareInsightActionHandler}
        />
      )}

      <HoliActionDrawer.Action
        icon={Bookmark2Line}
        title={t('favorites.remove.bookmark.button')}
        testID="btn-remove-favorite-bookmark"
        handleAction={removeInsightBookmarkActionHandler}
      />
    </HoliActionDrawer.Drawer>
  )
}

export default FavoriteDrawer
