import React, { useMemo } from 'react'
// Will be resolved with HOLI-10367
// eslint-disable-next-line no-restricted-imports
import { StyleSheet, Text } from 'react-native'

import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export type HoliMandatoryFieldStarProps = {
  show?: boolean
  error?: boolean
}

const HoliMandatoryFieldStar: React.FC<HoliMandatoryFieldStarProps> = ({ show, error }) => {
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  return <>{!!show && <Text style={!error ? styles.labelMandatoryStar : styles.labelMandatoryStarError}>*</Text>}</>
}

export default HoliMandatoryFieldStar

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    labelMandatoryStar: {
      color: theme.colors.brandColorB30,
    },
    labelMandatoryStarError: {
      color: theme.colors.error30,
    },
  })
