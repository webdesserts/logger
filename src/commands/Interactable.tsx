import React, { useRef, useEffect } from 'react';
import classes from './Interactable.module.scss';
import { useCommandContext, Subject } from './model';

interface InteractableProps extends React.HTMLAttributes<HTMLDivElement> {
  subject: Subject
}

export const Interactable = (props: InteractableProps) => {
  let { className, onClick, tabIndex, subject, ...otherProps } = props
  let classNames = [classes.block, props.className]
  let $div = useRef(null);
  useSubject(subject, $div)

  function handleClick (event: React.MouseEvent<HTMLDivElement>) {
    // @ts-ignore
    if ($div) $div.current.focus();
    if (props.onClick) props.onClick(event);
  }

  return (
    <div ref={$div} className={classNames.join(' ')} tabIndex={0} onClick={handleClick} {...otherProps}/>
  )
}

export function useSubject(subject: Subject, ref: React.RefObject<HTMLElement>) {
  let context = useCommandContext()

  function addToContext() {
    context.add(subject)
  }

  function removeFromContext() {
    context.remove(subject)
  }

  useEffect(() => {
    if (ref.current) {
      let $el = ref.current
      $el.addEventListener('focus', addToContext)
      $el.addEventListener('focus-within', addToContext)
      $el.addEventListener('blur', removeFromContext)
      return () => {
        $el.removeEventListener('focus', addToContext)
        $el.removeEventListener('focus-within', addToContext)
        $el.removeEventListener('blur', removeFromContext)
      }
    }
  })
}
