import React, { ReactNode } from 'react'

type OptionRenderer<T> = (option: T, isSelected: boolean, triggerSelect: (this: T) => void) => ReactNode

interface SingleOptionalProps<T> {
  required?: false,
  value: T | null,
  options: T[],
  optionRenderer: OptionRenderer<T>
  onChange: (value: T | null, option: T, isSelected: boolean) => void
}

interface SingleRequiredProps<T> {
  required: true,
  value: T,
  options: T[],
  optionRenderer: OptionRenderer<T>
  onChange: (value: T, option: T, isSelected: boolean) => void
}

interface MultipleProps<T> {
  required?: boolean,
  value: T[],
  options: T[],
  optionRenderer: OptionRenderer<T>
  onChange: (value: T[], option: T, isSelected: boolean) => void
}

type SingleProps<T> = SingleRequiredProps<T> | SingleOptionalProps<T>

export function Selectable<T >(props: SingleProps<T>) {
  let {
    required = false,
    value,
    options,
    optionRenderer,
    onChange
  } = props

  function onSelect (option: T, isSelected: boolean) {
    if (isSelected) {
      if (!required) (onChange as any)(null, option, false)
    } else {
      (onChange as any)(option, option, true)
    }
  }

  let nodes = options.map((option) => {
    let isSelected = value === option
    let triggerSelect = onSelect.bind(null, option, isSelected)
    return optionRenderer(option, isSelected, triggerSelect)
  })

  return <>{nodes}</>
}

export function MultiSelectable<T>(props: MultipleProps<T>) {
  let {
    required = false,
    value,
    options,
    optionRenderer,
    onChange
  } = props

  function onSelect (option: T, isSelected: boolean) {
    let next = Array.from(value)
    onChange = onChange as MultipleProps<T>['onChange']
    if (isSelected) {
      next.splice(next.indexOf(option),1)
      if (!(required && !next.length)) onChange(next, option, false);
    } else {
      onChange(next.concat(option), option, true)
    }
  }

  let nodes = options.map((option) => {
    let isSelected = value.includes(option)
    let triggerSelect = onSelect.bind(null, option, isSelected)
    return optionRenderer(option, isSelected, triggerSelect)
  })

  return <>{nodes}</>
}