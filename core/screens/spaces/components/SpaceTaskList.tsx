import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { useBreakpointMatcher } from '@holi/core/helpers'
import CollaboratorAreaCard from '@holi/core/screens/spaces/components/CollaborationAreaCard'
import NoDataCard from '@holi/core/screens/spaces/components/NoDataCard'
import DigitalToolKit from '@holi/core/screens/spaces/components/SpaceLinkHub/DigitalToolKit'
import StorageWidget from '@holi/core/screens/spaces/components/SpaceLinkHub/StorageWidget'
import SpaceTaskTile from '@holi/core/screens/spaces/components/SpaceTaskTile'
import { Space } from '@holi/core/screens/spaces/types'
import { SpaceConnectionType } from '@holi/core/screens/spaces/types'
import HoliGridCell from '@holi/ui/components/atoms/HoliGridCell'
import HoliGridWrapper from '@holi/ui/components/atoms/HoliGridWrapper'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors, vars } from '@holi/ui/styles/globalVars'

export type SpaceTaskListProps = {
  style?: StyleProp<ViewStyle>
  space: Space
}

const SpaceTaskList: React.VFC<SpaceTaskListProps> = ({ space, style }: SpaceTaskListProps) => {
  const { t } = useTranslation()
  const isCreator = space?.connectionStatusToMyself?.includes(SpaceConnectionType.CREATOR)
  const isMember = space?.connectionStatusToMyself?.includes(SpaceConnectionType.MEMBER)

  const itemsInRow = useBreakpointMatcher([
    [0, 1],
    [+vars.breakpointM, 2],
    [+vars.breakpointL, 3],
    [+vars.breakpointXxl, 4],
  ])

  const CollaborationArea = () => {
    return (
      <View style={styles.collaborationAreaContainer}>
        <DigitalToolKit space={space} />
        <View style={{ marginTop: 16 }}>
          <StorageWidget />
        </View>
      </View>
    )
  }

  const NewToolsTeaser = () => {
    return (
      <View>
        <HoliLocalImage
          imageSource={require('@holi/ui/assets/img/illustrations/illustration_new_tools.svg')}
          width={96}
          height={96}
          label={''}
          isSvg={true}
          resizeMode="stretch"
          style={styles.illustration}
        />
        <HoliText size={'small'} style={styles.emptyMessage}>
          {t('spaces.spaceDetails.newTools.message')}
        </HoliText>
      </View>
    )
  }

  const NoTasks = () => {
    return (
      <>
        {isCreator ||
          (isMember && (
            <CollaboratorAreaCard headerLeftIcon="check" headerRightIcon="add" title={'Tasks'}>
              <View style={[style, styles.empty]}>
                <HoliText size={'small'} style={styles.emptyMessage}>
                  {t('spaces.spaceDetails.tasks.empty.message.forCreators')}
                </HoliText>
                {(isCreator || isMember) && (
                  <HoliText size={'small'} style={styles.instruction}>
                    {t('spaces.spaceDetails.tasks.empty.instruction')}
                  </HoliText>
                )}
              </View>
            </CollaboratorAreaCard>
          )) || (
            <NoDataCard
              image={require('@holi/ui/assets/img/illustrations/illustration_no_actions_available.svg')}
              title={t('spaces.spaceDetails.tasks.empty.title.forNonMembers')}
              description={t('spaces.spaceDetails.tasks.empty.message.forNonMembers')}
            />
          )}
      </>
    )
  }

  return (
    <>
      <View style={style}>
        {(isCreator || isMember) && <CollaborationArea />}
        {(space && space.tasks && space.tasks.length > 0 && (
          <>
            <HoliHeading level="2">
              {t('spaces.spaceDetails.tasks.heading', { count: space.tasks?.length })}
            </HoliHeading>

            <HoliGridWrapper itemsInRow={itemsInRow} style={styles.tasksList}>
              {
                /** FIXME convert to VirtualizedList, FlatList or SectionList */
                space.tasks.map((task) => (
                  <HoliGridCell key={task.id}>
                    <SpaceTaskTile key={task.id} task={task} style={styles.taskTile} />
                  </HoliGridCell>
                ))
              }
            </HoliGridWrapper>
          </>
        )) || <NoTasks />}
        {(isCreator || isMember) && <NewToolsTeaser />}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  empty: {
    alignItems: 'center',
    paddingTop: 24,
  },
  emptyMessage: {
    textAlign: 'center',
    color: colors.foreground20,
  },
  instruction: {
    marginTop: 12,
    color: colors.foreground30,
  },
  tasksList: {
    paddingTop: 20,
  },
  taskTile: {
    flex: 1,
  },
  collaborationAreaContainer: {
    marginBottom: 16,
  },
  illustration: {
    marginTop: 32,
  },
})

export default SpaceTaskList
