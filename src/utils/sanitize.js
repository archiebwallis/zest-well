import DOMPurify from 'dompurify'

export const sanitize = (input) => {
  if (!input) return ''
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] })
}