import React from 'react'
import Image from 'next/image'
import styles from './footer.module.scss'

const Footer: React.VoidFunctionComponent = () => {
  return (
    <footer className={styles.footer}>
      <a
        href="https://project-holi.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Powered by the HOLI team
        <Image
          src={require('shared/assets/img/logo/logo.svg')}
          alt="sdfsdf"
          width="50"
          height="50"
        />
      </a>
    </footer>
  )
}

export default Footer
