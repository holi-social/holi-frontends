import { type FC, PropsWithChildren, createElement } from 'react'
import { StyleSheet, View } from 'react-native'

export interface HoliGridProps {
  breakpoints: HoliBreakpoints
  /** A render prop that includes styled children. */
  children: RenderProp
}

export type HoliBreakpoints = [number, number][]
type RenderProp = FC<{ GridContainer: FC<PropsWithChildren>; GridItem: FC<PropsWithChildren> }>

const HoliGrid = ({
  // breakpoints,
  children = () => {
    // TODO: log error
    return null
  },
}: HoliGridProps) => {
  const GridContainer = ({ children }: PropsWithChildren) => createElement(View, { style: styles.constainer }, children)
  const GridItem = ({ children }: PropsWithChildren) => createElement(View, {}, children)

  return children({
    GridItem,
    GridContainer,
  })
}

export default HoliGrid

const styles = StyleSheet.create({
  constainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    overflow: 'hidden',
    padding: 54,
  },
})
