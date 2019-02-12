import React, { KeyboardEventHandler, ReactEventHandler } from 'react'
import { Textbox } from './Textbox'
import { DateTime } from 'luxon';

export interface TimeboxProps {
  id?: string,
  time: DateTime,
  shy: boolean,
  readOnly: boolean,
  onChange: (time: DateTime) => void
}

function renderTime(time: DateTime) : string {
  return time.toLocaleString(DateTime.TIME_24_SIMPLE)
}

export class Timebox extends React.Component<TimeboxProps> {
  needsReselect : 'hour' | 'minute' | null = null

  static defaultProps = {
    shy: false,
    readOnly: false,
    onChange: () => {}
  }

  selectMinute($box: HTMLInputElement) {
    $box.setSelectionRange(3,5)
  }

  componentDidUpdate(prev: TimeboxProps) {
    if (prev.time.minute !== this.props.time.minute) this.needsReselect = 'minute'
    else if (prev.time.hour !== this.props.time.hour) this.needsReselect = 'hour'
    else this.needsReselect = null
  }

  handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    let { time, onChange } = this.props
    let { key, shiftKey, currentTarget: $box } = event
    console.log('keydown:', key)

    if (this.isHourSelected($box)) {
      let increment = shiftKey ? 12 : 1
      if (key === 'Tab' && !shiftKey) {
        event.preventDefault()
        this.selectMinute($box)
      } else if (key === 'ArrowUp') {
        onChange(time.set({ hour: time.hour + increment }))
      } else if (key === 'ArrowDown') {
        onChange(time.set({ hour: time.hour - increment }))
      } else if (key === 'ArrowRight') {
        this.selectMinute($box)
      } else if (key === 'Backspace') {
        onChange(time.set({ hour: 0 }))
      }
    } else if(this.isMinuteSelected($box)) {
      let increment = shiftKey ? 10 : 1
      if (key === 'Tab' && shiftKey) {
        event.preventDefault()
        this.selectHour($box)
      } else if (key === 'ArrowUp') {
        onChange(time.set({ minute: time.minute + increment }))
      } else if (key === 'ArrowDown') {
        onChange(time.set({ minute: time.minute - increment }))
      } else if (key === 'ArrowLeft') {
        this.selectHour($box)
      } else if (key === 'Backspace') {
        onChange(time.set({ minute: 0 }))
      }
    }
  }

  handleKeyPress: KeyboardEventHandler<HTMLInputElement> = (event) => {
    event.preventDefault()
    let { time, onChange } = this.props
    let { key: keyString, currentTarget: $box } = event

    let key = parseInt(keyString)

    if (isNaN(key)) return;

    if (this.isHourSelected($box)) {
      if ((time.hour <= 2)) {
        onChange(time.set({ hour: time.hour * 10 + key }))
      } else {
        onChange(time.set({ hour: key }))
      }
    } else if (this.isMinuteSelected($box)) {
      if (time.minute <= 6) {
        onChange(time.set({ minute: time.minute * 10 + key }))
      } else {
        onChange(time.set({ minute: key }))
      }
    }
  }

  handleSelect: ReactEventHandler<HTMLInputElement> = (event) => {
    let { currentTarget: $box } = event
    if (this.isHourSelected($box) || this.isMinuteSelected($box)) return;

    // When the input is first focused it selects everything
    if ($box.selectionStart === 0 && $box.selectionEnd === 5) {
      this.selectHour($box)
      return;
    }

    // the component updated and dropped the selection
    if (this.needsReselect) {
      event.preventDefault()
      switch(this.needsReselect) {
        case 'hour': this.selectHour($box); break;
        case 'minute': this.selectMinute($box); break;
      }
      this.needsReselect = null
      return;
    }

    if ($box.selectionStart === null || $box.selectionStart <= 3) {
      this.selectHour($box)
    } else {
      this.selectMinute($box)
    }
  }

  isHourSelected($box: HTMLInputElement) : boolean {
    return $box.selectionStart === 0 && $box.selectionEnd === 2
  }

  isMinuteSelected($box: HTMLInputElement) : boolean {
    return $box.selectionStart === 3 && $box.selectionEnd === 5
  }

  selectHour($box: HTMLInputElement) {
    $box.setSelectionRange(0,2)
  }

  render () {
    let { shy, time, onChange, ...otherProps } = this.props

    let props = {
      shy,
      value: renderTime(time),
      onKeyDown: this.handleKeyDown,
      onKeyPress: this.handleKeyPress,
      onSelect: this.handleSelect,
      onChange: () => {},
      ...otherProps
    }

    return <Textbox {...props} />
  }
}