import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { ScrollView } from 'react-native'

import MoreOptionItem from '@holi/core/components/MoreOptionItem'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { FolderUser, Hearts, IdCard, Newspaper, Pages, Tools } from '@holi/icons/src/generated'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const LegalDocuments = () => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const setScreenOptions = useSetScreenOptions()

  const { navigate } = useRouting()

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({ title: t('profile.settings.legalDocuments.title') })
  }, [setScreenOptions, t])

  return (
    <ScrollView>
      <View style={[mixins.container, styles.wrapper]}>
        <MoreOptionItem
          label={t('profile.settings.legalDocuments.imprint')}
          icon={Newspaper}
          iconRightStyle="arrow"
          onPress={() => navigate('/profile/settings/legalDocuments/document?type=imprint')}
          style={styles.item}
          testID="btn-imprint"
        />
        <MoreOptionItem
          label={t('profile.settings.legalDocuments.dataProcessing')}
          icon={IdCard}
          iconRightStyle="arrow"
          onPress={() => navigate('/profile/settings/legalDocuments/document?type=dataProcessing')}
          style={styles.item}
          testID="btn-data-processing"
        />
        <MoreOptionItem
          label={t('profile.settings.legalDocuments.privacyPolicy')}
          icon={FolderUser}
          iconRightStyle="arrow"
          onPress={() => navigate('/profile/settings/legalDocuments/document?type=privacyPolicy')}
          style={styles.item}
          testID="btn-privacy-policy"
        />
        <MoreOptionItem
          label={t('profile.settings.legalDocuments.termsOfUse')}
          icon={Pages}
          iconRightStyle="arrow"
          onPress={() => navigate('/profile/settings/legalDocuments/document?type=termsOfUse')}
          style={styles.item}
          testID="btn-terms-of-use"
        />
        <MoreOptionItem
          label={t('profile.settings.legalDocuments.communityGuidelines')}
          icon={Hearts}
          iconRightStyle="arrow"
          onPress={() => navigate('/profile/settings/legalDocuments/document?type=communityGuidelines')}
          style={styles.item}
          testID="btn-community-guidelines"
        />
        <MoreOptionItem
          label={t('profile.settings.legalDocuments.openSource')}
          icon={Tools}
          iconRightStyle="arrow"
          onPress={() => navigate('/profile/settings/legalDocuments/document?type=openSource')}
          style={styles.item}
          testID="btn-open-source"
        />
      </View>
    </ScrollView>
  )
}

export default LegalDocuments

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 24,
  },
  item: {
    marginVertical: 24,
  },
})
