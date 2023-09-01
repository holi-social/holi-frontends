import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import DefaultLayout from '@holi/core/components/DefaultLayout'
import { FeatureToggleName, useFeatureToggle } from '@holi/core/helpers/useFeatureToggle'
import { FeatureToggleStatus } from '@holi/core/screens/homeFeed/queries'
import CollaboratorAreaCard from '@holi/core/screens/spaces/linkHub/components/CollaborationAreaCard'
import { Zzz } from '@holi/icons/src/generated'
import HoliLottie from '@holi/ui/components/atoms/HoliLottie'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

interface FeatureToggleGuardProps {
  toggleName: FeatureToggleName
  featureNameKey: string
  noLayout?: boolean
  style?: StyleProp<ViewStyle>
}

const FeatureToggleGuard: React.FC<React.PropsWithChildren<FeatureToggleGuardProps>> = ({
  toggleName,
  featureNameKey,
  style,
  noLayout = false,
  children,
}) => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()

  const { loading: ftLoading, status } = useFeatureToggle(toggleName)
  const ftOff = status === FeatureToggleStatus.OFF
  const ftMaintenance = status === FeatureToggleStatus.MAINTENANCE

  if (ftLoading) {
    const content = (
      <View style={styles.loader}>
        <HoliLottie animType="loader" />
      </View>
    )
    return noLayout ? content : <DefaultLayout>{content}</DefaultLayout>
  } else if (ftOff) {
    return <></>
  } else if (ftMaintenance) {
    const content = (
      <CollaboratorAreaCard
        headerLeftIcon={Zzz}
        title={t('global.maintenance.title', { feature: t(featureNameKey) })}
        disabled={true}
        style={[mixins.container, styles.container, style]}
      >
        <HoliText size="small" style={styles.maintenance}>
          {t('global.maintenance.description')}
        </HoliText>
      </CollaboratorAreaCard>
    )
    return noLayout ? content : <DefaultLayout>{content}</DefaultLayout>
  }

  return children
}

export default memo(FeatureToggleGuard)

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    backgroundColor: colors.background30,
  },
  maintenance: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  loader: {
    height: 64,
    width: 64,
    alignSelf: 'center',
    justifyContent: 'center',
  },
})
