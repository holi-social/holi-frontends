import IcoMoon, { IconComponent } from 'react-icomoon'
import iconSet from 'shared/assets/fonts/holicons/selection.json'

const HoliconWeb: typeof IconComponent = (props) => (
  <IcoMoon iconSet={iconSet} {...props} />
)

export default HoliconWeb
