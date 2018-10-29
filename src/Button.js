import React from 'react';
import classes from './Button.module.scss';

export function Button ({ className: userClassName, ...props }) {
  let classNames = [classes.Button]
  if (userClassName) { classNames.push(userClassName) }
  return (
    <button className={classNames.join(' ')} {...props} />
  )
}