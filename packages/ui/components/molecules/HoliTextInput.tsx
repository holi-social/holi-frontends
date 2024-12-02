import React, { type ReactChild, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  type KeyboardTypeOptions,
  type LayoutChangeEvent,
  type NativeSyntheticEvent,
  Platform,
  type StyleProp,
  StyleSheet,
  TextInput,
  type TextInputFocusEventData,
  type TextInputIOSProps,
  type TextInputProps,
  type TextStyle,
  View,
  type ViewStyle,
  useWindowDimensions,
} from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import type { HoliIconType } from '@holi/icons/src/HoliIconType'
import { ErrorWarningFilled } from '@holi/icons/src/generated'
import type { AccessibilityPropsWeb, AccessibilityRoleWeb } from '@holi/ui/@types/reactNativeWeb'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliMandatoryFieldStar from '@holi/ui/components/molecules/HoliMandatoryFieldStar'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

export interface HoliTextInputProps {
  inputLabel?: string
  'aria-label': string
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
  trailingIcon?: HoliIconType
  trailingComponent?: ReactChild
  style?: StyleProp<ViewStyle>
  fontStyle?: StyleProp<TextStyle>
  inputStyle?: StyleProp<ViewStyle>
  labelStyle?: StyleProp<TextStyle>
  placeholderColor?: string
  /** TextInputProps to extend input e.g with'returnKeytype' or 'autofocus' */
  inputProps?: TextInputProps
  testID?: string
  onFocus?: (event: NativeSyntheticEvent<TextInputFocusEventData>) => void
  onBlur?: (event: NativeSyntheticEvent<TextInputFocusEventData>) => void
  onLayout?: (event: LayoutChangeEvent) => void
  role?: AccessibilityRoleWeb
  ariaExpanded?: boolean
  ariaHasPopup?: AccessibilityPropsWeb['aria-haspopup']
  'aria-autocomplete'?: AccessibilityPropsWeb['aria-autocomplete']
  'aria-controls'?: string
  showCharacterCount?: boolean
  isRequired?: boolean
  inputAccessoryViewID?: string
}

const isIOS = Platform.OS === 'ios'

const isHTMLTextAreaElement = (inputNode: HTMLTextAreaElement | TextInput | null): inputNode is HTMLTextAreaElement => {
  return Platform.OS === 'web' && !!inputNode && 'style' in inputNode
}

const INPUT_HEIGHT = 22
const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min * INPUT_HEIGHT), max * INPUT_HEIGHT)
const useAdjustInputHeightWeb = (
  textArea: TextInput | HTMLTextAreaElement | null,
  value?: string,
  noOfVisibleLines = 1,
  maxNoOfVisibleLines = 1
) => {
  useEffect(() => {
    if (!isHTMLTextAreaElement(textArea)) return

    // We need to reset the height momentarily to get the correct scrollHeight for the textarea
    textArea.style.height = '0px'
    const height = clamp(textArea.scrollHeight, noOfVisibleLines, maxNoOfVisibleLines)

    // We then set the height directly, outside of the render loop
    // Trying to set this with state or a ref will product an incorrect value.
    textArea.style.height = height + 'px'
  }, [maxNoOfVisibleLines, noOfVisibleLines, textArea, value])
}

const HoliTextInput = React.forwardRef<View, HoliTextInputProps>(
  (
    {
      noOfVisibleLines = 1,
      maxNoOfVisibleLines = 1,
      maxNoOfCharacters = 5000,
      inline = false,
      style = {},
      inputStyle = {},
      fontStyle = {},
      placeholderColor,
      type,
      value,
      inputLabel,
      onFocus,
      onBlur,
      showCharacterCount = false,
      isRequired = false,
      inputAccessoryViewID,
      ...props
    },
    ref
  ) => {
    const dimensions = useWindowDimensions()

    const [inputState, setInputState] = useState<'inactive' | 'focused' | 'hovered'>('inactive')
    const hasValidationErrors = !!props?.validationErrorText

    const accessibilityProps: AccessibilityPropsWeb = {
      role: props.role,
      'aria-expanded': props.ariaExpanded,
      'aria-haspopup': props.ariaHasPopup,
      accessible: true,
      'aria-label': props['aria-label'],
      'aria-autocomplete': props['aria-autocomplete'] || 'inline',
      'aria-controls': props['aria-controls'],
    }

    const handleFocus = useCallback(
      (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
        setInputState('focused')
        onFocus?.(event)
      },
      [onFocus]
    )
    const handleBlur = useCallback(
      (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
        setInputState('inactive')
        onBlur?.(event)
      },
      [onBlur]
    )

    const { theme } = useTheme()
    const { colors } = theme
    const styles = useMemo(() => getStyles(theme), [theme])

    const [inputHeight, seInputHeight] = useState(INPUT_HEIGHT)
    const textAreaRef = useRef<TextInput>(null)
    useAdjustInputHeightWeb(textAreaRef.current, value, noOfVisibleLines, maxNoOfVisibleLines)

    const keyboardType: KeyboardTypeOptions = (() => {
      if (type === 'email') return 'email-address'
      if (type === 'number') return 'numeric'
      return 'default'
    })()

    const textContentType: TextInputIOSProps['textContentType'] = (() => {
      // use value from predefined inputProps
      if (props?.inputProps?.textContentType) return props?.inputProps?.textContentType

      const iOS12Plus = Platform.OS === 'ios' && Number.parseInt(String(Platform.Version), 10) >= 12
      if (type === 'password') return iOS12Plus ? 'newPassword' : 'password'
      if (type === 'email') return Platform.OS === 'ios' ? 'username' : 'emailAddress'
    })()

    const autocomplete: TextInputProps['autoComplete'] = (() => {
      if (type === 'password')
        return Platform.OS === 'android' ? 'password' : props?.inputProps?.autoComplete || 'current-password'
      if (type === 'email') return 'email'
      return 'off'
    })()

    const hoverPropsForWeb = Platform.select({
      web: {
        onMouseOver: () => setInputState((prev) => (prev === 'inactive' ? 'hovered' : prev)),
        onMouseOut: () => setInputState((prev) => (prev === 'hovered' ? 'inactive' : prev)),
      },
    })

    const iconColor = (() => {
      switch (inputState) {
        case 'focused':
          return colors.brandColorB30
        case 'hovered':
          return colors.foreground20
        default:
          return colors.background30
      }
    })()

    const multiline = maxNoOfVisibleLines > 1

    const inputBorderColor = (() => {
      if (hasValidationErrors) return theme.colors.error30
      return iconColor
    })()

    return (
      <View
        ref={ref}
        onLayout={props?.onLayout}
        style={[styles.wrapper, inline ? styles.inline : styles.block, style]}
        {...hoverPropsForWeb}
      >
        <View style={[{ maxWidth: dimensions.width }, inline ? styles.inline : styles.block]}>
          {!!inputLabel && (
            <View style={[styles.labelWrapper, inline ? styles.inline : styles.block]}>
              <HoliText
                size="small"
                bold
                style={[
                  styles.label,
                  props.labelStyle,
                  inputState === 'focused' && styles.labelFocused,
                  hasValidationErrors ? styles.labelHasValidationErrors : {},
                ]}
                {...(props?.testID ? { testID: `${props?.testID}-label` } : {})}
              >
                {inputLabel}
                <HoliMandatoryFieldStar show={!!isRequired} error={!!hasValidationErrors} />
              </HoliText>
            </View>
          )}
          <View
            style={[styles.inputWrapper, inline ? styles.inline : styles.block]}
            testID={isIOS ? `${props?.testID || 'holi-text'}-input` : 'holi-text-input-wrapper'}
          >
            <TextInput
              value={value ?? ''}
              style={[
                styles.input,
                inputStyle,
                inline ? styles.inline : styles.block,
                fontStyle,
                { borderColor: inputBorderColor },
              ]}
              numberOfLines={noOfVisibleLines}
              textAlignVertical="top"
              multiline={multiline}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder={props?.placeholder}
              placeholderTextColor={placeholderColor || colors.foreground10}
              onChange={(event) => {
                let text = event.nativeEvent.text
                // type doesn't work with RN 'numeric' on web
                if (type === 'number') text = text.replace(/[^0-9]/g, '')
                props.onChange?.(text)
              }}
              onContentSizeChange={(event) => seInputHeight(event.nativeEvent.contentSize.height)}
              keyboardType={keyboardType}
              textContentType={textContentType}
              maxLength={maxNoOfCharacters}
              editable={!props?.disabled}
              blurOnSubmit={Platform.OS !== 'web' && !multiline}
              secureTextEntry={type === 'password'}
              autoComplete={autocomplete}
              autoCapitalize="none"
              {...accessibilityProps}
              {...props?.inputProps}
              testID={!isIOS ? `${props.testID || 'holi-text'}-input` : 'input'}
              ref={textAreaRef}
              // Fix for correct cursor scrolling for multiple lines
              scrollEnabled={multiline ? Math.floor(inputHeight / INPUT_HEIGHT) >= maxNoOfVisibleLines : true}
              inputAccessoryViewID={inputAccessoryViewID}
            />
            {(hasValidationErrors || props?.trailingIcon || props?.trailingComponent) && (
              <View style={styles.trailingIconWrapper}>
                {(props?.trailingIcon || props?.trailingComponent) &&
                  !hasValidationErrors &&
                  (props?.trailingComponent ||
                    (props?.trailingIcon && <HoliIcon icon={props.trailingIcon} size={22} color={iconColor} />))}
                {hasValidationErrors && <HoliIcon icon={ErrorWarningFilled} size={16} color={colors.error30} />}
              </View>
            )}
            {!showCharacterCount && (value?.length ?? 0) > maxNoOfCharacters * 0.8 && (
              <View
                style={[
                  styles.inputCharsTextWrapper,
                  inputState === 'hovered' && styles.inputCharsTextWrapperHovered,
                  inputState === 'focused' && styles.inputCharsTextWrapperFocused,
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
              <View
                style={[styles.helperTextWrapper, inline ? styles.inline : styles.block]}
                testID={isIOS ? `${props?.testID || 'holi-text'}-input${hasValidationErrors && '-error'}-message` : ''}
              >
                <HoliText
                  size="extrasmall"
                  style={[styles.helperText, hasValidationErrors ? styles.validationErrorText : {}]}
                  testID={
                    !isIOS ? `${props?.testID || 'holi-text'}-input${hasValidationErrors && '-error'}-message` : ''
                  }
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
)

HoliTextInput.displayName = 'HoliTextInput'

export default memo(HoliTextInput)

const FONT_SIZE = 16
const LINE_HEIGHT = FONT_SIZE * 1.4
export const TEXT_INPUT_VERTICAL_PADDING = 15
export const TEXT_INPUT_HORIZONTAL_PADDING = 10

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    wrapper: {
      flexDirection: 'row',
    },
    inputWrapper: {
      alignItems: 'center',
      flexDirection: 'row',
      ...Platform.select({
        web: {
          flexDirection: 'column',
        },
      }),
    },
    input: {
      flex: 1,
      fontSize: FONT_SIZE,
      lineHeight: LINE_HEIGHT,
      fontWeight: '400',
      fontFamily: theme.fontFamily.default('Regular'),
      color: theme.colors.foreground30,
      backgroundColor: theme.colors.background10,
      overflow: 'scroll',
      borderWidth: 2,
      borderRadius: 4,
      paddingHorizontal: TEXT_INPUT_HORIZONTAL_PADDING,
      paddingVertical: TEXT_INPUT_VERTICAL_PADDING,
      ...Platform.select({
        web: {
          overflowX: 'hidden',
          caretColor: theme.colors.brandColorB30,
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
      width: '100%',
    },
    inputCharsTextWrapper: {
      backgroundColor: theme.colors.foreground10,
      borderRadius: 8,
      position: 'absolute',
      paddingHorizontal: 8,
      right: 8,
      bottom: -8,
    },
    inputCharsTextWrapperFocused: {
      backgroundColor: theme.colors.brandColorB30,
    },
    inputCharsTextWrapperDisabled: {
      backgroundColor: theme.colors.background30,
    },
    inputCharsTextWrapperHasValidationErrors: {
      backgroundColor: theme.colors.error30,
    },
    inputCharsTextWrapperHovered: {
      backgroundColor: theme.colors.foreground20,
    },
    inputCharsText: {
      color: theme.colors.background10,
    },
    labelWrapper: {
      marginBottom: 6,
      flexDirection: 'row',
    },
    label: {
      color: theme.colors.foreground30,
    },
    labelFocused: {
      color: theme.colors.brandColorB30,
    },
    labelHasValidationErrors: {
      color: theme.colors.error30,
    },
    labelMandatoryStar: {
      color: theme.colors.brandColorB30,
    },
    helperTextWrapper: {
      flex: 4,
      marginTop: 6,
    },
    helperText: {
      color: theme.colors.foreground20,
    },
    validationErrorText: {
      color: theme.colors.error30,
    },
    trailingIconWrapper: {
      justifyContent: 'center',
      position: 'absolute',
      right: 12,
      top: 0,
      bottom: 0,
    },
    descriptionContainer: {
      flexDirection: 'row',
    },
    charactorCountContainer: {
      flex: 1,
      alignItems: 'flex-end',
      marginTop: 6,
    },
    charactorCountText: {
      color: theme.colors.foreground20,
    },
  })
