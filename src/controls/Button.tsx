import React from 'react';
import classes from './Button.module.scss';

interface Props extends React.HTMLAttributes<HTMLButtonElement> {}

export function Button ({ className: userClassName, ...props }: Props) {
  let classNames = [classes.Button]
  if (userClassName) { classNames.push(userClassName) }
  return (
    <button className={classNames.join(' ')} {...props} />
  )
}