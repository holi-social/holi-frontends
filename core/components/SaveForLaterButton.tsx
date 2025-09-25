import type React from 'react'
import {
  type FavoritingMutationOptions,
  useFavoriting,
} from '@holi/core/components/FavoritingButton/helpers/useFavoriting'
import { useSignupModal } from '@holi/core/providers/SignupModalProvider'
import { setSnackbarOptions } from '@holi/core/components/SnackbarGlobal'
import { Trans, useTranslation } from 'react-i18next'
import { Button } from 'holi-bricks/components/button'
import type { FavoritableType } from '@holi/api/graphql/graphql-codegen'
import { Spacing } from 'holi-bricks/foundations'
import { HoliTextLink } from '@holi/core/navigation/components/HoliTextLink'
import { HoliFigmaSpanPlaceholder } from '@holi/ui/components/atoms/HoliFigmaSpanPlaceholder'
import { BookmarkLine, BookmarkFill } from '@holi/icons/src/generated'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { TrackingEvent } from '@holi/core/tracking'

interface SaveForLaterButtonProps extends Omit<FavoritingMutationOptions, '__typename'> {
  favoritableId: string
  favoritableType: FavoritableType
  isFavorite?: boolean
  size?: 'sm' | 'md' | 'lg'
  __typename: string
}

export const SaveForLaterButton = ({
  favoritableId,
  favoritableType,
  __typename,
  isFavorite = false,
  onError,
  onCompleted,
  onUpdate,
  size = 'md',
}: SaveForLaterButtonProps) => {
  const { requireLogin } = useSignupModal()
  const { t } = useTranslation()
  const { track } = useTracking()

  const { favorite, unfavorite } = useFavoriting(favoritableId, favoritableType, {
    __typename,
    onError,
    onCompleted,
    onUpdate,
  })

  const handlePress = async () => {
    if (isFavorite) {
      const success = await unfavorite()
      if (success) {
        setSnackbarOptions({
          label: t('favorites.favoriteRemoved'),
          icon: BookmarkFill,
          dismissible: true,
          visible: true,
          offset: Spacing['4xl'] + Spacing.xl,
        })
        track(
          TrackingEvent.Favorites.unfavorited({
            type: favoritableType,
            id: favoritableId,
          })
        )
      }
    } else {
      const success = await favorite()
      if (success) {
        setSnackbarOptions({
          label: (
            <Trans
              t={t}
              i18nKey="favorites.favoriteSaved"
              components={{
                b: (
                  <HoliTextLink href="/profile/settings/favorites" label="Go to favorites" size="sm" color="selected" />
                ),
                span: <HoliFigmaSpanPlaceholder />,
              }}
            />
          ),
          variant: 'success',
          icon: BookmarkFill,
          dismissible: true,
          visible: true,
          offset: Spacing['4xl'] + Spacing.xl,
        })
        track(
          TrackingEvent.Favorites.favorited({
            type: favoritableType,
            id: favoritableId,
          })
        )
      }
    }
  }

  return (
    <Button
      label={
        isFavorite
          ? t('volunteering.progress.button.favorites.saved')
          : t('volunteering.progress.button.favorites.toSave')
      }
      onPress={() =>
        requireLogin(() => handlePress(), {
          title: t('loginRedirect.title'),
          description: t('insights.insight.login.prompt.message'),
          trackTrigger: 'FAVORITE_ON_INSIGHT',
        })
      }
      variant="secondary"
      icon={isFavorite ? BookmarkFill : BookmarkLine}
      testID={isFavorite ? 'unsave-for-later-button' : 'save-for-later-button'}
      size={size}
    />
  )
}
