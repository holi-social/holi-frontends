import React from 'react'
import { StyleSheet, View } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Translate } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import Spacing from '@holi/ui/foundations/Spacing'

export interface HoliTranslateProps {
  //   isVisible: boolean
  //   isLoading: boolean
  language: string
  onTranslate: () => void
}

const HoliTranslate = ({ language, onTranslate }: HoliTranslateProps) => {
  return (
    <HoliButton transparent label={'translate'} onPress={onTranslate}>
      <View style={styles.container}>
        <HoliIcon icon={Translate} size={16} />
        <HoliText bold size="small">
          Translate to {language}
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
