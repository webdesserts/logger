import { Model } from '../../utils/model';
import { DateTime } from 'luxon'
import { SubjectPayload, PaletteContextModel } from './context.model';

/*=======*\
*  Types  *
\*=======*/

export type CommandsState = CommandState[]
export type CommandState<P extends CommandParams = CommandParams> = {
  subject: SubjectPayload;
  name: string;
  params: P;
  description: string;
  onSubmit: (data: DataFromParams<P>) => void;
};
export type CommandParamTypes = 'string' | 'time'
export type CommandParams = {
  [key: string]: CommandParamOptions
}

export type CommandParamOptions = StringParamOptions | TimeParamOptions

export interface StringParamOptions extends CommonParamOptions {
  type: 'string',
  required?: boolean,
  defaultValue?: string,
}

export interface TimeParamOptions extends CommonParamOptions {
  type: 'time',
  required?: boolean,
  defaultValue?: DateTime,
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
  T extends 'time' ? DateTime :
  never
)

/*=========*\
*  Helpers  *
\*=========*/

function isEqual(a: CommandState<any> | null, b: CommandState<any> | null) : boolean {
  return a !== null && b !== null && a.name === b.name && PaletteContextModel.isEqual(a.subject, b.subject);
}

function display(command: CommandState<any>) : string {
  return `${command.subject.type}.${command.name}(${command.subject.id || ''})`
}

/*=======*\
*  Model  *
\*=======*/

export class CommandsModel extends Model<CommandsState> {
  static initialState: CommandsState = []
  // init() { console.log('commands:', this.state.map(display)) }
  static isEqual = isEqual
  static display = display

  add<P extends CommandParams>(command: CommandState<P>) {
    this.produceState((draft) => {
      let match = draft.findIndex(c => isEqual(c, command)) > -1
      if (!match) draft.push(command as CommandState<any>)
    })
  }
  remove<P extends CommandParams>(command: CommandState<P>) {
    this.produceState((draft) => {
      let index = draft.findIndex(c => isEqual(c, command))
      if (index > -1) draft.splice(index, 1)
    })
  }
}

export const [ CommandsProvider, useCommands ] = CommandsModel.createContext(CommandsModel.initialState)