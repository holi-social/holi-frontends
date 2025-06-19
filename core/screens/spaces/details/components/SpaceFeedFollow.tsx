import type React from 'react'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { useErrorHandling } from '@holi/core/errors/hooks'
import type { Space } from '@holi/api/graphql/graphql-codegen'
import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { IndeterminateCircleLine, AddCircleLine } from '@holi/icons/src/generated'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import {
  UpdateConnectionAction,
  SpaceUserConnectionType,
  useUpdateSpaceUserConnectionMutation,
} from '@holi/api/graphql/graphql-codegen'

export type SpaceFollowProps = {
  space: Space
}

const SpaceFeedFollow: React.FC<SpaceFollowProps> = ({ space }) => {
  const { t } = useTranslation()
  const { isLoggedIn } = useLoggedInUser()
  const { track } = useTracking()
  const { displayError } = useErrorHandling()

  const [unfollowDialogIsOpen, setUnfollowDialogIsOpen] = useState(false)
  const [followSpace, { loading }] = useUpdateSpaceUserConnectionMutation({
    update: (cache) => {
      cache.evict({ id: 'ROOT_QUERY', fieldName: 'mySpaces' })
    },
    onError: (error) => {
      displayError(error, 'Failed to follow space', {
        displayMessage: t('spaces.follow.error'),
        location: 'SpaceFeedFollow.followSpace',
        spaceId: space.id,
      })
    },
  })

  const isFollowing = space.connectionStatusToMyself?.includes(SpaceUserConnectionType.Follower)

  const onFollowSpaceButtonPressed = useCallback(() => {
    track(TrackingEvent.Spaces.followSpaceButtonPressed(space.id, isLoggedIn))

    followSpace({
      variables: {
        connectAction: UpdateConnectionAction.Connect,
        connectionType: SpaceUserConnectionType.Follower,
        spaceId: space.id,
      },
      onCompleted: () => track(TrackingEvent.Spaces.User.followed(space.id)),
    })
  }, [track, space.id, isLoggedIn, followSpace])

  const onUnfollowSpaceButtonPressed = useCallback(() => {
    setUnfollowDialogIsOpen(false)
    followSpace({
      variables: {
        connectAction: UpdateConnectionAction.Disconnect,
        connectionType: SpaceUserConnectionType.Follower,
        spaceId: space.id,
      },
      onCompleted: () => track(TrackingEvent.Spaces.User.unfollowed(space.id)),
    })
  }, [followSpace, space.id, track])

  return (
    <>
      <HoliBox padding={[0, 0, 32, 0]}>
        <HoliButton
          inline
          transparent
          label={isFollowing ? t('spaces.feed.follow.btn.unfollow') : t('spaces.feed.follow.btn.follow')}
          contentStyle={styles.buttonContent}
          onPress={isFollowing ? () => setUnfollowDialogIsOpen(true) : onFollowSpaceButtonPressed}
        >
          <HoliBox padding={[0, 13, 0, 0]}>
            <HoliIcon icon={isFollowing ? IndeterminateCircleLine : AddCircleLine} size={18} />
          </HoliBox>

          {!loading ? (
            <HoliText>
              {isFollowing ? t('spaces.feed.follow.btn.unfollow') : t('spaces.feed.follow.btn.follow')}
            </HoliText>
          ) : (
            <HoliText>{t('global.loading')}</HoliText>
          )}
        </HoliButton>
      </HoliBox>

      <HoliConfirmation
        show={unfollowDialogIsOpen}
        label={t('spaces.follow.unfollow.confirm.headline', { spaceName: space.title })}
        title={t('spaces.follow.unfollow.confirm.headline', { spaceName: space.title })}
        description={t('spaces.follow.unfollow.confirm.text', { spaceName: space.title })}
        secondaryText={t('global.dismiss')}
        primaryText={t('global.yes')}
        primaryButtonVariant="danger"
        onPrimary={onUnfollowSpaceButtonPressed}
        onDismiss={() => setUnfollowDialogIsOpen(false)}
      />
    </>
  )
}

export default SpaceFeedFollow

const styles = StyleSheet.create({
  buttonContent: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  iconRight: {
    marginLeft: 'auto',
  },
})
