import { useChat } from '@holi/core/hooks/useStartChat'
import { QuestionAnswerLine } from '@holi/icons/src/generated'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliActionDrawer from '@holi/ui/components/organisms/HoliActionDrawer'
import dimensions from '@holi/ui/styles/globalVars/dimensions'
import { Button } from 'holi-bricks/components/button'
import { Text } from 'holi-bricks/components/text'
import { useStyles } from 'holi-bricks/hooks'
import { Spacing } from 'holi-bricks/tokens'
import { createStyleSheet } from 'holi-bricks/utils'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, View } from 'react-native'

type AskQuestionProps = {
  isMember?: boolean
  representativeIdentity?: string
}

export const AskQuestion = ({ representativeIdentity }: AskQuestionProps) => {
  const { styles } = useStyles(stylesheet)
  const { startChat, isLoading } = useChat()
  const { t } = useTranslation()

  return (
    <HoliActionDrawer.Drawer
      customTrigger={(onPress, testID) => (
        <View
          style={[
            styles.ctaWrapper,
            Platform.OS === 'web' && {
              position: 'fixed',
            },
          ]}
          testID={testID}
        >
          <Button
            onPress={onPress}
            variant="primary"
            icon={QuestionAnswerLine}
            size="lg"
            iconSize="xs"
            label={t('spaces.askInfo')}
          />
        </View>
      )}
      label={t('global.options')}
      testID="ask-space-question"
    >
      <View style={styles.ctaDrawerContentWrapper}>
        <HoliLocalImage
          imageSource={require('@holi/ui/assets/img/spaces/chat.svg')}
          isSvg
          label="chat"
          width={40}
          height={36}
          resizeMode="contain"
        />
        <View style={styles.ctaDrawerContent}>
          <Text size="3xl">{t('spaces.connectTitle')}</Text>
          <Text size="md">{t('spaces.connectDescription')}</Text>
        </View>
        <Button
          loading={isLoading}
          disabled={isLoading}
          onPress={() => {
            if (representativeIdentity) {
              startChat(representativeIdentity)
            }
          }}
          variant="primary"
          size="lg"
          label={t('spaces.connectCta')}
        />
      </View>
    </HoliActionDrawer.Drawer>
  )
}

const stylesheet = createStyleSheet(() => ({
  ctaDrawerContent: {
    flexDirection: 'column',
    gap: 8,
  },
  ctaDrawerContentWrapper: {
    flexDirection: 'column',
    gap: 16,
  },
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
