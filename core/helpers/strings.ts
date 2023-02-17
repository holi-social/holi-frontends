export const createUUID = () => {
  let dt = new Date().getTime()
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (dt + Math.random() * 16) % 16 | 0
    dt = Math.floor(dt / 16)
    return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
  return uuid
}

export const getInitials = (name: string, maxLength = 3) =>
  name
    .split(' ')
    .map((_) => _[0] || '')
    .join('')
    .substring(0, maxLength) // maxLength is the max number of characters in the initials string

export const stringToColor = (str: string) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  let color = '#'
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff
    const newValue = '00' + value.toString(16)
    color += newValue.substring(newValue.length - 2)
  }
  return color
}
