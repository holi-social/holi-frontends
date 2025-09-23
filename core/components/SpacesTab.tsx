import { withProfiler } from '@sentry/react'
import React from 'react'

import EmptyTab from '@holi/core/components/EmptyTab'
import { logError } from '@holi/core/errors/helpers'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import SpaceAvatar from '@holi/core/screens/spaces/components/SpaceAvatar'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import { HoliTransition } from '@holi/ui/components/atoms/HoliTransition'
import HoliBlockItem from '@holi/ui/components/molecules/HoliBlockItem'
import Spacing from '@holi/ui/foundations/Spacing'
import { dimensions } from '@holi/ui/styles/globalVars'
import { useSpacesByMemberQuery } from '@holi/api/graphql/graphql-codegen'
import type { User } from '@holi/core/domain/shared/types'
import { useFeatureFlag } from '@holi/core/featureFlags/hooks/useFeatureFlag'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import { Stack } from 'holi-bricks/components/stack'
import { Text } from 'holi-bricks/components/text'
import { Button } from 'holi-bricks/components/button'
import { useTranslation } from 'react-i18next'
import useRouting from '@holi/core/navigation/hooks/useRouting'

export interface SpacesTabProps {
  memberId: string
  emptyText: string
  emptyCallToAction?: string
}

const SpacesTab = ({ emptyText, emptyCallToAction, memberId }: SpacesTabProps) => {
  const [rewardsPhaseTwoEnabled] = useFeatureFlag(FeatureFlagKey.REWARDS_PHASE_2)
  const { t } = useTranslation()
  const { navigate } = useRouting()

  const { data, refetch } = useSpacesByMemberQuery({
    variables: { memberId },
    onError: (error) =>
      logError(error, 'Failed to load spaces for user', { location: 'SpacesTab.spacesByMemberIdQuery' }),
  })
  useOnRefresh(refetch)

  const spaces = data?.spaces

  const animKey = !data ? 'loading' : data.spaces.totalResults > 0 ? 'ready' : 'empty'

  if (rewardsPhaseTwoEnabled) {
    return (
      <HoliTransition.FadeSwitch animKey={animKey}>
        {animKey === 'loading' && (
          <HoliBox padding={[Spacing.xs, 0]}>
            {Array.from({ length: 10 }, (_, index) => index).map((index) => (
              <HoliBox
                key={index}
                padding={[0, 0, 32, 0]}
                layout={{ maxWidth: dimensions.maxScreenWidth, width: '100%', alignSelf: 'center' }}
              >
                <HoliBlockItem loading testID="space-tab-loading" />
              </HoliBox>
            ))}
          </HoliBox>
        )}

        {animKey === 'ready' && (
          <Stack padding={{ top: 'xs', bottom: 'xs' }} gap="md">
            {spaces?.data?.map((space) => (
              <Stack key={space.id} maxWidth="lg" width="100%" alignSelf="center">
                <HoliBlockItem
                  label={space.title}
                  title={space.title}
                  imageElement={<SpaceAvatar space={space} size={'lg'} />}
                  users={space.members.data.map((membership) => membership.user) as User[]}
                  href={`/spaces/${space.name}`}
                  testID="space-tab"
                  totalUserCount={space.members.totalResults}
                />
              </Stack>
            ))}
          </Stack>
        )}

        {animKey === 'empty' && (
          <Stack
            backgroundColor="support"
            borderRadius="md"
            padding={{ top: 'lg', bottom: 'xl', left: 'md', right: 'md' }}
            margin={{ top: 'md', bottom: 'md' }}
            borderColor="default"
            borderWidth="sm"
            gap="md"
            alignItems="center"
          >
            <HoliLocalImage
              imageSource={require('@holi/ui/assets/img/illustrations/illustration_empty_spaces.svg')}
              isSvg
              label={''}
              width={231}
              height={164}
            />
            <Stack gap="3xs">
              <Text textAlign="center">{t('profile.tabs.spaces.tagline.empty')}</Text>
              <Text size="xxl" textAlign="center">
                {t('profile.tabs.spaces.empty')}
              </Text>
            </Stack>
            <Stack>
              <Button
                label={t('profile.tabs.spaces.empty.callToAction')}
                inline
                onPress={() => {
                  navigate('/spaces/explore')
                }}
              />
            </Stack>
          </Stack>
        )}
      </HoliTransition.FadeSwitch>
    )
  }

  return (
    <HoliTransition.FadeSwitch animKey={animKey}>
      {animKey === 'loading' && (
        <HoliBox padding={[Spacing.xs, 0]}>
          {Array.from({ length: 10 }, (_, index) => index).map((index) => (
            <HoliBox
              key={index}
              padding={[0, 0, 32, 0]}
              layout={{ maxWidth: dimensions.maxScreenWidth, width: '100%', alignSelf: 'center' }}
            >
              <HoliBlockItem loading testID="space-tab-loading" />
            </HoliBox>
          ))}
        </HoliBox>
      )}

      {animKey === 'ready' && (
        <HoliBox padding={[Spacing.xs, 0]}>
          {spaces?.data?.map((space) => (
            <HoliBox
              key={space.id}
              padding={[0, 0, 32, 0]}
              layout={{ maxWidth: dimensions.maxScreenWidth, width: '100%', alignSelf: 'center' }}
            >
              <HoliBlockItem
                label={space.title}
                title={space.title}
                imageElement={<SpaceAvatar space={space} size={'lg'} />}
                users={space.members.data.map((membership) => membership.user) as User[]}
                href={`/spaces/${space.name}`}
                testID="space-tab"
                totalUserCount={space.members.totalResults}
              />
            </HoliBox>
          ))}
        </HoliBox>
      )}

      {animKey === 'empty' && <EmptyTab text={emptyText} callToAction={emptyCallToAction} />}
    </HoliTransition.FadeSwitch>
  )
}

export default withProfiler(SpacesTab, { name: 'SpacesTab' })
