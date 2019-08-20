import React, { ComponentProps } from 'react'
import * as colors from '../brand/colors' 
import { ThemeProvider } from 'styled-components'

/*=======*\
*  Types  *  
\*=======*/

export type Theme = {
  primary: string,
  secondary: string,

  textHighlight: string,
  text: string,
  textDim: string,
  textInverted: string,

  bkg: string,
  bkgAlt: string,
  bkgInverted: string,

  accent: string,
  shadow: string,
}

/*========*\
*  Themes  *  
\*========*/

const dark: Theme = {
  primary: colors.primary,
  secondary: colors.secondary,

  textHighlight: colors.light,
  text: colors.lightAlt,
  textDim: colors.mid,
  textInverted: colors.darkAlt,

  bkg: colors.dark,
  bkgAlt: colors.darkAlt,
  bkgInverted: colors.lightAlt,

  accent: colors.lightAlt,
  shadow: 'rgba(0, 0, 0, .3)',
}

const light: Theme = {
  primary: colors.primary,
  secondary: colors.secondary,

  textHighlight: colors.dark,
  text: colors.darkAlt,
  textDim: colors.mid,
  textInverted: colors.lightAlt,

  bkg: colors.light,
  bkgAlt: colors.lightAlt,
  bkgInverted: colors.darkAlt,

  accent: colors.darkAlt,
  shadow: 'rgba(0, 0, 0, .3)',
}

export const themes = { dark, light }

/*===========*\
*  Theme HoC  * 
\*===========*/

export function withThemeProvider<C extends React.ComponentType<any>>(theme: Theme, Component: C) {
  return React.forwardRef<C, ComponentProps<C>>((props, ref) => (
    <ThemeProvider theme={theme}>
      {React.createElement(Component, { ref, ...props })}
    </ThemeProvider>
  ))
}