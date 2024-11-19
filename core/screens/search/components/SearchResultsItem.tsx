import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import type { User } from '@holi/core/domain/shared/types'
import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import SpaceAvatar from '@holi/core/screens/spaces/components/SpaceAvatar'
import type { Space } from '@holi/core/screens/spaces/types'
import { isHoliUser } from '@holi/core/screens/userprofile/types'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { Avatar } from 'holi-bricks/components/avatar'

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
            <Avatar
              imgSrc={item.avatar ?? ''}
              imgPlaceholder={item?.avatarBlurhash}
              label={item.avatarLabel ?? ''}
              initials={item.avatarLabel ?? ''}
              size="md"
            />
          ) : (
            <SpaceAvatar space={item} size="md" />
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
