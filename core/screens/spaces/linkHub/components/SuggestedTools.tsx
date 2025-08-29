import type React from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import type { HoliIconType } from '@holi/icons/src/HoliIconType'
import { ChatPoll, Group, Plant, ShareBox } from '@holi/icons/src/generated'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

type Tool = {
  id: string
  name: string
  org: string
  url: string
  icon: HoliIconType
}

const SuggestedTools: React.FC = () => {
  const { t } = useTranslation()
  const imageWidth = 285
  const imageHeight = 170
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

  const recommendedToolList: Tool[] = [
    {
      id: '0',
      name: t('spaces.toolKit.toolIdeas.tool.impactTools'),
      org: '[re]flecta network',
      url: 'https://www.reflecta.network/die-impact-tools',
      icon: Plant,
    },
    {
      id: '1',
      name: t('spaces.toolKit.toolIdeas.tool.debateModule'),
      org: 'Adhocracy +',
      url: 'https://adhocracy.plus/info/start/',
      icon: Group,
    },
    {
      id: '2',
      name: t('spaces.toolKit.toolIdeas.tool.interactivePolls'),
      org: 'Nuudel',
      url: 'https://nuudel.digitalcourage.de/',
      icon: ChatPoll,
    },
  ]

  const handleShareButtonPress = (url: string) => {
    Linking.openURL(url)
  }

  const RecommendedTool = ({ tool }: { tool: Tool }) => {
    return (
      <HoliButton
        label={t('spaces.toolKit.toolIdeas.tool.open.button.label')}
        transparent
        onPress={() => handleShareButtonPress(tool.url)}
      >
        <View style={styles.toolContainer}>
          <View style={styles.iconContainer}>
            <HoliIcon icon={tool.icon} size={21} colorOverride={colors.brandColorB30} />
          </View>
          <View style={styles.infoContainer}>
            <HoliText style={styles.toolName}>{tool.name}</HoliText>
            <HoliText size="extrasmall" style={styles.toolOrg}>
              {t('spaces.toolKit.toolIdeas.tool.poweredBy')} {tool.org}
            </HoliText>
          </View>
          <View style={styles.shareButtonContainer}>
            <HoliIcon icon={ShareBox} size={15} colorOverride={colors.foreground20} />
          </View>
        </View>
      </HoliButton>
    )
  }

  return (
    <View style={styles.container}>
      <HoliLocalImage
        imageSource={require('@holi/ui/assets/img/illustrations/illustration_space_suggested_tools.svg')}
        width={imageWidth}
        height={imageHeight}
        label={''}
        isSvg={true}
        resizeMode="stretch"
        style={styles.image}
      />
      <View style={styles.descriptionContainer}>
        <HoliText size="large" style={styles.title}>
          {t('spaces.toolKit.toolIdeas.title')}
        </HoliText>
        <HoliText style={styles.description}>{t('spaces.toolKit.toolIdeas.description')}</HoliText>
      </View>
      <View style={styles.toolsContainer}>
        {recommendedToolList.map((item) => {
          return <RecommendedTool key={item.id} tool={item} />
        }) || null}
      </View>
    </View>
  )
}

export default SuggestedTools

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    image: {
      marginTop: 24,
      alignSelf: 'center',
    },
    descriptionContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 24,
    },
    title: { marginBottom: 16, color: theme.colors.foreground30 },
    description: { color: theme.colors.foreground20, textAlign: 'center' },
    toolContainer: {
      flex: 1,
      flexDirection: 'row',
      width: '100%',
      backgroundColor: theme.colors.background10,
      padding: 16,
      marginBottom: 8,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.background30,
    },
    iconContainer: {
      width: 40,
      aspectRatio: 1,
      backgroundColor: theme.colors.brandColorB10,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    infoContainer: {
      flex: 4,
      flexDirection: 'column',
      marginLeft: 12,
    },
    shareButtonContainer: {
      justifyContent: 'center',
    },
    toolName: {
      color: theme.colors.foreground30,
    },
    toolOrg: {
      color: theme.colors.foreground20,
    },
    toolsContainer: {
      marginTop: 32,
    },
  })
