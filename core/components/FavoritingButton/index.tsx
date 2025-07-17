import type React from 'react'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import {
  type FavoritingMutationOptions,
  useFavoriting,
} from '@holi/core/components/FavoritingButton/helpers/useFavoriting'
import { useSignupModal } from '@holi/core/providers/SignupModalProvider'
import { BookmarkFill, BookmarkLine } from '@holi/icons/src/generated'
import { HoliIcon, type HoliIconProps } from '@holi/icons/src/HoliIcon'
import { setSnackbarOptions } from '@holi/core/components/SnackbarGlobal'
import { Trans, useTranslation } from 'react-i18next'
import { Pressable } from 'react-native'
import type { FavoritableType } from '@holi/api/graphql/graphql-codegen'
import { Spacing, type SpacingSize } from 'holi-bricks/foundations'
import { HoliTextLink } from '@holi/core/navigation/components/HoliTextLink'
import { HoliFigmaSpanPlaceholder } from '@holi/ui/components/atoms/HoliFigmaSpanPlaceholder'

interface FavoritingButtonProps extends FavoritingMutationOptions, Pick<HoliIconProps, 'shadow'> {
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
  shadow,
}: FavoritingButtonProps) => {
  const { isLoggedIn } = useLoggedInUser()
  const { openSignupModal } = useSignupModal()
  const { t } = useTranslation()

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
    if (success) {
      setSnackbarOptions({
        label: (
          <Trans
            t={t}
            i18nKey="favorites.favoriteSaved"
            components={{
              b: <HoliTextLink href="/profile/settings/favorites" label="Go to favorites" size="sm" color="selected" />,
              span: <HoliFigmaSpanPlaceholder />,
            }}
          />
        ),
        variant: 'success',
        icon: BookmarkFill,
        dismissible: true,
        visible: true,
        offset: Spacing.xl,
      })
    }
  }

  const unfavoriteHandler = async () => {
    const success = await unfavorite()
    if (success) {
      setSnackbarOptions({
        label: t('favorites.favoriteRemoved'),
        variant: 'success',
        icon: BookmarkLine,
        dismissible: true,
        visible: true,
        offset: Spacing.xl,
      })
    }
  }

  return isFavorite ? (
    <Pressable onPress={unfavoriteHandler}>
      <HoliIcon icon={BookmarkFill} colorOverride={tintColor} size={Spacing[size]} shadow={shadow} />
    </Pressable>
  ) : (
    <Pressable onPress={favoriteHandler}>
      <HoliIcon icon={BookmarkLine} colorOverride={tintColor} size={Spacing[size]} shadow={shadow} />
    </Pressable>
  )
}
