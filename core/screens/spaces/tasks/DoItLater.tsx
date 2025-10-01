import React, { type PropsWithChildren } from 'react'
import { Text } from 'holi-bricks/components/text'
import { useTranslation } from 'react-i18next'
import HoliLottie from '@holi/ui/components/atoms/HoliLottie'
import { Stack } from 'holi-bricks/components/stack'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import { GoodDeedCard } from '@holi/core/screens/spaces/tasks/components/GoodDeedCard'
import type { MultiPlatformImageSource } from 'holi-bricks/components/image'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { setPathToRedirect } from '@holi/core/navigation/hooks/useRedirect'
import { setRedirectAfterSocialLogin } from '@holi/core/screens/spaces/tasks/helpers'
import { ButtonTracked } from '@holi/core/components/Trackable'
import { TrackingEvent } from '@holi/core/tracking'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { StepCheck, StepText } from '@holi/core/screens/spaces/tasks/components/progressSteps'
import { Spacing } from 'holi-bricks/foundations'
import { ScrollView } from 'react-native'

type DoItLaterProps = {
  id: string
  title: string
  imageSrc?: MultiPlatformImageSource
  completedCount: number
  onJoin?: () => void
  trackingProps: TrackingEvent.TaskProperties
}

type DoItLaterModalProps = PropsWithChildren & {
  shown: boolean
  onDismiss: () => void
}

const Frame = ({ children }: PropsWithChildren) => (
  <Stack
    padding="xxs"
    borderRadius="md"
    borderColor="default"
    borderWidth="sm"
    backgroundColor="support"
    direction="row"
    gap="xs"
  >
    {children}
  </Stack>
)

export const DoItLater = ({ id, title, imageSrc, completedCount, onJoin, trackingProps }: DoItLaterProps) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const { styles } = useStyles(stylesheet)

  return (
    <Stack gap="3xs" margin={{ top: 'md', bottom: 'xxl' }} padding="xs">
      <Text size="3xl" headingLevel="1" textAlign="center">
        {t('tasks.bookmark.unlogged.title')}
      </Text>
      <Text size="md" textAlign="center">
        {t('tasks.bookmark.unlogged.subtitle')}
      </Text>
      <HoliLottie animType="rocket" loop style={styles.animation} />
      <Frame>
        <StepCheck stage="done" size="lg" />
        <Stack gap="3xs" flexShrink={1}>
          <Text size="md">{t('tasks.bookmark.unlogged.step1')}</Text>
          <GoodDeedCard title={title} imageSrc={imageSrc} completedCount={completedCount} />
        </Stack>
      </Frame>
      <Frame>
        <StepText value="2" stage="inprogress" size="lg" />
        <Text size="md" flexShrink={1}>
          {t('tasks.bookmark.unlogged.step2')}
        </Text>
      </Frame>
      <Frame>
        <StepText value={3} size="lg" />
        <Text size="md" flexShrink={1}>
          {t('tasks.bookmark.unlogged.step3')}
        </Text>
      </Frame>
      <ButtonTracked
        label={t('tasks.bookmark.unlogged.cta')}
        margin={{ top: 'lg' }}
        onPress={() => {
          const addToFavoritesPath = `/profile/settings/favorites/add?taskId=${id}`
          setPathToRedirect(addToFavoritesPath)
          setRedirectAfterSocialLogin(addToFavoritesPath)
          onJoin?.()
          navigate('/onboarding')
        }}
        trackingEvent={TrackingEvent.Task.CTAButton.saveForLater({
          step: 'register',
          ...trackingProps,
        })}
      />
    </Stack>
  )
}

export const DoItLaterModal = ({ children, ...rest }: DoItLaterModalProps) => {
  const { theme } = useStyles()
  const { t } = useTranslation()

  return (
    <HoliModal
      label={t('tasks.bookmark.unlogged.subtitle')}
      autoHeight={false}
      relativeHeight={100}
      backgroundColor={theme.colors.bg.main}
      {...rest}
    >
      <HoliContainer noPaddingOnSmallViewports flex={1}>
        <ScrollView>{children}</ScrollView>
      </HoliContainer>
    </HoliModal>
  )
}

const stylesheet = createStyleSheet({
  animation: {
    width: '100%',
    position: 'relative',
    aspectRatio: 342 / 130,
    paddingVertical: Spacing.sm,
  },
})
