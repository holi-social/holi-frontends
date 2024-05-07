import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

type NoToolsProps = {
  spaceIdOrName: string
}

const imageWidth = 251

const NoTools = ({ spaceIdOrName }: NoToolsProps) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const { navigate } = useRouting()

  const navigateToAddToolPage = () => {
    navigate(`/spaces/${spaceIdOrName}/linkhub/tools/create`)
  }

  return (
    <View style={styles.container}>
      <HoliLocalImage
        imageSource={require('@holi/ui/assets/img/illustrations/illustration_space_digital_tools.svg')}
        width={imageWidth}
        height={imageWidth * 0.6}
        label={''}
        isSvg={true}
        resizeMode="stretch"
        style={styles.illustration}
      />
      <HoliText size="small">{t('spaces.toolKit.allTools.noData.title')}</HoliText>
      <HoliText size="large" style={styles.description}>
        {t('spaces.toolKit.allTools.noData.description')}
      </HoliText>
      <HoliButton
        label={t('allTools.drawer.headline')}
        inline
        testID="space-resources-add-button"
        onPress={navigateToAddToolPage}
        style={styles.linkToolButton}
      >
        <HoliText>{t('spaces.toolKit.allTools.noData.link.button.label')}</HoliText>
      </HoliButton>
    </View>
  )
}

export default NoTools

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      marginTop: 10,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.background30,
      backgroundColor: theme.colors.background10,
      margin: 24,
      padding: 24,
      alignItems: 'center',
    },
    illustration: {
      marginTop: 32,
      marginBottom: 24,
    },
    description: {
      textAlign: 'center',
      marginTop: 8,
      color: theme.colors.foreground30,
    },
    linkToolButton: {
      marginTop: 24,
    },
  })
