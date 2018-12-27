import React, { useEffect } from 'react';
export { reducer } from './store'

function linkContext() {}
function unlinkContext() {}

function handleFocusWithin() {
  linkContext()
}
function handleBlur() {
  unlinkContext()
}

export function useCommandContext(path: string, ref: React.RefObject<HTMLElement>) {
  useEffect(() => {
    if (ref && ref.current) {
      let $el = ref.current
      $el.addEventListener('focus-within', handleFocusWithin)
      $el.addEventListener('blur', handleBlur)
      return () => {
        $el.removeEventListener('focus-within', handleFocusWithin)
        $el.removeEventListener('blur', handleBlur)
      }
    }
  })
}
