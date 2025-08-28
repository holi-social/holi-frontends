import React, { useMemo } from 'react'
import type { Dispatch, PropsWithChildren, SetStateAction } from 'react'
import { Modal, Pressable, View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

interface Props {
  isVisible: boolean
  label: string
  setVisibility: Dispatch<SetStateAction<boolean>>
}

// TODO: This can be a candidate for a Holi component and should be synced with our design department
const NotificationModal = ({ isVisible, children, label, setVisibility }: PropsWithChildren<Props>) => {
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  return (
    <Modal animationType="fade" transparent visible={isVisible} aria-label={label}>
      <View style={styles.modalContainer}>
        <Pressable onPress={() => setVisibility(false)} style={styles.Modalbackdrop} testID="close-modal" />
        <View style={styles.modalView}>{children}</View>
      </View>
    </Modal>
  )
}

export default NotificationModal

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    modalContainer: {
      justifyContent: 'center',
      flex: 1,
    },
    Modalbackdrop: {
      opacity: 0.4,
      backgroundColor: theme.colors.foreground30,
      ...StyleSheet.absoluteFillObject,
    },
    modalView: {
      maxWidth: 460,
      padding: 24,
      margin: 25,
      alignSelf: 'center',
      backgroundColor: theme.colors.background10,
      borderWidth: 2,
      borderRadius: 24,
      borderColor: theme.colors.foreground30,
      shadowColor: theme.colors.foreground30,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 1,
      shadowRadius: 0,
    },
  })
