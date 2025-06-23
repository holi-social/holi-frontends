import { useMutation } from '@apollo/client'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { LinkType, useShareLink } from '@holi/core/hooks/useShareLink'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSignupModal } from '@holi/core/providers/SignupModalProvider'
import { FavoriteType } from '@holi/core/screens/favorites/model'
import {
  FavoriteV2Response,
  UnfavoriteV2Response,
  favoriteV2Mutation,
  unfavoriteV2Mutation,
} from '@holi/core/screens/favorites/mutation'
import { favoritesQuery } from '@holi/core/screens/favorites/queries'
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
  const { isLoggedIn } = useLoggedInUser()
  const { displayError } = useErrorHandling()
  const { openToast } = useToast()

  const { id, isFavorite } = insight

  const { openSignupModal } = useSignupModal()

  const [favorite] = useMutation<FavoriteV2Response>(favoriteV2Mutation, {
    onError: (error) =>
      displayError(error, 'Failed to favorite insight', {
        location: 'InsightDrawer.favoriteInsight',
        id,
      }),
    refetchQueries: [{ query: insightById, variables: { id } }, favoritesQuery],
  })

  const [unfavorite] = useMutation<UnfavoriteV2Response>(unfavoriteV2Mutation, {
    onError: (error) =>
      displayError(error, 'Failed to remove insight favorite', {
        location: 'InsightDrawer.unfavorite',
        id,
      }),
    refetchQueries: [{ query: insightById, variables: { id } }, favoritesQuery],
  })

  const favoriteInsightActionHandler = async () => {
    if (isLoggedIn) {
      await favorite({ variables: { favoritableId: id, favoritableType: FavoriteType.INSIGHT } })
      openToast(t('insights.insight.favorite.success'), HoliToastType.SUCCESS)
    } else {
      openSignupModal({
        title: t('loginRedirect.title'),
        description: t('insights.insight.login.prompt.message'),
        trackTrigger: 'FAVORITE_ON_INSIGHT',
      })
    }
  }

  const unfavoriteActionHandler = async () => {
    await unfavorite({ variables: { favoritableId: id, favoritableType: FavoriteType.INSIGHT } })
    openToast(t('insights.insight.remove.favorite.success'), HoliToastType.SUCCESS)
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
    <HoliActionDrawer.Drawer label={t('global.moreOptions')} testID="btn-insight-more-options" buttonElement={children}>
      <HoliActionDrawer.Action
        icon={Share}
        title={t('global.share')}
        testID="btn-share-insight"
        handleAction={shareLink}
      />
      {isFavorite ? (
        <HoliActionDrawer.Action
          icon={BookmarkFill}
          title={t('insights.insight.remove.favorite.button')}
          testID="btn-remove-insight-favorite"
          handleAction={unfavoriteActionHandler}
        />
      ) : (
        <HoliActionDrawer.Action
          icon={BookmarkLine}
          title={t('insights.insight.favorite.button')}
          testID="btn-favorite-insight"
          handleAction={favoriteInsightActionHandler}
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
