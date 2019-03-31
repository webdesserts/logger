import React, { useState } from 'react'
import { CommandParams, DataFromParams, NamedType, CommandParamTypes, CommandState } from './models/commands.model';
import { Textbox } from '../controls/Textbox';
import { Button } from '../controls/Button';
import { mapValues } from 'lodash'

interface Props<P extends CommandParams> {
  command: CommandState<P>, 
  onSubmit: (command: CommandState<P>, data: DataFromParams<P>) => void
}

export function PaletteForm<P extends CommandParams>(props: Props<P>) {
  let { command, onSubmit } = props
  let [ data, setData ] = useState(generateInitialData(command.params as P))

  let controls = Object.entries(command.params).map(([label, param], i) => (
    <div className="field">
      <label>{label}</label>
      <Control type={param.type} value={data[label]} autoFocus={i === 0} onChange={(value) => {
        console.log('set data?', value)
        setData({ ...data, [label]: value  })
      }} />
    </div>
    )
  )

  function handleSubmit() {
    if (isValid(data, command.params)) onSubmit(command, data);
  }

  return (
    <div>
      {controls}
      <Button theme="dark" onClick={handleSubmit}>Submit</Button>
    </div>
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
  else return false
}

function generateInitialData<P extends CommandParams>(params: P) : FormStateFromParams<P> {
  let data = mapValues(params, (options, label) => {
    if (options.type === 'string') {
      return ''
    } else {
      throw Error(`Unrecognized Param Type "${options.type}"`)
    }
  })
  return data as FormStateFromParams<P>
}

type ControlProps = {
  type: 'string',
  autoFocus?: boolean,
  value: string | undefined
  onChange: (value: string) => void
}

function Control(props: ControlProps) {
  switch(props.type) {
    case 'string': return (
      <Textbox theme="dark" autoFocus={props.autoFocus} value={props.value} onChange={({ target }) => props.onChange(target.value)}/>
    )
    default: throw Error('unrecognized control type')
  }
}

type FormStateFromParams<T extends CommandParams> = {
  [P in keyof T]: NamedType<T[P]['type']> | undefined
};