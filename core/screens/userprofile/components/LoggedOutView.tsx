import React, { VoidFunctionComponent } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, ViewStyle } from 'react-native'

import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'

export type LoggedOutViewProps = {
  style?: ViewStyle | Record<string, unknown>
}

const LoggedOutView: VoidFunctionComponent<LoggedOutViewProps> = (props: LoggedOutViewProps) => {
  const { t } = useTranslation()

  return (
    <View style={[styles.loggedOutView, props.style]}>
      <View style={styles.moodImage}>
        <HoliLocalImage
          imageSource={require('@holi/ui/assets/img/illustrations/illustration_logged_out.png')}
          width={189}
          height={158}
          label={t('profile.loggedOut.image')}
        />
      </View>
      <HoliHeading level="1" size="medium" style={styles.text} testID="user-profile-logged-out-heading">
        {t('profile.loggedOut.heading')}
      </HoliHeading>
    </View>
  )
}

const styles = StyleSheet.create({
  loggedOutView: {
    marginTop: 100,
  },
  moodImage: {
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
    marginTop: 45,
  },
})

export default LoggedOutView
