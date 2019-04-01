import { Model } from '../../utils/model';
import { inherits } from 'util';

/*=======*\
*  Types  *
\*=======*/

export type CommandsState = CommandState[]
export type CommandState<P extends CommandParams = CommandParams> = { subject: string, name: string, params: CommandParams, description: string, onSubmit: (data: DataFromParams<P>) => void }
export type CommandParamTypes = 'string'
export type CommandParams = {
  [key: string]: CommandParamOptions
}

export type CommandParamOptions = StringParamOptions

export interface StringParamOptions extends CommonParamOptions {
  type: 'string',
  required?: boolean,
  defaultValue?: string,
}

interface CommonParamOptions {
  type: CommandParamTypes,
  required?: boolean,
}

export type DataFromParams<T extends CommandParams> = {
  [P in keyof T]: (
    T[P]['required'] extends true ? NamedType<T[P]['type']> :
    NamedType<T[P]['type']> | undefined
  )
};

export type NamedType<T extends CommandParamTypes> = (
  T extends 'string' ? string :
  never
)

/*=========*\
*  Helpers  *
\*=========*/

export function matches<P extends CommandParams>(search: CommandState<P>) {
  return (command: CommandState) => (
    command.name === search.name &&
    command.subject === command.subject
  )
}

/*=======*\
*  Model  *
\*=======*/

export class CommandsModel extends Model<CommandsState> {
  static initialState: CommandsState = []
  init() { console.log('commands:', this.state) }

  add<P extends CommandParams>(command: CommandState<P>) {
    console.log('addCommand')
    this.produceState((draft) => {
      let match = draft.findIndex(matches(command)) > -1
      if (!match) draft.push(command as CommandState)
    })
  }
  remove<P extends CommandParams>(command: CommandState<P>) {
    this.produceState((draft) => {
      let index = draft.findIndex(matches(command))
      if (index > -1) draft.splice(index, 1)
    })
  }
}

export const [ CommandsProvider, useCommands ] = CommandsModel.createContext(CommandsModel.initialState)