import React, { type PropsWithChildren } from 'react'
import { Text } from 'holi-bricks/components/text'
import { useTranslation } from 'react-i18next'
import HoliLottie from '@holi/ui/components/atoms/HoliLottie'
import { Stack } from 'holi-bricks/components/stack'
import HoliModal from '@holi/ui/components/molecules/HoliModal'
import { useStyles } from 'holi-bricks/styles'
import { GoodDeedCard } from '@holi/core/screens/spaces/tasks/components/GoodDeedCard'
import { Button } from 'holi-bricks/components/button'
import type { MultiPlatformImageSource } from 'holi-bricks/components/image'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { setPathToRedirect } from '@holi/core/navigation/hooks/useRedirect'

const Frame = ({ children }: PropsWithChildren) => (
  <Stack padding="xxs" borderRadius="md" borderColor="default" borderWidth="sm" backgroundColor="support">
    {children}
  </Stack>
)

type DoItLaterProps = {
  id: string
  title: string
  imageSrc?: MultiPlatformImageSource
}

export const DoItLater = ({ id, title, imageSrc }: DoItLaterProps) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()

  return (
    <Stack gap="3xs" margin={{ top: 'md' }} padding="xs">
      <Text size="3xl" headingLevel="1" textAlign="center">
        {t('tasks.bookmark.unlogged.title')}
      </Text>
      <Text size="md" textAlign="center">
        {t('tasks.bookmark.unlogged.subtitle')}
      </Text>
      <HoliLottie animType="rocket" loop style={{ aspectRatio: 342 / 130 }} />
      <Frame>
        <Text size="md">{t('tasks.bookmark.unlogged.step1')}</Text>
        <GoodDeedCard title={title} imageSrc={imageSrc} completedCount={10} />
      </Frame>
      <Frame>
        <Text size="md">{t('tasks.bookmark.unlogged.step2')}</Text>
      </Frame>
      <Frame>
        <Text size="md">{t('tasks.bookmark.unlogged.step3')}</Text>
      </Frame>
      <Button
        label={t('tasks.bookmark.unlogged.cta')}
        margin={{ top: 'lg' }}
        onPress={() => {
          setPathToRedirect(`/profile/settings/favorites/add?taskId=${id}`)
          navigate('/onboarding')
        }}
      />
    </Stack>
  )
}

type DoItLaterModalProps = PropsWithChildren & {
  shown: boolean
  onDismiss: () => void
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
      {children}
    </HoliModal>
  )
}
