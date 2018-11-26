import React from 'react';
import classes from './Button.module.scss';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button = React.forwardRef<HTMLButtonElement, Props>(
  function Button(props, ref) {
    let { className: userClassName, ...otherProps } = props
    let classNames = [classes.Button]
    if (userClassName) { classNames.push(userClassName) }

    return <button ref={ref} className={classNames.join(' ')} {...otherProps} />
  }
)