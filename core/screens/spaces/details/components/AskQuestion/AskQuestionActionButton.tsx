import { ButtonTracked } from '@holi/core/components/Trackable'
import { TrackingEvent } from '@holi/core/tracking'
import { QuestionAnswerLine } from '@holi/icons/src/generated'
import dimensions from '@holi/ui/styles/globalVars/dimensions'
import { useStyles } from 'holi-bricks/styles'
import { Spacing } from 'holi-bricks/foundations'
import { createStyleSheet } from 'holi-bricks/styles'
import React, {} from 'react'
import { Platform, View } from 'react-native'
import { useTranslation } from 'react-i18next'

export const AskQuestionActionButton = (props: {
  testID: string | undefined
  onPress: () => void
}) => {
  const { styles } = useStyles(askQuestionButtonStyles)
  const { t } = useTranslation()
  const label = t('spaces.askInfo')
  return (
    <View
      style={[
        styles.ctaWrapper,
        Platform.OS === 'web' && {
          position: 'fixed',
        },
      ]}
      testID={props.testID}
    >
      <ButtonTracked
        trackingEvent={TrackingEvent.SpaceAskQuestion.startedConversation}
        onPress={props.onPress}
        variant="primary"
        icon={QuestionAnswerLine}
        size="lg"
        label={label}
      />
    </View>
  )
}

const askQuestionButtonStyles = createStyleSheet(() => ({
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
