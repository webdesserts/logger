import React, { ChangeEventHandler, FocusEventHandler } from 'react'
import { Textbox } from './Textbox'
import { Duration } from 'luxon';

export interface DurationboxProps {
  value: Duration,
  shy: boolean,
  onChange: (dur: Duration) => void
}

export interface DurationboxState {
  value: string
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

export class Durationbox extends React.Component<DurationboxProps, DurationboxState> {
  state = { value: renderDuration(this.props.value) }

  handleChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    if (containsInvalidCharacters(target.value)) return;
    this.setState({ value: target.value })

    if (isValidDuration(target.value)) {
      this.props.onChange(parseDuration(target.value))
    }
  }

  handleBlur: FocusEventHandler = ({ target }) => {
    let string = renderDuration(this.props.value)
    this.setState({ value: string })
  }

  render () {
    let { shy } = this.props
    let { value } = this.state

    return <Textbox shy={shy} value={value} onChange={this.handleChange} onBlur={this.handleBlur}/>
  }
}