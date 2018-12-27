import React, { useState } from 'react'
import { Textbox } from './Textbox'
import { Duration } from 'luxon';

export interface DurationboxProps {
  id?: string,
  value: Duration,
  shy: boolean,
  onChange: (dur: Duration) => void
}

function isValidDuration(string: string) {
  return (/^((\d{1,2}(\.\d+)?)|(\.\d+))$/).test(string)
}

function containsInvalidCharacters(string: string) {
  return /[^\d\.]/g.test(string)
}

function parseDuration(string: string) {
  return Duration.fromObject({
    hours: Math.min(24, Math.round(parseFloat(string) * 100) / 100)
  })
}

function renderDuration(duration: Duration) : string {
  return (Math.round(duration.as('hours') * 100) / 100).toString()
}

export function Durationbox(props: DurationboxProps) {
  let { value, onChange, shy, ...otherProps } = props
  let [ state, setState ] = useState({ value: renderDuration(props.value) })

  function handleChange ({ target }: React.ChangeEvent<HTMLInputElement>) {
    if (containsInvalidCharacters(target.value)) return;
    setState({ value: target.value })

    if (isValidDuration(target.value)) {
      props.onChange(parseDuration(target.value))
    }
  }

  function handleBlur ({ target }: React.FocusEvent<HTMLInputElement>) {
    let string = renderDuration(props.value)
    setState({ value: string })
  }

  return <Textbox shy={shy} value={state.value} onChange={handleChange} onBlur={handleBlur} {...otherProps} />
}

Durationbox.defaultProps = {
  shy: false
}