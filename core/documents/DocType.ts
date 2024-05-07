export const docTypes = ['imprint', 'privacyPolicy', 'communityGuidelines', 'openSource', 'termsOfUse'] as const

export type DocType = (typeof docTypes)[number]

export const parseDocType = (value?: string): DocType | undefined => docTypes.find((dt) => dt === value)
