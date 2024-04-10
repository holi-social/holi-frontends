import React, { type PropsWithChildren, memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import DefaultLayout from '@holi/core/components/DefaultLayout'
import { FeatureToggleName, useFeatureToggle } from '@holi/core/helpers/useFeatureToggle'
import CollaboratorAreaCard from '@holi/core/screens/spaces/linkHub/components/CollaborationAreaCard'
import { Zzz } from '@holi/icons/src/generated'
import HoliLottie from '@holi/ui/components/atoms/HoliLottie'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

interface FeatureToggleGuardProps {
  toggleName: FeatureToggleName
  featureNameKey: string
  noLayout?: boolean
  style?: StyleProp<ViewStyle>
}

const FeatureToggleGuard = ({
  toggleName,
  featureNameKey,
  style,
  noLayout = false,
  children,
}: PropsWithChildren<FeatureToggleGuardProps>) => {
  const { theme } = useTheme()
  const { ftLoading, ftOff, ftMaintenance } = useFeatureToggle(toggleName)
  const styles = useMemo(() => getStyles(theme), [theme])

  if (ftLoading) return <Loading styles={styles} hasLayout={noLayout} />
  if (ftOff) return null
  if (ftMaintenance) return <Maintenance styles={styles} hasLayout={noLayout} name={featureNameKey} style={style} />

  return children
}

export default memo(FeatureToggleGuard)

interface ConditionalLayoutProps {
  hasLayout: boolean
}

function ConditionalLayout({ children, hasLayout }: PropsWithChildren<ConditionalLayoutProps>) {
  return hasLayout ? children : <DefaultLayout>{children}</DefaultLayout>
}

interface LoadingProps extends ConditionalLayoutProps {
  styles: ReturnType<typeof getStyles>
}

function Loading({ hasLayout, styles }: LoadingProps) {
  return (
    <ConditionalLayout hasLayout={hasLayout}>
      <View style={styles.loader} testID="feature-toggle-guard-loader">
        <HoliLottie animType="loader" />
      </View>
    </ConditionalLayout>
  )
}

interface MaintenanceContentProps extends ConditionalLayoutProps {
  styles: ReturnType<typeof getStyles>
  name: string
  style?: StyleProp<ViewStyle>
}

function Maintenance({ style, styles, hasLayout, name }: MaintenanceContentProps) {
  const { t } = useTranslation()
  const mixins = useStyleMixins()

  return (
    <ConditionalLayout hasLayout={hasLayout}>
      <CollaboratorAreaCard
        headerLeftIcon={Zzz}
        title={t('global.maintenance.title', { feature: t(name) })}
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
