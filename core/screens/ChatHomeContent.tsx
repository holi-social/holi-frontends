import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { useToastForNotAvailableFeature } from '@holi/core/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliNoResults from '@holi/ui/components/molecules/HoliNoResults'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const ChatHomeContent = () => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { isLoggedIn } = useLoggedInUser()

  const { navigate } = useRouting()

  // TODO: remove after implementing the feature
  const showToast = useToastForNotAvailableFeature()

  return !isLoggedIn ? (
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
  ) : (
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
  )
}

export default memo(ChatHomeContent)

const styles = StyleSheet.create({
  noResultsMessage: {
    marginTop: 24,
  },
})
