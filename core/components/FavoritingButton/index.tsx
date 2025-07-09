import type React from 'react'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import {
  type FavoritingMutationOptions,
  useFavoriting,
} from '@holi/core/components/FavoritingButton/helpers/useFavoriting'
import { useSignupModal } from '@holi/core/providers/SignupModalProvider'
import { BookmarkFill, BookmarkLine } from '@holi/icons/src/generated'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Snackbar } from 'holi-bricks/components/snackbar/Snackbar'
import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Pressable } from 'react-native'
import type { FavoritableType } from '@holi/api/graphql/graphql-codegen'
import { Spacing, type SpacingSize } from 'holi-bricks/foundations'
import { HoliTextLink } from '@holi/core/navigation/components/HoliTextLink'

interface FavoritingButtonProps extends FavoritingMutationOptions {
  favoritableId: string
  favoritableType: FavoritableType
  size?: SpacingSize
  tintColor?: string
  isFavorite?: boolean
}

export const FavoritingButton = ({
  favoritableId,
  favoritableType,
  __typename,
  size = 'md',
  tintColor,
  isFavorite = false,
  onError,
  onCompleted,
  onUpdate,
}: FavoritingButtonProps) => {
  const { isLoggedIn } = useLoggedInUser()
  const { openSignupModal } = useSignupModal()
  const { t } = useTranslation()

  const [snackbarVisible, setSnackbarVisibility] = useState(false)

  const { favorite, unfavorite } = useFavoriting(favoritableId, favoritableType, {
    __typename,
    onError,
    onCompleted,
    onUpdate,
  })

  const favoriteHandler = async () => {
    if (!isLoggedIn) {
      openSignupModal({
        title: t('loginRedirect.title'),
        description: t('insights.insight.login.prompt.message'),
        trackTrigger: 'FAVORITE_ON_INSIGHT',
      })
      return
    }

    const success = await favorite()
    setSnackbarVisibility(success)
  }

  const unfavoriteHandler = async () => {
    const success = await unfavorite()
    setSnackbarVisibility(success)
  }

  return (
    <>
      <Snackbar
        label={
          isFavorite ? (
            <Trans
              t={t}
              i18nKey="insights.insight.favorite.add.success"
              components={{
                underline: (
                  <HoliTextLink href="/profile/settings/favorites" label="Go to favorites" size="sm" color="selected" />
                ),
              }}
            />
          ) : (
            t('insights.insight.favorite.remove.success')
          )
        }
        persistent
        icon={isFavorite ? BookmarkFill : BookmarkLine}
        showDismiss
        onDismiss={() => setSnackbarVisibility(false)}
        show={snackbarVisible}
      />

      {isFavorite ? (
        <Pressable onPress={unfavoriteHandler}>
          <HoliIcon icon={BookmarkFill} colorOverride={tintColor} size={Spacing[size]} />
        </Pressable>
      ) : (
        <Pressable onPress={favoriteHandler}>
          <HoliIcon icon={BookmarkLine} colorOverride={tintColor} size={Spacing[size]} />
        </Pressable>
      )}
    </>
  )
}
