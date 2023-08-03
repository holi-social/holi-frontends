import React, { ReactNode } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { HoliIconType } from '@holi/icons/src/HoliIconType'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'

interface CollaboratorAreaCardProps {
  headerLeftIcon?: HoliIconType
  headerRightIcon?: HoliIconType
  headerRightButtonLabel?: string
  title?: string
  children?: ReactNode
  style?: StyleProp<ViewStyle>
  onPressHeaderLeft?: () => void
  onPressHeaderRight?: () => void
  testID?: string
}
const CollaboratorAreaCard: React.VFC<CollaboratorAreaCardProps> = ({
  headerLeftIcon,
  headerRightIcon,
  headerRightButtonLabel,
  title,
  children,
  style,
  onPressHeaderLeft,
  onPressHeaderRight,
  testID = 'collaboration-area-card',
}: CollaboratorAreaCardProps) => {
  const Header = () => {
    return (
      <View style={styles.headerContainer}>
        <HoliButton
          transparent
          style={styles.headerTitleContainer}
          label={title || ''}
          onPress={onPressHeaderLeft}
          testID={`btn-left-${testID}`}
        >
          <View style={styles.headerTitle}>
            {headerLeftIcon && (
              <HoliIcon icon={headerLeftIcon} size={24} color={colors.brandColorB30} style={{ marginRight: 8 }} />
            )}
            <HoliText>{title}</HoliText>
          </View>
        </HoliButton>
        {!!headerRightButtonLabel && (
          <View>
            <HoliButton
              transparent
              style={styles.headerRightButton}
              label={headerRightButtonLabel}
              onPress={onPressHeaderRight}
              testID={`btn-right-${testID}`}
            >
              {headerRightIcon && <HoliIcon icon={headerRightIcon} size={24} color={colors.foreground30} />}
            </HoliButton>
          </View>
        )}
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
    backgroundColor: colors.background10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.background30,
  },
  headerContainer: {
    padding: 16,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flex: 4,
    justifyContent: 'center',
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRightButton: {
    alignSelf: 'flex-end',
  },
  contentContainer: {
    flex: 1,
  },
})
