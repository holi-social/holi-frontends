import React, { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import MoreOptionsButtonWithModal from '@holi/core/components/MoreOptionsButtonWithModal'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { useModalState } from '@holi/ui/components/molecules/HoliModal'
import { colors } from '@holi/ui/styles/globalVars'

interface CollaboratorAreaCardProps {
  icon?: string
  title?: string
  children?: ReactNode
  style?: StyleProp<ViewStyle>
  onPress?: () => void
}
const CollaboratorAreaCard: React.VFC<CollaboratorAreaCardProps> = ({
  icon,
  title,
  children,
  style,
  onPress,
}: CollaboratorAreaCardProps) => {
  const { t } = useTranslation()
  const { visible, show, hide } = useModalState()
  const Header = () => {
    return (
      <View style={styles.headerContainer}>
        <HoliButton transparent style={styles.headerTitleContainer} label={title ? title : ''} onPress={onPress}>
          <View style={styles.headerTitle}>
            {icon && <HoliIcon icon={icon} size={18} color={colors.foreground20} style={{ marginRight: 6 }} />}
            <HoliText>{title}</HoliText>
          </View>
        </HoliButton>
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
    <View style={[styles.wrapper, style]}>
      <Header />
      <View style={styles.contentContainer}>{children && children}</View>
    </View>
  )
}

export default CollaboratorAreaCard

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.background30,
  },
  headerContainer: {
    padding: 10,
    width: '100%',
    flex: 1,
    flexDirection: 'row',
  },
  headerTitleContainer: {
    flex: 4,
    justifyContent: 'center',
  },
  headerTitle: {
    flexDirection: 'row',
  },
  moreButton: {
    alignSelf: 'flex-start',
    justifyContent: 'flex-end',
  },
  contentContainer: {
    flex: 1,
  },
})
