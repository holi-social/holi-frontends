import type React from 'react'
import { Animated } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import Spacing from '@holi/ui/foundations/Spacing'

interface EmailIllustrationProps {
  isResubscribed: boolean
  fadeAnim?: Animated.Value
}

export const EmailIllustration: React.FC<EmailIllustrationProps> = ({ isResubscribed, fadeAnim }) => {
  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
        },
      ]}
    >
      <HoliLocalImage
        imageSource={
          isResubscribed
            ? require('@holi/ui/assets/img/illustrations/resubscribe_illustration.svg')
            : require('@holi/ui/assets/img/illustrations/unsubscribe_illustration.svg')
        }
        width={74}
        height={72}
        label={isResubscribed ? 'Email Resubscribe' : 'Email Unsubscribe'}
        isSvg
      />
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    marginBottom: Spacing['3xs'],
  },
})
