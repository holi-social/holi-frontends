import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'

const NewToolsTeaser: React.FC = () => {
  const { t } = useTranslation()
  return (
    <View style={styles.illustrationContainer}>
      <HoliLocalImage
        imageSource={require('@holi/ui/assets/img/illustrations/illustration_new_tools.svg')}
        width={96}
        height={96}
        label={''}
        isSvg={true}
        resizeMode="contain"
        style={styles.illustration}
      />
      <HoliText size={'small'} style={styles.emptyMessage}>
        {t('spaces.spaceDetails.newTools.message')}
      </HoliText>
    </View>
  )
}

export default NewToolsTeaser

const styles = StyleSheet.create({
  illustrationContainer: {
    marginTop: 32,
    paddingBottom: 16,
    alignItems: 'center',
  },
  illustration: {
    marginBottom: 8,
  },
  emptyMessage: {
    textAlign: 'center',
    color: colors.foreground20,
  },
})
