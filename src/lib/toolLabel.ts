import { STACK_TOOLS } from '../data/dataStack/tools'

export function toolLabel(id: string | undefined): string {
  if (!id) return ''
  return STACK_TOOLS.find((t) => t.id === id)?.name ?? id
}
