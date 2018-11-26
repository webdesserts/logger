import React from 'react';
import classes from './Textbox.module.scss';

export interface TextboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  shy?: boolean
}

export const Textbox = React.forwardRef<HTMLInputElement, TextboxProps>(
  function Textbox(props, ref) {
    let { className: userClassName, shy, ...otherProps } = props
    let classNames = [classes.Textbox]
    if (shy) { classNames.push(classes.Textbox_shy) }
    if (userClassName) { classNames.push(userClassName) }
    return (
      <input ref={ref} type="text" className={classNames.join(' ')} {...otherProps} />
    )
  }
)