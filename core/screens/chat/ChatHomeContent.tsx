import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { chatClient } from '@holi/chat/src/store'
import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import RoomListContainer from '@holi/core/screens/chat/RoomListContainer'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliNoResults from '@holi/ui/components/molecules/HoliNoResults'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const ChatHomeContent = () => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { isLoggedIn } = useLoggedInUser()
  const { navigate } = useRouting()

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

  if (!chatClient.isOn) return null

  return <RoomListContainer />
}

export default memo(ChatHomeContent)

const styles = StyleSheet.create({
  noResultsMessage: {
    marginTop: 24,
  },
})
