import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { User } from '@holi/core/domain/shared/types'
import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import SpaceAvatar from '@holi/core/screens/spaces/components/SpaceAvatar'
import { Space } from '@holi/core/screens/spaces/types'
import { isHoliUser } from '@holi/core/screens/userprofile/types'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'

interface SearchResultsItemProps {
  item: User | Space
}

const SearchResultsItem = ({ item }: SearchResultsItemProps) => {
  const { t } = useTranslation()

  return (
    <HoliLink
      href={isHoliUser(item) ? `/profile/${item.id}` : `/spaces/${item.id}`}
      label={
        isHoliUser(item)
          ? t('user.visitProfile', { name: item.fullName })
          : t('space.visitProfile', { title: item.title })
      }
    >
      <View style={[styles.flexRow, styles.flex]}>
        <HoliBox padding={[0, 16, 0, 0]}>
          {isHoliUser(item) ? (
            <HoliAvatar
              imageSrc={item.avatar ?? ''}
              imageBlurhash={item.avatarBlurhash ?? ''}
              label={item.avatarLabel ?? ''}
              initials={item.avatarLabel ?? ''}
              defaultColor={item.avatarDefaultColor ?? ''}
              size="medium"
            />
          ) : (
            <SpaceAvatar space={item} size="medium" />
          )}
        </HoliBox>

        <View>
          <HoliText>{isHoliUser(item) ? item.fullName : item.title}</HoliText>
        </View>
      </View>
    </HoliLink>
  )
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})

export default SearchResultsItem
