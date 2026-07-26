import { useSyncExternalStore } from 'react'

/**
 * Tiny global store for the "Speak with a representative" modal.
 * Lives outside React so ANY button anywhere on the page can open it
 * without prop-drilling or wrapping the tree in a context provider.
 */
let isOpen = false
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((l) => l())
}

export const contactModal = {
  open() {
    if (!isOpen) {
      isOpen = true
      emit()
    }
  },
  close() {
    if (isOpen) {
      isOpen = false
      emit()
    }
  },
}

export function useContactModal() {
  const open = useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => isOpen,
    () => isOpen,
  )
  return { isOpen: open, open: contactModal.open, close: contactModal.close }
}
