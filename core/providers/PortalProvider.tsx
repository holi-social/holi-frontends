import type React from 'react'
import { createContext, useCallback, useContext, useState } from 'react'
import { ScrollView, type StyleProp, type ViewStyle } from 'react-native'

export type GateElement = React.ReactElement | null | undefined

export interface PortalContextValue {
  gates: Record<string, GateElement>
  teleport: (gateName: string, element: GateElement) => void
}

export const PortalContext = createContext<PortalContextValue>({} as PortalContextValue)

export const usePortals = () => useContext(PortalContext)

export const PortalProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  const [gates, setGates] = useState<Record<string, GateElement>>({})

  const teleport = useCallback((gateName: string, element: GateElement) => {
    setGates((prevGates) => ({ ...prevGates, [gateName]: element }))
  }, [])

  return <PortalContext.Provider value={{ gates: gates, teleport: teleport }}>{children}</PortalContext.Provider>
}
export default PortalProvider

export type PortalGateProps = {
  gateName: string
  style?: StyleProp<ViewStyle>
}
export const PortalGate: React.FC<PortalGateProps> = ({ gateName, style }) => {
  const { gates } = usePortals()

  if (!gates[gateName]) return null

  return (
    <ScrollView style={style} keyboardShouldPersistTaps="handled">
      {gates[gateName]}
    </ScrollView>
  )
}
