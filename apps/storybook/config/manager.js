import { addons } from '@storybook/addons'
import { create } from '@storybook/theming'

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'Project Holi',
    brandUrl: 'https://holi.social/',
    brandImage: './images/project-holi.webp',
    brandTarget: '_blank',
  }),
})
