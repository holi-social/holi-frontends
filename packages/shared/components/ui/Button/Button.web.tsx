import React from 'react'
import ButtonBase, { ButtonProps } from './ButtonBase'
import { jsVars } from '@holi/shared/styles/globalVars'
import styles from './button.module.scss'

export const Button: React.FC<ButtonProps> = (props) => {
  return (
    <button className={[jsVars.CSS_BUTTON_CLASS, styles.button].join(' ')} type="button">
      <ButtonBase {...props} />
    </button>
  )
}
