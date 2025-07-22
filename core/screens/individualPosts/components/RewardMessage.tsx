import React from 'react'
import { StyleSheet, View, Pressable, Linking } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Image } from 'holi-bricks/components/image'

import { dimensions } from '@holi/ui/styles/globalVars'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { Text } from 'holi-bricks/components/text'
import { Button } from 'holi-bricks/components/button'
import { LinkM } from '@holi/icons/src/generated'

interface RewardMessageProps {
  campaignTag?: string
  goodDeedCount?: number
  onClaim?: () => void
}

const RewardMessage: React.FC<RewardMessageProps> = ({
  campaignTag = '#1MioguteTaten',
  goodDeedCount = 1,
  onClaim,
}) => {
  const { theme } = useTheme()
  const { t } = useTranslation()
  const styles = React.useMemo(() => getStyles(theme), [theme])

  const handleMoreInfoPress = () => {
    // This would link to more information about the campaign
    if (campaignTag) {
      Linking.openURL(`https://holi.com/campaigns/${campaignTag.replace('#', '')}`)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Icon would be replaced with actual SVG component */}
        {/* This is a placeholder for the handshake heart icon */}
        <View style={styles.iconContainer}>
          <Image
            source={require('@holi/ui/assets/img/posts/category-illustrationsV2.svg')}
            width={120}
            height={120}
            alt="Handshake Heart"
          />
        </View>
        <Text headingLevel="1" size="5xl" bold>
          {goodDeedCount}
        </Text>
        <View style={styles.countContainer}>
          <Text headingLevel="2" size="3xl">
            Good Deed
          </Text>
        </View>
      </View>

      <View style={styles.subContent}>
        <View style={styles.descriptionContainer}>
          <Text size="xl">Your contribution counts as a good deed - for you and our joint million.</Text>
        </View>
        <Pressable style={styles.moreInfoContainer} onPress={handleMoreInfoPress}>
          <Text size="lg" bold>
            {`More about ${campaignTag}`}
          </Text>
          <LinkM width={24} height={24} color={theme.colors.black300} />
        </Pressable>
      </View>
      <View style={styles.buttonContainer}>
        <Button label={t('global.claim', 'Claim')} onPress={onClaim} size="md" />
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
    },
    content: {
      flex: 4,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: dimensions.spacingM,
      width: '100%',
    },
    countContainer: {
      top: -8,
    },
    iconContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      bottom: -16,
    },
    descriptionContainer: {
      textAlign: 'center',
      marginBottom: dimensions.spacingS,
      maxWidth: 320,
    },
    moreInfoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: dimensions.spacingXxs,
    },
    buttonContainer: {
      width: '100%',
      paddingHorizontal: dimensions.spacingM,
      paddingVertical: dimensions.spacingL,
    },
  })

export default RewardMessage
