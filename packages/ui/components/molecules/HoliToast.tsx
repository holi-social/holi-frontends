import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { StyleSheet, View, useWindowDimensions } from 'react-native'

import { createUUID } from '@holi/core/helpers'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors, vars } from '@holi/ui/styles/globalVars'

const TOAST_TIMEOUT = 2000

export enum HoliToastType {
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
}

interface Toast {
  id: string
  type: HoliToastType
  text: string
  testID?: string
}

export interface HoliToastProps extends Toast {
  closeToast: () => void
}

export interface ToastContextValue {
  openToast: (text: string, type?: HoliToastType, testID?: string) => void
  closeToast: (id: string) => void
}

export const ToastContext = createContext<ToastContextValue>({} as ToastContextValue)

export const ToastProvider: React.FC<Partial<ToastContextValue>> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([])
  const closeToast = useCallback(
    (id: string) => setToasts((currentToasts: Toast[]) => currentToasts.filter((toast: Toast) => toast.id !== id)),
    []
  )
  const openToast = useCallback(
    (text: string, type = HoliToastType.SUCCESS, testID?: string) =>
      setToasts((currentToasts: Toast[]) => [...currentToasts, { id: createUUID(), text, type, testID }]),
    []
  )
  const contextValue = useMemo(() => ({ openToast, closeToast }), [closeToast, openToast])

  const { width: deviceWidth } = useWindowDimensions()
  const styles = createStyles(deviceWidth)

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      <View style={styles.wrapper}>
        {toasts.map((toast: Toast) => (
          <HoliToast
            key={toast.id}
            id={toast.id}
            type={toast.type}
            closeToast={() => closeToast(toast.id)}
            text={toast.text}
            testID={toast.testID}
          />
        ))}
      </View>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)

export const HoliToast: React.FC<HoliToastProps> = ({ closeToast, type, text, testID }) => {
  const { width: deviceWidth } = useWindowDimensions()

  const styles = createStyles(deviceWidth, type)
  useEffect(() => {
    const timer = setTimeout(closeToast, TOAST_TIMEOUT)
    return () => clearTimeout(timer)
  }, [closeToast])

  return (
    <HoliButton
      transparent
      label={text}
      style={styles.toast}
      onPress={closeToast}
      testID={`toast-${testID ? testID : type}`}
    >
      <HoliText style={styles.toastText}>{text}</HoliText>
      {type === HoliToastType.SUCCESS ? <HoliIcon icon="home-smile-2" /> : null}
    </HoliButton>
  )
}

export default HoliToast

const createStyles = (deviceWidth: number, type?: HoliToastType) =>
  StyleSheet.create({
    wrapper: {
      top: 0,
      position: 'absolute',
      zIndex: 1000,
      width: '100%',
      ...(deviceWidth >= +vars.breakpointL
        ? {
            maxWidth: 400,
            marginLeft: 'auto',
            marginRight: 'auto',
            left: 0,
            right: 0,
          }
        : {}),
    },
    toast: {
      padding: 17,
      backgroundColor: type === HoliToastType.ERROR ? colors.errorRed : colors.positivepurple,
      ...(deviceWidth >= +vars.breakpointL
        ? {
            borderRadius: 10,
            marginTop: 5,
          }
        : {}),
    },
    toastText: {
      color: colors.fontColorWhite,
      textAlign: 'center',
    },
  })
