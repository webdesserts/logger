import React from 'react';
import classes from './Button.module.scss';

type Themes = 'light' | 'dark'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  theme?: Themes
}

export const Button = React.forwardRef<HTMLButtonElement, Props>(
  function Button(props, ref) {
    let { theme, className: userClassName, ...otherProps } = props
    let classNames = [classes.Button]
    classNames.push(getThemeClass(theme))
    if (userClassName) { classNames.push(userClassName) }

    return <button ref={ref} className={classNames.join(' ')} {...otherProps} />
  }
)

function getThemeClass(theme: Themes = 'light') {
  switch(theme) {
    case "dark": return classes.Button_dark;
    case "light": return classes.Button_light;
  }
}