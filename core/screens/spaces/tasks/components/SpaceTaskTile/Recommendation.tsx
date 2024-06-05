import React, { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import SpaceAvatar from '@holi/core/screens/spaces/components/SpaceAvatar'
import Content from '@holi/core/screens/spaces/tasks/components/SpaceTaskTile/components/Content'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { HoliCardComponent } from '@holi/ui/components/molecules/HoliCard'
import { PropsWithSkeleton } from '@holi/ui/components/types'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

import Image from './components/Image'
import Skeleton from './components/Skeleton'
import { BaseProps } from './types'

const IMAGE_HEIGHT = 136
const IMAGE_WIDTH = 311

const Recommendation = ({ loading, task, space }: PropsWithSkeleton<BaseProps>) => {
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  if (loading) {
    return <Skeleton />
  }

  return (
    <HoliLink href={`/spaces/${space.name}/tasks/${task.id}`} label={task.name} isFullHeight>
      <HoliCardComponent.CardContainer hasBorder borderColor="gray200" borderRadius={16}>
        <Image
          imageUrl={task.thumbnail}
          imageBlurhash={task.thumbnailBlurhash}
          imageHeight={IMAGE_HEIGHT}
          imageWidth={IMAGE_WIDTH}
        >
          <View style={[styles.imageCaption, styles.spaceCaption]}>
            <SpaceAvatar space={space} size="micro" />
            <HoliText size="extrasmall" color="gray300">
              {space.name}
            </HoliText>
          </View>
        </Image>

        <HoliCardComponent.ContentContainer>
          <HoliText ellipsizeMode="tail" bold numberOfLines={2} testID="task-title">
            {task.name}
          </HoliText>

          <Content task={task} recommendation />
        </HoliCardComponent.ContentContainer>
      </HoliCardComponent.CardContainer>
    </HoliLink>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    imageCaption: {
      padding: 4,
      paddingRight: 8,
      flexDirection: 'row',
      alignItems: 'center',
    },
    spaceCaption: {
      borderRadius: 6,
      gap: 4,
      backgroundColor: theme.colors.background10,
    },
  })

export default Recommendation
