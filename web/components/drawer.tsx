import { View } from 'react-native'

import Button from 'shared/components/ui/Button'
import { DrawerContent } from 'shared/features/spaces/navigation/drawer'

type DrawerProps = {
  open: boolean
  onClose: () => void
  children?: React.ReactChildren
}

export const Drawer: React.VoidFunctionComponent<DrawerProps> = ({ open, onClose, children = <DrawerContent /> }) => {
  // TODO close on route change
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'column',
        position: 'absolute',
        backgroundColor: 'gray',
        zIndex: 888,
        height: '100%',
        width: open ? '30%' : 0,
        overflow: 'hidden',
      }}
    >
      {children}
      <Button onPress={onClose}>close</Button>
    </View>
  )
}
