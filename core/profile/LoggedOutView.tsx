import React, { VoidFunctionComponent } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, ViewStyle } from 'react-native'

import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import SharedImage from '@holi/ui/components/atoms/SharedImage'

export type LoggedOutViewProps = {
  style?: ViewStyle | Record<string, unknown>
}

const LoggedOutView: VoidFunctionComponent<LoggedOutViewProps> = (props: LoggedOutViewProps) => {
  const { t } = useTranslation()

  return (
    <View style={[styles.loggedOutView, props.style]}>
      <View style={styles.moodImage}>
        <SharedImage
          imageFile={require('@holi/ui/assets/img/icons/illustration_logged_out.png')}
          isSvg={false}
          style={{ width: 200, height: 200 }}
          altText={t('profile.loggedOut.image')}
        />
      </View>
      <HoliHeading level="1" size="medium" style={styles.text}>
        {t('profile.loggedOut.heading')}
      </HoliHeading>
    </View>
  )
}

export default LoggedOutView

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
