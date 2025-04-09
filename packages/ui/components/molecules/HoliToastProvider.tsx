import type React from 'react'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native'

import { createUUID } from '@holi/core/helpers/strings'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { EmotionUnhappyNoeyes, UserSmile } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'
import SafeArea from '@holi/ui/components/atoms/SafeArea'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { dimensions } from '@holi/ui/styles/globalVars'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

export enum HoliToastType {
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
}

export enum HoliToastTimeout {
  ERROR = 5000,
  SUCCESS = 3000,
}

interface Toast {
  id: string
  type: HoliToastType
  text: string
  timeout?: HoliToastTimeout
  testID?: string
}

export interface HoliToastProps extends Toast {
  closeToast: () => void
}

interface ToastOptions {
  timeout?: HoliToastTimeout
  testID?: string
}

export interface ToastContextValue {
  openToast: (text: string, type: HoliToastType, options?: ToastOptions) => void
  closeToast: (id: string) => void
}

const selectTimeoutForType = (type: HoliToastType): HoliToastTimeout =>
  type === HoliToastType.ERROR ? HoliToastTimeout.ERROR : HoliToastTimeout.SUCCESS

export const ToastContext = createContext<ToastContextValue>({} as ToastContextValue)

export const ToastProvider = ({ children }: React.PropsWithChildren<Partial<ToastContextValue>>) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const closeToast = useCallback(
    (id: string) => setToasts((currentToasts: Toast[]) => currentToasts.filter((toast) => toast.id !== id)),
    []
  )
  const openToast = useCallback(
    (text: string, type: HoliToastType, { timeout, testID }: ToastOptions = {}) =>
      setToasts((currentToasts: Toast[]) => [
        ...currentToasts,
        {
          id: createUUID(),
          text,
          type,
          timeout,
          testID,
        },
      ]),
    []
  )
  const contextValue = useMemo(() => ({ openToast, closeToast }), [closeToast, openToast])

  const { width: deviceWidth } = useWindowDimensions()
  const firstToastType = toasts?.[0]?.type
  const { theme } = useTheme()
  const styles = useMemo(() => createStyles(deviceWidth, theme, firstToastType), [deviceWidth, theme, firstToastType])

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      {!!toasts.length && (
        <SafeArea style={[styles.wrapper, Platform.OS === 'web' && styles.wrapperWebPosition]}>
          {toasts.map((toast: Toast) => (
            <HoliToast
              key={toast.id}
              id={toast.id}
              type={toast.type}
              closeToast={() => closeToast(toast.id)}
              text={toast.text}
              timeout={toast.timeout}
              testID={toast.testID}
            />
          ))}
        </SafeArea>
      )}
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)

export const HoliToast: React.FC<HoliToastProps> = ({ closeToast, type, text, timeout, testID }) => {
  const { width: deviceWidth } = useWindowDimensions()
  const toastTimeout = timeout || selectTimeoutForType(type)
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => createStyles(deviceWidth, theme, type), [deviceWidth, theme, type])

  useEffect(() => {
    const timer = setTimeout(closeToast, toastTimeout)
    return () => clearTimeout(timer)
  }, [closeToast, toastTimeout])

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
        {/* TODO: Change error icon to sad smiley */}
        <HoliIcon
          icon={type === HoliToastType.SUCCESS ? UserSmile : EmotionUnhappyNoeyes}
          size={20}
          colorOverride={colors.background10}
          style={styles.toastIcon}
        />
      </View>
    </HoliButton>
  )
}

export default HoliToast

const createStyles = (deviceWidth: number, theme: HoliTheme, type?: HoliToastType) =>
  StyleSheet.create({
    wrapper: {
      top: 0,
      position: 'absolute',
      zIndex: 1000,
      width: '100%',
      ...Platform.select({
        native: {
          backgroundColor: type === HoliToastType.ERROR ? theme.colors.error30 : theme.colors.brandColorB30,
        },
      }),
      ...(deviceWidth >= dimensions.breakpointL
        ? {
            maxWidth: dimensions.maxButtonWidth,
            marginLeft: 'auto',
            marginRight: 'auto',
            left: 0,
            right: 0,
          }
        : {}),
    },
    wrapperWebPosition: {
      position: 'fixed',
      width: '100%',
      top: 0,
    },
    toast: {
      padding: 20,
      flex: 1,
      backgroundColor: type === HoliToastType.ERROR ? theme.colors.error30 : theme.colors.brandColorB30,
      ...(deviceWidth >= dimensions.breakpointL
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
      color: theme.colors.background10,
      textAlign: 'center',
    },
    toastIcon: {
      marginLeft: 10,
    },
  })
