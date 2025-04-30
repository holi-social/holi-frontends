import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import SpaceMineTile from '@holi/core/screens/spaces/discover/components/SpaceMineTile'
import type { SpaceSection } from '@holi/core/screens/spaces/types'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { Text } from 'holi-bricks/components/text'
import { Spacing } from 'holi-bricks/foundations'
import { useBreakpointMatcher } from '@holi/core/helpers'
import { dimensions } from '@holi/ui/styles/globalVars'

export type MySpacesProps = {
  mySpaces: SpaceSection[]
}

const MySpaces = ({ mySpaces = [] }: MySpacesProps) => {
  const { t } = useTranslation()
  const additionalMarginHorizontal = useBreakpointMatcher([
    [0, Spacing.xs],
    [dimensions.breakpointS, 0],
    [dimensions.breakpointL, 0],
  ])

  const mappedSpaces = mySpaces.map((section) => ({
    title: t(`spaces.tabs.mine.${section.type.toLowerCase()}`),
    type: section.type,
    data: section.spaces.data,
  }))

  return (
    <View style={{ marginHorizontal: additionalMarginHorizontal }}>
      <HoliContainer noPadding>
        {mappedSpaces.map((section, sectionIndex) => (
          <View key={`${sectionIndex}`} style={styles.section}>
            <View testID={`section-headline-${section.type}`}>
              <Text headingLevel="3" size="lg">
                {section.title}
              </Text>
            </View>

            {section.data.map((space, spaceIndex) => (
              <SpaceMineTile
                space={space}
                sectionType={section.type}
                key={`${sectionIndex}-${space.name}-${spaceIndex}`}
              />
            ))}
          </View>
        ))}
      </HoliContainer>
    </View>
  )
}

export default MySpaces

const styles = StyleSheet.create({
  section: {
    marginTop: Spacing.md,
  },
})
