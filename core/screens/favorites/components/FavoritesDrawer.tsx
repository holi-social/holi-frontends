import { useMutation } from '@apollo/client'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, ViewStyle } from 'react-native'

import { useErrorHandling } from '@holi/core/errors/hooks'
import { RemoveInsightBookmark, removeInsightBookmarkMutation } from '@holi/core/screens/insights/mutations'
import { Bookmark2Line, Share } from '@holi/icons/src/generated'
import HoliActionDrawer from '@holi/ui/components/organisms/HoliActionDrawer'

type FavoriteDrawerProps = {
  id: string
  children: React.ReactNode
  style?: StyleProp<ViewStyle>
}

const FavoriteDrawer: React.FC<FavoriteDrawerProps> = ({ id, children }: FavoriteDrawerProps) => {
  const { t } = useTranslation()
  const { displayError } = useErrorHandling()

  //TODO: This sould also handle removing bookmarks for initiatives, quotes, recommendations, etc...
  const [removeInsightBookmark] = useMutation<RemoveInsightBookmark>(removeInsightBookmarkMutation, {
    onError: (error) =>
      displayError(error, 'Failed to remove insight bookmark', {
        location: 'FavoriteDrawer.removeInsightBookmark',
        id,
      }),
    refetchQueries: ['FavoriteInsights'],
  })

  const removeInsightBookmarkActionHandler = async () => {
    await removeInsightBookmark({ variables: { insightId: id } })
  }

  return (
    <HoliActionDrawer.Drawer
      label={t('global.moreOptions')}
      testID="btn-appointment-more-options"
      buttonElement={children}
    >
      <HoliActionDrawer.Action
        icon={Share}
        title={t('global.share')}
        testID="btn-share-favorite"
        handleAction={removeInsightBookmarkActionHandler}
      />
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
