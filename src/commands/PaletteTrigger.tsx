import React, { useRef, useEffect, RefObject } from 'react';
import classes from './PaletteTrigger.module.scss';
import { usePaletteContext, SubjectPayload } from './models/context.model';
import { useTriggers } from './models/triggers.model';

interface TriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  type: string,
  id?: string
}

export function Trigger(props: TriggerProps) {
  let { className, onClick, tabIndex, type, id, ...otherProps } = props

  let subject = { type, id }
  let blockRef = useRef(null);
  let context = usePaletteContext()
  useSubject(subject, blockRef)

  let classNames = [classes.block, props.className]
  if (context.state.find((s) => s.type === subject.type && s.id === subject.id)) {
    classNames.push(classes.block_inContext)
  }

  function handleClick (event: React.MouseEvent<HTMLDivElement>) {
    if (props.onClick) props.onClick(event);
  }

  return (
    <div ref={blockRef} className={classNames.join(' ')} tabIndex={0} onClick={handleClick} {...otherProps}/>
  )
}

export function useSubject<T extends HTMLElement>(subject: SubjectPayload, ref: React.RefObject<T>) {
  let triggers = useTriggers()

  useEffect(() => {
    if (ref.current) {
      let trigger = { $node: ref.current, subject }

      triggers.add(trigger)

      return () => {
        triggers.remove(trigger)
      }
    }
  // Apparently this might not always work as expected?
  }, [ref])
}

export function useTriggersManager(palette: RefObject<HTMLElement>, onContextFocus: () => void) {
  let triggers = useTriggers()
  let context = usePaletteContext()

  for (let subject of context.state) {
    let trigger = triggers.findBySubject(subject)
    if (!trigger) {
      context.remove(subject)
    }
  }

  function isWithinPalette($target: HTMLElement) {
    return palette.current && ($target === palette.current || palette.current.contains($target))
  }

  function handleClickOrFocus(event: Event) {
    let $target = event.target as HTMLElement
    for (let trigger of triggers.state) {
      if ($target === trigger.$node || trigger.$node.contains($target)) {
        context.add(trigger.subject)
        if (event.type === 'click') onContextFocus()
      } else if (!isWithinPalette($target)) {
        context.remove(trigger.subject)
      }
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOrFocus)
    document.addEventListener('focus', handleClickOrFocus, { capture: true })
    return () => {
      document.removeEventListener('click', handleClickOrFocus)
      document.removeEventListener('focus', handleClickOrFocus, { capture: true })
    }
  }) 
}