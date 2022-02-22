import IcoMoon, { IconComponent } from 'react-icomoon'
const iconSet = require('./assets/fonts/selection.json')


const HoliconWeb: typeof IconComponent = (props) => (
  <IcoMoon
    iconSet={iconSet}
    {...props}
  />
)

export default HoliconWeb
