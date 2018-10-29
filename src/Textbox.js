import React from 'react';
import classes from './Textbox.module.scss';

export function Textbox ({ className: userClassName, ...props }) {
  let classNames = [classes.Textbox]
  if (userClassName) { classNames.push(userClassName) }
  return (
    <input type="text" className={classNames.join(' ')} {...props} />
  )
}