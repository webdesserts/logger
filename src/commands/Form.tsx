import React, { useState } from 'react'
import { CommandParams, DataFromParams, NamedType, CommandParamTypes, CommandState, CommandParamOptions } from './models/commands.model';
import { Textbox } from '../controls/Textbox';
import { Timebox } from '../controls/Timebox';
import { Button } from '../controls/Button';
import { DateTime } from 'luxon';
import { mapValues } from 'lodash'
import * as Styles from './Form.styles'

interface Props<P extends CommandParams> {
  command: CommandState<P>, 
  onSubmit: (command: CommandState<P>, data: DataFromParams<P>) => void
}

export function PaletteForm<P extends CommandParams>(props: Props<P>) {
  let { command, onSubmit } = props
  let [ data, setData ] = useState(generateInitialData(command.params as P))

  let controls = Object.entries(command.params).map(([label, param], i) => (
    <Styles.Field key={label}>
      <label>{label}</label>
      <Control options={param} value={data[label]} autoFocus={i === 0} onChange={(value) => {
        setData({ ...data, [label]: value  })
      }} />
    </Styles.Field>
    )
  )

  function handleSubmit() {
    if (isValid(data, command.params)) onSubmit(command, data);
  }

  return (
    <Styles.Form>
      {controls}
      <Button onClick={handleSubmit}>Submit</Button>
    </Styles.Form>
  )
}

function isValid<P extends CommandParams>(data: FormStateFromParams<P>, params: CommandParams) : data is DataFromParams<P>  {
  let valid = true
  for (let [key, options] of Object.entries(params)) {
    let value = data[key]
    if (options.required && (value === undefined || options.type === 'string' && value === '') ) {
      valid = false; break;
    }
    if (!matchesType(options.type, data[key])) {
      valid = false; break;
    }
  }
  return valid
}

function matchesType<T extends CommandParamTypes>(type: T | undefined, value: any) : value is NamedType<T> {
  if (value === undefined) return true
  else if (typeof value === type) return true 
  else if (type === 'time' && value instanceof DateTime) return true 
  else return false
}

function generateInitialData<P extends CommandParams>(params: P) : FormStateFromParams<P> {
  let data = mapValues(params, (options, label) => {
    if (options.type === 'string') {
      return options.defaultValue || ''
    } else if (options.type === 'time') {
      return options.defaultValue
    } else {
      throw Error(`Unrecognized Param Type "${options.type}"`)
    }
  })
  return data as FormStateFromParams<P>
}

type ControlProps<P extends CommandParamOptions, T extends NamedType<P['type']>> = {
  options: P
  autoFocus?: boolean,
  value: T | undefined,
  onChange: (value: T) => void
}

function Control<P extends CommandParamOptions, T extends NamedType<P['type']>>(props: ControlProps<P, T>) {
  let { options, autoFocus, value, onChange } = props
  switch(options.type) {
    case 'string': return (
      <Textbox autoFocus={autoFocus} value={value as string} onChange={({ target }) => onChange(target.value as any)}/>
    )
    case 'time': return (
      <Timebox time={value as DateTime | undefined} autoFocus={autoFocus} onChange={(time: DateTime) => onChange(time as any)} />
    )
    default: throw Error('unrecognized control type')
  }
}

type FormStateFromParams<T extends CommandParams> = {
  [P in keyof T]: NamedType<T[P]['type']> | undefined
};