import xss from 'xss'

export const sanitizeBuffer = (buffer: Buffer) => {
  const sanitizedContent = xss(buffer.toString('utf-8'))
  return Buffer.from(sanitizedContent, 'utf-8')
}
