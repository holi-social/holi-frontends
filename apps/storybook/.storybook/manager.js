import { addons } from '@storybook/addons'
import { create } from '@storybook/theming'

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'Project Holi',
    brandUrl: 'https://project-holi.org/',
    brandImage: './images/project-holi.webp',
    brandTarget: '_blank',
  }),
})
