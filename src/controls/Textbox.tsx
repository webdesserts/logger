import React from 'react';
import classes from './Textbox.module.scss';

type Themes = 'light' | 'dark'

export interface TextboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  theme?: Themes
  shy?: boolean
  readOnly?: boolean
}

export const Textbox = React.forwardRef<HTMLInputElement, TextboxProps>(
  function Textbox(props, ref) {
    let { className: userClassName, shy, readOnly, theme, tabIndex, ...otherProps } = props
    let classNames = [classes.Textbox]
    classNames.push(getThemeClass(theme))
    if (shy) { classNames.push(classes.Textbox_shy) }
    if (userClassName) { classNames.push(userClassName) }
    let overriddenIndex = readOnly ? -1 : tabIndex
    return (
      <input ref={ref} type="text" className={classNames.join(' ')} readOnly={readOnly} tabIndex={overriddenIndex} {...otherProps} />
    )
  }
)

function getThemeClass(theme: Themes = 'light') {
  switch(theme) {
    case "dark": return classes.Textbox_dark;
    case "light": return classes.Textbox_light;
  }
}