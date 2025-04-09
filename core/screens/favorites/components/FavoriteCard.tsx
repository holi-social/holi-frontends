import type React from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { getRelativeDateString } from '@holi/core/i18n/helpers/dateHelper'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import FavoriteDrawer from '@holi/core/screens/favorites/components/FavoritesDrawer'
import { FavoriteType } from '@holi/core/screens/favorites/model'
import type { Favorites } from '@holi/core/screens/favorites/types'
import type { Insight } from '@holi/core/screens/insights/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import AccountCircleFilled from '@holi/icons/src/generated/AccountCircleFilled'
import MoreFilled from '@holi/icons/src/generated/MoreFilled'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { Avatar } from 'holi-bricks/components/avatar'

interface FavoriteCardProps {
  item: Favorites
}

const FavoriteCard: React.FC<FavoriteCardProps> = ({ item }) => {
  const { i18n } = useTranslation()
  const { navigate } = useRouting()
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])
  const { favoritable, favoritableType } = item

  if (favoritableType === FavoriteType.INSIGHT) {
    const insight = favoritable as Insight
    return (
      <View style={styles.cardContainer} testID={'favorites-card'}>
        <View style={styles.favoriteDrawer}>
          <FavoriteDrawer item={item}>
            <HoliIcon icon={MoreFilled} />
          </FavoriteDrawer>
        </View>
        <HoliButton transparent inline label={insight.title} onPress={() => navigate(`/insights/${insight.id}`)}>
          <View style={styles.cardContent}>
            <View style={styles.thumbnailContainer}>
              {insight.headerImage ? (
                <HoliImage source={{ uri: insight.headerImage }} style={styles.thumbnail} label={insight.title} />
              ) : (
                <HoliLocalImage
                  imageSource={require('@holi/ui/assets/img/illustrations/illustration_thumbnail_placeholder.svg')}
                  isSvg
                  label={insight.title}
                  width={100}
                  height={100}
                />
              )}
            </View>
            <View style={styles.detailsContainer}>
              <HoliText ellipsizeMode="tail" numberOfLines={2} bold>
                {insight.title}
              </HoliText>
              {insight.creator && (
                <View style={styles.curatorContainer}>
                  {insight.creator.avatar ? (
                    <View style={styles.curatorAvatar}>
                      <Avatar
                        size="xs"
                        initials={insight.creator.avatarLabel || ''}
                        label={insight.creator.fullName}
                        source={insight.creator.avatar}
                        imgPlaceholder={insight.creator.avatarBlurhash}
                      />
                    </View>
                  ) : (
                    <HoliIcon style={styles.curatorAvatar} icon={AccountCircleFilled} colorOverride={colors.gray200} />
                  )}
                  <HoliText size="small" color="gray300">
                    {insight.creator.fullName}
                  </HoliText>
                </View>
              )}
              {insight.datePublished && (
                <HoliText size="extrasmall" color="gray300">
                  {getRelativeDateString(insight.datePublished, i18n.language)}
                </HoliText>
              )}
            </View>
          </View>
        </HoliButton>
      </View>
    )
  }
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    cardContainer: {
      position: 'relative',
      borderWidth: 1,
      borderColor: theme.colors.gray200,
      backgroundColor: theme.colors.white100,
      borderRadius: 8,
      margin: 8,
      padding: 8,
    },
    cardContent: {
      flexDirection: 'row',
      flex: 1,
    },
    thumbnailContainer: {
      width: 100,
      height: 100,
    },
    thumbnail: {
      width: '100%',
      height: '100%',
      borderRadius: 8,
    },
    detailsContainer: {
      flex: 1,
      marginLeft: 8,
      marginRight: 32,
      justifyContent: 'space-between',
    },
    curatorContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    curatorAvatar: {
      marginRight: 8,
    },
    favoriteDrawer: {
      position: 'absolute',
      top: 10,
      right: 10,
      zIndex: 1,
    },
  })

export default FavoriteCard
