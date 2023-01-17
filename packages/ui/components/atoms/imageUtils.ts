/**
 * These modes work the same across web and mobile and therefore are the only ones we allow.
 */
export type ResizeMode = 'cover' | 'contain' | 'stretch'

export const ResizeModes: ResizeMode[] = [
  'cover',
  'contain',
  'stretch', // fill in web
  // center and repeat have no web equivalent
]

export const resizeModeForWeb = (resizeMode: ResizeMode): 'cover' | 'contain' | 'fill' => {
  switch (resizeMode) {
    case 'stretch':
      return 'fill'
    default:
      return resizeMode
  }
}
