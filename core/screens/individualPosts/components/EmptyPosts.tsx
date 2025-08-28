import React from 'react'
import { useTranslation } from 'react-i18next'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import { Button } from 'holi-bricks/components/button'
import { Text } from 'holi-bricks/components/text'
import { Stack } from 'holi-bricks/components/stack'

const EmptyPosts = () => {
  const { t } = useTranslation()
  const { navigate } = useRouting()

  return (
    <Stack
      backgroundColor="support"
      borderRadius="md"
      padding={{ top: 'lg', bottom: 'xl', left: 'md', right: 'md' }}
      borderColor="default"
      borderWidth="sm"
      gap="md"
      alignItems="center"
    >
      <HoliLocalImage
        imageSource={require('@holi/ui/assets/img/illustrations/illustration_feed_post.svg')}
        isSvg
        label={''}
        width={231}
        height={164}
      />
      <Stack gap="3xs">
        <Text size="md" textAlign="center">
          {t('individuals.post.emptyTitle')}
        </Text>
        <Text size="xxl" textAlign="center">
          {t('individuals.post.emptyPrompt')}
        </Text>
      </Stack>
      <Button inline label={t('individuals.post.input.first')} onPress={() => navigate('/feed-posts/create')} />
    </Stack>
  )
}

export default EmptyPosts
