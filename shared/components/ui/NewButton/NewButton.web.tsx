import React from 'react'
import ButtonBase, { ButtonProps } from './ButtonBase'
import styles from './button.module.scss'

export const NewButton: React.VoidFunctionComponent<ButtonProps> = (props) => {
  return (
    <button className={styles.button} type="button">
      <ButtonBase {...props} />
    </button>
  )
}
