import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Platform, SafeAreaView as SafeAreaViewIOS, StyleSheet, View, useWindowDimensions } from 'react-native'

import { createUUID } from '@holi/core/helpers'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { default as SafeAreaViewAndroid } from '@holi/ui/components/atoms/SafeArea'
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
    (id: string) => setToasts((currentToasts: Toast[]) => currentToasts.filter((toast) => toast.id !== id)),
    []
  )
  const openToast = useCallback(
    (text: string, type = HoliToastType.SUCCESS, testID?: string) =>
      setToasts((currentToasts: Toast[]) => [...currentToasts, { id: createUUID(), text, type, testID }]),
    []
  )
  const contextValue = useMemo(() => ({ openToast, closeToast }), [closeToast, openToast])

  const { width: deviceWidth } = useWindowDimensions()
  const styles = useMemo(() => createStyles(deviceWidth), [deviceWidth])

  const SafeArea = Platform.OS === 'android' ? SafeAreaViewAndroid : SafeAreaViewIOS

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      <SafeArea style={styles.wrapper}>
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
      </SafeArea>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)

export const HoliToast: React.FC<HoliToastProps> = ({ closeToast, type, text, testID }) => {
  const { width: deviceWidth } = useWindowDimensions()

  const styles = useMemo(() => createStyles(deviceWidth, type), [deviceWidth, type])

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
      <View style={styles.toastView}>
        <HoliText style={styles.toastText} selectable={false}>
          {text}
        </HoliText>
        <HoliIcon
          icon={type === HoliToastType.SUCCESS ? 'smiley-2' : 'error-warning'}
          size={20}
          color={colors.fontColorWhite}
          style={styles.toastIcon}
        />
      </View>
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
            maxWidth: +vars.maxButtonWidth,
            marginLeft: 'auto',
            marginRight: 'auto',
            left: 0,
            right: 0,
          }
        : {}),
    },
    toast: {
      padding: 20,
      flex: 1,
      backgroundColor: type === HoliToastType.ERROR ? colors.backgroundColorError : colors.backgroundColorSuccess,
      ...(deviceWidth >= +vars.breakpointL
        ? {
            borderRadius: 10,
            marginTop: 5,
          }
        : {}),
    },
    toastView: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    toastText: {
      color: colors.fontColorWhite,
      textAlign: 'center',
    },
    toastIcon: {
      marginLeft: 10,
    },
  })
