import React from 'react'
import { StyleSheet, Text } from 'react-native'

import { colors } from '@holi/ui/styles/globalVars'

export type HoliMandatoryFieldStarProps = {
  show?: boolean
  error?: boolean
}

const HoliMandatoryFieldStar: React.FC<HoliMandatoryFieldStarProps> = ({ show, error }) => {
  const styles = getStyles()

  return <>{!!show && <Text style={!error ? styles.labelMandatoryStar : styles.labelMandatoryStarError}>*</Text>}</>
}

export default HoliMandatoryFieldStar

const getStyles = () =>
  StyleSheet.create({
    labelMandatoryStar: {
      color: colors.brandColorB30,
    },
    labelMandatoryStarError: {
      color: colors.error30,
    },
  })
