import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, ViewStyle } from 'react-native'

import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export type UpdatesOfYourAppsProps = {
  style?: (ViewStyle | Record<string, unknown>) | (ViewStyle | Record<string, unknown>)[]
}
const UpdatesOfYourApps: React.VFC<UpdatesOfYourAppsProps> = (props: UpdatesOfYourAppsProps) => {
  const mixins = useStyleMixins()
  const { t } = useTranslation()

  return (
    <View style={[mixins.container, styles.updatesOfYourApps, props.style]}>
      <HoliHeading size="large">{t('apps.updates.headline')}</HoliHeading>
      <View style={styles.updatesContainer} />
    </View>
  )
}

export default UpdatesOfYourApps

const styles = StyleSheet.create({
  updatesOfYourApps: {},
  updatesContainer: {
    // dummy ...
    minHeight: 200,
  },
})
