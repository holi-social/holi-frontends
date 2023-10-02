import React from 'react'
import type { Dispatch, PropsWithChildren, SetStateAction } from 'react'
import { Modal, Pressable, StyleSheet, View } from 'react-native'

import { colors } from '@holi/ui/styles/globalVars'

interface Props {
  isVisible: boolean
  label: string
  setVisibility: Dispatch<SetStateAction<boolean>>
}

// TODO: This can be a candidate for a Holi component and should be synced with our design department
const NotificationModal = ({ isVisible, children, label, setVisibility }: PropsWithChildren<Props>) => {
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

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: 'center',
    flex: 1,
  },
  Modalbackdrop: {
    opacity: 0.4,
    backgroundColor: colors.foreground30,
    ...StyleSheet.absoluteFillObject,
  },
  modalView: {
    maxWidth: 460,
    padding: 24,
    margin: 25,
    alignSelf: 'center',
    backgroundColor: colors.background10,
    borderWidth: 2,
    borderRadius: 24,
    borderColor: colors.foreground30,
    shadowColor: colors.foreground30,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
})
