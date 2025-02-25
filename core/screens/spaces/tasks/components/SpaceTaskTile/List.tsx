import { ChipLabel } from 'holi-bricks/components/chips'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import Content from '@holi/core/screens/spaces/tasks/components/SpaceTaskTile/components/Content'
import Skeleton from '@holi/core/screens/spaces/tasks/components/SpaceTaskTile/components/Skeleton'
import { TaskDrawer } from '@holi/core/screens/spaces/tasks/components/TaskDrawer'
import { VisibilityType } from '@holi/core/screens/spaces/types'
import { GlobeFilled, LockFilled } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { HoliCardComponent } from '@holi/ui/components/molecules/HoliCard'
import type { PropsWithSkeleton } from '@holi/ui/components/types'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

import Image from './components/Image'
import type { ListProps } from './types'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'

const IMAGE_HEIGHT = 136
const IMAGE_WIDTH = 311

const List = ({ loading, task, space, isCollaborator = false }: PropsWithSkeleton<ListProps>) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const loginState = useLoggedInUser()

  if (loading) {
    return <Skeleton />
  }

  const hiddenLink = (
    <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
      <HoliLink href={`/spaces/${space.name}/tasks/${task.id}`} label={task.name} isFullHeight />
    </View>
  )

  const isTaskOwner = loginState.isLoggedIn && isCollaborator && loginState.user.id === task.creator.id

  return (
    <HoliCardComponent.CardContainer hasBorder borderColor="foreground30at12Percent" borderRadius={16}>
      <Image
        imageUrl={task.thumbnail}
        imageBlurhash={task.thumbnailBlurhash}
        imageHeight={IMAGE_HEIGHT}
        imageWidth={IMAGE_WIDTH}
        imageAspectRatio={1.75}
      >
        {isCollaborator && (
          <ChipLabel iconLeading={task.visibility === VisibilityType.PUBLIC ? GlobeFilled : LockFilled} size="sm">
            {t(`spaces.input.task.visibility.${task.visibility}.title`)}
          </ChipLabel>
        )}
      </Image>

      {hiddenLink}

      <HoliCardComponent.ContentContainer>
        <View style={styles.detailContainer}>
          <View style={{ flex: 1 }}>
            <HoliText ellipsizeMode="tail" bold numberOfLines={2} testID="task-title">
              {task.name}
            </HoliText>
          </View>

          {hiddenLink}
          <TaskDrawer isOwner={isTaskOwner} taskId={task.id} spaceName={space.name} />
        </View>

        <Content task={task} />

        {hiddenLink}
      </HoliCardComponent.ContentContainer>
    </HoliCardComponent.CardContainer>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    detailContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      zIndex: 2,
      gap: 8,
    },
    imageCaption: {
      padding: 4,
      paddingRight: 8,
      flexDirection: 'row',
      alignItems: 'center',
    },
    visibilityCaption: {
      borderRadius: 24,
      borderWidth: 1,
      borderColor: theme.colors.background30,
      backgroundColor: theme.colors.background20,
    },
  })

export default List
