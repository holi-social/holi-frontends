import { useQuery } from '@apollo/client'
import { useAtomValue } from 'jotai'
import React from 'react'
import { FlatList, StyleSheet, View } from 'react-native'

import { roomAtomsNamesAtom } from '@holi/chat/src/store'
import { onScreenScrollY } from '@holi/core/helpers'
import RoomItem, { ROOM_ITEM_HEIGHT } from '@holi/core/screens/chat/components/RoomList/RoomItem'
import {
  UsersByChatIdentitiesQueryVariables,
  UsersByChatIdentitiesResponse,
  usersByChatIdentitiesQuery,
} from '@holi/core/screens/userprofile/queries'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import type { RoomListProps } from './types'

const RoomList = ({ roomAtoms }: RoomListProps) => {
  const mixins = useStyleMixins()
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
    <FlatList
      data={Object.values(roomAtoms)}
      renderItem={({ item, index }) => <RoomItem roomAtom={item} user={chatUsers[index]} />}
      // use ListHeaderComponent to add the List space above for HeaderAnimated
      ListHeaderComponent={() => <View style={styles.listHeaderSpacer} />}
      ListFooterComponent={() => <View style={styles.listFooterSpacer} />}
      ItemSeparatorComponent={() => <View style={styles.listItemSeparator} />}
      keyExtractor={(item) => item.toString()}
      getItemLayout={(_, index) => ({
        length: ROOM_ITEM_HEIGHT,
        offset: ROOM_ITEM_HEIGHT * index,
        index,
      })}
      onScroll={onScreenScrollY}
      style={[mixins.container, styles.list]}
    />
  )
}

export default RoomList

const styles = StyleSheet.create({
  list: {
    height: '100%',
  },
  listHeaderSpacer: {
    height: vars.topBarHeight,
  },
  listFooterSpacer: {
    height: vars.bottomBarHeight,
  },
  listItemSeparator: {
    borderColor: colors.background30,
    borderTopWidth: 1,
  },
})
