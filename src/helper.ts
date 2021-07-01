import type { OptionBase } from "./interface"

export function findOptionIndex(options: OptionBase[], value: string): number {
  return options.findIndex(option => option.value === value)
}

export function findText(options: OptionBase[], value: string): string {
  return options.find((option: OptionBase) => option.value === value)?.text || "";
}

export function findMyOption(options: OptionBase[], value: string) {
  return options.find((option: OptionBase) => option.value === value) || null;
}

export function simplifyArr(arr) {
  arr = arr.slice().sort();
  return JSON.stringify(arr);
}
