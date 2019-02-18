import React, { useRef, useEffect, FocusEventHandler } from 'react';
import classes from './Interactable.module.scss';
import { useCommandContext, Subject } from './models/context.model';
import { useContextTriggers } from './models/triggers.model';

interface InteractableProps extends React.HTMLAttributes<HTMLDivElement> {
  subject: Subject
}

export const Interactable = (props: InteractableProps) => {
  let { className, onClick, tabIndex, subject, ...otherProps } = props

  let blockRef = useRef(null);
  let context = useCommandContext()
  useSubject(subject, blockRef)

  let classNames = [classes.block, props.className]
  if (context.state.includes(subject)) {
    classNames.push(classes.block_inContext)
  }

  function handleClick (event: React.MouseEvent<HTMLDivElement>) {
    if (props.onClick) props.onClick(event);
  }

  return (
    <div ref={blockRef} className={classNames.join(' ')} tabIndex={0} onClick={handleClick} {...otherProps}/>
  )
}

export function useSubject<T extends HTMLElement>(subject: Subject, ref: React.RefObject<T>) {
  let triggers = useContextTriggers()

  useEffect(() => {
    if (ref.current) {
      let trigger = { $node: ref.current, subject }

      triggers.add(trigger)

      return () => {
        triggers.remove(trigger)
      }
    }
  }, [ref.current])
}
