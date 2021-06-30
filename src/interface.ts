import type {Writable} from "svelte/store";

export interface OptionBase {
  text: string;
  value: string;
  disabled?: boolean;
  dataset?: DOMStringMap
}

export type Options = readonly OptionBase[];

export interface GroupBase {
  readonly options: readonly OptionBase[];
  readonly label?: string;
}

export type OptionsOrGroups = readonly (OptionBase | GroupBase)[];

export interface SingleArgVoidFunc <T> {
  ( arg: T ): void
}

export interface SingleArgBoolFunc <T> {
  ( arg: T ): boolean
}

export interface BoolFunc {
  (): boolean;
}

export interface StoreDaddy {
  setValue: SingleArgVoidFunc<string>;
  addOption: SingleArgVoidFunc<OptionBase>;
  addOptions: ( arg: Options, arg2: boolean ) => void;
  setValues: SingleArgVoidFunc<string[]>;
  setFocusedOption:  SingleArgVoidFunc<string>;
  appendValue:  SingleArgVoidFunc<string>;
  clearByIndex: SingleArgVoidFunc<number>;
  clearValues: Function;
  setSearch: SingleArgVoidFunc<string>;
  backspace: Function;
  
  // writable
  search: Writable<string>;
  value: Writable<string>;
  values: Writable<Array<string>>;
  options: Writable<Options>;
  focusedOption: Writable<string>
}


export type BoolFuncOrNull = (() => boolean) | null;
export type VoidFuncOrNull = (() => boolean) | null;


export interface Callback {
  onBeforeOpen: BoolFuncOrNull;
  onOpen: VoidFuncOrNull;
  onBeforeClose: BoolFuncOrNull;
  onClose: VoidFuncOrNull;
  onBeforeChange: BoolFuncOrNull;
  onChange: VoidFuncOrNull;
  onFocus: VoidFuncOrNull;
  onBlur: VoidFuncOrNull;
  onKeyDown: VoidFuncOrNull;
  onKeyUp: VoidFuncOrNull;
  onKeyPress: VoidFuncOrNull;
  onMenuScrollTop: VoidFuncOrNull;
  onMenuScrollEnd: VoidFuncOrNull;
}

export interface OptionProps {
  classes?: {
    container?: string;
    controls?: string
    dropdownRoot?: string
    dropdown?: string
    placeholder?: string
  },
  placeholder?: string;
  search?: boolean;
  noResultsText?: string;
  renderOption: (string, dataset: DOMStringMap) => string | null;
  renderValue: (string, dataset: DOMStringMap) => string | null;
  clearable: boolean;
  callback: Callback;
}
