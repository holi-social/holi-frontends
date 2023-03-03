import React, { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import MoreOptionsButtonWithModal from '@holi/core/components/MoreOptionsButtonWithModal'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { colors } from '@holi/ui/styles/globalVars'

interface CollaboratorAreaCardProps {
  icon: string
  title?: string
  children?: ReactNode
}
const CollaboratorAreaCard: React.VFC<CollaboratorAreaCardProps> = ({ icon, title, children }) => {
  //const { setOptions } = useUnifiedNavigation()
  const { t } = useTranslation()
  const { visible, show, hide } = useModalState()
  const Header = () => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerTitleContainer}>
          <HoliIcon icon={icon} size={18} color={colors.foreground20} style={{ marginRight: 6 }} />
          <HoliText size="small">{title}</HoliText>
        </View>
        <MoreOptionsButtonWithModal
          label={t('global.moreOptions')}
          showOptions={visible}
          onPress={show}
          onModalDismiss={hide}
          style={styles.moreButton}
        />
      </View>
    )
  }

  return (
    <View style={styles.wrapper}>
      <Header />
      {children && children}
    </View>
  )
}

export default CollaboratorAreaCard

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: colors.background10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.background30,
  },
  headerContainer: {
    display: 'flex',
    paddingVertical: 11,
    paddingHorizontal: 11,
    width: '100%',
    flex: 1,
    flexDirection: 'row',
  },
  headerTitleContainer: {
    flex: 4,
    flexDirection: 'row',
  },
  headerMoreButton: {
    flex: 1,
  },
  moreButton: {
    alignSelf: 'flex-start',
    justifyContent: 'flex-end',
  },
})
