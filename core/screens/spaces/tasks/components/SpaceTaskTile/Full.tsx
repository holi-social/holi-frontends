import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import SpaceAvatar from '@holi/core/screens/spaces/components/SpaceAvatar'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { HoliCardComponent } from '@holi/ui/components/molecules/HoliCard'
import type { PropsWithSkeleton } from '@holi/ui/components/types'

import Content from './components/Content'
import Image from './components/Image'
import Skeleton from './components/Skeleton'
import type { BaseProps } from './types'

const IMAGE_HEIGHT = 166
const IMAGE_WIDTH = 311

const List = ({ loading, task, space }: PropsWithSkeleton<BaseProps>) => {
  const { t } = useTranslation()

  if (loading) {
    return <Skeleton descriptionWithDetails />
  }

  return (
    <HoliCardComponent.CardContainer hasBorder borderColor="foreground30at12Percent" borderRadius={16}>
      <Image
        imageUrl={task.thumbnail}
        imageBlurhash={task.thumbnailBlurhash}
        imageHeight={IMAGE_HEIGHT}
        imageWidth={IMAGE_WIDTH}
      />

      <HoliCardComponent.ContentContainer>
        <HoliText bold testID="task-title">
          {task.name}
        </HoliText>

        <HoliGap size="xs" />
        <HoliLink
          label={space.title ? t('space.visitProfile', { title: space.title }) : ''}
          href={`/spaces/${space.name}`}
        >
          <View style={styles.space}>
            <SpaceAvatar space={space} size="xs" />
            <HoliText size="small">
              <Trans t={t} i18nKey="spaces.tasks.details.space" values={{ space: space.title }}>
                <HoliText size="small" bold />
              </Trans>
            </HoliText>
          </View>
        </HoliLink>
        <HoliGap size={'s'} />

        <Content task={task} richTextOutputColor="support" descriptionWithDetails />
      </HoliCardComponent.ContentContainer>
    </HoliCardComponent.CardContainer>
  )
}

const styles = StyleSheet.create({
  space: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
})

export default List
