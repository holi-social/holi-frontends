import React, { ReactNode } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

interface CollaboratorAreaCardProps {
  headerLeftIcon?: string
  headerRightIcon?: string
  title?: string
  children?: ReactNode
  style?: StyleProp<ViewStyle>
  onPressHeaderLeft?: () => void
  onPressHeaderRight?: () => void
}
const CollaboratorAreaCard: React.VFC<CollaboratorAreaCardProps> = ({
  headerLeftIcon,
  headerRightIcon,
  title,
  children,
  style,
  onPressHeaderLeft,
  onPressHeaderRight,
}: CollaboratorAreaCardProps) => {
  const Header = () => {
    return (
      <View style={styles.headerContainer}>
        <HoliButton
          transparent
          style={styles.headerTitleContainer}
          label={title ? title : ''}
          onPress={onPressHeaderLeft}
        >
          <View style={styles.headerTitle}>
            {headerLeftIcon && (
              <HoliIcon icon={headerLeftIcon} size={18} color={colors.brandColorB30} style={{ marginRight: 6 }} />
            )}
            <HoliText>{title}</HoliText>
          </View>
        </HoliButton>
        <View>
          <HoliButton
            transparent
            style={styles.headerRightButton}
            label={title ? title : ''}
            onPress={onPressHeaderRight}
          >
            {headerRightIcon && <HoliIcon icon={headerRightIcon} size={18} color={colors.foreground30} />}
          </HoliButton>
        </View>
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
  headerRightButton: {
    alignSelf: 'flex-end',
  },
  contentContainer: {
    flex: 1,
  },
})
