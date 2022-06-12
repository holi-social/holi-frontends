interface HoliTextTypeInfo {
  name: string
  level: number
  role: string
}

export enum HoliTextType {
  super = 'super',
  heading1 = 'heading1',
  heading2 = 'heading2',
  heading3 = 'heading3',
  button = 'button',
  body = 'body',
  captionLink = 'captionLink',
  caption = 'caption',
  labelLink = 'labelLink',
  label = 'label',
}

export const HoliTextTypes: Record<HoliTextType, HoliTextTypeInfo> = {
  [HoliTextType.super]: { name: HoliTextType.super, level: 1, role: 'header' },
  [HoliTextType.heading1]: { name: HoliTextType.heading1, level: 1, role: 'header' },
  [HoliTextType.heading2]: { name: HoliTextType.heading2, level: 2, role: 'header' },
  [HoliTextType.heading3]: { name: HoliTextType.heading3, level: 3, role: 'header' },
  [HoliTextType.button]: { name: HoliTextType.button, level: 0, role: 'button' },
  [HoliTextType.body]: { name: HoliTextType.body, level: 0, role: 'text' },
  [HoliTextType.captionLink]: { name: HoliTextType.captionLink, level: 0, role: 'link' },
  [HoliTextType.caption]: { name: HoliTextType.caption, level: 0, role: 'none' },
  [HoliTextType.labelLink]: { name: HoliTextType.labelLink, level: 0, role: 'link' },
  [HoliTextType.label]: { name: HoliTextType.label, level: 0, role: 'text' },
}
