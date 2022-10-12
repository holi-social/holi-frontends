import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, ViewStyle } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

export type RecoverPasswordSentProps = {
  style?: ViewStyle | ViewStyle[]
}

const RecoverPasswordSent: React.FC<RecoverPasswordSentProps> = (props: RecoverPasswordSentProps) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()

  return (
    <View style={[styles.viewContainer, props.style]}>
      <View style={styles.moodImage}>
        <HoliLocalImage
          imageSource={require('@holi/ui/assets/img/illustrations/illustration_look_out.png')}
          width={217}
          height={158}
          label={t('profile.loggedOut.image')}
          style={{ borderWidth: 2, borderColor: '#0f0', width: 300 }}
        />
      </View>
      <HoliHeading level="2" size="medium" style={styles.heading}>
        {t('auth.forgotPassword.success.headline')}
      </HoliHeading>
      <HoliText style={styles.text}>{t('auth.forgotPassword.success.text')}</HoliText>

      <HoliButton
        label={t('auth.forgotPassword.success.button')}
        inline
        onPress={() => navigate('/')}
        style={styles.button}
      >
        {t('auth.forgotPassword.success.button')}
      </HoliButton>
    </View>
  )
}

export default RecoverPasswordSent

const styles = StyleSheet.create({
  viewContainer: {
    width: '100%',
  },
  moodImage: {
    alignItems: 'center',
  },
  heading: {
    marginTop: 40,
    textAlign: 'center',
  },
  text: {
    marginTop: 40,
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
    alignSelf: 'center',
  },
})
