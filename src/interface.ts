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

export interface StoreDaddy {
  setValue: Function;
  addOption: Function;
  addOptions: Function;
  setValues: Function;
  // setMultiple: Function;
  appendValue: Function;
  clearByIndex: Function;
  clearValues: Function;
  setSearch: Function;
  backspace: Function;
  
  // writable
  search: any;
  value: any;
  values: any;
  options: any;
  // multiple: any
}



export interface Callback {
  onBeforeOpen: (() => boolean) | null;
  onOpen: (() => void) | null;
  onBeforeClose: (() => boolean) | null;
  onClose: (() => void) | null;
  onBeforeChange: (() => boolean) | null;
  onChange: (() => void) | null;
  onFocus: (() => void) | null;
  onBlur: (() => void) | null;
  onKeyDown: (() => void) | null;
  onKeyUp: (() => void) | null;
  onKeyPress: (() => void) | null;
  onMenuScrollTop: (() => void) | null;
  onMenuScrollEnd: (() => void) | null;
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
