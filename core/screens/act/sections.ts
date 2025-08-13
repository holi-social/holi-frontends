import { ActSectionType } from '@holi/core/screens/act/ActSection'

export const orderedSections = (selectedContentType?: string) => {
  const sections = [
    ActSectionType.STARTSMALL,
    ActSectionType.VOLUNTEERING,
    ActSectionType.PETITIONS,
    ActSectionType.EVENTS,
    ActSectionType.DONATIONS,
    ActSectionType.CHALLENGES,
  ]

  if (selectedContentType) {
    const index = sections.findIndex((item) => item === selectedContentType)
    if (index > 0) {
      const [itemToMoveToTheFront] = sections.splice(index, 1)
      sections.unshift(itemToMoveToTheFront)
    }
  }
  return sections
}
