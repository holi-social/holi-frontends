import React from 'react'
import ButtonBase, { ButtonProps } from './ButtonBase'
import { jsVars } from '@holi/ui/styles/globalVars'
import styles from './button.module.scss'

export const Button: React.FC<ButtonProps> = (props) => {
  return (
    <button
      className={[jsVars.CSS_BUTTON_CLASS, styles.button, props.fullWidth ? styles.fullWidth : ''].join(' ')}
      type="button"
    >
      <ButtonBase {...props} />
    </button>
  )
}
