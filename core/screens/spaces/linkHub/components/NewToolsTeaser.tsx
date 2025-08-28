import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

const NewToolsTeaser: React.FC = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

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

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
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
      color: theme.colors.foreground20,
    },
  })
