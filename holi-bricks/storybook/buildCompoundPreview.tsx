/* eslint-disable @typescript-eslint/no-explicit-any */
type Slot = {
  enabled: boolean
  name: string
  props?: Record<string, any>
  content?: string
}

type Helper = (value: any) => string

export function buildCompoundPreview({
  component,
  slots,
  helper,
}: {
  component: string
  slots: Slot[]
  helper?: Helper
}): string {
  const INDENT = (level: number) => '  '.repeat(level)

  const formatValue = (value: any): string => {
    if (typeof value === 'string') return `"${value}"`
    if (typeof value === 'number') return `{${value}}`
    if (typeof value === 'boolean') return `{${value}}`
    if (typeof value === 'function') {
      const serialized = helper?.(value)
      return `{${serialized ?? '() => {}}'}}`
    }
    return `{${JSON.stringify(value)}}`
  }

  const renderProps = (props?: Record<string, any>, indentLevel = 2): string => {
    if (!props || Object.keys(props).length === 0) return ''
    return (
      '\n' +
      Object.entries(props)
        .map(([key, value]) => `${INDENT(indentLevel)}${key}=${formatValue(value)}`)
        .join('\n')
    )
  }

  const renderSlot = (slot: Slot): string => {
    if (!slot.enabled) return ''

    if (slot.props) {
      return `${INDENT(1)}<${slot.name}${renderProps(slot.props)}\n${INDENT(1)}/>`
    }

    if (slot.content) {
      const indentedContent = slot.content
        .split('\n')
        .map((line) => INDENT(2) + line)
        .join('\n')

      return `${INDENT(1)}<${slot.name}>\n${indentedContent}\n${INDENT(1)}</${slot.name}>`
    }

    return `${INDENT(1)}<${slot.name} />`
  }

  const slotLines = slots
    .map(renderSlot)
    .filter((line) => line !== '')
    .join('\n\n')

  return `<${component}>\n${slotLines}\n</${component}>`
}
