import type React from 'react'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { useFavoriting } from '@holi/core/components/FavoritingButton/helpers/useFavoriting'
import { useSignupModal } from '@holi/core/providers/SignupModalProvider'
import { BookmarkFill, BookmarkLine } from '@holi/icons/src/generated'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Snackbar } from 'holi-bricks/components/snackbar/Snackbar'
import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Pressable } from 'react-native'
import type { FavoritableType } from '@holi/api/graphql/graphql-codegen'
import type { ApolloError } from '@apollo/client'

type FavoritingButtonProps = {
  favoritableId: string
  favoritableType: FavoritableType
  typename: string
  tintColor?: string
  isFavorite?: boolean
  onError?: (error: ApolloError) => void
  onCompleted?: () => void
}

export const FavoritingButton = ({
  favoritableId,
  favoritableType,
  typename,
  tintColor,
  isFavorite = false,
  onError,
  onCompleted,
}: FavoritingButtonProps) => {
  const { isLoggedIn } = useLoggedInUser()
  const { openSignupModal } = useSignupModal()
  const { t } = useTranslation()

  const [showSnackbar, setShowSnackbar] = useState(false)

  const { favorite, unfavorite } = useFavoriting(favoritableId, favoritableType, {
    __typename: typename,
    onError,
    onCompleted,
  })

  const favoriteHandler = async () => {
    if (isLoggedIn) {
      const success = await favorite()
      setShowSnackbar(success)
    } else {
      openSignupModal({
        title: t('loginRedirect.title'),
        description: t('insights.insight.login.prompt.message'),
        trackTrigger: 'FAVORITE_ON_INSIGHT',
      })
    }
  }

  const unfavoriteHandler = async () => {
    const success = await unfavorite()
    setShowSnackbar(success)
  }

  return (
    <>
      <Snackbar
        label={
          isFavorite ? (
            <Trans t={t} i18nKey="insights.insight.favorite.add.success" components={{ underline: <u /> }} />
          ) : (
            t('insights.insight.favorite.remove.success')
          )
        }
        persistent
        icon={isFavorite ? BookmarkFill : BookmarkLine}
        showDismiss
        onDismiss={() => setShowSnackbar(false)}
        show={showSnackbar}
      />

      {isFavorite ? (
        <Pressable onPress={unfavoriteHandler}>
          <HoliIcon icon={BookmarkFill} colorOverride={tintColor} />
        </Pressable>
      ) : (
        <Pressable onPress={favoriteHandler}>
          <HoliIcon icon={BookmarkLine} colorOverride={tintColor} />
        </Pressable>
      )}
    </>
  )
}
