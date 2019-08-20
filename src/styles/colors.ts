import { Theme, themes } from './themes'

/*===============*\
*  Color Getters  * 
\*===============*/

export type ColorName = keyof Theme
export type ColorGetter<C extends ColorName> = (props: { theme: Theme }) => Theme[C]
export type ThemeColors = {
  [c in ColorName]: ColorGetter<c>
}

function generateColorGetters(theme: Theme) : ThemeColors {
  let colorNames = Object.keys(themes.dark) as ColorName[]

  return colorNames.reduce((getters, name) => {
    getters[name] = ({ theme }) => theme[name]
    return getters
  }, {} as Partial<ThemeColors>) as ThemeColors
}

const colorGetters: ThemeColors = generateColorGetters(themes.dark)

export { colorGetters as colors }

/*===========*\
*  Theme HoC  * 
\*===========*/
