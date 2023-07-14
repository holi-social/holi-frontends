import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const SpaceCollaboratorOnboardingInfo: React.FC = () => {
  const mixins = useStyleMixins()
  const { t } = useTranslation()

  return (
    <View style={mixins.container}>
      <HoliText style={styles.header} size="large">
        {t('spaces.collaborate.onboarding.info.header')}
      </HoliText>
      <View style={styles.row}>
        <View style={styles.count}>
          <HoliText size="large" style={styles.italic}>
            1
          </HoliText>
        </View>
        <HoliText style={styles.text}>{t('spaces.collaborate.onboarding.info.text1')}</HoliText>
      </View>
      <View style={styles.row}>
        <View style={styles.count}>
          <HoliText size="large" style={styles.italic}>
            2
          </HoliText>
        </View>
        <HoliText style={styles.text}>{t('spaces.collaborate.onboarding.info.text2')}</HoliText>
      </View>
      <View style={styles.row}>
        <View style={styles.count}>
          <HoliText size="large" style={styles.italic}>
            3
          </HoliText>
        </View>
        <HoliText style={styles.text}>{t('spaces.collaborate.onboarding.info.text3')}</HoliText>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  count: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    borderRadius: 32 / 2,
    backgroundColor: colors.brandColorB10,
    borderColor: colors.brandColorB20,
    borderWidth: 1,
    flexShrink: 0,
    marginRight: 16,
  },
  italic: {
    fontStyle: 'italic',
  },
  text: {
    flex: 1,
    flexWrap: 'wrap',
  },
})

export default SpaceCollaboratorOnboardingInfo
