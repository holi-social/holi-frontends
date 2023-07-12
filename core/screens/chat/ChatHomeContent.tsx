import React from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, Platform, SafeAreaView, StyleSheet, View } from 'react-native'

import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { onScreenScrollY, useToastForNotAvailableFeature } from '@holi/core/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { chatRoomListSeed } from '@holi/core/screens/chat/components/seed'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliNoResults from '@holi/ui/components/molecules/HoliNoResults'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const ChatHomeContent = () => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { isLoggedIn } = useLoggedInUser()

  const { navigate } = useRouting()

  // TODO: remove after implementing the feature
  const showToast = useToastForNotAvailableFeature()

  if (!isLoggedIn) {
    return (
      <ScrollHeaderLayout.Default backgroundColor={colors.background20}>
        <View style={mixins.container}>
          <HoliNoResults
            firstText={t('loginRedirect.title')}
            media={
              <HoliLocalImage
                imageSource={require('@holi/ui/assets/img/illustrations/illustration_chat_emtpy.svg')}
                width={251}
                height={188}
                label=""
                isSvg
              />
            }
            secondText={t('loginRedirect.text')}
            style={[styles.noResultsMessage]}
          >
            <HoliButton label={t('loginRedirect.btnConfirm')} onPress={() => navigate('/login')}>
              {t('loginRedirect.btnConfirm')}
            </HoliButton>
          </HoliNoResults>
        </View>
      </ScrollHeaderLayout.Default>
    )
  }

  if (!chatRoomListSeed.length) {
    return (
      <ScrollHeaderLayout.Default backgroundColor={colors.background20}>
        <View style={mixins.container}>
          <HoliNoResults
            firstText={t('chat.empty.tagline')}
            media={
              <HoliLocalImage
                imageSource={require('@holi/ui/assets/img/illustrations/illustration_chat_emtpy.svg')}
                width={251}
                height={188}
                label=""
                isSvg
              />
            }
            secondText={t('chat.empty.headline')}
            style={[styles.noResultsMessage]}
          >
            <HoliButton label={t('loginRedirect.btnConfirm')} onPress={showToast}>
              {t('chat.empty.button.text')}
            </HoliButton>
          </HoliNoResults>
        </View>
      </ScrollHeaderLayout.Default>
    )
  }

  return (
    <SafeAreaView style={styles.wrapper}>
      <FlatList
        data={chatRoomListSeed}
          <HoliBox padding={[ROOM_ITEM_VERTICAL_PADDING, 0]}>
            <ConversationItem room={item} />
          </HoliBox>
        )}
        // use ListHeaderComponent to add padding bottom for HeaderAnimated
        ListHeaderComponent={() => <View style={styles.listHeaderSpacer} />}
        ItemSeparatorComponent={() => <View style={styles.listItemSeparator} />}
        keyExtractor={(item) => item.id}
        getItemLayout={(_, index) => ({
          length: ROOM_ITEM_HEIGHT,
          offset: ROOM_ITEM_HEIGHT * index,
          index,
        })}
        onScroll={onScreenScrollY}
        style={[mixins.container, styles.list]}
      />
    </SafeAreaView>
  )
}

export default ChatHomeContent

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background20,
    ...Platform.select({
      web: {
        minHeight: '100%',
      },
    }),
  },
  list: {
    height: '100%',
  },
  listHeaderSpacer: {
    height: vars.topBarHeight,
  },
  listItemSeparator: {
    borderColor: colors.background30,
    borderTopWidth: 1,
  },
  noResultsMessage: {
    marginTop: 24,
  },
})
