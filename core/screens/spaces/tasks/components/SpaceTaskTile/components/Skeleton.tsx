import React from 'react'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import FilterPill from '@holi/core/components/FilterPill'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import HoliSkeleton from '@holi/ui/components/atoms/HoliSkeleton'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import { HoliCardComponent } from '@holi/ui/components/molecules/HoliCard'
import { PropsWithSkeleton } from '@holi/ui/components/types'

import { type Props, styles as contentStyles } from './Content'

const Skeleton = ({ descriptionWithDetails }: PropsWithSkeleton<Pick<Props, 'descriptionWithDetails'>>) => {
  return (
    <HoliCardComponent.CardContainer hasBorder borderColor="foreground30at12Percent" borderRadius={16}>
      <HoliSkeleton width="100%" height="auto" aspectRatio={1.75} borderRadius={8} />

      <HoliCardComponent.ContentContainer>
        <View style={contentStyles.iconsContainer}>
          <HoliText loading skeletonOptions={{ width: '60%' }} style={styles.textWidth} />

          <View style={contentStyles.iconGroupContainer}>
            <HoliText loading size="extrasmall" skeletonOptions={{ width: '80%' }} style={styles.textWidth} />
          </View>
        </View>

        <View style={contentStyles.skillsContainer}>
          <FilterPill loading />
        </View>

        <HoliGap size="s" />
        <HoliText loading skeletonOptions={{ width: '100%' }} />

        <HoliText loading style={contentStyles.publishedByTitle} skeletonOptions={{ width: '40%' }} />

        {descriptionWithDetails && (
          <>
            <View style={contentStyles.avatar}>
              <HoliAvatar loading size="medium" />
              <View style={{ flex: 1 }}>
                <HoliText loading skeletonOptions={{ width: '40%' }} />
              </View>
            </View>

            <HoliText loading style={contentStyles.contactInformationTitle} skeletonOptions={{ width: '60%' }} />

            <View style={contentStyles.contactContainer}>
              <HoliText loading size="small" style={styles.textWidth} skeletonOptions={{ width: '40%' }} />
            </View>
          </>
        )}
      </HoliCardComponent.ContentContainer>
    </HoliCardComponent.CardContainer>
  )
}

export default Skeleton

const styles = StyleSheet.create({
  textWidth: {
    width: '100%',
  },
})
