import React from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, StyleSheet, View } from 'react-native'

import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

type Tool = {
  id: string
  name: string
  org: string
  url: string
  icon: string
}

const ToolIdeas: React.FC = () => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const imageWidth = 210

  const recommandedToolList: Tool[] = [
    {
      id: '0',
      name: t('spaces.toolKit.toolIdeas.tool.impactTools'),
      org: '[re]flecta network',
      url: 'https://www.reflecta.network/die-impact-tools',
      icon: 'chat-smile-2',
    },
    {
      id: '1',
      name: t('spaces.toolKit.toolIdeas.tool.debateModule'),
      org: 'Adhocracy +',
      url: 'https://adhocracy.plus/info/start/',
      icon: 'group-line',
    },
    {
      id: '2',
      name: t('spaces.toolKit.toolIdeas.tool.groupWallet'),
      org: 'Elinor',
      url: 'https://elinor.network/en',
      icon: 'wallet-3-line',
    },
    {
      id: '3',
      name: t('spaces.toolKit.toolIdeas.tool.interactivePolls'),
      org: 'Nuudle',
      url: 'https://nuudel.digitalcourage.de/',
      icon: 'chat-poll',
    },
  ]

  const handleShareButtonPress = (url: string) => {
    Linking.openURL(url)
  }

  const RecommandedTool = ({ tool }: { tool: Tool }) => {
    return (
      <View style={styles.toolContainer}>
        <View style={styles.iconContainer}>
          <HoliIcon size={21} color={colors.brandColorB30} icon={tool.icon} />
        </View>
        <View style={styles.infoContainer}>
          <HoliText style={styles.toolName}>{tool.name}</HoliText>
          <HoliText size="extrasmall" style={styles.toolOrg}>
            {t('spaces.toolKit.toolIdeas.tool.poweredBy')} {tool.org}
          </HoliText>
        </View>
        <View style={styles.shareButtonContainer}>
          <HoliButton
            label={t('spaces.toolKit.toolIdeas.tool.open.button.label')}
            transparent
            onPress={() => handleShareButtonPress(tool.url)}
          >
            <HoliIcon icon={'share-box'} size={15} />
          </HoliButton>
        </View>
      </View>
    )
  }

  return (
    <View style={[mixins.container, styles.container]}>
      <HoliLocalImage
        imageSource={require('@holi/ui/assets/img/illustrations/illustration_space_tool_ideas.svg')}
        width={imageWidth}
        height={imageWidth * 0.86}
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
        {recommandedToolList.map((item) => {
          return <RecommandedTool key={item.id} tool={item} />
        }) || null}
      </View>
    </View>
  )
}

export default ToolIdeas

const styles = StyleSheet.create({
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
  title: { marginBottom: 16, color: colors.foreground30 },
  description: { color: colors.foreground20, textAlign: 'center' },
  toolContainer: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    backgroundColor: colors.background10,
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.background30,
  },
  iconContainer: {
    width: 40,
    aspectRatio: 1,
    backgroundColor: colors.brandColorB10,
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
    color: colors.foreground30,
  },
  toolOrg: {
    color: colors.foreground20,
  },
  toolsContainer: {
    marginTop: 32,
  },
})
