import 'styled-components'
import { Theme } from './themes'

// We include this override to avoid having to declare a Theme type for every
// styled component
declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}