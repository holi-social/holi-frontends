import IcoMoon, { IconComponent } from 'react-icomoon'
import { Svg, Path } from "react-native-svg"
const iconSet = require('./assets/fonts/selection.json')


const Holicon: typeof IconComponent = (props) => (

  // == for mobile icons:
  <IcoMoon
    native
    SvgComponent={Svg}
    PathComponent={Path}
    iconSet={iconSet}
    {...props}
  />

  // == for web icons:
  // <IcoMoon
  //   iconSet={iconSet}
  //   {...props}
  // />
)

export default Holicon
