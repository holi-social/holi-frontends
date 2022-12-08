import React from 'react'
import { useTranslation } from 'react-i18next'
import { GestureResponderEvent, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

type FilteredNoResultsProps = {
  style?: StyleProp<ViewStyle>
  onPress?: (event: React.SyntheticEvent | GestureResponderEvent) => void
}

const FilteredNoResults: React.VFC<FilteredNoResultsProps> = ({ style, onPress }) => {
  const { t } = useTranslation()

  return (
    <View style={[style, styles.container]}>
      <HoliText size="small" style={styles.title}>
        {t('spaces.filter.notFound.title')}
      </HoliText>
      <HoliText size="large" style={styles.description}>
        {t('spaces.filter.notFound.description')}
      </HoliText>
      <HoliButton label={''} style={styles.clearBtn} onPress={onPress}>
        <HoliText>{t('search.filter.reset')}</HoliText>
      </HoliButton>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 16,
    height: 'auto',
    borderWidth: 1,
    borderColor: colors.borderColorGrey,
    backgroundColor: colors.backgroundColorWhite,
  },
  clearBtn: {
    marginTop: 24,
    width: 'auto',
    borderWidth: 1,
  },
  description: {
    marginTop: 16,
    textAlign: 'center',
  },
  title: {},
})

export default FilteredNoResults
