import { Spacing } from 'holi-bricks/foundations'
import { FoundationTheme } from 'holi-bricks/foundations/colors/themes/types'

export const buttonBaseStyle = {
  borderRadius: 1000, // pill
  borderStyle: 'solid',
  borderWidth: 1,
  display: 'flex',
} as const

export type ButtonVariant = keyof FoundationTheme['components']['button']

interface ButtonVariantArgsBase {
  variant: ButtonVariant
  theme: FoundationTheme
}

export const getButtonVariantStyle = ({
  variant,
  theme,
  pressed,
  hovered,
}: ButtonVariantArgsBase & { pressed: boolean; hovered: boolean }) => ({
  backgroundColor: theme.components.button[variant].background,
  borderColor: theme.components.button[variant].border,
  boxShadow: `0 0 0 ${pressed ? '2px' : hovered ? '1px' : '0px'} ${theme.components.button[variant].border}`,
})

export const getButtonSelectedStyle = (theme: FoundationTheme) =>
  ({
    true: {
      backgroundColor: theme.components.button.selected.background,
      borderColor: theme.components.button.selected.border,
    },
  }) as const

export const getButtonDisabledStyle = (theme: FoundationTheme) =>
  ({
    true: {
      backgroundColor: theme.components.button.disabled.background,
      borderColor: theme.components.button.disabled.border,
    },
  }) as const

export const getButtonTextVariantStyle = ({
  variant,
  theme,
  disabled,
  selected,
}: ButtonVariantArgsBase & { disabled: boolean; selected: boolean }) => ({
  color: disabled
    ? theme.components.button.disabled.text
    : selected
      ? theme.components.button.selected.text
      : theme.components.button[variant].text,
})

export const buttonContentStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: Spacing['4xs'],
} as const
