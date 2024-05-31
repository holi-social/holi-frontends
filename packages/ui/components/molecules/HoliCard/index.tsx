import * as CardContainer from './CardContainer'
import * as ContentContainer from './ContentContainer'
import HoliCard, { HoliCardProps } from './HoliCard'
import * as Image from './Image'
import * as ImageCaption from './ImageCaption'
import * as ImageContainer from './ImageContainer'

export const HoliCardComponent = {
  ...CardContainer,
  ...ContentContainer,
  ...Image,
  ...ImageCaption,
  ...ImageContainer,
}

export default HoliCard
export { type HoliCardProps }
