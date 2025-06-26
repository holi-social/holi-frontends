import type React from 'react'
import { useTranslation } from 'react-i18next'
import type { StyleProp, ViewStyle } from 'react-native'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { LinkType, useShareLink } from '@holi/core/hooks/useShareLink'
import { insightById } from '@holi/core/screens/insights/queries'
import { Bookmark2Line, Share } from '@holi/icons/src/generated'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import HoliActionDrawer from '@holi/ui/components/organisms/HoliActionDrawer'
import {
  FavoritesDocument,
  type FavoritableType,
  useUnfavoriteV2Mutation,
  type Insight,
  type UserFavorite,
} from '@holi/api/graphql/graphql-codegen'

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
    link: `/insights/${item.favoritableId}`,
    linkType: LinkType.UNIVERSAL,
    message: `${t('insights.insight.share.message', {
      title: (item.favoritable as Insight).title,
      interpolation: { escapeValue: false },
    })}`,
  })

  const [unfavorite] = useUnfavoriteV2Mutation({
    onError: (error) =>
      displayError(error, 'Failed to remove favorite', {
        location: 'FavoriteDrawer.unfavorite',
      }),
    refetchQueries: [
      FavoritesDocument,
      {
        query: insightById,
        variables: {
          id: item.favoritableId,
        },
      },
    ],
  })

  const removeInsightFavoriteActionHandler = async () => {
    await unfavorite({
      variables: { favoritableId: item.favoritableId, favoritableType: item.favoritableType as FavoritableType },
    })
    openToast(t('insights.insight.remove.bookmark.success'), HoliToastType.SUCCESS)
  }

  const shareInsightActionHandler = async () => {
    if ('INSIGHT' === item.favoritableType) {
      await shareInsightLink()
    }
  }

  return (
    <HoliActionDrawer.Drawer
      label={t('global.moreOptions')}
      testID="btn-favorites-more-options"
      buttonElement={children}
    >
      {'INSIGHT' === item.favoritableType && (
        <HoliActionDrawer.Action
          icon={Share}
          title={t('global.share')}
          testID="btn-share-favorite"
          handleAction={shareInsightActionHandler}
        />
      )}

      <HoliActionDrawer.Action
        icon={Bookmark2Line}
        title={t('favorites.remove.favorite.button')}
        testID="btn-remove-favorite"
        handleAction={removeInsightFavoriteActionHandler}
      />
    </HoliActionDrawer.Drawer>
  )
}

export default FavoriteDrawer
