import React, { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

import { Spacing } from 'holi-bricks/foundations/dimensions/spacing'

import type { ChallengeTeaser } from '@holi-apps/challenges/components/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { VideoFilled, Lock } from '@holi/icons/src/generated'
import { Text } from 'holi-bricks/components/text'
import { Image } from 'holi-bricks/components/image'
import { BorderRadius, mono } from 'holi-bricks/foundations'
import ChallengeImageLoader from './ChallengeImageLoader'

interface CarouselCardImageProps {
  challenge: ChallengeTeaser
  width: number
}

export const CarouselCardImage = ({ challenge, width }: CarouselCardImageProps) => {
  const styles = useMemo(() => getStyles(width), [width])
  const label = `${challenge.title}`
  const isUpcoming = challenge.isUpcoming

  const renderOverlay = () => {
    if (isUpcoming) {
      return (
        <>
          {/* Dark background overlay */}
          <View style={styles.darkOverlay} />

          {/* Light overlay with lock icon */}
          <View style={styles.lightOverlay}>
            <HoliIcon icon={Lock} size={32} colorOverride={mono['100']} />
          </View>
        </>
      )
    }

    return (
      <>
        <ChallengeImageLoader />
        <View style={styles.avatar}>
          <Text size="sm" colorOverride={mono['100']}>
            {challenge.submissionsCount}
          </Text>
          <HoliIcon icon={VideoFilled} size={12} colorOverride={mono['100']} style={styles.participantsIcon} />
        </View>
      </>
    )
  }

  return (
    <View style={styles.container}>
      {challenge.cover ? (
        <Image source={challenge.cover} width={width} height={width} alt={label} />
      ) : (
        <View style={styles.placeholder} />
      )}
      {renderOverlay()}
    </View>
  )
}

const getStyles = (width: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      borderRadius: BorderRadius.md,
      overflow: 'hidden',
      position: 'relative',
      borderWidth: 1,
      borderColor: mono['100'],
    },
    gradient: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: 60,
      borderBottomLeftRadius: BorderRadius.md,
      borderBottomRightRadius: BorderRadius.md,
    },
    avatar: {
      zIndex: 1,
      color: 'white',
      position: 'absolute',
      bottom: Spacing['3xs'],
      right: Spacing['3xs'] + 2,
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing['4xs'],
    },
    participantsIcon: {
      padding: 2,
    },
    darkOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(24, 23, 23, 0.3)',
      borderRadius: 16,
    },
    lightOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(217, 217, 217, 0)',
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    placeholder: {
      width: width,
      height: width,
      backgroundColor: mono['100'],
    },
  })
