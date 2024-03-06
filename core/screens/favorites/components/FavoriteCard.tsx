import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { getRelativeDateString } from '@holi/core/i18n/helpers/dateHelper'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import FavoriteDrawer from '@holi/core/screens/favorites/components/FavoritesDrawer'
import { User } from '@holi/core/screens/userprofile/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import AccountCircleFilled from '@holi/icons/src/generated/AccountCircleFilled'
import MoreFilled from '@holi/icons/src/generated/MoreFilled'
import HoliImage from '@holi/ui/components/atoms/HoliImage'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

interface FavoriteCardProps {
  id: string
  title: string
  thumbnail?: string
  primaryLink: string
  curator?: User
  published?: string
  externalLink?: string
  contentType?: string
}

const FavoriteCard: React.FC<FavoriteCardProps> = ({ id, title, thumbnail, primaryLink, curator, published }) => {
  const { i18n } = useTranslation()
  const { navigate } = useRouting()

  return (
    <View style={styles.cardContainer}>
      <View style={styles.favoriteDrawer}>
        <FavoriteDrawer id={id}>
          <HoliIcon icon={MoreFilled} />
        </FavoriteDrawer>
      </View>
      <HoliButton transparent inline label={title} onPress={() => navigate(primaryLink)}>
        <View style={styles.cardContent}>
          <View style={styles.thumbnailContainer}>
            {thumbnail ? (
              <HoliImage source={{ uri: thumbnail }} style={styles.thumbnail} label={title} />
            ) : (
              <HoliLocalImage
                imageSource={require('@holi/ui/assets/img/illustrations/illustration_thumbnail_placeholder.svg')}
                isSvg
                label={title}
                width={100}
                height={100}
              />
            )}
          </View>
          <View style={styles.detailsContainer}>
            <HoliText ellipsizeMode="tail" numberOfLines={2} bold>
              {title}
            </HoliText>
            {curator && (
              <View style={styles.curatorContainer}>
                {curator.avatar ? (
                  <HoliAvatar
                    imageSrc={curator.avatar}
                    imageBlurhash={curator.avatarBlurhash}
                    label={curator.fullName}
                    initials={curator.avatarLabel || ''}
                    defaultColor={curator.avatarDefaultColor || ''}
                    size="micro"
                    style={styles.curatorAvatar}
                  />
                ) : (
                  <HoliIcon style={styles.curatorAvatar} icon={AccountCircleFilled} color={colors.gray200} />
                )}
                <HoliText size="small" color="gray300">
                  {curator.fullName}
                </HoliText>
              </View>
            )}
            {published && (
              <HoliText size="extrasmall" color="gray300">
                {getRelativeDateString(published, i18n.language)}
              </HoliText>
            )}
          </View>
        </View>
      </HoliButton>
    </View>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.gray200,
    backgroundColor: colors.white100,
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
