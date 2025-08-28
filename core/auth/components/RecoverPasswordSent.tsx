import type React from 'react'
import { useTranslation } from 'react-i18next'
import { View, type ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { Button } from 'holi-bricks/components/button'

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
          imageSource={require('@holi/ui/assets/img/illustrations/illustration_new_mail.svg')}
          width={251}
          height={181}
          label={t('profile.loggedOut.image')}
          isSvg
        />
      </View>
      <HoliBox padding={[20, 0, 0, 0]} />
      <HoliHeading level="2" size="m" align="center" testID="form-sent-headline">
        {t('auth.forgotPassword.success.headline')}
      </HoliHeading>
      <HoliText style={styles.text}>{t('auth.forgotPassword.success.text')}</HoliText>

      <View style={styles.button}>
        <Button
          label={t('auth.forgotPassword.success.button')}
          inline
          onPress={() => navigate('/')}
          testID="back-to-home-btn"
        />
      </View>
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
  text: {
    marginTop: 20,
    textAlign: 'center',
  },
  button: {
    marginTop: 40,
    alignSelf: 'center',
  },
})
