export function copyToClipboard (text) {
  var textArea = document.createElement('textarea')
  textArea.className = 'fixed-top'
  textArea.value = text
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  document.execCommand('copy')
  document.body.removeChild(textArea)
}

export function copyHeading (id) {
  const text = window.location.origin + window.location.pathname + '#' + id
  const el = document.getElementById(id)

  if (el) {
    el.id = ''
  }

  window.location.hash = '#' + id

  if (el) {
    setTimeout(() => {
      el.id = id
    }, 300)
  }

  copyToClipboard(text)

  this.$q.notify({
    message: 'Anchor has been copied to clipboard.',
    color: 'white',
    textColor: 'primary',
    icon: 'done',
    position: 'top',
    timeout: 2000
  })
}

export function slugify (str) {
  return encodeURIComponent(String(str).trim().replace(/\s+/g, '-'))
}

export function makeUrl (slug) {
  window.location = window.location.origin + window.location.pathname + '#' + slug
}
