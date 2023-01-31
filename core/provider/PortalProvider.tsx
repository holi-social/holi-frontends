import React, { createContext, useCallback, useContext, useState } from 'react'
import { ScrollView, StyleProp, ViewStyle } from 'react-native'

export type GateElement = JSX.Element | null | undefined

export interface PortalContextValue {
  gates: Record<string, GateElement>
  teleport: (gateName: string, element: GateElement) => void
}

export const PortalContext = createContext<PortalContextValue>({} as PortalContextValue)

export const usePortals = () => useContext(PortalContext)

export const PortalProvider: React.FC = ({ children }) => {
  const [gates, setGates] = useState<Record<string, GateElement>>({})

  const teleport = useCallback(
    (gateName: string, element: GateElement) => {
      setGates({ ...gates, [gateName]: element })
    },
    [gates]
  )

  return <PortalContext.Provider value={{ gates: gates, teleport: teleport }}>{children}</PortalContext.Provider>
}
export default PortalProvider

export type PortalGateProps = {
  gateName: string
  style?: StyleProp<ViewStyle>
}
export const PortalGate: React.VFC<PortalGateProps> = ({ gateName, style }) => {
  const { gates } = usePortals()

  if (!gates[gateName]) return null

  return <ScrollView style={style}>{gates[gateName]}</ScrollView>
}
