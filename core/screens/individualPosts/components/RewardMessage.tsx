import React from 'react'
import { StyleSheet, View, Pressable, Linking } from 'react-native'
import { useTranslation } from 'react-i18next'

import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { Text } from 'holi-bricks/components/text'
import { Button } from 'holi-bricks/components/button'
import { LinkM } from '@holi/icons/src/generated'
import { breakpoints, Spacing } from 'holi-bricks/foundations'
import GoodDeedsCounterAnimation from '@holi/core/components/GoodDeedsCounterAnimation'

interface RewardMessageProps {
  campaignTag?: string
  deedCount?: number
  onClaim?: () => void
}

const RewardMessage: React.FC<RewardMessageProps> = ({ campaignTag = '#1MioguteTaten', deedCount = 0, onClaim }) => {
  const { theme } = useTheme()
  const { t } = useTranslation()
  const styles = React.useMemo(() => getStyles(theme), [theme])

  const labelText = t('goodDeeds.name', { count: deedCount })

  const handleMoreInfoPress = () => {
    if (campaignTag) {
      Linking.openURL('https://holi.social/1million')
    }
  }

  return (
    <View style={[styles.container]} testID="reward-message-container">
      <View style={styles.content}>
        <GoodDeedsCounterAnimation
          deedCount={deedCount}
          labelText={labelText}
          testID="reward-message-good-deeds-counter-animation"
          counterTestID="reward-message-good-deeds-counter-final"
          labelTestID="reward-message-good-deeds-counter-label"
        />
      </View>

      <View style={styles.subContent}>
        <View style={styles.descriptionContainer}>
          <Text size="xl" textAlign="center" testID="reward-message-text">
            {t('goodDeed.rewardsMessage.text')}
          </Text>
        </View>

        <Pressable style={styles.moreInfoContainer} onPress={handleMoreInfoPress} testID="reward-message-link">
          <Text size="lg" bold>
            {t('goodDeed.rewardsMessage.link')}
          </Text>
          <LinkM width={24} height={24} color={theme.colors.black300} />
        </Pressable>
      </View>

      <View style={styles.buttonContainer}>
        <Button label={t('goodDeed.rewardsMessage.button')} onPress={onClaim} size="md" testID="reward-claim-button" />
      </View>
    </View>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.background10,
      flex: 1,
    },
    holiContainer: {
      flex: 1,
      justifyContent: 'center',
      width: '100%',
      alignItems: 'center',
    },
    subContent: {
      flex: 1,
      justifyContent: 'center',
      width: '100%',
      alignItems: 'center',
      paddingHorizontal: Spacing.md,
    },
    content: {
      flex: 4,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    },
    descriptionContainer: {
      textAlign: 'center',
      marginBottom: Spacing.xs,
      maxWidth: 320,
    },
    moreInfoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing['4xs'],
    },
    buttonContainer: {
      width: '100%',
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.xl,
      maxWidth: breakpoints.sm,
    },
  })

export default RewardMessage
