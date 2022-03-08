import IcoMoon, { IconComponent } from 'react-icomoon'
import { Svg, Path } from 'react-native-svg'
import iconSet from 'shared/assets/fonts/holicons/selection.json'

const HoliconMobile: typeof IconComponent = (props) => (
  <IcoMoon
    native
    SvgComponent={Svg}
    PathComponent={Path}
    iconSet={iconSet}
    {...props}
  />
)

export default HoliconMobile
