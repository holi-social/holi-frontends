import { useQuery } from '@apollo/client'
import { FlashList } from '@shopify/flash-list'
import { useAtomValue } from 'jotai'
import React, { memo } from 'react'
import { Platform, StyleSheet, View } from 'react-native'

import { roomAtomsNamesAtom } from '@holi/chat/src/store'
import { onScreenScrollY } from '@holi/core/helpers'
import { useSafeAreaInsets } from '@holi/core/helpers/useSafeAreaInsets'
import RoomItem, { ROOM_ITEM_HEIGHT } from '@holi/core/screens/chat/components/RoomList/RoomItem'
import {
  UsersByChatIdentitiesQueryVariables,
  UsersByChatIdentitiesResponse,
  usersByChatIdentitiesQuery,
} from '@holi/core/screens/userprofile/queries'
import { colors, vars } from '@holi/ui/styles/globalVars'

import type { RoomListProps } from './types'

const RoomList = ({ roomAtoms }: RoomListProps) => {
  const { top: safeAreaInsetTop } = useSafeAreaInsets()
  const roomNames = useAtomValue(roomAtomsNamesAtom)

  const { data } = useQuery<UsersByChatIdentitiesResponse, UsersByChatIdentitiesQueryVariables>(
    usersByChatIdentitiesQuery,
    {
      variables: {
        identities: roomNames,
        offset: 0,
        limit: roomNames.length,
      },
      skip: !roomNames.length,
    }
  )
  const chatUsers = data?.usersByChatIdentities.data ?? []

  return (
    <FlashList
      data={Object.values(roomAtoms)}
      renderItem={({ item, index }) => <RoomItem roomAtom={item} user={chatUsers[index]} />}
      keyExtractor={(item) => item.toString()}
      estimatedItemSize={ROOM_ITEM_HEIGHT}
      ListHeaderComponent={() => (
        <View style={{ height: +vars.topBarHeight + (Platform.OS === 'android' ? safeAreaInsetTop : 0) }} />
      )}
      ItemSeparatorComponent={() => <View style={styles.listItemSeparator} />}
      onScroll={onScreenScrollY}
      contentContainerStyle={{ paddingHorizontal: 16 }}
    />
  )
}

export default memo(RoomList)

const styles = StyleSheet.create({
  listItemSeparator: {
    borderColor: colors.background30,
    borderTopWidth: 1,
  },
})
