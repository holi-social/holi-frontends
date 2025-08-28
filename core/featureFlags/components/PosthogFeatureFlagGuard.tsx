import React, { type PropsWithChildren, memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import DefaultLayout from '@holi/core/components/DefaultLayout'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { useFeatureFlagWithMaintenance } from '@holi/core/featureFlags/hooks/useFeatureFlagWithMaintenance'
import CollaboratorAreaCard from '@holi/core/screens/spaces/linkHub/components/CollaborationAreaCard'
import { Zzz } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

interface PosthogFeatureFlagGuardProps {
  featureFlagKey: FeatureFlagKey
  i18nKey: string
  noLayout?: boolean
  style?: StyleProp<ViewStyle>
}

/**
 * Only to be used in conjunction with multivariate feature toggles with these three possible values:
 *
 * 1. "on"
 * 2. "off"
 * 3. "maintenance"
 */
const PosthogFeatureFlagGuard = ({
  featureFlagKey,
  i18nKey,
  style,
  noLayout = false,
  children,
}: PropsWithChildren<PosthogFeatureFlagGuardProps>) => {
  const { theme } = useTheme()
  const ff = useFeatureFlagWithMaintenance(featureFlagKey)
  const styles = useMemo(() => getStyles(theme), [theme])

  if (ff.isUnknown || ff.isOff) return null
  else if (ff.inMaintenance) return <Maintenance styles={styles} hasLayout={noLayout} i18nKey={i18nKey} style={style} />
  else return children
}

export default memo(PosthogFeatureFlagGuard)

interface ConditionalLayoutProps {
  hasLayout: boolean
}

function ConditionalLayout({ children, hasLayout }: PropsWithChildren<ConditionalLayoutProps>) {
  return hasLayout ? children : <DefaultLayout>{children}</DefaultLayout>
}

interface MaintenanceContentProps extends ConditionalLayoutProps {
  styles: ReturnType<typeof getStyles>
  i18nKey: string
  style?: StyleProp<ViewStyle>
}

function Maintenance({ style, styles, hasLayout, i18nKey }: MaintenanceContentProps) {
  const { t } = useTranslation()
  const mixins = useStyleMixins()

  return (
    <ConditionalLayout hasLayout={hasLayout}>
      <CollaboratorAreaCard
        headerLeftIcon={Zzz}
        title={t('global.maintenance.title', { feature: t(i18nKey) })}
        disabled={true}
        style={[mixins.container, styles.container, style]}
      >
        <HoliText size="small" style={styles.maintenance}>
          {t('global.maintenance.description')}
        </HoliText>
      </CollaboratorAreaCard>
    </ConditionalLayout>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 0,
      backgroundColor: theme.colors.background30,
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
