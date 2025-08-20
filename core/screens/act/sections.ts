export enum ActSectionType {
  VOLUNTEERING = 'VOLUNTEERING',
  CHALLENGES = 'CHALLENGES',
  EVENTS = 'EVENTS',
  DONATIONS = 'DONATIONS',
  PETITIONS = 'PETITIONS',
  STARTSMALL = 'STARTSMALL',
}

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
