import type { SelectOption } from "./interface"

export function findText(options: SelectOption[], value: string): string {
  return options.find((option: SelectOption): boolean => option.value === value)?.text || "";
}

