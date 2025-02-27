import type React from 'react'
import { Animated, Pressable, StyleSheet } from 'react-native'
import { Text } from 'holi-bricks/components/text/Text'
import { Button } from 'holi-bricks/components/button/Button'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Refresh } from '@holi/icons/src/generated'
import Spacing from '@holi/ui/foundations/Spacing'
import { useTheme } from '@holi/ui/styles/theme'
import { useTranslation } from 'react-i18next'

interface EmailContentProps {
  resubscribe: boolean
  isResubscribed: boolean
  fadeAnim?: Animated.Value
  series: string
  email: string
  onResubscribe: () => void
  onLogin: () => void
}

export const EmailContent: React.FC<EmailContentProps> = ({
  resubscribe = false,
  isResubscribed,
  fadeAnim,
  series,
  email,
  onResubscribe,
  onLogin,
}) => {
  const { theme } = useTheme()
  const { t } = useTranslation()

  let fullSeriesName = series

  switch (series) {
    case 'welcome':
      fullSeriesName = t('email.unsubscribe.welcomeSeries')
      break
  }

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
      }}
    >
      <Text size="xxl" color="main" textAlign="left">
        {isResubscribed
          ? t('email.resubscribe.description', { series: fullSeriesName, email })
          : t('email.unsubscribe.description', { series: fullSeriesName, email })}
      </Text>

      <HoliGap size="ml" />

      {!isResubscribed && resubscribe ? (
        <>
          <Text size="md" color="main" textAlign="left">
            {t('email.unsubscribe.subText')}
          </Text>

          <HoliGap size="s" />

          <Pressable onPress={onResubscribe} style={styles.resubscribeButton}>
            <Text size="lg" color="informative" textAlign="left">
              {t('email.unsubscribe.button')}
            </Text>
            <HoliIcon icon={Refresh} size={24} color={theme.colors.brandB300} />
          </Pressable>

          <HoliGap size="ml" />
        </>
      ) : null}

      <Button size="lg" label="Log into holi" variant="primary" onPress={onLogin} />
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  resubscribeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['4xs'],
  },
})
