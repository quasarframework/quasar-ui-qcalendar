import { Notify } from 'quasar'

const andRE = /&/g
const rCombining = /[\u0300-\u036F]/g
// oxlint-disable-next-line no-control-regex
const rControl = /[\u0000-\u001f]/g
const rSpecial = /[\s~`!@#$%^&*()\-_+=[\]{}|\\;:"'“”‘’<>,.?/]+/g

/**
 * Default slugification function used by qPress client helpers.
 */
export const slugify = (str: string): string =>
  str
    .trim()
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
    .normalize('NFKD')
    .replace(rCombining, '')
    .replace(andRE, '-and-')
    .replace(rControl, '-')
    .replace(rSpecial, '-')
    .replace(/[^a-z0-9-]+/g, '')
    .replace(/([a-z])(\d)/g, '$1-$2')
    .replace(/(\d)([a-z])/g, '$1-$2')
    .replace(/-{2,}/g, '-')
    .replace(/(^-|-$)/g, '')
    .replace(/^(\d)/, '_$1')

/**
 * Fallback function to copy text to clipboard when the Clipboard API is not available.
 * This function creates a temporary textarea element, selects its content, and uses the
 * deprecated execCommand('copy') method to copy the text.
 *
 * @param text - The string to be copied to the clipboard.
 * @returns A boolean indicating whether the copy operation was successful (true) or not (false).
 */
function copyToClipboardFallback(text: string): boolean {
  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.style.position = 'fixed' // avoid scrolling to bottom
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  let res = false
  try {
    res = document.execCommand('copy')
  } catch (err) {
    console.error('Unable to copy to clipboard', err)
  } finally {
    document.body.removeChild(textArea)
  }
  return res
}

/**
 * Copies the provided text to the clipboard using the Clipboard API if available,
 * or falls back to a manual method if the API is not supported.
 *
 * @param text - The string to be copied to the clipboard.
 * @returns A Promise that resolves when the text has been successfully copied,
 *          or rejects if the copy operation fails.
 * @throws Will throw an error if the Clipboard API fails or if the fallback method fails.
 */
export async function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      console.error('Failed to copy text to clipboard using Clipboard API', err)
      throw err
    }
  } else {
    return new Promise((resolve, reject) => {
      const res = copyToClipboardFallback(text)
      if (res) {
        resolve()
      } else {
        const error = new Error('Failed to copy text to clipboard using fallback method')
        console.error(error)
        reject(error)
      }
    })
  }
}

/**
 * Copies a heading's anchor link to the clipboard and updates the URL hash.
 * This function performs the following actions:
 * 1. Constructs the full URL with the anchor.
 * 2. Temporarily removes the element's ID to prevent page jumping.
 * 3. Updates the URL hash using history API or fallback method.
 * 4. Restores the element's ID after a short delay.
 * 5. Copies the constructed URL to the clipboard.
 * 6. Displays a notification to confirm the copy action.
 *
 * @param id - The ID of the heading element to be copied.
 * @returns void This function doesn't return a value.
 */
export function copyHeading(id: string): void {
  const text = `${location.origin}${location.pathname}#${id}`
  const el = document.getElementById(id)

  if (el) {
    el.id = '' // Temporarily clear the ID to avoid jumping
  }

  if ('replaceState' in history) {
    history.replaceState(history.state, '', `${location.pathname}#${id}`)
  } else {
    location.hash = `#${id}`
  }

  if (el) {
    setTimeout(() => {
      el.id = id // Restore the ID
    }, 300)
  }

  copyToClipboard(text)

  Notify.create({
    message: 'Anchor has been copied to clipboard.',
    position: 'top',
    actions: [{ icon: 'cancel', color: 'white', dense: true, round: true }],
    timeout: 2000,
  })
}
