import React, { ReactNode, useMemo } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { HoliIconType } from '@holi/icons/src/HoliIconType'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

interface CollaboratorAreaCardProps {
  headerLeftIcon?: HoliIconType
  headerRightIcon?: HoliIconType
  headerRightButtonLabel?: string
  title?: string
  disabled?: boolean
  children?: ReactNode
  style?: StyleProp<ViewStyle>
  onPressHeaderLeft?: () => void
  onPressHeaderRight?: () => void
  testID?: string
  isCollaborator?: boolean
}
const CollaboratorAreaCard: React.VFC<CollaboratorAreaCardProps> = ({
  headerLeftIcon,
  headerRightIcon,
  headerRightButtonLabel,
  title,
  disabled,
  children,
  style,
  onPressHeaderLeft,
  onPressHeaderRight,
  isCollaborator = true,
  testID = 'collaboration-area-card',
}: CollaboratorAreaCardProps) => {
  const size = isCollaborator ? 'default' : 'large'
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

  const Header = () => {
    return (
      <View style={isCollaborator ? styles.headerContainer : styles.collaboratorHeaderContainer}>
        <HoliButton
          transparent
          style={styles.headerTitleContainer}
          label={title || ''}
          onPress={onPressHeaderLeft}
          testID={`btn-left-${testID}`}
        >
          <View style={styles.headerTitle}>
            {headerLeftIcon && (
              <HoliIcon
                icon={headerLeftIcon}
                size={24}
                color={!disabled ? colors.brandColorB30 : colors.foreground20}
                style={{ marginRight: 8 }}
              />
            )}
            <HoliText size={size}>{title}</HoliText>
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

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    wrapper: {
      backgroundColor: theme.colors.background10,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.background30,
    },
    headerContainer: {
      padding: 16,
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
    },
    collaboratorHeaderContainer: {
      paddingLeft: 8,
      paddingTop: 16,
      paddingBottom: 8,
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
