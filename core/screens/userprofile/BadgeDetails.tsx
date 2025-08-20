import React, {} from 'react'

import { Text } from 'holi-bricks/components/text'
import type { Badge } from '@holi/core/screens/userprofile/MyBadges'
import { Stack } from 'holi-bricks/components/stack'
import { View } from 'react-native'
import { Image } from 'holi-bricks/components/image'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { LockFilled } from '@holi/icons/src/generated'
import { ChipLabel } from 'holi-bricks/components/chips'
import { Button } from 'holi-bricks/components/button'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { HoliProgressBar } from '@holi/ui/components/molecules/HoliProgressBar'

const IMAGE_WIDTH = 240
const SHINING_SIZE = 293

const BadgeDetails = ({ badge }: { badge: Badge }) => {
  const { navigate } = useRouting()

  return (
    <Stack padding={{ top: 'xs', bottom: 'xs' }} gap="xxs">
      <Stack
        backgroundColor="support"
        padding={{ top: 'xxl', bottom: 'xxl', left: 'xs', right: 'xs' }}
        borderRadius="md"
        alignItems="center"
        gap="xl"
      >
        {/* image */}
        <Stack alignItems="center">
          <View style={{ position: 'absolute', alignSelf: 'center', justifyContent: 'center', height: '100%' }}>
            <Image
              source={require('@holi/ui/assets/img/illustrations/illustration_shining.svg')}
              alt="shining illustration"
              width={SHINING_SIZE}
              height={SHINING_SIZE}
            />
          </View>
          <View style={{ position: 'relative' }}>
            <Image
              source={badge.state === 'active' || badge.state === 'locked' ? badge.imgSrcActive : badge.imgSrcAchieved}
              alt="badge illustration"
              width={IMAGE_WIDTH}
              height={IMAGE_WIDTH}
            />
          </View>
          {badge.state === 'locked' && (
            <View style={{ position: 'absolute', alignSelf: 'center', justifyContent: 'center', height: '100%' }}>
              <HoliIcon icon={LockFilled} color="muted" size={72} />
            </View>
          )}
        </Stack>

        {/* description */}
        <Stack alignContent="center" gap="xs">
          <Stack alignContent="center" gap="4xs">
            <Text size="xxl" textAlign="center">
              {badge.title}
            </Text>

            {badge.currentStep && badge.totalSteps && (
              <Stack padding={{ bottom: 'xl' }} gap="3xs">
                <Stack alignItems="center">
                  <HoliProgressBar percentage={(badge.currentStep / badge.totalSteps) * 100 || 0} size="small" />
                </Stack>

                <Text size="xs" textAlign="center" color="support">
                  {badge.currentStep}
                  {badge.currentStep && badge.totalSteps && '/'}
                  {badge.totalSteps} {badge.description}
                </Text>
              </Stack>
            )}

            <Text size="md" textAlign="center">
              {badge.state === 'active' || badge.state === 'locked'
                ? badge.descriptionActive
                : badge.descriptionAchieved}
            </Text>
          </Stack>

          {badge.date && (
            <Stack alignSelf="center">
              <ChipLabel>{badge.date}</ChipLabel>
            </Stack>
          )}
        </Stack>

        {/* button */}
        {badge.buttonLabel && badge.buttonLink && badge.state === 'active' && (
          <Stack>
            <Button
              label={badge.buttonLabel}
              onPress={() => {
                navigate(badge.buttonLink ?? '')
              }}
            />
          </Stack>
        )}
      </Stack>
    </Stack>
  )
}

export default BadgeDetails
