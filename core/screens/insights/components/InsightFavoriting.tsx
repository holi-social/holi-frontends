import type React from 'react'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useSignupModal } from '@holi/core/providers/SignupModalProvider'
import { BookmarkFill, BookmarkLine } from '@holi/icons/src/generated'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Snackbar } from 'holi-bricks/components/snackbar/Snackbar'
import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Pressable } from 'react-native'
import { FavoritableType, useFavoriteV2Mutation, useUnfavoriteV2Mutation } from '@holi/api/graphql/graphql-codegen'

type InsightFavoritingProps = {
  insightId: string
  isFavorite: boolean
}

export const InsightFavoriting = ({ insightId, isFavorite }: InsightFavoritingProps) => {
  const { displayError } = useErrorHandling()
  const { isLoggedIn } = useLoggedInUser()
  const { openSignupModal } = useSignupModal()
  const { t } = useTranslation()

  const [showSnackbar, setShowSnackbar] = useState(false)
  const [showRemovedSnackbar, setShowRemovedSnackbar] = useState(false)

  const [favorite] = useFavoriteV2Mutation({
    onError: (error) =>
      displayError(error, 'Failed to favorite insight', {
        location: 'InsightDetailPage.favoriteInsight',
        insightId: insightId,
      }),
    update: (cache) => {
      cache.modify({
        id: cache.identify({ __typename: 'Insight', id: insightId }),
        fields: {
          isFavorite() {
            return true
          },
        },
      })
    },
  })

  const [unfavorite] = useUnfavoriteV2Mutation({
    onError: (error) =>
      displayError(error, 'Failed to remove insight favorite', {
        location: 'InsightDrawer.unfavorite',
        insightId: insightId,
      }),
    update: (cache) => {
      cache.modify({
        id: cache.identify({ __typename: 'Insight', id: insightId }),
        fields: {
          isFavorite() {
            return false
          },
        },
      })
    },
  })

  const favoriteInsightActionHandler = async () => {
    if (isLoggedIn) {
      const favouritingSuccess = (
        await favorite({ variables: { favoritableId: insightId, favoritableType: FavoritableType.Insight } })
      ).data?.favoriteV2.success
      setShowSnackbar(favouritingSuccess || false)
    } else {
      openSignupModal({
        title: t('loginRedirect.title'),
        description: t('insights.insight.login.prompt.message'),
        trackTrigger: 'FAVORITE_ON_INSIGHT',
      })
    }
  }

  const unfavoriteInsightActionHandler = async () => {
    const unfavoritingSuccess = (
      await unfavorite({ variables: { favoritableId: insightId, favoritableType: FavoritableType.Insight } })
    ).data?.unfavoriteV2
    setShowRemovedSnackbar(unfavoritingSuccess?.success || false)
  }
  return (
    <>
      {/* show snackbar when successfully added to bookmarks */}
      <Snackbar
        label={<Trans t={t} i18nKey="insights.insight.favorite.success" components={{ underline: <u /> }} />}
        persistent
        icon={BookmarkFill}
        showDismiss
        onDismiss={() => setShowSnackbar(false)}
        show={showSnackbar}
      />

      {/* show snackbar when successfully removed from bookmarks */}
      <Snackbar
        label={t('insights.insight.remove.favorite.success')}
        persistent
        icon={BookmarkFill}
        showDismiss
        onDismiss={() => setShowRemovedSnackbar(false)}
        show={showRemovedSnackbar}
      />

      {isFavorite ? (
        <Pressable onPress={unfavoriteInsightActionHandler}>
          <HoliIcon icon={BookmarkFill} />
        </Pressable>
      ) : (
        <Pressable onPress={favoriteInsightActionHandler}>
          <HoliIcon icon={BookmarkLine} />
        </Pressable>
      )}
    </>
  )
}
