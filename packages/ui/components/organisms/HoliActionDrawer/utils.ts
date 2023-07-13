export const actions = ['block', 'delete', 'edit', 'report', 'share', 'leave', 'collaborators', 'external'] as const
export type ActionsType = typeof actions
export type ActionType = ActionsType[number]

export const mapActionIcons = (actions: ActionsType): Map<ActionType, string> => {
  const iconMap = new Map<ActionType, string>()
  for (const action of actions) {
    if (action === 'delete') iconMap.set('delete', 'delete')
    if (action === 'edit') iconMap.set('edit', 'edit-2')
    if (action === 'report') iconMap.set('report', 'flag')
    if (action === 'share') iconMap.set('share', 'share')
    if (action === 'block') iconMap.set('block', 'close-circle')
    if (action === 'leave') iconMap.set('leave', 'door-closed')
    if (action === 'collaborators') iconMap.set('collaborators', 'user-settings')
    if (action === 'external') iconMap.set('external', 'arrow-right-up')
  }

  return iconMap
}
