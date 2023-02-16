import React, { ReactChild, useCallback, useEffect, useMemo, useState } from 'react'
import {
  AccessibilityProps,
  KeyboardTypeOptions,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  Platform,
  StyleProp,
  StyleSheet,
  TargetedEvent,
  TextInput,
  TextInputContentSizeChangeEventData,
  TextInputIOSProps,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
  useWindowDimensions,
} from 'react-native'

import type { AccessibilityPropsWeb } from '@holi/ui/@types/reactNativeWeb'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export type HoliTextInputProps = {
  inputLabel?: string
  accessibilityLabel: string
  value?: string
  placeholder?: string
  helperText?: string
  validationErrorText?: string
  disabled?: boolean
  noOfVisibleLines?: number
  maxNoOfVisibleLines?: number
  maxNoOfCharacters?: number
  onChange?: (value: string) => void
  type?: 'text' | 'email' | 'number' | 'password' // Force limited input types
  inline?: boolean
  trailingIcon?: string
  trailingComponent?: ReactChild
  style?: StyleProp<ViewStyle>
  inputStyle?: StyleProp<ViewStyle>
  labelStyle?: StyleProp<TextStyle>
  /** TextInputProps to extend input e.g with'returnKeytype' or 'autofocus' */
  inputProps?: TextInputProps
  testID?: string
  onFocus?: (event: NativeSyntheticEvent<TargetedEvent>) => void
  onBlur?: (event: NativeSyntheticEvent<TargetedEvent>) => void
  onLayout?: (event: LayoutChangeEvent) => void
  accessibilityAutoComplete?: AccessibilityPropsWeb['accessibilityAutoComplete']
  accessibilityControls?: string
  showCharacterCount?: boolean
  // eslint-disable-next-line
  [x: string]: any
}

const HoliTextInput = (
  {
    noOfVisibleLines = 1,
    maxNoOfVisibleLines = 1,
    maxNoOfCharacters = 5000,
    inline = false,
    style = {},
    inputStyle = {},
    type,
    value,
    inputLabel,
    onFocus,
    onBlur,
    showCharacterCount = false,
    ...props
  }: HoliTextInputProps,
  ref: React.ForwardedRef<View>
) => {
  const dimensions = useWindowDimensions()
  const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

  const [isFocused, setFocused] = useState<boolean>(false)
  const [isHovered, setHovered] = useState<boolean>(false)
  const hasValidationErrors = !!props?.validationErrorText

  // numberOfLines values is only used for auto-sizing the textarea when there is new text input
  const [numberOfLines, setNumberOfLines] = useState<number>(
    clamp(noOfVisibleLines, noOfVisibleLines, maxNoOfVisibleLines)
  )

  const accessibilityProps: AccessibilityProps & AccessibilityPropsWeb = {
    accessible: true,
    accessibilityLabel: props.accessibilityLabel,
    accessibilityAutoComplete: props.accessibilityAutoComplete || 'inline',
    accessibilityControls: props.accessibilityControls,
  }

  useEffect(() => {
    setNumberOfLines(clamp(noOfVisibleLines, noOfVisibleLines, maxNoOfVisibleLines))
  }, [noOfVisibleLines, maxNoOfVisibleLines])

  const handleFocus = useCallback(
    (event) => {
      setFocused(true)
      onFocus && onFocus(event)
    },
    [setFocused, onFocus]
  )
  const handleBlur = useCallback(
    (event) => {
      setFocused(false)
      onBlur && onBlur(event)
    },
    [setFocused, onBlur]
  )

  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const adjustInputHeight = (event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
    const inputHeight = event.nativeEvent.contentSize.height
    const newNumberOfLines = Math.round((inputHeight - 2 * INPUT_VERTICAL_PADDING) / LINE_HEIGHT)
    setNumberOfLines(clamp(newNumberOfLines, noOfVisibleLines, maxNoOfVisibleLines))
  }

  const keyboardType: KeyboardTypeOptions = (() => {
    if (type === 'email') return 'email-address'
    if (type === 'number') return 'numeric'
    return 'default'
  })()

  const textContentType: TextInputIOSProps['textContentType'] = (() => {
    const iOS12Plus = Platform.OS === 'ios' && parseInt(String(Platform.Version), 10) >= 12
    if (type === 'password') return iOS12Plus ? 'newPassword' : 'password'
    if (type === 'email') return Platform.OS === 'ios' ? 'username' : 'emailAddress'
  })()

  const autocomplete: TextInputProps['autoComplete'] = (() => {
    if (type === 'password') return Platform.OS === 'android' ? 'password' : 'current-password'
    if (type === 'email') return 'email'
    return 'off'
  })()

  const hoverPropsForWeb = Platform.select({
    web: {
      onMouseOver: () => setHovered(true),
      onMouseOut: () => setHovered(false),
    },
  })

  const iconColor = (() => {
    if (isFocused) return colors.brandColorB30
    if (isHovered) return colors.foreground20
    return colors.background30
  })()

  return (
    <View
      ref={ref}
      onLayout={props?.onLayout}
      style={[styles.wrapper, inline ? styles.inline : styles.block, style]}
      {...hoverPropsForWeb}
    >
      <View style={[styles.wrapperContainer, { maxWidth: dimensions.width }, inline ? styles.inline : styles.block]}>
        {!!inputLabel && (
          <View style={[styles.labelWrapper, inline ? styles.inline : styles.block]}>
            <HoliText
              size="small"
              bold
              style={[
                styles.label,
                props.labelStyle,
                isFocused ? styles.labelFocused : {},
                hasValidationErrors ? styles.labelHasValidationErrors : {},
              ]}
            >
              {inputLabel}
            </HoliText>
          </View>
        )}
        <View
          style={[
            styles.inputWrapper,
            inline ? styles.inline : styles.block,
            isHovered && styles.inputWrapperHovered,
            isFocused && styles.inputWrapperFocused,
            inputStyle,
            props?.disabled && styles.inputWrapperDisabled,
            hasValidationErrors && styles.inputWrapperHasValidationErrors,
          ]}
        >
          <TextInput
            value={value}
            style={[
              styles.input,
              inline ? styles.inline : styles.block,
              { height: numberOfLines * LINE_HEIGHT + 2 * INPUT_VERTICAL_PADDING },
            ]}
            numberOfLines={noOfVisibleLines}
            multiline={maxNoOfVisibleLines > 1}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={props?.placeholder}
            placeholderTextColor={colors.foreground10}
            onChange={(event) => {
              let text = event.nativeEvent.text
              // type doesn't work with RN 'numeric' on web
              if (type === 'number') text = text.replace(/[^0-9]/g, '')
              props.onChange?.(text)
            }}
            onContentSizeChange={adjustInputHeight}
            keyboardType={keyboardType}
            textContentType={textContentType}
            maxLength={maxNoOfCharacters}
            editable={!props?.disabled}
            blurOnSubmit={Platform.OS !== 'web'}
            secureTextEntry={type === 'password'}
            autoComplete={autocomplete}
            autoCapitalize="none"
            autoCorrect={false}
            {...accessibilityProps}
            {...props?.inputProps}
            testID={`${props?.testID || 'holi-text'}-input`}
          />
          {(hasValidationErrors || props?.trailingIcon || props?.trailingComponent) && (
            <View style={styles.trailingIconWrapper}>
              {(props?.trailingIcon || props?.trailingComponent) &&
                !hasValidationErrors &&
                (props?.trailingComponent || <HoliIcon icon={props?.trailingIcon || ''} size={22} color={iconColor} />)}
              {hasValidationErrors && <HoliIcon icon="error-warning" size={16} filled color={colors.error30} />}
            </View>
          )}
          {!showCharacterCount && (value?.length ?? 0) > maxNoOfCharacters * 0.8 && (
            <View
              style={[
                styles.inputCharsTextWrapper,
                isHovered && styles.inputCharsTextWrapperHovered,
                isFocused && styles.inputCharsTextWrapperFocused,
                props?.disabled && styles.inputCharsTextWrapperDisabled,
                hasValidationErrors && styles.inputCharsTextWrapperHasValidationErrors,
              ]}
            >
              <HoliText
                size="extrasmall"
                style={styles.inputCharsText}
              >{`${value?.length}/${maxNoOfCharacters}`}</HoliText>
            </View>
          )}
        </View>
        <View style={styles.descriptionContainer}>
          {(props?.validationErrorText || props?.helperText) && (
            <View style={[styles.helperTextWrapper, inline ? styles.inline : styles.block]}>
              <HoliText
                size="extrasmall"
                style={[styles.helperText, hasValidationErrors ? styles.validationErrorText : {}]}
                testID={`${props?.testID || 'holi-text'}-input${hasValidationErrors && '-error'}-message`}
              >
                {props?.validationErrorText || props?.helperText}
              </HoliText>
            </View>
          )}
          {showCharacterCount && (
            <View style={[styles.charactorCountContainer, inline ? styles.inline : styles.block]}>
              <HoliText
                size="extrasmall"
                style={[styles.charactorCountText, hasValidationErrors ? styles.validationErrorText : {}]}
              >{`${value ? value.length : 0}/${maxNoOfCharacters}`}</HoliText>
            </View>
          )}
        </View>
      </View>
    </View>
  )
}

export default React.forwardRef(HoliTextInput)

const LINE_HEIGHT = 16 * 1.4
const INPUT_VERTICAL_PADDING = 15

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    wrapper: {
      flexDirection: 'row',
    },
    wrapperContainer: {
      minWidth: 190,
    },
    inputWrapper: {
      alignItems: 'center',
      flexDirection: 'row',
      borderWidth: 2,
      borderColor: colors.background30,
      borderRadius: 4,
      backgroundColor: colors.background10,
    },
    inputWrapperFocused: {
      borderColor: colors.brandColorB30,
    },
    inputWrapperDisabled: {
      borderColor: colors.background30,
      backgroundColor: colors.background20,
    },
    inputWrapperHasValidationErrors: {
      borderColor: colors.error30,
    },
    inputWrapperHovered: {
      borderColor: colors.foreground20,
    },
    input: {
      flex: 1,
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: INPUT_VERTICAL_PADDING,
      lineHeight: LINE_HEIGHT,
      fontWeight: '400',
      fontFamily: theme.fontFamily.default('Book'),
      color: colors.foreground30,
      overflow: 'scroll',
      ...Platform.select({
        web: {
          overflowX: 'hidden',
          caretColor: colors.brandColorB30,
        },
      }),
    },
    inline: {
      ...Platform.select({
        web: {
          alignSelf: 'flex-start',
          width: 'auto',
        },
      }),
      maxWidth: '100%',
    },
    block: {
      alignSelf: 'stretch',
      width: '100%',
    },
    inputCharsTextWrapper: {
      backgroundColor: colors.foreground10,
      borderRadius: 8,
      position: 'absolute',
      paddingHorizontal: 8,
      right: 8,
      bottom: -8,
    },
    inputCharsTextWrapperFocused: {
      backgroundColor: colors.brandColorB30,
    },
    inputCharsTextWrapperDisabled: {
      backgroundColor: colors.background30,
    },
    inputCharsTextWrapperHasValidationErrors: {
      backgroundColor: colors.error30,
    },
    inputCharsTextWrapperHovered: {
      backgroundColor: colors.foreground20,
    },
    inputCharsText: {
      color: colors.background10,
    },
    labelWrapper: {
      marginBottom: 6,
    },
    label: {
      color: colors.foreground30,
    },
    labelFocused: {
      color: colors.brandColorB30,
    },
    labelHasValidationErrors: {
      color: colors.error30,
    },
    helperTextWrapper: {
      flex: 4,
    },
    helperText: {
      color: colors.foreground20,
    },
    validationErrorText: {
      color: colors.error30,
    },
    trailingIconWrapper: {
      height: 22,
      justifyContent: 'center',
      marginRight: 12,
    },
    descriptionContainer: {
      flexDirection: 'row',
      marginTop: 6,
    },
    charactorCountContainer: {
      flex: 1,
      alignItems: 'flex-end',
    },
    charactorCountText: {
      color: colors.foreground20,
    },
  })
