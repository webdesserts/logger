import React from 'react';
import classes from './Textbox.module.scss';

interface Props extends React.HTMLAttributes<HTMLInputElement> {
}

export function Textbox ({ className: userClassName, ...props }: Props) {
  let classNames = [classes.Textbox]
  if (userClassName) { classNames.push(userClassName) }
  return (
    <input type="text" className={classNames.join(' ')} {...props} />
  )
}