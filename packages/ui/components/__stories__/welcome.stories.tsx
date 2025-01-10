import React from 'react'

import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'

export default {
  title: 'Welcome',
}

export const All = () => {
  return (
    <div className="welcome-page">
      <div className="welcome-container">
        <HoliHeading size="l">Welcome to HOLI Components</HoliHeading>
        <section className="description">
          <HoliText>
            These components are based on{' '}
            <a href="https://www.figma.com/file/RbD0C3K6vITgJXJ4srCxQ9/2.-components" target="_blank" rel="noreferrer">
              FIGMA design
            </a>
          </HoliText>
          <HoliText style={{ display: 'flex', marginTop: 10 }}>See below our</HoliText>
          <ul>
            <li>
              <a href="/?path=/story/foundations-colors--colors-overview">Foundations</a>
            </li>
            <li>
              <a href="/?path=/story/atoms-holigridwrapper--primary">Atoms</a>
            </li>
            <li>
              <a href="/?path=/story/molecules-holiautocomplete--primary">Molecules</a>
            </li>
            <li>
              <a href="/?path=/story/organisms-holicarousel--example">Organisms</a>
            </li>
          </ul>
        </section>
        <div className="container-logo">
          <img
            src={
              require('@holi/ui/assets/img/icons/brand/Logo.svg') /* eslint-disable-line @typescript-eslint/no-require-imports */
            }
          />
          <img
            src={
              require('@holi/ui/assets/img/icons/brand/BubbleConnection.svg') /* eslint-disable-line @typescript-eslint/no-require-imports */
            }
            style={{ marginTop: -1 }}
          />
        </div>
      </div>
    </div>
  )
}
