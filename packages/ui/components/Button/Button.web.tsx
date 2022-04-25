import React from 'react'

import { jsVars } from '@holi/ui/styles/globalVars'

import ButtonBase, { ButtonProps } from './ButtonBase'
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
