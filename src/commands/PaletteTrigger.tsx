import React, { useRef, useEffect, RefObject } from 'react';
import classes from './PaletteTrigger.module.scss';
import { usePaletteContext } from './models/context.model';
import { useTriggers, NodeTriggerState, AutoTriggerState } from './models/triggers.model';

type SubjectProps = {
  type: string,
  id?: string,
}

type AutoTriggerProps = {
  children: React.ReactNode
} & SubjectProps

export function AutoTrigger(props: AutoTriggerProps) {
  let { type, id, children } = props
  let subject = { type, id }
  let triggers = useTriggers()

  useEffect(() => {
    let trigger: AutoTriggerState = { subject, auto: true, $node: null }

    triggers.add(trigger)

    return () => {
      triggers.remove(trigger)
    }
  }, [type, id])

  return <>{children}</>
}

type TriggerProps = {
  children: React.ReactNode
} & SubjectProps & React.HTMLAttributes<HTMLDivElement>


export function Trigger(props: TriggerProps) {
  let { className, onClick, tabIndex, type, id, ...otherProps } = props

  let subject = { type, id }
  let blockRef = useRef(null);
  let context = usePaletteContext()
  let triggers = useTriggers()

  useEffect(() => {
    let $node = blockRef.current
    if ($node) {
      let trigger: NodeTriggerState = { subject, $node, auto: false }

      triggers.add(trigger)

      return () => {
        triggers.remove(trigger)
      }
    }
  // Apparently this might not always work as expected?
  }, [blockRef])

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

export function useTriggersManager(palette: RefObject<HTMLElement>, onContextFocus: () => void) {
  let triggers = useTriggers()
  let context = usePaletteContext()

  for (let trigger of triggers.state) {
    if (trigger.auto) {
      context.add(trigger.subject)
    }
  }

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
      if (trigger.auto) continue;
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