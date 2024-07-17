import React from 'react'
import { StyleSheet, View } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Translate } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import Spacing from '@holi/ui/foundations/Spacing'

/* export interface HoliTranslateProps {
     isVisible: boolean
} */
const HoliTranslate = () => {
  const handlePress = () => {
    alert('Translate to [language]')
  }
  return (
    <HoliButton transparent label={'translate'} onPress={() => handlePress()}>
      <View style={styles.container}>
        <HoliIcon icon={Translate} size={16} />
        <HoliText bold size="small">
          Translate to [language]
        </HoliText>
      </View>
    </HoliButton>
  )
}

export default HoliTranslate

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing['4xs'],
  },
})
