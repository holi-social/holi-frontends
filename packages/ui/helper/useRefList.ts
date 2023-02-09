import { useRef } from 'react'
import { View } from 'react-native'

/**
 * Handles a generic list of refs.
 * @Usage:
 * ```
  const someComponent = () => {
    const { refs, addRef } = useRefList()

    useEffect(() => {
      console.log('First ref: ', refs['one'])
    }, [])

    return (
      <>
        <View ref={addRef('one')} />
        <View ref={addRef('two')} />
        <View ref={addRef('three')} />
      </>
    )
  }
  ```
 */

export const useRefList = () => {
  const refs = useRef<Record<string, View>>({})

  const addRef = (key: string) => (element: View | null) => {
    if (!element) return
    refs.current[key] = element
  }

  return { refs: refs.current, addRef }
}
