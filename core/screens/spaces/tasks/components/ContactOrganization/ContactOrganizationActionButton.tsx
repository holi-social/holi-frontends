import { ButtonTracked } from '@holi/core/components/Trackable'
import { TrackingEvent } from '@holi/core/tracking'
import { ChatSmile2 } from '@holi/icons/src/generated'
import dimensions from '@holi/ui/styles/globalVars/dimensions'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import { Spacing } from 'holi-bricks/foundations'
import React, {} from 'react'
import { Platform, View } from 'react-native'
import { useTranslation } from 'react-i18next'

interface Props {
  onPress: () => void
  loading?: boolean
  testID?: string
}

export const ContactOrganizationActionButton = ({ onPress, testID, loading }: Props) => {
  const { styles } = useStyles(stylesheet)
  const { t } = useTranslation()

  return (
    <View
      style={[
        styles.ctaWrapper,
        Platform.OS === 'web' && {
          position: 'fixed',
        },
      ]}
      testID={testID}
    >
      <ButtonTracked
        trackingEvent={TrackingEvent.TaskContactOrganization.startedConversationFromTask}
        onPress={onPress}
        loading={loading}
        disabled={loading}
        variant="primary"
        icon={ChatSmile2}
        size="lg"
        label={t('spaces.tasks.contactOrganization')}
      />
    </View>
  )
}

const stylesheet = createStyleSheet(() => ({
  ctaWrapper: {
    padding: Spacing.xxs,
    left: 0,
    right: 0,
    bottom: 0,
    maxWidth: Number(dimensions.maxScreenWidth),
    position: 'absolute',
    marginHorizontal: 'auto',
  },
}))
