import { NativeStackHeaderProps } from '@react-navigation/native-stack'

interface MobileHeaderAnimatedProps extends NativeStackHeaderProps {
  web?: never
}

interface WebHeaderAnimatedProps {
  web: true
}

export type HeaderAnimatedProps = MobileHeaderAnimatedProps | WebHeaderAnimatedProps
